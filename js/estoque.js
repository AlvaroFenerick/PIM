// Elementos do DOM para toast e modal
const toast = document.getElementById('toast');
const modalDetalhes = document.getElementById('modalDetalhes');
const modalDetalhesConteudo = document.getElementById('modalDetalhesConteudo');
const listaItens = document.getElementById('listaItens');
const resumoContagem = document.getElementById('resumoContagem');

// Função para mostrar Toast (adaptada das páginas anteriores)
function mostrarToast(mensagem, tipo = 'sucesso') {
  const conteudo = document.getElementById('toastConteudo');
  const icone = tipo === 'sucesso' ? '✅' : '❌';
  const corClasse = tipo === 'sucesso' ? 'bg-green-100 border-green-300 text-green-800' : 'bg-red-100 border-red-300 text-red-800';
  
  conteudo.innerHTML = `
    <span class="mr-2">${icone}</span>
    <span>${mensagem}</span>
  `;
  toast.className = `fixed top-4 right-4 z-50 ${corClasse} border rounded-lg shadow-lg p-4 max-w-sm w-full mx-4 transition-opacity duration-300 opacity-100`;
  toast.classList.remove('hidden');

  setTimeout(() => {
    toast.classList.add('opacity-0');
    setTimeout(() => toast.classList.add('hidden'), 300);
  }, 4000);
}

// Função para mostrar Modal de Detalhes
function mostrarModalDetalhes(dados) {
  let condicaoTexto = '';
  let corClasse = '';
  switch (dados.condicao) {
    case 'bom': condicaoTexto = 'Bom ✅'; corClasse = 'text-green-600'; break;
    case 'medio': condicaoTexto = 'Médio ⚠️'; corClasse = 'text-yellow-600'; break;
    case 'ruim': condicaoTexto = 'Ruim ❌'; corClasse = 'text-red-600'; break;
    default: condicaoTexto = 'N/A'; corClasse = 'text-gray-600'; break;
  }

  // Imagem placeholder para teclado (substitua pela URL real se tiver upload)
  const imagemUrl = dados.imagem || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop'; // Exemplo: imagem de teclado

  modalDetalhesConteudo.innerHTML = `
    <img src="${imagemUrl}" alt="${dados.nome}" class="w-full h-48 object-cover rounded mb-4">
    <p><strong>Código:</strong> ${dados.codigo}</p>
    <p><strong>Nome:</strong> ${dados.nome}</p>
    <p><strong>Descrição:</strong> ${dados.descricao}</p>
    <p><strong>Condição:</strong> <span class="${corClasse}">${condicaoTexto}</span></p>
    <p><strong>Data de Cadastro:</strong> ${new Date(dados.data).toLocaleDateString('pt-BR')}</p>
  `;
  modalDetalhes.classList.remove('hidden');
}

// Função para fechar Modal de Detalhes
function fecharModalDetalhes() {
  modalDetalhes.classList.add('hidden');
}

// Fecha modal ao clicar fora
document.addEventListener('click', (e) => {
  if (e.target === modalDetalhes) fecharModalDetalhes();
});

// Função para carregar/atualizar o estoque do localStorage
function carregarEstoque() {
  let itens = JSON.parse(localStorage.getItem("itens")) || [];
  
  // Exemplo: Filtra para itens com "teclado" no nome (ajuste conforme necessário)
  const itensTeclado = itens.filter(item => item.nome.toLowerCase().includes('teclado'));
  const totalTeclados = itensTeclado.length;
  const todosItens = itens.length; // Fallback se não houver teclados

  // Limpa a lista anterior
  listaItens.innerHTML = '';

  if (totalTeclados === 0 && todosItens === 0) {
    listaItens.innerHTML = '<p class="col-span-full text-center text-gray-500 py-8">Estoque vazio. Adicione itens no gerenciador!</p>';
    resumoContagem.innerHTML = '<p class="text-gray-600">Total de itens no estoque: 0</p>';
    mostrarToast('Estoque vazio! Cadastre itens primeiro.', 'erro');
    return;
  }

  // Usa itensTeclado se houver, senão todos os itens
  const itensParaMostrar = totalTeclados > 0 ? itensTeclado : itens;

  // Cria cards
  itensParaMostrar.forEach((item) => {
    // Imagem placeholder (pode ser dinâmica se adicionar 'imagem' no localStorage)
    const imagemUrl = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&h=200&fit=crop'; // Teclado exemplo

    // Cor da condição para badge
    let corBadge = '';
    let condicaoTextoBadge = '';
    switch (item.condicao) {
      case 'bom': 
        corBadge = 'bg-green-100 text-green-800'; 
        condicaoTextoBadge = 'Bom';
        break;
      case 'medio': 
        corBadge = 'bg-yellow-100 text-yellow-800'; 
        condicaoTextoBadge = 'Médio';
        break;
      case 'ruim': 
        corBadge = 'bg-red-100 text-red-800'; 
        condicaoTextoBadge = 'Ruim';
        break;
      default: 
        corBadge = 'bg-gray-100 text-gray-800';
        condicaoTextoBadge = 'N/A';
    }

    const card = document.createElement('div');
    card.className = 'bg-gray-50 rounded-lg p-4 shadow-md hover:shadow-lg transition';
    card.innerHTML = `
      <img src="${imagemUrl}" alt="${item.nome}" class="w-full h-48 object-cover rounded mb-3">
      <h3 class="font-semibold text-indigo-700 mb-2">${item.nome}</h3>
      <p class="text-gray-600 mb-2">${item.descricao.substring(0, 100)}${item.descricao.length > 100 ? '...' : ''}</p>
      <span class="inline-block px-2 py-1 rounded-full text-xs font-medium ${corBadge} mb-3">${condicaoTextoBadge}</span>
      <button onclick="mostrarModalDetalhes(${JSON.stringify(item).replace(/"/g, '&quot;')})" 
              class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
        Ver Detalhes
      </button>
    `;
    listaItens.appendChild(card);
  });

  // Atualiza resumo (exemplo focado em teclados)
  const textoResumo = totalTeclados > 0 ? `Total de teclados no estoque: ${totalTeclados}` : `Total de itens no estoque: ${todosItens}`;
  resumoContagem.innerHTML = `<p class="text-lg font-semibold text-indigo-700">${textoResumo}</p>`;
}

// Função para atualizar o estoque (chamada pelo botão)
function atualizarEstoque() {
  carregarEstoque();
  mostrarToast('Estoque atualizado com sucesso!', 'sucesso');
}

// Carrega o estoque ao inicializar a página
window.onload = () => {
  carregarEstoque();
};