// Elementos do DOM para o mini menu, toast e modais
const miniMenu = document.getElementById('miniMenu');
const toast = document.getElementById('toast');
const modalConfirmacao = document.getElementById('modalConfirmacao');
const modalDetalhes = document.getElementById('modalDetalhes');
const modalMensagem = document.getElementById('modalMensagem');
const modalDetalhesConteudo = document.getElementById('modalDetalhesConteudo');
const btnConfirmar = document.getElementById('btnConfirmar');
const btnCancelar = document.getElementById('btnCancelar');

// Função para mostrar Toast (notificação flutuante)
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

  // Esconde após 4 segundos
  setTimeout(() => {
    toast.classList.add('opacity-0');
    setTimeout(() => toast.classList.add('hidden'), 300);
  }, 4000);
}

// Função para mostrar Modal de Confirmação
function confirmarAcao(mensagem, callback) {
  modalMensagem.textContent = mensagem;
  modalConfirmacao.classList.remove('hidden');

  // Configura botões (remove listeners anteriores para evitar duplicatas)
  const confirmarHandler = () => {
    modalConfirmacao.classList.add('hidden');
    btnConfirmar.removeEventListener('click', confirmarHandler);
    btnCancelar.removeEventListener('click', cancelarHandler);
    callback(true); // Executa a ação
  };

  const cancelarHandler = () => {
    modalConfirmacao.classList.add('hidden');
    btnConfirmar.removeEventListener('click', confirmarHandler);
    btnCancelar.removeEventListener('click', cancelarHandler);
    callback(false); // Cancela
  };

  btnConfirmar.addEventListener('click', confirmarHandler);
  btnCancelar.addEventListener('click', cancelarHandler);
}

// Função para mostrar Modal de Detalhes
function mostrarModalDetalhes(dados) {
  let condicaoTexto = '';
  switch (dados.condicao) {
      case 'bom': condicaoTexto = 'Bom ✅'; break;
      case 'medio': condicaoTexto = 'Médio ⚠️'; break;
      case 'ruim': condicaoTexto = 'Ruim ❌'; break;
      default: condicaoTexto = 'N/A'; break;
  }

  modalDetalhesConteudo.innerHTML = `
    <p><strong>Código:</strong> ${dados.codigo}</p>
    <p><strong>Nome:</strong> ${dados.nome}</p>
    <p><strong>Descrição:</strong> ${dados.descricao}</p>
    <p><strong>Condição:</strong> ${condicaoTexto}</p>
    <p><strong>Data de Cadastro:</strong> ${dados.data || 'N/A'}</p>
    ${!dados.isAtivo ? `<p><strong>Data de Saída:</strong> ${dados.dataSaida}</p>` : ''}
  `;
  modalDetalhes.classList.remove('hidden');
}

// Função para fechar Modal de Detalhes
function fecharModalDetalhes() {
  modalDetalhes.classList.add('hidden');
}

// Fecha modais ao clicar fora
document.addEventListener('click', (e) => {
  if (e.target === modalConfirmacao) modalConfirmacao.classList.add('hidden');
  if (e.target === modalDetalhes) modalDetalhes.classList.add('hidden');
});

// Carrega as tabelas ao inicializar a página
window.onload = () => {
  atualizarRelatorioMes();
  atualizarRelatorioSaida();

  // Fecha o mini menu ao clicar fora dele
  document.addEventListener('click', (e) => {
    if (!miniMenu.contains(e.target) && !e.target.classList.contains('btn-editar')) {
      miniMenu.classList.add('hidden');
    }
  });
};

