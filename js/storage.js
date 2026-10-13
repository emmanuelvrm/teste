/*
 * CAMADA DE DADOS  (único arquivo que sabe ONDE as tarefas ficam)
 * Etapa 0: localStorage do navegador.
 * Etapa 1: este arquivo é trocado por uma versão que usa fetch("/api/tarefas").
 * As 4 funções abaixo e o formato da tarefa NÃO mudam, por isso ui.js e app.js
 * continuam iguais.
 *
 * Formato da tarefa:
 *   { id, titulo, concluida, criada_em, atualizada_em, removida, sincronizada }
 */
const Dados = (function () {
  const CHAVE = "tarefas-referencia:v1";
  let memoria = [];            // reserva caso o navegador bloqueie o localStorage

  function ler() {
    try { return JSON.parse(localStorage.getItem(CHAVE)) || []; }
    catch (e) { return memoria; }
  }
  function gravar(lista) {
    memoria = lista;
    try { localStorage.setItem(CHAVE, JSON.stringify(lista)); } catch (e) { /* segue em memória */ }
  }
  function agora() { return new Date().toISOString(); }
  function novoId() {
    return (crypto.randomUUID ? crypto.randomUUID()
      : "t-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8));
  }

  async function listar() { return ler().filter(t => !t.removida); }

  async function criar(titulo) {
    const lista = ler();
    const tarefa = { id: novoId(), titulo: titulo.trim(), concluida: false,
      criada_em: agora(), atualizada_em: agora(), removida: false, sincronizada: false };
    lista.unshift(tarefa);
    gravar(lista);
    return tarefa;
  }

  async function alternar(id) {
    const lista = ler();
    const t = lista.find(x => x.id === id);
    if (t) { t.concluida = !t.concluida; t.atualizada_em = agora(); t.sincronizada = false; }
    gravar(lista);
    return t;
  }

  async function remover(id) {          // exclusão lógica: prepara a sincronização futura
    const lista = ler();
    const t = lista.find(x => x.id === id);
    if (t) { t.removida = true; t.atualizada_em = agora(); t.sincronizada = false; }
    gravar(lista);
  }

  return { listar, criar, alternar, remover, origem: "navegador (localStorage)" };
})();
