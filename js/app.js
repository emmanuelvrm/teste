/*
 * CAMADA DE CONTROLE  (liga eventos da tela às funções de dados)
 */
(function () {
  let filtro = "todas";

  async function atualizar() { UI.desenhar(await Dados.listar(), filtro); }

  document.getElementById("form-nova").addEventListener("submit", async (e) => {
    e.preventDefault();
    const campo = document.getElementById("titulo");
    if (!campo.value.trim()) return;
    await Dados.criar(campo.value);
    campo.value = ""; campo.focus();
    atualizar();
  });

  document.getElementById("lista").addEventListener("click", async (e) => {
    const acao = e.target.dataset.acao;
    const id = e.target.closest(".item")?.dataset.id;
    if (!acao || !id) return;
    if (acao === "alternar") await Dados.alternar(id);
    if (acao === "remover") await Dados.remover(id);
    atualizar();
  });

  document.querySelector(".filtros").addEventListener("click", (e) => {
    const f = e.target.dataset.filtro;
    if (!f) return;
    filtro = f;
    document.querySelectorAll(".filtros button").forEach(b =>
      b.setAttribute("aria-pressed", String(b.dataset.filtro === f)));
    atualizar();
  });

  // Verifica o servidor: a rota /saude é o mesmo "health check" usado depois no deploy.
  async function verificarServidor() {
    try {
      const r = await fetch("saude", { cache: "no-store" });
      const j = await r.json();
      UI.status(j.status === "ok" ? "Servidor respondendo (/saude: ok)" : "Servidor com problema", j.status === "ok" ? "ok" : "erro");
    } catch (e) {
      UI.status("Sem servidor: rodando só no navegador", "erro");
    }
  }

  UI.origem(Dados.origem);
  atualizar();
  verificarServidor();
  setInterval(verificarServidor, 15000);
})();