function atualizarRelatorioMes() {
  let itens = JSON.parse(localStorage.getItem("itens")) || [];
  const tbody = document.querySelector("#tabelaRelatorioMes tbody");
  tbody.innerHTML = "";

  const mesAtual = new Date().getMonth();
  const anoAtual = new Date().getFullYear();

  itens
      .filter(item => {
          const dataItem = new Date(item.data);
          return dataItem.getMonth() === mesAtual && dataItem.getFullYear() === anoAtual;
      })
      .forEach((item, index) => {
          // Formatação da condição para exibição e cor
          let condicaoTexto = '';
          let corClasse = '';
          switch (item.condicao) {
              case 'bom':
                  condicaoTexto = 'Bom';
                  corClasse = 'bg-green-100';
                  break;
              case 'medio':
                  condicaoTexto = 'Médio';
                  corClasse = 'bg-yellow-100';
                  break;
              case 'ruim':
                  condicaoTexto = 'Ruim';
                  corClasse = 'bg-red-100';
                  break;
              default:
                  condicaoTexto = '';
                  corClasse = '';
          }

          const tr = document.createElement("tr");
          tr.innerHTML = `
              <td class="py-3 px-4 border-b border-gray-200">${item.codigo}</td>
              <td class="py-3 px-4 border-b border-gray-200">${item.nome}</td>
              <td class="py-3 px-4 border-b border-gray-200">${item.descricao}</td>
              <td class="py-3 px-4 border-b border-gray-200 ${corClasse}">${condicaoTexto}</td>
              <td class="py-3 px-4 border-b border-gray-200">${new Date(item.data).toLocaleDateString('pt-BR')}</td>
              <td class="py-3 px-4 border-b border-gray-200">
                  <button class="btn-editar bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-300 w-full"
                          onclick="mostrarMenuMes(event, ${index})"
                          aria-label="Editar item ${item.nome}">
                      Editar
                  </button>
              </td>
          `;
          tbody.appendChild(tr);
      });
}

