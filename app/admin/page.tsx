"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

interface StatCandidate {
  id: number;
  nome: string;
  categoria: string;
  regiao_administrativa: string;
  votos: number;
}

interface Lead {
  nome: string;
  email: string;
  whatsapp: string;
  genero: string;
  criado_em: string;
}

interface StatsData {
  totalVotes: number;
  totalLeads: number;
  votesByRA: { [ra: string]: number };
  votesByCategory: { [cat: string]: number };
  genderStats: { Feminino: number; Masculino: number; Outros: number };
  top10Candidates: StatCandidate[];
  rankingGeral: StatCandidate[];
  rankingByCategory: { [cat: string]: StatCandidate[] };
  candidatos: any[];
  eleitores: Lead[];
}

export default function AdminDashboard() {
  const [session, setSession] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isUserAdmin, setIsUserAdmin] = useState<boolean | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [notification, setNotification] = useState<{ text: string; type: "success" | "error" } | null>(null);
  
  // Controle de Abas
  const [activeTab, setActiveTab] = useState<"dashboard" | "inscritos" | "rankings" | "cities" | "rankingGeral" | "leads">("dashboard");
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>("");
  
  // Filtros de busca para abas novas
  const [inscritosSearch, setInscritosSearch] = useState("");
  const [rankingGeralSearch, setRankingGeralSearch] = useState("");

  // Modais de detalhe de inscritos
  const [activeCityModal, setActiveCityModal] = useState<boolean>(false);
  const [activeCategoryModal, setActiveCategoryModal] = useState<boolean>(false);

  // Monitorar estado da autenticação
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchStats(session.access_token);
      } else {
        setCheckingAuth(false);
        setIsUserAdmin(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchStats(session.access_token);
      } else {
        setStats(null);
        setCheckingAuth(false);
        setIsUserAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const showNotification = (text: string, type: "success" | "error") => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Classificador de Profissional vs Empresa
  const isEmpresa = (categoria: string): boolean => {
    const lower = categoria.toLowerCase();
    return lower.includes("salão") || 
           lower.includes("barbearia") || 
           lower.includes("esmalteria") || 
           lower.includes("studio") || 
           lower.includes("clínica") || 
           lower.includes("espaço") || 
           lower.includes("centro");
  };

  // Cálculos dos Candidatos Inscritos
  let profissionaisCount = 0;
  let empresasCount = 0;
  const candidatesByRA: { [ra: string]: number } = {};
  const candidatesByCategory: { [cat: string]: number } = {};

  stats?.candidatos?.forEach((c: any) => {
    candidatesByRA[c.regiao_administrativa] = (candidatesByRA[c.regiao_administrativa] || 0) + 1;
    candidatesByCategory[c.categoria] = (candidatesByCategory[c.categoria] || 0) + 1;
    if (isEmpresa(c.categoria)) {
      empresasCount++;
    } else {
      profissionaisCount++;
    }
  });

  const totalInscritos = stats?.candidatos?.length || 1;
  const profPct = Math.round((profissionaisCount / totalInscritos) * 100);
  const empPct = Math.round((empresasCount / totalInscritos) * 100);

  // Ordenações para os gráficos
  const sortedRAs = Object.keys(candidatesByRA)
    .map(ra => ({ ra, count: candidatesByRA[ra] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const sortedCats = Object.keys(candidatesByCategory)
    .map(cat => ({ cat, count: candidatesByCategory[cat] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const handleSignIn = async (provider: "google" | "facebook") => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/admin`
        }
      });
      if (error) throw error;
    } catch (err: any) {
      showNotification(`Erro ao entrar: ${err.message}`, "error");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    showNotification("Sessão encerrada.", "success");
    setIsUserAdmin(false);
  };

  // Buscar estatísticas gerais (A própria API valida contra a tabela "MDA-admins")
  const fetchStats = async (token: string) => {
    setLoadingStats(true);
    try {
      const res = await fetch("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.status === 403) {
        setIsUserAdmin(false);
        setCheckingAuth(false);
        return;
      }
      
      const data = await res.json();
      if (data.success) {
        setIsUserAdmin(true);
        setStats(data);
      } else {
        showNotification(data.error || "Erro ao carregar dados.", "error");
      }
    } catch (err) {
      showNotification("Falha na conexão de dados.", "error");
    } finally {
      setCheckingAuth(false);
      setLoadingStats(false);
    }
  };

  // Sincronizar Candidatos da Planilha do Google
  const handleSync = async () => {
    if (!session) return;
    setSyncing(true);
    try {
      const res = await fetch("/api/admin/sync", {
        method: "POST"
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Sincronização concluída! ${data.count} candidatos atualizados.`, "success");
        fetchStats(session.access_token);
      } else {
        showNotification(data.error || "Erro ao sincronizar.", "error");
      }
    } catch (err) {
      showNotification("Erro na rede durante a sincronização.", "error");
    } finally {
      setSyncing(false);
    }
  };

  // Exportar Excel
  const exportExcel = () => {
    if (!session) return;
    window.open(`/api/admin/export/excel?token=${session.access_token}`, "_blank");
    showNotification("Download da planilha de auditoria iniciado.", "success");
  };

  // Exportar PDF
  const exportPdf = () => {
    if (!session) return;
    window.open(`/api/admin/export/pdf?token=${session.access_token}`, "_blank");
    showNotification("Download do PDF de vencedores iniciado.", "success");
  };

  // Copiar contatos de WhatsApp em lote para disparos
  const copyWhatsappsToClipboard = () => {
    if (!stats?.eleitores || stats.eleitores.length === 0) {
      showNotification("Nenhum lead disponível para copiar.", "error");
      return;
    }
    const cleanNumbers = stats.eleitores
      .map(el => el.whatsapp.replace(/\D/g, ""))
      .filter((v, i, a) => a.indexOf(v) === i); // remover duplicados
    
    const clipboardText = cleanNumbers.join(", ");
    navigator.clipboard.writeText(clipboardText).then(() => {
      showNotification(`${cleanNumbers.length} números de WhatsApp copiados!`, "success");
    }).catch(() => {
      showNotification("Falha ao copiar contatos.", "error");
    });
  };

  // Exportar Leads para CSV
  const downloadLeadsCSV = () => {
    if (!stats?.eleitores || stats.eleitores.length === 0) {
      showNotification("Nenhum lead disponível para download.", "error");
      return;
    }
    const headers = ["Nome", "Email", "WhatsApp", "Genero", "Data de Cadastro"];
    const rows = stats.eleitores.map(el => [
      `"${el.nome.replace(/"/g, '""')}"`,
      `"${el.email}"`,
      `"${el.whatsapp}"`,
      `"${el.genero || 'Não informado'}"`,
      `"${new Date(el.criado_em).toLocaleDateString("pt-BR")}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `leads_trofeu_beleza_df_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification("Planilha de Leads baixada!", "success");
  };

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-preto text-cinza-texto font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-dourado border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs uppercase tracking-widest font-semibold">Verificando permissões...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-preto text-branco-quente min-h-screen relative pb-24">
        
        {/* Glow Dourado de Palco */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none -z-10"
          style={{
            background: "radial-gradient(circle at 50% 15%, rgba(201,162,75,0.06), rgba(201,162,75,0) 50%)"
          }}
        />

        {/* Notificações */}
        {notification && (
          <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-xl backdrop-blur-md border animate-bounce ${
            notification.type === "success" 
              ? "bg-emerald-950/90 border-emerald-500 text-emerald-200" 
              : "bg-red-950/90 border-red-500 text-red-200"
          }`}>
            <span className="font-sans text-sm font-medium">{notification.text}</span>
          </div>
        )}

        <section className="max-w-7xl mx-auto px-6 pt-12">
          
          {/* Header */}
          <div className="text-center mb-10 flex flex-col items-center gap-3">
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-dourado">
              ✦ Controle da Organização
            </span>
            <h1 className="bg-gradient-to-b from-[#F6E6AE] via-dourado-claro to-[#A9842F] bg-clip-text font-display text-4xl font-bold uppercase tracking-wider text-transparent sm:text-5xl">
              Painel de Apuração
            </h1>
            <p className="max-w-md font-sans text-xs sm:text-sm text-cinza-texto leading-relaxed">
              Consulte parciais em tempo real, gerencie leads coletados e exporte dados para auditoria.
            </p>
          </div>

          {!isUserAdmin ? (
            /* Login Bloqueado */
            <div className="max-w-md mx-auto glass-card rounded-2xl p-8 border border-dourado/20 text-center">
              <h3 className="font-display text-lg font-bold text-dourado-claro uppercase tracking-wider mb-3">
                Acesso Restrito
              </h3>
              <p className="font-sans text-xs text-cinza-texto leading-relaxed mb-6">
                Este espaço é exclusivo para a comissão organizadora do prêmio. Se você é um organizador, faça login com o seu e-mail administrativo cadastrado:
              </p>
              
              {session && (
                <div className="bg-red-950/30 border border-red-500/20 text-red-200 px-4 py-2.5 rounded-lg text-xs font-medium mb-4 break-all">
                  O e-mail <b>{session.user.email}</b> não possui permissão de acesso.
                </div>
              )}

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handleSignIn("google")}
                  className="w-full flex items-center justify-center gap-2 bg-white text-black font-sans text-xs font-bold py-2.5 px-5 rounded-md hover:bg-neutral-200 transition-colors shimmer-border"
                >
                  Entrar com Google
                </button>
                <button
                  onClick={() => handleSignIn("facebook")}
                  className="w-full flex items-center justify-center gap-2 bg-[#1877F2] text-white font-sans text-xs font-bold py-2.5 px-5 rounded-md hover:bg-[#165fc2] transition-colors shimmer-border"
                >
                  Entrar com Facebook
                </button>
                {session && (
                  <button
                    onClick={handleSignOut}
                    className="text-cinza-texto hover:text-white font-sans text-xs mt-3 underline"
                  >
                    Trocar de Conta
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Dashboard Ativo */
            <div>
              {/* Barra de Status e Ações */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-grafite/60 border border-dourado/25 rounded-2xl p-6 mb-8">
                <div className="text-center md:text-left">
                  <span className="font-sans text-[10px] uppercase tracking-widest text-dourado">Sessão Autenticada</span>
                  <h4 className="font-sans text-sm font-semibold text-branco-quente break-all">{session.user.email}</h4>
                </div>
                
                <div className="flex flex-wrap gap-3 justify-center md:justify-end">
                  <button
                    onClick={handleSync}
                    disabled={syncing}
                    className="bg-neutral-900 border border-neutral-700 hover:border-dourado hover:text-dourado text-branco-quente font-sans text-xs font-bold py-2 px-4 rounded-md transition-colors"
                  >
                    {syncing ? "Sincronizando..." : "Sincronizar Planilha"}
                  </button>
                  <button
                    onClick={exportExcel}
                    className="bg-neutral-900 border border-neutral-700 hover:border-dourado hover:text-dourado text-branco-quente font-sans text-xs font-bold py-2 px-4 rounded-md transition-colors"
                  >
                    Exportar Planilha (XLSX)
                  </button>
                  <button
                    onClick={exportPdf}
                    className="bg-dourado hover:bg-dourado-claro text-preto font-sans text-xs font-bold py-2 px-4 rounded-md transition-colors shimmer-border"
                  >
                    Vencedores (PDF)
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="border border-neutral-800 hover:border-red-500/50 hover:text-red-400 text-cinza-texto font-sans text-xs font-semibold py-2 px-4 rounded-md transition-colors"
                  >
                    Sair
                  </button>
                </div>
              </div>

              {/* Navegação por Abas */}
              <div className="flex flex-wrap justify-center border-b border-neutral-900 gap-1 sm:gap-2 mb-8">
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`pb-3 px-4 text-xs sm:text-sm font-sans font-bold transition-all border-b-2 ${
                    activeTab === "dashboard"
                      ? "border-dourado text-dourado"
                      : "border-transparent text-cinza-texto hover:text-white"
                  }`}
                >
                  📊 Dashboard Geral
                </button>
                <button
                  onClick={() => setActiveTab("inscritos")}
                  className={`pb-3 px-4 text-xs sm:text-sm font-sans font-bold transition-all border-b-2 ${
                    activeTab === "inscritos"
                      ? "border-dourado text-dourado"
                      : "border-transparent text-cinza-texto hover:text-white"
                  }`}
                >
                  📝 Inscritos ({stats?.candidatos?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab("rankings")}
                  className={`pb-3 px-4 text-xs sm:text-sm font-sans font-bold transition-all border-b-2 ${
                    activeTab === "rankings"
                      ? "border-dourado text-dourado"
                      : "border-transparent text-cinza-texto hover:text-white"
                  }`}
                >
                  🥇 Classificação por Categoria
                </button>
                <button
                  onClick={() => setActiveTab("cities")}
                  className={`pb-3 px-4 text-xs sm:text-sm font-sans font-bold transition-all border-b-2 ${
                    activeTab === "cities"
                      ? "border-dourado text-dourado"
                      : "border-transparent text-cinza-texto hover:text-white"
                  }`}
                >
                  🏙️ Classificação por Cidade
                </button>
                <button
                  onClick={() => setActiveTab("rankingGeral")}
                  className={`pb-3 px-4 text-xs sm:text-sm font-sans font-bold transition-all border-b-2 ${
                    activeTab === "rankingGeral"
                      ? "border-dourado text-dourado"
                      : "border-transparent text-cinza-texto hover:text-white"
                  }`}
                >
                  🏆 Ranking Geral
                </button>
                <button
                  onClick={() => setActiveTab("leads")}
                  className={`pb-3 px-4 text-xs sm:text-sm font-sans font-bold transition-all border-b-2 ${
                    activeTab === "leads"
                      ? "border-dourado text-dourado"
                      : "border-transparent text-cinza-texto hover:text-white"
                  }`}
                >
                  👥 Lista de Leads ({stats?.totalLeads || 0})
                </button>
              </div>

              {/* ================= ABA 1: DASHBOARD GERAL ================= */}
              {activeTab === "dashboard" && (
                <div className="animate-fade-in flex flex-col gap-8">
                  
                  {/* Grid de Métricas */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="glass-card rounded-2xl p-6 border border-dourado/10 text-center">
                      <span className="font-sans text-[10px] uppercase tracking-widest text-cinza-texto">Votos Acumulados</span>
                      <h2 className="font-display text-4xl font-bold text-dourado mt-2">
                        {loadingStats ? "..." : stats?.totalVotes || 0}
                      </h2>
                    </div>
                    
                    <div className="glass-card rounded-2xl p-6 border border-dourado/10 text-center">
                      <span className="font-sans text-[10px] uppercase tracking-widest text-cinza-texto">Leads Coletados (Eleitores)</span>
                      <h2 className="font-display text-4xl font-bold text-dourado mt-2">
                        {loadingStats ? "..." : stats?.totalLeads || 0}
                      </h2>
                    </div>

                    <div className="glass-card rounded-2xl p-6 border border-dourado/10 text-center">
                      <span className="font-sans text-[10px] uppercase tracking-widest text-cinza-texto">RAs Participantes</span>
                      <h2 className="font-display text-4xl font-bold text-dourado mt-2">
                        {stats ? Object.keys(stats.votesByRA).length : 0}
                      </h2>
                    </div>
                  </div>

                  {/* Segunda Linha: Cidades e Gênero */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Cidades mais Votadas */}
                    <div className="glass-card rounded-2xl p-6 border border-dourado/10">
                      <h3 className="font-display text-xs sm:text-sm font-bold text-dourado-claro uppercase tracking-wider border-b border-dourado/20 pb-3 mb-4">
                        🏆 Ranking de Cidades (RAs Mais Ativas)
                      </h3>
                      {stats && Object.keys(stats.votesByRA).length > 0 ? (
                        <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-1">
                          {Object.keys(stats.votesByRA)
                            .map(ra => ({ ra, votes: stats.votesByRA[ra] }))
                            .sort((a, b) => b.votes - a.votes)
                            .map((item, idx) => {
                              const pct = stats.totalVotes > 0 ? Math.round((item.votes / stats.totalVotes) * 100) : 0;
                              return (
                                <div key={item.ra} className="flex flex-col gap-1.5 font-sans text-xs">
                                  <div className="flex justify-between items-center">
                                    <span className="font-bold text-branco-quente">{idx + 1}º - {item.ra}</span>
                                    <span className="text-dourado font-bold">{item.votes} votos ({pct}%)</span>
                                  </div>
                                  <div className="h-2 w-full bg-black/60 rounded-full overflow-hidden border border-neutral-900">
                                    <div 
                                      className="h-full bg-gradient-to-r from-dourado to-dourado-claro rounded-full transition-all duration-300"
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      ) : (
                        <p className="font-sans text-xs text-cinza-texto py-10 text-center italic">Nenhum voto computado ainda.</p>
                      )}
                    </div>

                    {/* Votação por Gênero */}
                    <div className="glass-card rounded-2xl p-6 border border-dourado/10 flex flex-col justify-between">
                      <div>
                        <h3 className="font-display text-xs sm:text-sm font-bold text-dourado-claro uppercase tracking-wider border-b border-dourado/20 pb-3 mb-4">
                          👥 Perfil de Eleitores (Por Gênero)
                        </h3>
                        {stats && stats.totalLeads > 0 ? (
                          <div className="flex flex-col gap-5 pt-3">
                            {[
                              { label: "Feminino", count: stats.genderStats.Feminino, color: "from-[#F472B6] to-[#EC4899]" },
                              { label: "Masculino", count: stats.genderStats.Masculino, color: "from-[#60A5FA] to-[#3B82F6]" },
                              { label: "Outros / Não respondido", count: stats.genderStats.Outros, color: "from-neutral-600 to-neutral-500" }
                            ].map(item => {
                              const pct = stats.totalLeads > 0 ? Math.round((item.count / stats.totalLeads) * 100) : 0;
                              return (
                                <div key={item.label} className="flex flex-col gap-1.5 font-sans text-xs">
                                  <div className="flex justify-between items-center">
                                    <span className="font-bold text-branco-quente">{item.label}</span>
                                    <span className="text-dourado font-bold">{item.count} eleitores ({pct}%)</span>
                                  </div>
                                  <div className="h-3 w-full bg-black/60 rounded-full overflow-hidden border border-neutral-900">
                                    <div 
                                      className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-300`}
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="font-sans text-xs text-cinza-texto py-10 text-center italic">Aguardando dados de identificação.</p>
                        )}
                      </div>
                      {stats && stats.totalLeads > 0 && (
                        <div className="border-t border-border/10 pt-4 mt-6 text-center text-[10px] text-cinza-texto font-sans italic">
                          O gráfico acima reflete a demografia autodeclarada dos eleitores no Passo 1 da cabine.
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Terceira Linha: Top 10 Concorrentes e Categorias Engajadas */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Top 10 Concorrentes mais Votados Geral */}
                    <div className="glass-card rounded-2xl p-6 border border-dourado/10">
                      <h3 className="font-display text-xs sm:text-sm font-bold text-dourado-claro uppercase tracking-wider border-b border-dourado/20 pb-3 mb-4">
                        👑 Top 10 Concorrentes Mais Votados (Geral)
                      </h3>
                      {stats && stats.top10Candidates.length > 0 ? (
                        <div className="flex flex-col gap-3">
                          {stats.top10Candidates.map((cand, idx) => (
                            <div key={cand.id} className="flex items-center justify-between font-sans text-xs p-2 rounded-lg bg-black/30 border border-neutral-900/60">
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-dourado text-sm w-5">{idx + 1}º</span>
                                <div className="flex flex-col">
                                  <span className="font-bold text-branco-quente">{cand.nome}</span>
                                  <span className="text-[9px] text-cinza-texto truncate max-w-[200px] sm:max-w-[300px]">
                                    {cand.categoria} — {cand.regiao_administrativa}
                                  </span>
                                </div>
                              </div>
                              <span className="font-bold text-dourado-claro bg-dourado/5 px-2.5 py-1 rounded-md border border-dourado/10">{cand.votos} votos</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="font-sans text-xs text-cinza-texto py-10 text-center italic">Sem votos computados ainda.</p>
                      )}
                    </div>

                    {/* Categorias Mais Engajadas */}
                    <div className="glass-card rounded-2xl p-6 border border-dourado/10">
                      <h3 className="font-display text-xs sm:text-sm font-bold text-dourado-claro uppercase tracking-wider border-b border-dourado/20 pb-3 mb-4">
                        ⚡ Categorias Mais Votadas (Engajamento)
                      </h3>
                      {stats && Object.keys(stats.votesByCategory).length > 0 ? (
                        <div className="flex flex-col gap-4">
                          {Object.keys(stats.votesByCategory)
                            .map(cat => ({ cat, count: stats.votesByCategory[cat] }))
                            .sort((a, b) => b.count - a.count)
                            .slice(0, 5)
                            .map((item, idx) => {
                              const pct = stats.totalVotes > 0 ? Math.round((item.count / stats.totalVotes) * 100) : 0;
                              return (
                                <div key={item.cat} className="flex flex-col gap-1.5 font-sans text-xs">
                                  <div className="flex justify-between items-center">
                                    <span className="font-bold text-branco-quente truncate max-w-[200px] sm:max-w-[300px]">{idx + 1}º - {item.cat}</span>
                                    <span className="text-dourado font-bold">{item.count} votos ({pct}%)</span>
                                  </div>
                                  <div className="h-2 w-full bg-black/60 rounded-full overflow-hidden border border-neutral-900">
                                    <div 
                                      className="h-full bg-gradient-to-r from-amber-600 to-dourado rounded-full transition-all duration-300"
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      ) : (
                        <p className="font-sans text-xs text-cinza-texto py-10 text-center italic">Aguardando início das votações.</p>
                      )}
                    </div>

                  </div>

                </div>
              )}

              {/* ================= ABA 2: CLASSICAÇÃO POR CATEGORIA (GRID COMPACTO) ================= */}
              {activeTab === "rankings" && (
                <div className="animate-fade-in">
                  
                  {loadingStats ? (
                    <div className="text-center py-20 font-sans text-cinza-texto">
                      Carregando dados...
                    </div>
                  ) : !stats ? (
                    <div className="text-center py-20 font-sans text-cinza-texto">
                      Nenhum dado de apuração disponível.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Object.keys(stats.rankingByCategory).map(catName => {
                        const cands = stats.rankingByCategory[catName];
                        const maxVotos = Math.max(...cands.map(c => c.votos), 1);
                        
                        return (
                          <div key={catName} className="glass-card rounded-2xl p-5 border border-dourado/10 flex flex-col justify-between min-h-[300px]">
                            <div>
                              {/* Título da Categoria */}
                              <div className="border-b border-dourado/20 pb-2.5 mb-4">
                                <h4 className="font-display text-[13px] font-bold text-dourado uppercase tracking-wider truncate">
                                  {catName}
                                </h4>
                              </div>
                              
                              {/* Lista de Líderes */}
                              <div className="flex flex-col gap-3">
                                {cands.slice(0, 3).map((cand, idx) => {
                                  const pct = Math.round((cand.votos / maxVotos) * 100);
                                  const medal = idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉";
                                  
                                  return (
                                    <div key={cand.id} className="flex flex-col gap-1.5">
                                      <div className="flex items-center justify-between text-[11px] font-sans">
                                        <span className="font-medium text-branco-quente truncate max-w-[70%]">
                                          {medal} {cand.nome} <span className="text-[9px] text-cinza-texto">({cand.regiao_administrativa})</span>
                                        </span>
                                        <span className="font-bold text-dourado-claro">{cand.votos} votos</span>
                                      </div>
                                      <div className="h-1.5 w-full bg-black/60 rounded-full overflow-hidden border border-neutral-900">
                                        <div 
                                          className="h-full bg-gradient-to-r from-dourado to-dourado-claro rounded-full transition-all duration-300" 
                                          style={{ width: `${pct}%` }}
                                        />
                                      </div>
                                    </div>
                                  );
                                })}
                                
                                {cands.length === 0 && (
                                  <p className="font-sans text-[11px] text-neutral-600 italic">Nenhum concorrente cadastrado nesta categoria.</p>
                                )}
                              </div>
                            </div>

                            {cands.length > 3 && (
                              <div className="border-t border-border/5 pt-3 mt-4 text-right">
                                <span className="font-sans text-[9px] text-neutral-500 italic">
                                  + {cands.length - 3} candidatos cadastrados
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                </div>
              )}

              {/* ================= ABA 3: LISTA DE LEADS (CRM ELEITORES) ================= */}
              {activeTab === "leads" && (
                <div className="animate-fade-in bg-grafite/20 border border-neutral-900/60 rounded-2xl p-6">
                  
                  {/* Título e Ações da Lista */}
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 border-b border-border/10 pb-4">
                    <div>
                      <h4 className="font-display text-sm font-bold text-dourado-claro uppercase tracking-wider">
                        Banco de Dados de Leads
                      </h4>
                      <p className="font-sans text-[11px] text-cinza-texto mt-1">
                        Visualize e copie os contatos dos eleitores que registraram participação na cabine.
                      </p>
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={copyWhatsappsToClipboard}
                        className="bg-neutral-900 border border-neutral-700 hover:border-dourado hover:text-dourado text-branco-quente font-sans text-xs font-bold py-2 px-4 rounded-md transition-colors"
                      >
                        Copiar WhatsApps
                      </button>
                      <button
                        onClick={downloadLeadsCSV}
                        className="bg-dourado hover:bg-dourado-claro text-preto font-sans text-xs font-bold py-2 px-4 rounded-md transition-colors shimmer-border"
                      >
                        Exportar CSV
                      </button>
                    </div>
                  </div>

                  {/* Tabela de Leads */}
                  {stats && stats.eleitores.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left font-sans text-xs">
                        <thead>
                          <tr className="border-b border-border/20 text-dourado text-[10px] uppercase tracking-wider font-bold">
                            <th className="py-3 px-4">Nome</th>
                            <th className="py-3 px-4">E-mail</th>
                            <th className="py-3 px-4">WhatsApp</th>
                            <th className="py-3 px-4 text-center">Gênero</th>
                            <th className="py-3 px-4 text-right">Data de Cadastro</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.eleitores.map((eleitor, idx) => (
                            <tr key={idx} className="border-b border-border/5 hover:bg-white/5 transition-colors">
                              <td className="py-3.5 px-4 font-bold text-branco-quente">{eleitor.nome}</td>
                              <td className="py-3.5 px-4 text-cinza-texto font-medium">{eleitor.email}</td>
                              <td className="py-3.5 px-4 text-branco-quente font-bold">{eleitor.whatsapp}</td>
                              <td className="py-3.5 px-4 text-center text-cinza-texto font-medium">{eleitor.genero || "Outros"}</td>
                              <td className="py-3.5 px-4 text-right text-cinza-texto">
                                {new Date(eleitor.criado_em).toLocaleDateString("pt-BR")} às {new Date(eleitor.criado_em).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="py-20 text-center text-cinza-texto font-sans italic">
                      Nenhum lead coletado até o momento.
                    </div>
                  )}

                </div>
              )}

              {/* ================= ABA: CANDIDATOS INSCRITOS ================= */}
              {activeTab === "inscritos" && (
                <div className="animate-fade-in flex flex-col gap-6">
                  
                  {/* Grid de Gráficos das Inscrições */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Gráfico 1: Inscritos por Cidade */}
                    <div className="glass-card rounded-2xl p-5 border border-dourado/10 flex flex-col justify-between min-h-[225px]">
                      <div>
                        <h5 className="font-display text-[10px] sm:text-xs font-bold text-dourado-claro uppercase tracking-wider border-b border-dourado/20 pb-2 mb-3">
                          🏙️ Inscrições por Cidade (Top 5)
                        </h5>
                        <div className="flex flex-col gap-3">
                          {sortedRAs.map(item => {
                            const pct = Math.round((item.count / totalInscritos) * 100);
                            return (
                              <div key={item.ra} className="flex flex-col gap-1 text-[11px] font-sans">
                                <div className="flex justify-between items-center text-cinza-texto">
                                  <span className="font-bold truncate max-w-[70%]">{item.ra}</span>
                                  <span className="text-dourado font-bold">{item.count}</span>
                                </div>
                                <div className="h-1.5 w-full bg-black/60 rounded-full overflow-hidden border border-neutral-900">
                                  <div className="h-full bg-dourado rounded-full" style={{ width: `${pct || 1}%` }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="border-t border-border/5 pt-3 mt-4 flex justify-end">
                        <button
                          onClick={() => setActiveCityModal(true)}
                          className="text-[10px] text-dourado font-bold hover:underline font-sans cursor-pointer"
                        >
                          Ver tudo ➔
                        </button>
                      </div>
                    </div>

                    {/* Gráfico 2: Inscritos por Categoria */}
                    <div className="glass-card rounded-2xl p-5 border border-dourado/10 flex flex-col justify-between min-h-[225px]">
                      <div>
                        <h5 className="font-display text-[10px] sm:text-xs font-bold text-dourado-claro uppercase tracking-wider border-b border-dourado/20 pb-2 mb-3">
                          ⚡ Inscrições por Categoria (Top 5)
                        </h5>
                        <div className="flex flex-col gap-3">
                          {sortedCats.map(item => {
                            const pct = Math.round((item.count / totalInscritos) * 100);
                            return (
                              <div key={item.cat} className="flex flex-col gap-1 text-[11px] font-sans">
                                <div className="flex justify-between items-center text-cinza-texto">
                                  <span className="font-bold truncate max-w-[70%]">{item.cat}</span>
                                  <span className="text-dourado font-bold">{item.count}</span>
                                </div>
                                <div className="h-1.5 w-full bg-black/60 rounded-full overflow-hidden border border-neutral-900">
                                  <div className="h-full bg-gradient-to-r from-amber-600 to-dourado rounded-full" style={{ width: `${pct || 1}%` }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="border-t border-border/5 pt-3 mt-4 flex justify-end">
                        <button
                          onClick={() => setActiveCategoryModal(true)}
                          className="text-[10px] text-dourado font-bold hover:underline font-sans cursor-pointer"
                        >
                          Ver tudo ➔
                        </button>
                      </div>
                    </div>

                    {/* Gráfico 3: Profissionais vs Empresas */}
                    <div className="glass-card rounded-2xl p-5 border border-dourado/10 flex flex-col justify-between">
                      <div>
                        <h5 className="font-display text-[10px] sm:text-xs font-bold text-dourado-claro uppercase tracking-wider border-b border-dourado/20 pb-2 mb-3">
                          👥 Perfil das Inscrições (Tipo)
                        </h5>
                        
                        <div className="flex flex-col gap-4 pt-2">
                          <div className="flex flex-col gap-1 text-[11px] font-sans">
                            <div className="flex justify-between items-center text-cinza-texto">
                              <span className="font-bold">Profissionais (Pessoas)</span>
                              <span className="text-dourado font-bold">{profissionaisCount} ({profPct}%)</span>
                            </div>
                            <div className="h-2.5 w-full bg-black/60 rounded-full overflow-hidden border border-neutral-900">
                              <div className="h-full bg-gradient-to-r from-dourado to-dourado-claro rounded-full" style={{ width: `${profPct}%` }} />
                            </div>
                          </div>

                          <div className="flex flex-col gap-1 text-[11px] font-sans">
                            <div className="flex justify-between items-center text-cinza-texto">
                              <span className="font-bold">Empresas (Salões/Clínicas)</span>
                              <span className="text-dourado font-bold">{empresasCount} ({empPct}%)</span>
                            </div>
                            <div className="h-2.5 w-full bg-black/60 rounded-full overflow-hidden border border-neutral-900">
                              <div className="h-full bg-neutral-600 rounded-full" style={{ width: `${empPct}%` }} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <span className="text-[9px] text-neutral-600 font-sans italic text-center block mt-3">
                        Total cadastrado: {totalInscritos} candidatos
                      </span>
                    </div>

                  </div>

                  <div className="bg-grafite/20 border border-neutral-900/60 rounded-2xl p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 border-b border-border/10 pb-4">
                      <div>
                        <h4 className="font-display text-sm font-bold text-dourado-claro uppercase tracking-wider">
                          Candidatos Inscritos
                        </h4>
                        <p className="font-sans text-[11px] text-cinza-texto mt-1">
                          Visualize a lista de todos os concorrentes importados da planilha de respostas do formulário da Érica.
                        </p>
                      </div>
                      
                      <div className="w-full sm:w-80">
                        <input
                          type="text"
                          placeholder="Buscar por Nome, Cidade ou Categoria..."
                          value={inscritosSearch}
                          onChange={(e) => setInscritosSearch(e.target.value)}
                          className="w-full bg-black text-branco-quente border border-neutral-800 rounded-md py-2 px-3 font-sans text-xs outline-none focus:border-dourado"
                        />
                      </div>
                    </div>

                    {stats && stats.candidatos && stats.candidatos.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left font-sans text-xs">
                          <thead>
                            <tr className="border-b border-border/20 text-dourado text-[10px] uppercase tracking-wider font-bold">
                              <th className="py-3 px-4">Nome do Inscrito</th>
                              <th className="py-3 px-4">Categoria</th>
                              <th className="py-3 px-4">Região Administrativa (Cidade)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {stats.candidatos
                              .filter(c => {
                                const s = inscritosSearch.toLowerCase();
                                return c.nome.toLowerCase().includes(s) || 
                                       c.categoria.toLowerCase().includes(s) || 
                                       c.regiao_administrativa.toLowerCase().includes(s);
                              })
                              .map((cand, idx) => (
                                <tr key={idx} className="border-b border-border/5 hover:bg-white/5 transition-colors">
                                  <td className="py-3.5 px-4 font-bold text-branco-quente">{cand.nome}</td>
                                  <td className="py-3.5 px-4 text-cinza-texto font-medium">{cand.categoria}</td>
                                  <td className="py-3.5 px-4 text-branco-quente font-bold">{cand.regiao_administrativa}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="py-20 text-center text-cinza-texto font-sans italic">
                        Nenhum candidato inscrito carregado. Clique em Sincronizar.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ================= ABA: RANKING GERAL ================= */}
              {activeTab === "rankingGeral" && (
                <div className="animate-fade-in bg-grafite/20 border border-neutral-900/60 rounded-2xl p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 border-b border-border/10 pb-4">
                    <div>
                      <h4 className="font-display text-sm font-bold text-dourado-claro uppercase tracking-wider">
                        Ranking Geral da Votação
                      </h4>
                      <p className="font-sans text-[11px] text-cinza-texto mt-1">
                        Classificação completa de todos os candidatos, ordenada pela quantidade de votos recebidos.
                      </p>
                    </div>
                    
                    <div className="w-full sm:w-80">
                      <input
                        type="text"
                        placeholder="Buscar concorrente no Ranking..."
                        value={rankingGeralSearch}
                        onChange={(e) => setRankingGeralSearch(e.target.value)}
                        className="w-full bg-black text-branco-quente border border-neutral-800 rounded-md py-2 px-3 font-sans text-xs outline-none focus:border-dourado"
                      />
                    </div>
                  </div>

                  {stats && stats.rankingGeral && stats.rankingGeral.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left font-sans text-xs">
                        <thead>
                          <tr className="border-b border-border/20 text-dourado text-[10px] uppercase tracking-wider font-bold">
                            <th className="py-3 px-4 w-20">Classificação</th>
                            <th className="py-3 px-4 w-24">Votos</th>
                            <th className="py-3 px-4">Nome</th>
                            <th className="py-3 px-4">Cidade (RA)</th>
                            <th className="py-3 px-4">Categoria</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.rankingGeral
                            .filter(c => {
                              const s = rankingGeralSearch.toLowerCase();
                              return c.nome.toLowerCase().includes(s) || 
                                     c.categoria.toLowerCase().includes(s) || 
                                     c.regiao_administrativa.toLowerCase().includes(s);
                            })
                            .map((cand, idx) => {
                              const medal = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `${idx + 1}º`;
                              return (
                                <tr key={idx} className="border-b border-border/5 hover:bg-white/5 transition-colors">
                                  <td className="py-3.5 px-4 font-bold text-dourado text-sm">{medal}</td>
                                  <td className="py-3.5 px-4 font-bold text-branco-quente">
                                    <span className="bg-dourado/10 border border-dourado/20 text-dourado text-xs px-2.5 py-0.5 rounded">
                                      {cand.votos} {cand.votos === 1 ? 'voto' : 'votos'}
                                    </span>
                                  </td>
                                  <td className="py-3.5 px-4 font-bold text-branco-quente">{cand.nome}</td>
                                  <td className="py-3.5 px-4 text-cinza-texto font-medium">{cand.regiao_administrativa}</td>
                                  <td className="py-3.5 px-4 text-cinza-texto">{cand.categoria}</td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="py-20 text-center text-cinza-texto font-sans italic">
                      Nenhum dado de votação computado ainda.
                    </div>
                  )}
                </div>
              )}

              {/* ================= ABA 4: CLASSICAÇÃO POR CIDADE ================= */}
              {activeTab === "cities" && (
                <div className="animate-fade-in flex flex-col gap-6">
                  
                  {/* Filtro por Cidade */}
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-grafite/20 border border-neutral-900 rounded-2xl p-6">
                    <div>
                      <h4 className="font-display text-sm font-bold text-dourado-claro uppercase tracking-wider">
                        Apuração por Região Administrativa (Cidade)
                      </h4>
                      <p className="font-sans text-[11px] text-cinza-texto mt-1">
                        Selecione uma RA para ver os resultados detalhados por categoria ou visualize o resumo geral de todas.
                      </p>
                    </div>
                    
                    <div className="w-full sm:w-64 flex flex-col gap-1">
                      <label className="font-sans text-[9px] uppercase tracking-wider text-dourado font-bold">
                        Filtrar Cidade:
                      </label>
                      <select
                        value={selectedCityFilter}
                        onChange={(e) => setSelectedCityFilter(e.target.value)}
                        className="w-full bg-black text-branco-quente border border-neutral-800 rounded-md py-2 px-3 font-sans text-xs outline-none focus:border-dourado"
                      >
                        <option value="">-- Todas as Cidades (Resumo) --</option>
                        {stats && Object.keys(stats.votesByRA).sort().map(ra => (
                          <option key={ra} value={ra}>{ra}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Resultados */}
                  {loadingStats ? (
                    <div className="text-center py-20 font-sans text-cinza-texto">
                      Carregando dados...
                    </div>
                  ) : !stats ? (
                    <div className="text-center py-20 font-sans text-cinza-texto">
                      Nenhum dado de apuração disponível.
                    </div>
                  ) : selectedCityFilter === "" ? (
                    /* VISÃO GERAL: TODAS AS CIDADES */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Object.keys(stats.votesByRA).sort().map(raName => {
                        // Achatar todos os candidatos desta cidade
                        const candidatesInRA = Object.keys(stats.rankingByCategory).flatMap(catName => 
                          stats.rankingByCategory[catName]
                            .filter(c => c.regiao_administrativa === raName)
                            .map(c => ({ ...c, categoria: catName }))
                        ).sort((a, b) => b.votos - a.votos);

                        return (
                          <div key={raName} className="glass-card rounded-2xl p-5 border border-dourado/10 flex flex-col justify-between min-h-[300px]">
                            <div>
                              <div className="border-b border-dourado/20 pb-2.5 mb-4 flex justify-between items-center">
                                <h4 className="font-display text-[13px] font-bold text-dourado uppercase tracking-wider truncate">
                                  🏙️ {raName}
                                </h4>
                                <span className="bg-dourado/10 border border-dourado/25 text-dourado text-[10px] font-bold px-2 py-0.5 rounded-full">
                                  {stats.votesByRA[raName]} {stats.votesByRA[raName] === 1 ? 'voto' : 'votos'}
                                </span>
                              </div>
                              
                              <div className="flex flex-col gap-2.5">
                                {candidatesInRA.slice(0, 5).map((cand, idx) => {
                                  const medal = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `${idx + 1}º`;
                                  return (
                                    <div key={cand.id} className="flex justify-between items-center font-sans text-[11px] p-2 rounded-lg bg-black/25 border border-neutral-900/50">
                                      <div className="flex flex-col truncate max-w-[70%]">
                                        <span className="font-bold text-branco-quente truncate">{medal} {cand.nome}</span>
                                        <span className="text-[8px] text-cinza-texto truncate">{cand.categoria}</span>
                                      </div>
                                      <span className="font-bold text-dourado-claro bg-dourado/5 px-2 py-0.5 rounded border border-dourado/5">
                                        {cand.votos} {cand.votos === 1 ? 'voto' : 'votos'}
                                      </span>
                                    </div>
                                  );
                                })}

                                {candidatesInRA.length === 0 && (
                                  <p className="font-sans text-[11px] text-neutral-600 italic">Nenhum voto computado nesta cidade.</p>
                                )}
                              </div>
                            </div>
                            
                            {candidatesInRA.length > 5 && (
                              <div className="border-t border-border/5 pt-3 mt-4 flex justify-between items-center">
                                <span className="font-sans text-[9px] text-neutral-500 italic">
                                  + {candidatesInRA.length - 5} candidatos votados
                                </span>
                                <button
                                  onClick={() => setSelectedCityFilter(raName)}
                                  className="text-[10px] text-dourado font-bold hover:underline"
                                >
                                  Ver detalhes ➔
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* VISÃO DETALHADA: CIDADE ESPECÍFICA SELECIONADA */
                    <div className="flex flex-col gap-6">
                      <div className="flex justify-between items-center border-b border-border/10 pb-3">
                        <h3 className="font-display text-base font-bold text-dourado uppercase tracking-wider">
                          Apuração Detalhada: {selectedCityFilter}
                        </h3>
                        <button
                          onClick={() => setSelectedCityFilter("")}
                          className="text-xs text-cinza-texto hover:text-white underline font-sans"
                        >
                          ➔ Voltar para visão geral de todas as cidades
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.keys(stats.rankingByCategory).map(catName => {
                          const localCandidates = stats.rankingByCategory[catName]
                            .filter(c => c.regiao_administrativa === selectedCityFilter);
                          
                          if (localCandidates.length === 0) return null; // Não renderizar categorias vazias nessa RA

                          const maxVotos = Math.max(...localCandidates.map(c => c.votos), 1);

                          return (
                            <div key={catName} className="glass-card rounded-2xl p-5 border border-dourado/10 flex flex-col justify-between min-h-[220px]">
                              <div>
                                <div className="border-b border-neutral-900 pb-2 mb-3">
                                  <h4 className="font-display text-[12px] font-bold text-dourado uppercase tracking-wider truncate">
                                    {catName}
                                  </h4>
                                </div>

                                <div className="flex flex-col gap-3">
                                  {localCandidates.map((cand, idx) => {
                                    const pct = Math.round((cand.votos / maxVotos) * 100);
                                    const medal = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `${idx + 1}º`;

                                    return (
                                      <div key={cand.id} className="flex flex-col gap-1.5">
                                        <div className="flex items-center justify-between text-[11px] font-sans">
                                          <span className="font-medium text-branco-quente truncate max-w-[70%]">
                                            {medal} {cand.nome}
                                          </span>
                                          <span className="font-bold text-dourado-claro">{cand.votos} votos</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-black/60 rounded-full overflow-hidden border border-neutral-900">
                                          <div 
                                            className="h-full bg-gradient-to-r from-dourado to-dourado-claro rounded-full transition-all duration-300" 
                                            style={{ width: `${pct}%` }}
                                          />
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>
          )}

        </section>
      </main>

      {/* Modal: Todas as Cidades */}
      {activeCityModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="glass-card bg-[#0D0D0D]/95 border border-dourado/25 rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col p-6 overflow-hidden relative animate-fade-in shadow-2xl">
            <button
              onClick={() => setActiveCityModal(false)}
              className="absolute top-4 right-4 text-cinza-texto hover:text-white font-sans font-bold text-base bg-black/40 hover:bg-neutral-800 w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer"
            >
              ✕
            </button>
            <h4 className="font-display text-xs sm:text-sm font-bold text-dourado-claro uppercase tracking-wider border-b border-neutral-900 pb-3.5 mb-4 pr-10">
              🏙️ Todas as Cidades ({Object.keys(candidatesByRA).length})
            </h4>
            <div className="overflow-y-auto flex flex-col gap-3.5 pr-1.5 scrollbar-thin max-h-[60vh]">
              {Object.keys(candidatesByRA)
                .map(ra => ({ ra, count: candidatesByRA[ra] }))
                .sort((a, b) => b.count - a.count)
                .map(item => {
                  const pct = Math.round((item.count / totalInscritos) * 100);
                  return (
                    <div key={item.ra} className="flex flex-col gap-1 text-[11px] font-sans">
                      <div className="flex justify-between items-center text-cinza-texto">
                        <span className="font-bold truncate max-w-[70%]">{item.ra}</span>
                        <span className="text-dourado font-bold">{item.count} inscritos</span>
                      </div>
                      <div className="h-1.5 w-full bg-black/60 rounded-full overflow-hidden border border-neutral-900">
                        <div className="h-full bg-dourado rounded-full" style={{ width: `${pct || 1}%` }} />
                      </div>
                    </div>
                  );
                })}
            </div>
            <div className="border-t border-neutral-900 pt-3 mt-4 text-[10px] text-neutral-500 font-sans italic text-center">
              Total geral cadastrado: {totalInscritos} candidatos
            </div>
          </div>
        </div>
      )}

      {/* Modal: Todas as Categorias */}
      {activeCategoryModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="glass-card bg-[#0D0D0D]/95 border border-dourado/25 rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col p-6 overflow-hidden relative animate-fade-in shadow-2xl">
            <button
              onClick={() => setActiveCategoryModal(false)}
              className="absolute top-4 right-4 text-cinza-texto hover:text-white font-sans font-bold text-base bg-black/40 hover:bg-neutral-800 w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer"
            >
              ✕
            </button>
            <h4 className="font-display text-xs sm:text-sm font-bold text-dourado-claro uppercase tracking-wider border-b border-neutral-900 pb-3.5 mb-4 pr-10">
              ⚡ Todas as Categorias ({Object.keys(candidatesByCategory).length})
            </h4>
            <div className="overflow-y-auto flex flex-col gap-3.5 pr-1.5 scrollbar-thin max-h-[60vh]">
              {Object.keys(candidatesByCategory)
                .map(cat => ({ cat, count: candidatesByCategory[cat] }))
                .sort((a, b) => b.count - a.count)
                .map(item => {
                  const pct = Math.round((item.count / totalInscritos) * 100);
                  return (
                    <div key={item.cat} className="flex flex-col gap-1 text-[11px] font-sans">
                      <div className="flex justify-between items-center text-cinza-texto">
                        <span className="font-bold truncate max-w-[70%]">{item.cat}</span>
                        <span className="text-dourado font-bold">{item.count} inscritos</span>
                      </div>
                      <div className="h-1.5 w-full bg-black/60 rounded-full overflow-hidden border border-neutral-900">
                        <div className="h-full bg-gradient-to-r from-amber-600 to-dourado rounded-full" style={{ width: `${pct || 1}%` }} />
                      </div>
                    </div>
                  );
                })}
            </div>
            <div className="border-t border-neutral-900 pt-3 mt-4 text-[10px] text-neutral-500 font-sans italic text-center">
              Total geral cadastrado: {totalInscritos} candidatos
            </div>
          </div>
        </div>
      )}

      <SiteFooter />
    </>
  );
}
