import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

function parseCSV(text: string): string[][] {
  const lines: string[][] = [];
  let row: string[] = [];
  let current = "";
  let inQuotes = false;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(current.trim());
      current = "";
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      row.push(current.trim());
      if (row.some(cell => cell !== "")) {
        lines.push(row);
      }
      row = [];
      current = "";
    } else {
      current += char;
    }
  }
  
  if (current !== "" || row.length > 0) {
    row.push(current.trim());
    lines.push(row);
  }
  
  return lines;
}

function capitalizeName(name: string): string {
  if (!name) return "";
  name = name.replace(/\s+/g, " ").trim();
  const lowercaseWords = ["de", "do", "da", "dos", "das", "e"];
  return name
    .toLowerCase()
    .split(" ")
    .map((word, index) => {
      if (lowercaseWords.includes(word) && index > 0) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export async function POST() {
  try {
    const sheetId = process.env.GOOGLE_SHEET_ID;
    if (!sheetId) {
      return NextResponse.json({ error: 'Missing GOOGLE_SHEET_ID env variable.' }, { status: 500 });
    }

    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
    const res = await fetch(csvUrl, { cache: 'no-store' });
    
    if (!res.ok) {
      return NextResponse.json({ error: `Failed to fetch Google Sheets: ${res.statusText}` }, { status: 500 });
    }
    
    const text = await res.text();
    const rows = parseCSV(text);
    
    if (rows.length <= 1) {
      return NextResponse.json({ error: 'No data found in Google Sheets.' }, { status: 400 });
    }
    
    const candidates: Array<{ nome: string; regiao_administrativa: string; categoria: string }> = [];
    
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.length < 2) continue;
      
      const type = row[1]; // "Profissional" ou "Empresa ou estabelecimento"
      let name = "";
      let ra = "";
      let category = "";
      
      if (type === "Profissional") {
        name = row[7] || row[2];
        ra = row[8];
        category = row[9];
      } else if (type && type.includes("Empresa")) {
        name = row[14] || row[15];
        ra = row[18];
        category = row[19];
      } else {
        continue;
      }
      
      name = capitalizeName(name);
      ra = ra ? ra.trim() : "";
      category = category ? category.trim() : "";
      
      if (name && ra && category) {
        candidates.push({
          nome: name,
          regiao_administrativa: ra,
          categoria: category
        });
      }
    }
    
    // Deduplicar para evitar erros de batch no Postgres
    const uniqueCandidates: Array<{ nome: string; regiao_administrativa: string; categoria: string }> = [];
    const seen = new Set<string>();
    
    for (const c of candidates) {
      const key = `${c.nome.toLowerCase()}|${c.categoria.toLowerCase()}|${c.regiao_administrativa.toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueCandidates.push(c);
      }
    }
    
    const supabase = getSupabaseAdmin();
    
    // Upsert em lotes de 100
    const batchSize = 100;
    let inserted = 0;
    
    for (let i = 0; i < uniqueCandidates.length; i += batchSize) {
      const batch = uniqueCandidates.slice(i, i + batchSize);
      const { error } = await supabase
        .from('MDA-candidatos')
        .upsert(batch, { onConflict: 'nome, categoria, regiao_administrativa' });
        
      if (error) {
        console.error(`Error in batch ${i / batchSize + 1}:`, error.message);
        return NextResponse.json({ error: `Supabase database error: ${error.message}` }, { status: 500 });
      }
      inserted += batch.length;
    }
    
    return NextResponse.json({ 
      success: true, 
      count: inserted, 
      rawCount: candidates.length 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