function atualizarRelatorioSaida() {
    let removidos = JSON.parse(localStorage.getItem("removidos")) || [];
    const tbody = document.querySelector("#tabelaRelatorioSaida tbody");
    tbody.innerHTML = "";

    removidos.forEach((item, index) => {
        // Formatação da condição para exibição e cor
        let condicaoTexto = '';
        let corClasse = '';
        switch (item.condicao) {
            case 'bom':
                condicaoTexto = 'Bom';
                corClasse = 'bg-green-100';
                break;
            case 'medio':
                condicaoTexto = 'Médio';
                corClasse = 'bg-yellow-100';
                break;
            case 'ruim':
                condicaoTexto = 'Ruim';
                corClasse = 'bg-red-100';
                break;
            default:
                condicaoTexto = '';
                corClasse = '';
        }

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="py-3 px-4 border-b border-gray-200">${item.codigo}</td>
            <td class="py-3 px-4 border-b border-gray-200">${item.nome}</td>
            <td class="py-3 px-4 border-b border-gray-200">${item.descricao}</td>
            <td class="py-3 px-4 border-b border-gray-200 ${corClasse}">${condicaoTexto}</td>
            <td class="py-3 px-4 border-b border-gray-200">${new Date(item.dataSaida).toLocaleDateString('pt-BR')}</td>
            <td class="py-3 px-4 border-b border-gray-200">
                <button class="btn-editar bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-300 w-full"
                        onclick="mostrarMenuSaida(event, ${index})"
                        aria-label="Editar item de saída ${item.nome}">
                    Editar
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Função para mostrar mini menu de itens cadastrados (mes)
function mostrarMenuMes(event, index) {
    event.stopPropagation(); // Impede o fechamento imediato
    const itens = JSON.parse(localStorage.getItem("itens")) || [];
    const item = itens[index];

    // Posiciona o menu perto do botão
    const rect = event.target.getBoundingClientRect();
    miniMenu.style.top = `${rect.bottom + window.scrollY}px`;
    miniMenu.style.left = `${rect.left + window.scrollX}px`;

    // Conteúdo do menu para itens ativos
    miniMenu.innerHTML = `
        <button class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onclick="editarItemMes(${index}); miniMenu.classList.add('hidden');">
            Editar Item
        </button>
        <button class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onclick="removerItemMes(${index}); miniMenu.classList.add('hidden');">
            Remover Item
        </button>
        <button class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onclick="verDetalhesItem(${index}, true); miniMenu.classList.add('hidden');">
            Ver Detalhes
        </button>
    `;

    miniMenu.classList.remove('hidden');
}

// Função para mostrar mini menu de itens de saída
function mostrarMenuSaida(event, index) {
    event.stopPropagation();
    const removidos = JSON.parse(localStorage.getItem("removidos")) || [];
    const item = removidos[index];

    // Posiciona o menu
    const rect = event.target.getBoundingClientRect();
    miniMenu.style.top = `${rect.bottom + window.scrollY}px`;
    miniMenu.style.left = `${rect.left + window.scrollX}px`;

    // Conteúdo do menu para itens removidos
    miniMenu.innerHTML = `
        <button class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onclick="restaurarItemSaida(${index}); miniMenu.classList.add('hidden');">
            Restaurar Item
        </button>
        <button class="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50" onclick="excluirItemSaida(${index}); miniMenu.classList.add('hidden');">
            Excluir Definitivo
        </button>
        <button class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onclick="verDetalhesItem(${index}, false); miniMenu.classList.add('hidden');">
            Ver Detalhes
        </button>
    `;

    miniMenu.classList.remove('hidden');
}

// Funções de ações do menu para itens cadastrados (mes)
function editarItemMes(index) {
    window.location.href = `gerenciador.html?editIndex=${index}`;
}

function removerItemMes(index) {
    confirmarAcao('⚠️ Tem certeza que deseja remover este item?\n\nEle será movido para a lista de itens de saída e não poderá ser editado aqui.', (confirmado) => {
        if (!confirmado) return;

        let itens = JSON.parse(localStorage.getItem("itens")) || [];
        let removidos = JSON.parse(localStorage.getItem("removidos")) || [];

        const [itemRemovido] = itens.splice(index, 1);
        itemRemovido.dataSaida = new Date().toISOString();

        removidos.push(itemRemovido);

        localStorage.setItem("itens", JSON.stringify(itens));
        localStorage.setItem("removidos", JSON.stringify(removidos));

        atualizarRelatorioMes();
        atualizarRelatorioSaida();
        mostrarToast('Item removido com sucesso! Ele agora aparece na seção de itens de saída.');
    });
}

// Funções de ações do menu para itens de saída
function restaurarItemSaida(index) {
    confirmarAcao('🔄 Tem certeza que deseja restaurar este item?\n\nEle voltará para a lista de itens ativos e poderá ser editado novamente.', (confirmado) => {
        if (!confirmado) return;

        let removidos = JSON.parse(localStorage.getItem("removidos")) || [];
        let itens = JSON.parse(localStorage.getItem("itens")) || [];

        const [itemRestaurado] = removidos.splice(index, 1);
        delete itemRestaurado.dataSaida; // Remove a data de saída

        itens.push(itemRestaurado);

        localStorage.setItem("removidos", JSON.stringify(removidos));
        localStorage.setItem("itens", JSON.stringify(itens));

        atualizarRelatorioMes();
        atualizarRelatorioSaida();
        mostrarToast('Item restaurado com sucesso! Ele agora aparece na seção de itens cadastrados.');
    });
}

function excluirItemSaida(index) {
    confirmarAcao('🗑️ Tem certeza que deseja excluir este item definitivamente?\n\nEsta ação é IRREVERSÍVEL e removerá o item permanentemente do histórico.', (confirmado) => {
        if (!confirmado) return;

        let removidos = JSON.parse(localStorage.getItem("removidos")) || [];
        removidos.splice(index, 1);

        localStorage.setItem("removidos", JSON.stringify(removidos));

        atualizarRelatorioSaida();
        mostrarToast('Item excluído definitivamente! O histórico foi atualizado.', 'erro');
    });
}

// Função genérica para ver detalhes (ativa ou saída)
function verDetalhesItem(index, isAtivo) {
    let dados;
    if (isAtivo) {
        let itens = JSON.parse(localStorage.getItem("itens")) || [];
        dados = itens[index];
        dados.data = new Date(dados.data).toLocaleDateString('pt-BR');
    } else {
        let removidos = JSON.parse(localStorage.getItem("removidos")) || [];
        dados = removidos[index];
        dados.dataSaida = new Date(dados.dataSaida).toLocaleDateString('pt-BR');
        if (dados.data) {
            dados.data = new Date(dados.data).toLocaleDateString('pt-BR');
        }
    }
    dados.isAtivo = isAtivo;
    dados.condicao = dados.condicao; // Já processada no modal

    mostrarModalDetalhes(dados);
}

// Função para exportar PDF de Itens Cadastrados Neste Mês
function exportarPDFMes() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let itens = JSON.parse(localStorage.getItem("itens")) || [];
    const mesAtual = new Date().getMonth();
    const anoAtual = new Date().getFullYear();
    const itensFiltrados = itens.filter(item => {
        const dataItem = new Date(item.data);
        return dataItem.getMonth() === mesAtual && dataItem.getFullYear() === anoAtual;
    });

    // Título
    doc.setFontSize(16);
    doc.text(`Relatório: Itens Cadastrados Neste Mês (${new Date().toLocaleDateString('pt-BR', { month: 'long' })} ${anoAtual})`, 14, 20);
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`, 14, 30);

    if (itensFiltrados.length === 0) {
        doc.text('Nenhum item encontrado para este mês.', 14, 45);
    } else {
        // Cabeçalhos da tabela
        const cabecalhos = [['Código', 'Nome', 'Descrição', 'Condição', 'Data']];
        const corpo = itensFiltrados.map(item => {
            let condicaoTexto = '';
            switch (item.condicao) {
                case 'bom': condicaoTexto = 'Bom'; break;
                case 'medio': condicaoTexto = 'Médio'; break;
                case 'ruim': condicaoTexto = 'Ruim'; break;
                default: condicaoTexto = ''; break;
            }
            return [item.codigo, item.nome, item.descricao, condicaoTexto, new Date(item.data).toLocaleDateString('pt-BR')];
        });

        // Adiciona a tabela ao PDF (a partir de y=40)
        doc.autoTable({
            head: cabecalhos,
            body: corpo,
            startY: 40,
            theme: 'grid',
            headStyles: { fillColor: [99, 102, 241] }, // Cor indigo para cabeçalho
            styles: { fontSize: 8, cellPadding: 3 },
            margin: { left: 14, right: 14 }
        });
    }

        // Salva o PDF
    doc.save(`relatorio-mes-${new Date().toISOString().split('T')[0]}.pdf`);
}

// Função para exportar PDF de Itens que Saíram do Estoque
function exportarPDFSaida() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let removidos = JSON.parse(localStorage.getItem("removidos")) || [];

    // Título
    doc.setFontSize(16);
    doc.text('Relatório: Itens que Saíram do Estoque', 14, 20);
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`, 14, 30);

    if (removidos.length === 0) {
        doc.text('Nenhum item removido encontrado.', 14, 45);
    } else {
        // Cabeçalhos da tabela
        const cabecalhos = [['Código', 'Nome', 'Descrição', 'Condição', 'Data Saída']];
        const corpo = removidos.map(item => {
            let condicaoTexto = '';
            switch (item.condicao) {
                case 'bom': condicaoTexto = 'Bom'; break;
                case 'medio': condicaoTexto = 'Médio'; break;
                case 'ruim': condicaoTexto = 'Ruim'; break;
                default: condicaoTexto = ''; break;
            }
            return [item.codigo, item.nome, item.descricao, condicaoTexto, new Date(item.dataSaida).toLocaleDateString('pt-BR')];
        });

        // Adiciona a tabela ao PDF (a partir de y=40)
        doc.autoTable({
            head: cabecalhos,
            body: corpo,
            startY: 40,
            theme: 'grid',
            headStyles: { fillColor: [34, 197, 94] }, // Cor verde para cabeçalho
            styles: { fontSize: 8, cellPadding: 3 },
            margin: { left: 14, right: 14 }
        });
    }

    // Salva o PDF
    doc.save(`relatorio-saida-${new Date().toISOString().split('T')[0]}.pdf`);
}