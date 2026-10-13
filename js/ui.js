/*
 * CAMADA DE TELA  (só desenha; não sabe de onde os dados vêm)
 */
const UI = (function () {
  const $lista = document.getElementById("lista");
  const $vazio = document.getElementById("vazio");
  const $contador = document.getElementById("contador");

  function dataCurta(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) + " " +
           d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  }

  function desenhar(tarefas, filtro) {
    const visiveis = tarefas.filter(t =>
      filtro === "pendentes" ? !t.concluida : filtro === "concluidas" ? t.concluida : true);
    $lista.replaceChildren(...visiveis.map(criarItem));
    $vazio.hidden = visiveis.length > 0;
    const pend = tarefas.filter(t => !t.concluida).length;
    $contador.textContent = pend + (pend === 1 ? " pendente" : " pendentes");
  }

  function criarItem(t) {
    const li = document.createElement("li");
    li.className = "item" + (t.concluida ? " feita" : "");
    li.dataset.id = t.id;

    const cb = document.createElement("input");
    cb.type = "checkbox"; cb.checked = t.concluida; cb.dataset.acao = "alternar";
    cb.setAttribute("aria-label", "Concluir: " + t.titulo);

    const txt = document.createElement("span");
    txt.className = "texto"; txt.textContent = t.titulo;       // textContent evita injeção de HTML

    const data = document.createElement("span");
    data.className = "data"; data.textContent = dataCurta(t.atualizada_em);

    const bt = document.createElement("button");
    bt.type = "button"; bt.className = "remover"; bt.dataset.acao = "remover";
    bt.textContent = "Remover"; bt.setAttribute("aria-label", "Remover: " + t.titulo);

    li.append(cb, txt, data, bt);
    return li;
  }

  function status(texto, estado) {
    document.getElementById("status-servidor").textContent = texto;
    document.getElementById("ponto").className = "ponto " + (estado || "");
  }
  function origem(texto) { document.getElementById("onde").textContent = "dados: " + texto; }

  return { desenhar, status, origem };
})();
