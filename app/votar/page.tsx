"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

interface Candidato {
  id: number;
  nome: string;
  categoria: string;
  regiao_administrativa: string;
}

interface Voto {
  candidato_id: number;
  categoria: string;
}

interface ColumnState {
  category: string;
  candidateId: number | null;
  skipped: boolean;
}

export default function Votar() {
  const [session, setSession] = useState<any>(null);
  const [userVotes, setUserVotes] = useState<Voto[]>([]);
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRA, setSelectedRA] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<number>(1); // 1: Lead Form, 2: Social Login, 3: RA, 4: Voting, 5: Success
  const [notification, setNotification] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Campos de Cadastro do Lead (Passo 1)
  const [leadNome, setLeadNome] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadWhatsapp, setLeadWhatsapp] = useState("");
  const [leadGenero, setLeadGenero] = useState("");

  // Estado das 3 colunas de votação
  const [columns, setColumns] = useState<ColumnState[]>([
    { category: "", candidateId: null, skipped: false },
    { category: "", candidateId: null, skipped: false },
    { category: "", candidateId: null, skipped: false }
  ]);

  // Máscara para celular brasileiro: (XX) 9XXXX-XXXX
  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleaned = value.replace(/\D/g, "");
    let formatted = "";
    
    if (cleaned.length > 0) {
      formatted = `(${cleaned.substring(0, 2)}`;
      if (cleaned.length > 2) {
        formatted += `) ${cleaned.substring(2, 7)}`;
      }
      if (cleaned.length > 7) {
        formatted += `-${cleaned.substring(7, 11)}`;
      }
    }
    setLeadWhatsapp(formatted);
  };

  // Carregar sessão de autenticação
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        handlePostAuthFlow(session);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        handlePostAuthFlow(session);
      } else {
        setUserVotes([]);
        setCurrentStep(1);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Processo executado logo após o login social com sucesso
  const handlePostAuthFlow = async (activeSession: any) => {
    const pendingReg = localStorage.getItem("eleitor_cadastro");
    if (pendingReg) {
      try {
        const { nome, whatsapp, genero } = JSON.parse(pendingReg);
        const registerRes = await fetch("/api/user/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${activeSession.access_token}`
          },
          body: JSON.stringify({ nome, whatsapp, genero })
        });
        
        if (registerRes.ok) {
          localStorage.removeItem("eleitor_cadastro");
        }
      } catch (err) {
        console.error("Erro ao registrar dados cadastrais:", err);
      }
    }

    fetchUserVotes(activeSession.access_token);
  };

  // Carregar candidatos do banco
  useEffect(() => {
    async function fetchCandidatos() {
      try {
        const { data, error } = await supabase
          .from('MDA-candidatos')
          .select("*")
          .order("nome");
        
        if (error) throw error;
        setCandidatos(data || []);
        
        if (data && data.length > 0) {
          const ras = [...new Set(data.map((c: any) => c.regiao_administrativa))].sort();
          if (ras.length > 0) {
            setSelectedRA(prev => prev || ras[0]);
          }
        }
      } catch (err: any) {
        showNotification("Erro ao carregar candidatos.", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchCandidatos();
  }, []);

  // Buscar votos do usuário logado
  const fetchUserVotes = async (token: string) => {
    try {
      const res = await fetch("/api/user/votes", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.votes && data.votes.length > 0) {
        setUserVotes(data.votes);
        setCurrentStep(5); // Exibe recibo
      } else {
        // Apenas avança se estiver nas etapas de login/cadastro
        setCurrentStep(prev => (prev === 1 || prev === 2) ? 3 : prev);
      }
    } catch (err) {
      console.error("Erro ao buscar votos:", err);
    }
  };

  const showNotification = (text: string, type: "success" | "error") => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Validar o Formulário de Cadastro do Lead (Passo 1)
  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!leadNome.trim() || leadNome.trim().split(" ").length < 2) {
      showNotification("Por favor, digite seu nome completo.", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(leadEmail)) {
      showNotification("Por favor, insira um e-mail válido.", "error");
      return;
    }

    const cleanPhone = leadWhatsapp.replace(/\D/g, "");
    if (cleanPhone.length < 11) {
      showNotification("WhatsApp inválido. Deve ter DDD + 9 dígitos.", "error");
      return;
    }

    if (!leadGenero) {
      showNotification("Por favor, selecione seu gênero.", "error");
      return;
    }

    // Verificar duplicidade de e-mail ou whatsapp antes de prosseguir
    try {
      const checkRes = await fetch("/api/user/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: leadEmail, whatsapp: leadWhatsapp })
      });
      const checkData = await checkRes.json();
      
      if (checkData.exists) {
        showNotification(checkData.message, "error");
        return;
      }
    } catch (err) {
      console.error("Erro ao verificar duplicidade:", err);
    }

    // Salvar no localStorage temporariamente para sobreviver ao OAuth
    localStorage.setItem("eleitor_cadastro", JSON.stringify({
      nome: leadNome,
      whatsapp: leadWhatsapp,
      email: leadEmail,
      genero: leadGenero
    }));

    showNotification("Identificação cadastrada com sucesso!", "success");
    setCurrentStep(2); // Avança para o login social
  };

  const handleOAuthLogin = async (provider: "google" | "facebook") => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/votar`
        }
      });
      if (error) throw error;
    } catch (err: any) {
      showNotification(`Erro ao autenticar: ${err.message}`, "error");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("eleitor_cadastro");
    setColumns([
      { category: "", candidateId: null, skipped: false },
      { category: "", candidateId: null, skipped: false },
      { category: "", candidateId: null, skipped: false }
    ]);
    setLeadNome("");
    setLeadEmail("");
    setLeadWhatsapp("");
    showNotification("Você desconectou da votação.", "success");
    setCurrentStep(1);
  };

  const uniqueRAs = [...new Set(candidatos.map(c => c.regiao_administrativa))].sort();

  const categoriesInRA = [...new Set(
    candidatos
      .filter(c => c.regiao_administrativa === selectedRA)
      .map(c => c.categoria)
  )].sort();

  const handleCategoryChange = (colIndex: number, category: string) => {
    setColumns(prev => {
      const updated = [...prev];
      updated[colIndex] = { category, candidateId: null, skipped: false };
      return updated;
    });
  };

  const handleCandidateSelect = (colIndex: number, candidateId: number) => {
    setColumns(prev => {
      const updated = [...prev];
      updated[colIndex] = { ...updated[colIndex], candidateId, skipped: false };
      return updated;
    });
  };

  const handleSkipColumn = (colIndex: number, isSkipped: boolean) => {
    setColumns(prev => {
      const updated = [...prev];
      updated[colIndex] = { 
        ...updated[colIndex], 
        skipped: isSkipped, 
        candidateId: isSkipped ? null : updated[colIndex].candidateId 
      };
      return updated;
    });
  };

  const submitVotes = async () => {
    if (!session) return;

    const valid = columns.every(col => {
      if (!col.category) return true;
      return col.candidateId !== null || col.skipped;
    });

    if (!valid) {
      showNotification("Por favor, selecione um candidato ou marque 'Não quero votar' nas categorias escolhidas.", "error");
      return;
    }

    const votesToSubmit = columns.filter(col => col.category && col.candidateId !== null && !col.skipped);

    if (votesToSubmit.length === 0) {
      showNotification("Por favor, faça pelo menos 1 voto para enviar.", "error");
      return;
    }

    setIsSubmitting(true);
    let successCount = 0;
    const errors: string[] = [];

    for (const vote of votesToSubmit) {
      try {
        const res = await fetch("/api/vote", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`
          },
          body: JSON.stringify({
            candidatoId: vote.candidateId,
            categoria: vote.category
          })
        });

        const data = await res.json();
        if (res.ok) {
          successCount++;
        } else {
          errors.push(`${vote.category}: ${data.error}`);
        }
      } catch (err) {
        errors.push(`${vote.category}: Erro de conexão`);
      }
    }

    setIsSubmitting(false);

    if (successCount > 0) {
      showNotification(`Votos registrados com sucesso!`, "success");
      fetchUserVotes(session.access_token);
    } else if (errors.length > 0) {
      showNotification(errors[0], "error");
    }
  };

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-preto text-branco-quente min-h-screen relative pb-20">
        
        {/* Glow de palco */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none -z-10"
          style={{
            background: "radial-gradient(circle at 50% 15%, rgba(201,162,75,0.08), rgba(201,162,75,0) 50%)"
          }}
        />

        {notification && (
          <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-xl backdrop-blur-md border animate-bounce ${
            notification.type === "success" 
              ? "bg-emerald-950/90 border-emerald-500 text-emerald-200" 
              : "bg-red-950/90 border-red-500 text-red-200"
          }`}>
            <span className="font-sans text-sm font-medium">{notification.text}</span>
          </div>
        )}

        <section className="max-w-6xl mx-auto px-6 pt-12">
          
          <div className="text-center mb-10 flex flex-col items-center gap-3">
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-dourado">
              ✦ Escolha Popular
            </span>
            <h1 className="bg-gradient-to-b from-[#F6E6AE] via-dourado-claro to-[#A9842F] bg-clip-text font-display text-4xl font-bold uppercase tracking-wider text-transparent sm:text-5xl">
              Cabine de Voto
            </h1>
            <p className="max-w-md font-sans text-xs sm:text-sm text-cinza-texto leading-relaxed">
              Votação por etapas. Preencha seus dados para receber novidades da feira e confirme seu voto.
            </p>
          </div>

          {/* Indicador de Etapas Interativo */}
          <div className="flex flex-wrap justify-center items-center gap-3 mb-10 text-xs font-sans font-bold">
            {[
              { step: 1, label: "1. Identificação" },
              { step: 2, label: "2. Autenticação" },
              { step: 3, label: "3. Região (RA)" },
              { step: 4, label: "4. Votação" }
            ].map((item, idx) => {
              const isActive = currentStep === item.step;
              const isPrevious = item.step < currentStep && currentStep < 5;
              
              return (
                <div key={item.step} className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (isPrevious) setCurrentStep(item.step);
                    }}
                    disabled={!isPrevious && !isActive}
                    className={`px-4 py-2.5 text-[11px] sm:text-xs rounded-lg transition-all duration-300 font-sans font-bold shadow-md ${
                      isActive 
                        ? "bg-dourado text-preto cursor-default shimmer-border hover:shadow-[0_0_24px_0_rgba(201,162,75,0.5)] hover:scale-[1.03]" 
                        : isPrevious
                          ? "bg-grafite text-cinza-texto hover:text-dourado hover:scale-[1.03] active:scale-[0.98] cursor-pointer border border-neutral-800"
                          : "bg-grafite/40 text-cinza-texto/30 cursor-not-allowed opacity-50 border border-neutral-900/50"
                    }`}
                  >
                    {item.label}
                  </button>
                  {idx < 3 && <span className="text-neutral-700 font-normal">➔</span>}
                </div>
              );
            })}
          </div>

          {/* ================= PASSO 1: IDENTIFICAÇÃO DO ELEITOR ================= */}
          {currentStep === 1 && (
            <div className="max-w-md mx-auto glass-card rounded-2xl p-6 sm:p-8 border border-dourado/20 animate-fade-in">
              <h3 className="font-display text-lg font-bold text-dourado-claro uppercase tracking-wider mb-2 text-center">
                Identificação do Eleitor
              </h3>
              <p className="font-sans text-[11px] text-cinza-texto leading-relaxed mb-6 text-center">
                Para podermos registrar a legitimidade da sua participação e lhe enviar as novidades do prêmio e da feira Hair Brasília, preencha os dados abaixo. Seus dados estão protegidos pela LGPD.
              </p>

              <form onSubmit={handleRegistrationSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-sans text-[10px] uppercase tracking-wider text-cinza-texto font-bold">
                    Nome Completo:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Maria Oliveira Santos"
                    value={leadNome}
                    onChange={(e) => setLeadNome(e.target.value)}
                    className="bg-black text-branco-quente border border-neutral-800 rounded-md py-2 px-3 font-sans text-xs outline-none focus:border-dourado"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-sans text-[10px] uppercase tracking-wider text-cinza-texto font-bold">
                    E-mail:
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Ex: maria@gmail.com"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    className="bg-black text-branco-quente border border-neutral-800 rounded-md py-2 px-3 font-sans text-xs outline-none focus:border-dourado"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-sans text-[10px] uppercase tracking-wider text-cinza-texto font-bold">
                    WhatsApp para contato:
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(61) 99999-9999"
                    value={leadWhatsapp}
                    onChange={handlePhoneInput}
                    className="bg-black text-branco-quente border border-neutral-800 rounded-md py-2 px-3 font-sans text-xs outline-none focus:border-dourado"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-sans text-[10px] uppercase tracking-wider text-cinza-texto font-bold">
                    Como você se identifica (Gênero):
                  </label>
                  <select
                    required
                    value={leadGenero}
                    onChange={(e) => setLeadGenero(e.target.value)}
                    className="bg-black text-branco-quente border border-neutral-800 rounded-md py-2 px-3 font-sans text-xs outline-none focus:border-dourado"
                  >
                    <option value="">-- Selecionar Gênero --</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Outro / Prefiro não responder">Outro / Prefiro não responder</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="bg-dourado hover:bg-dourado-claro text-preto font-sans text-xs font-bold py-2.5 rounded-md transition-all mt-2 shimmer-border"
                >
                  Salvar e Avançar
                </button>
              </form>
            </div>
          )}

          {/* ================= PASSO 2: AUTENTICAÇÃO SOCIAL ================= */}
          {currentStep === 2 && (
            <div className="max-w-md mx-auto glass-card rounded-2xl p-6 sm:p-8 border border-dourado/20 text-center animate-fade-in">
              <h3 className="font-display text-lg font-bold text-dourado-claro uppercase tracking-wider mb-2">
                Conectar Conta Social
              </h3>
              <p className="font-sans text-[11px] text-cinza-texto leading-relaxed mb-6">
                Como regra de auditoria (estilo Prêmio iBest), cada eleitor pode computar seus votos uma única vez. A autenticação social garante que o voto seja associado a um perfil autêntico e evita robôs de votação em lote. Escolha uma opção abaixo:
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handleOAuthLogin("google")}
                  className="w-full flex items-center justify-center gap-2 bg-white hover:bg-neutral-200 text-black font-sans text-xs font-bold py-3 px-5 rounded-md transition-colors shimmer-border"
                >
                  {/* Google SVG Logo */}
                  <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                  Entrar com Google
                </button>
                <button
                  onClick={() => handleOAuthLogin("facebook")}
                  className="w-full flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#165fc2] text-white font-sans text-xs font-bold py-3 px-5 rounded-md transition-colors shimmer-border"
                >
                  {/* Facebook SVG Logo */}
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Entrar com Facebook
                </button>
                
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-xs text-neutral-500 hover:text-white underline font-sans mt-4"
                >
                  Voltar para Identificação
                </button>
              </div>
            </div>
          )}

          {/* ================= PASSO 3: REGIÃO ADMINISTRATIVA ================= */}
          {currentStep === 3 && (
            <div className="max-w-md mx-auto glass-card rounded-2xl p-8 border border-dourado/20 text-center animate-fade-in">
              <span className="font-sans text-[10px] uppercase tracking-widest text-dourado block mb-1">Sessão Autenticada</span>
              <h3 className="font-display text-lg font-bold text-dourado-claro uppercase tracking-wider mb-2">
                Região de Votação
              </h3>
              <p className="font-sans text-xs text-cinza-texto leading-relaxed mb-6">
                Como os concorrentes do Troféu Beleza DF disputam em suas respectivas localidades, selecione abaixo qual Região Administrativa (RA) você deseja filtrar para computar seus votos.
              </p>
              
              <div className="flex flex-col gap-5">
                <select
                  value={selectedRA}
                  onChange={(e) => setSelectedRA(e.target.value)}
                  className="w-full bg-grafite text-branco-quente border border-dourado/30 rounded-md py-2.5 px-3 font-sans text-sm outline-none focus:border-dourado"
                >
                  {uniqueRAs.map((ra) => (
                    <option key={ra} value={ra}>{ra}</option>
                  ))}
                </select>

                <button
                  onClick={() => setCurrentStep(4)}
                  className="w-full bg-dourado hover:bg-dourado-claro text-preto font-sans text-xs font-bold py-2.5 rounded-md transition-all shimmer-border"
                >
                  Avançar para Votação
                </button>
                
                <button
                  onClick={handleSignOut}
                  className="text-xs text-neutral-500 hover:text-red-400 underline font-sans"
                >
                  Sair da Conta
                </button>
              </div>
            </div>
          )}

          {/* ================= PASSO 4: MÚLTIPLAS COLUNAS DE VOTO ================= */}
          {currentStep === 4 && (
            <div className="animate-fade-in">
              
              {/* Info Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-grafite/40 border border-dourado/10 rounded-xl p-4 mb-8 text-xs font-sans">
                <div>
                  <span className="text-cinza-texto">Região de Voto: </span>
                  <span className="text-dourado font-bold">{selectedRA}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-cinza-texto truncate">{session?.user?.email}</span>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="text-dourado font-semibold underline hover:text-dourado-claro"
                  >
                    Alterar RA
                  </button>
                </div>
              </div>

              {/* Descrição do passo de voto */}
              <div className="bg-grafite/20 border border-neutral-900 rounded-2xl p-6 mb-8 text-center max-w-2xl mx-auto font-sans">
                <h4 className="text-dourado-claro font-bold text-sm mb-1 uppercase tracking-wider">Escolha Seus Favoritos</h4>
                <p className="text-xs text-cinza-texto leading-relaxed">
                  Para votar, selecione a categoria desejada em cada uma das 3 colunas independentes abaixo. Você pode dar até **1 voto por categoria**. Se preferir não votar em alguma delas, basta selecionar a categoria e marcar a caixa *"Não quero votar nesta categoria"*.
                </p>
              </div>

              {/* Grid de 3 Colunas de Voto */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {columns.map((col, colIdx) => {
                  
                  const selectedElsewhere = columns
                    .filter((_, idx) => idx !== colIdx)
                    .map(c => c.category)
                    .filter(c => c !== "");

                  const availableCategories = categoriesInRA.filter(cat => !selectedElsewhere.includes(cat));

                  const currentCandidates = candidatos.filter(c => 
                    c.regiao_administrativa === selectedRA && 
                    c.categoria === col.category
                  );

                  // Contar candidatos de cada categoria nesta RA específica
                  const categoryCounts: { [cat: string]: number } = {};
                  candidatos
                    .filter(c => c.regiao_administrativa === selectedRA)
                    .forEach(c => {
                      categoryCounts[c.categoria] = (categoryCounts[c.categoria] || 0) + 1;
                    });

                  return (
                    <div 
                      key={colIdx} 
                      className="glass-card rounded-2xl p-5 border border-dourado/10 flex flex-col justify-between min-h-[450px]"
                    >
                      <div className="flex flex-col gap-4">
                        <div className="border-b border-border/30 pb-3 mb-1">
                          <h4 className="font-display text-sm font-bold text-dourado uppercase tracking-wider">
                            Escolha {colIdx + 1}
                          </h4>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="font-sans text-[9px] uppercase tracking-wider text-dourado font-bold">
                            Categoria do Voto:
                          </label>
                          <select
                            value={col.category}
                            onChange={(e) => handleCategoryChange(colIdx, e.target.value)}
                            className="w-full bg-black text-branco-quente border border-neutral-800 rounded-md py-2 px-3 font-sans text-xs outline-none focus:border-dourado truncate max-w-full"
                          >
                            <option value="">-- Selecionar Categoria --</option>
                            {availableCategories.map(cat => {
                              const count = categoryCounts[cat] || 0;
                              const label = `${cat} (${count} ${count === 1 ? 'candidato' : 'candidatos'})`;
                              return (
                                <option key={cat} value={cat}>
                                  {label}
                                </option>
                              );
                            })}
                          </select>
                        </div>

                        {col.category && (
                          <div className="mt-2">
                            <label className={`flex items-center gap-3 p-3 rounded-lg border font-sans text-xs font-semibold cursor-pointer transition-all mb-4 ${
                              col.skipped 
                                ? "bg-amber-950/10 border-amber-600/50 text-amber-300" 
                                : "bg-black/35 border-neutral-900 text-cinza-texto hover:text-branco-quente"
                            }`}>
                              <input
                                type="checkbox"
                                checked={col.skipped}
                                onChange={(e) => handleSkipColumn(colIdx, e.target.checked)}
                                className="accent-dourado"
                              />
                              Não quero votar nesta categoria
                            </label>

                            {!col.skipped && (
                              <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
                                {currentCandidates.map(cand => {
                                  const isSelected = col.candidateId === cand.id;
                                  return (
                                    <div
                                      key={cand.id}
                                      onClick={() => handleCandidateSelect(colIdx, cand.id)}
                                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                        isSelected 
                                          ? "bg-dourado/10 border-dourado text-branco-quente shadow-[0_0_10px_-2px_rgba(201,162,75,0.2)]" 
                                          : "bg-black/30 border-neutral-900 text-cinza-texto hover:border-neutral-800 hover:text-white"
                                      }`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className="font-sans text-xs font-bold">{cand.nome}</span>
                                        {isSelected && <span className="text-dourado text-xs">✓</span>}
                                      </div>
                                    </div>
                                  );
                                })}
                                {currentCandidates.length === 0 && (
                                  <p className="font-sans text-xs text-neutral-600 italic">Nenhum candidato nesta categoria.</p>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {!col.category && (
                        <div className="border border-dashed border-neutral-950 rounded-xl p-6 text-center mt-6">
                          <span className="font-sans text-[11px] text-neutral-600 block">Escolha uma categoria acima</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={submitVotes}
                  disabled={isSubmitting}
                  className="bg-dourado hover:bg-dourado-claro text-preto font-sans text-xs font-bold py-3 px-10 rounded-md transition-all shimmer-border shadow-lg"
                >
                  {isSubmitting ? "Computando seus votos..." : "Confirmar e Enviar Votos"}
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="text-xs text-neutral-500 hover:text-white underline font-sans"
                >
                  Voltar para escolha de RA
                </button>
              </div>

            </div>
          )}

          {/* ================= PASSO 5: SUCESSO / VOTO CONFIRMADO ================= */}
          {currentStep === 5 && (
            <div className="max-w-lg mx-auto glass-card rounded-2xl p-8 border border-emerald-500/20 text-center animate-fade-in">
              <span className="text-4xl block mb-4">🏆</span>
              <h3 className="font-display text-xl font-bold text-emerald-400 uppercase tracking-wider mb-2">
                Obrigado! Seus votos foram registrados.
              </h3>
              <p className="font-sans text-xs text-cinza-texto leading-relaxed mb-6">
                Sua participação foi computada com sucesso no banco de dados. Confira abaixo os seus votos registrados:
              </p>

              <div className="flex flex-col gap-3 mb-8 text-left max-w-sm mx-auto">
                {userVotes.map((v, idx) => {
                  const cand = candidatos.find(c => c.id === v.candidato_id);
                  return (
                    <div key={idx} className="bg-black/40 border border-neutral-800 rounded-lg p-3 flex justify-between items-center">
                      <div>
                        <span className="font-sans text-[9px] uppercase tracking-wider text-dourado block">{v.categoria}</span>
                        <span className="font-sans text-xs font-bold text-branco-quente block mt-0.5">{cand?.nome || "Candidato"}</span>
                      </div>
                      <span className="bg-emerald-950/80 border border-emerald-600/30 text-emerald-400 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">
                        Confirmado
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-center gap-4">
                <a
                  href="/"
                  className="bg-neutral-900 border border-neutral-700 hover:border-dourado hover:text-dourado text-branco-quente font-sans text-xs font-bold py-2.5 px-6 rounded-md transition-colors"
                >
                  Voltar para o Site
                </a>
                <button
                  onClick={handleSignOut}
                  className="bg-transparent border border-neutral-800 hover:border-red-500 hover:text-red-400 text-cinza-texto font-sans text-xs font-semibold py-2.5 px-6 rounded-md transition-colors"
                >
                  Sair da Conta
                </button>
              </div>
            </div>
          )}

        </section>
      </main>
      <SiteFooter />
    </>
  );
}
