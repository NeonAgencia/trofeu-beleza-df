import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function Regulamento() {
  const secoes = [
    {
      numero: "1",
      titulo: "Do objetivo",
      conteudo: [
        "O Troféu Os Melhores do Ano – Beleza DF é uma iniciativa criada para reconhecer, valorizar e dar visibilidade a profissionais, empresas e estabelecimentos que fazem a beleza acontecer no Distrito Federal.",
        "O projeto tem como propósito destacar histórias reais de trabalho, dedicação, superação, empreendedorismo, transformação e contribuição para o fortalecimento da área da beleza.",
        "Mais do que uma premiação, o Troféu nasce como um movimento de valorização das pessoas que constroem diariamente o setor da beleza em suas comunidades, regiões administrativas, salões, clínicas, barbearias, esmalterias e espaços de atendimento."
      ]
    },
    {
      numero: "2",
      titulo: "Da participação",
      conteudo: [
        "Poderão participar profissionais, empresas e estabelecimentos da área da beleza que atuem no Distrito Federal e que realizem sua inscrição dentro do prazo definido pela organização.",
        "A inscrição deverá ser realizada por meio do formulário oficial disponibilizado pela organização do Troféu.",
        "Ao se inscrever, o participante declara que as informações fornecidas são verdadeiras e autoriza a utilização de seu nome, imagem, história, trajetória profissional e demais dados informados para fins de divulgação, comunicação, homenagem e realização do Troféu Os Melhores do Ano – Beleza DF."
      ]
    },
    {
      numero: "3",
      titulo: "Das categorias",
      conteudo: [
        "O Troféu poderá contemplar categorias voltadas a profissionais e estabelecimentos da área da beleza, incluindo, entre outras:",
        "Categorias Profissionais: Cabeleireiro(a); Barbeiro; Maquiador(a); Nail Designer; Designer de Sobrancelhas; Lash Designer; Micropigmentador(a); Profissional da Estética.",
        "Categorias de Empresas e Estabelecimentos: Salão de Beleza; Barbearia; Clínica de Estética; Esmalteria / Nail Studio; Espaço de Design de Sobrancelhas; Espaço de Lash Design / Extensão de Cílios; Espaço de Micropigmentação; Outros espaços ligados à área da beleza, conforme avaliação da organização.",
        "A organização poderá ajustar, agrupar, alterar ou excluir categorias, caso identifique necessidade técnica, operacional ou número insuficiente de inscrições em determinada categoria ou Região Administrativa."
      ]
    },
    {
      numero: "4",
      titulo: "Da votação popular",
      conteudo: [
        "A proposta inicial do Troféu prevê a realização de votação popular, online, por categoria e por Região Administrativa, com o objetivo de reconhecer os profissionais e estabelecimentos mais indicados pelo público.",
        "A votação será realizada por meio de plataforma digital ou formulário oficial, conforme definição da organização.",
        "Cada participante deverá concorrer na categoria e Região Administrativa informadas no ato da inscrição.",
        "A organização poderá adotar mecanismos de controle para garantir maior segurança, transparência e regularidade no processo de votação, podendo invalidar votos duplicados, inconsistentes, suspeitos ou que não estejam de acordo com as regras estabelecidas."
      ]
    },
    {
      numero: "5",
      titulo: "Do quórum mínimo para votação",
      conteudo: [
        "Para que uma categoria seja considerada apta à votação competitiva por Região Administrativa, será necessário atingir número mínimo de inscrições válidas, conforme avaliação da organização.",
        "Caso determinada categoria ou Região Administrativa não alcance quórum suficiente para a realização da votação popular no formato inicialmente planejado, a organização poderá:",
        "• Não abrir a votação competitiva naquela categoria ou localidade;",
        "• Agrupar categorias semelhantes;",
        "• Ajustar o formato de reconhecimento;",
        "• Realizar homenagem especial aos participantes inscritos;",
        "• Reconhecer histórias de superação, luta, dedicação, empreendedorismo e contribuição para a área da beleza.",
        "Essa medida tem como objetivo preservar a seriedade, a justiça e a credibilidade do Troféu, evitando disputas sem representatividade suficiente."
      ]
    },
    {
      numero: "6",
      titulo: "Do reconhecimento por história e trajetória",
      conteudo: [
        "Independentemente da realização da votação popular em todas as categorias e Regiões Administrativas, a organização poderá reconhecer profissionais, empresas e estabelecimentos que realizaram sua inscrição e apresentaram histórias relevantes de superação, vitória, dedicação, empreendedorismo, transformação pessoal, profissional ou contribuição para a área da beleza.",
        "As histórias poderão ser avaliadas pela organização do Troféu, considerando critérios como: trajetória na área da beleza; superação de desafios pessoais ou profissionais; dedicação ao trabalho; impacto positivo na vida de clientes, equipes ou comunidade; contribuição para o fortalecimento da beleza no Distrito Federal; coerência e veracidade das informações apresentadas na inscrição.",
        "Esse reconhecimento não dependerá exclusivamente da votação popular, podendo ocorrer por decisão da organização quando não houver quórum suficiente para votação ou quando a história inscrita representar de forma significativa o propósito do Troféu."
      ]
    },
    {
      numero: "7",
      titulo: "Da homenagem especial",
      conteudo: [
        "Os profissionais, empresas e estabelecimentos selecionados para reconhecimento especial poderão ser homenageados durante a programação oficial da Hair Brasília.",
        "A homenagem acontecerá no dia 21/07, às 16h, no auditório da Hair Brasília, em momento dedicado à valorização das histórias que ajudam a construir a beleza do Distrito Federal.",
        "A homenagem tem caráter institucional, simbólico e de reconhecimento público, não representando necessariamente classificação por votação popular, salvo nos casos em que a votação tenha sido realizada e validada pela organização."
      ]
    },
    {
      numero: "8",
      titulo: "Da divulgação dos homenageados e reconhecidos",
      conteudo: [
        "A organização poderá divulgar os nomes, imagens, histórias e categorias dos profissionais, empresas e estabelecimentos homenageados nos canais oficiais da Hair Brasília, do Troféu Os Melhores do Ano – Beleza DF, redes sociais, site, imprensa, materiais institucionais e demais meios de comunicação relacionados ao projeto.",
        "Ao realizar a inscrição, o participante autoriza essa divulgação, sem que isso gere qualquer obrigação financeira por parte da organização."
      ]
    },
    {
      numero: "9",
      titulo: "Da transparência do processo",
      conteudo: [
        "A organização se compromete a conduzir o Troféu com responsabilidade, transparência e respeito aos participantes.",
        "A votação popular, quando realizada, será considerada conforme os critérios definidos pela organização.",
        "Nos casos em que não houver quórum suficiente para votação competitiva, o reconhecimento por história e trajetória será realizado como forma de preservar o propósito principal do projeto: valorizar quem faz a beleza acontecer."
      ]
    },
    {
      numero: "10",
      titulo: "Das decisões da organização",
      conteudo: [
        "Caberá exclusivamente à organização do Troféu Os Melhores do Ano – Beleza DF interpretar este regulamento, resolver casos omissos, validar inscrições, definir categorias, confirmar quórum, conduzir a votação, selecionar histórias para reconhecimento e realizar eventuais ajustes necessários para a boa execução do projeto.",
        "As decisões da organização serão soberanas e terão como objetivo garantir a credibilidade, a segurança, a coerência e a valorização dos participantes."
      ]
    },
    {
      numero: "11",
      titulo: "Das disposições finais",
      conteudo: [
        "A inscrição no Troféu Os Melhores do Ano – Beleza DF implica na aceitação integral deste regulamento.",
        "O participante declara estar ciente de que o formato do Troféu poderá ser ajustado conforme o número de inscrições, categorias, Regiões Administrativas, condições técnicas, operacionais e estratégicas definidas pela organização.",
        "O Troféu Os Melhores do Ano – Beleza DF reafirma seu compromisso de reconhecer profissionais e estabelecimentos que, com trabalho, coragem, dedicação e amor pela profissão, ajudam a construir a história da beleza no Distrito Federal."
      ]
    }
  ];

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-preto text-branco-quente pb-24 relative">
        {/* Glow Dourado sutil de palco */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none -z-10"
          style={{
            background: "radial-gradient(circle at 50% 10%, rgba(201,162,75,0.06), rgba(201,162,75,0) 40%)"
          }}
        />

        <section className="max-w-4xl mx-auto px-6 pt-16">
          {/* Cabeçalho da Página */}
          <div className="text-center mb-16 flex flex-col items-center gap-3">
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-dourado">
              ✦ Termos e Diretrizes
            </span>
            <h1 className="bg-gradient-to-b from-[#F6E6AE] via-dourado-claro to-[#A9842F] bg-clip-text font-display text-3xl font-bold uppercase tracking-wider text-transparent sm:text-4xl">
              Regulamento Oficial
            </h1>
            <p className="max-w-md font-sans text-xs sm:text-sm text-cinza-texto leading-relaxed">
              Diretrizes de participação, votação popular, quórum e critérios de reconhecimento do Troféu Beleza DF.
            </p>
          </div>

          {/* Container do Regulamento (Glassmorphism) */}
          <div className="glass-card rounded-2xl p-6 sm:p-10 border border-dourado/15">
            <div className="flex flex-col gap-10">
              {secoes.map((sec) => (
                <div key={sec.numero} className="border-b border-border/30 pb-8 last:border-b-0 last:pb-0">
                  {/* Título da Seção */}
                  <h3 className="font-display text-base font-bold text-dourado-claro uppercase tracking-wider mb-4 flex items-baseline gap-2">
                    <span className="text-dourado font-sans text-sm font-semibold">{sec.numero}.</span>
                    {sec.titulo}
                  </h3>
                  
                  {/* Conteúdo */}
                  <div className="flex flex-col gap-3">
                    {sec.conteudo.map((p, i) => (
                      <p key={i} className="font-sans text-xs sm:text-sm leading-relaxed text-cinza-texto">
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
