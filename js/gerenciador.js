let editIndex = null;

// Elementos do DOM para toast e modal
const toast = document.getElementById('toast');
const modalConfirmacao = document.getElementById('modalConfirmacao');
const modalMensagem = document.getElementById('modalMensagem');
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

// Fecha modal ao clicar fora
document.addEventListener('click', (e) => {
  if (e.target === modalConfirmacao) modalConfirmacao.classList.add('hidden');
});

window.onload = () => {
    listarItens();

    const params = new URLSearchParams(window.location.search);
    const index = params.get("editIndex");

    if (index !== null) {
        editarItem(Number(index));
    }
};

function salvarItem() {
    const codigo = document.getElementById("codigo").value.trim();
    const nome = document.getElementById("nome").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const condicao = document.getElementById("condicao").value;

    if (!codigo || !nome) {
        mostrarToast("Preencha código e nome!", 'erro');
        return;
    }

    let itens = JSON.parse(localStorage.getItem("itens")) || [];

    if (editIndex === null) {
        const data = new Date().toISOString();
        const item = { codigo, nome, descricao, condicao, data };
        itens.push(item);
        mostrarToast("Item adicionado com sucesso!");
    } else {
        itens[editIndex].codigo = codigo;
        itens[editIndex].nome = nome;
        itens[editIndex].descricao = descricao;
        itens[editIndex].condicao = condicao;
        editIndex = null;
        document.getElementById("btnSalvar").textContent = "Salvar";
        mostrarToast("Item atualizado com sucesso!");
    }

    localStorage.setItem("itens", JSON.stringify(itens));

    limparFormulario();
    listarItens();
}

function limparFormulario() {
    document.getElementById("codigo").value = "";
    document.getElementById("nome").value = "";
    document.getElementById("descricao").value = "";
    document.getElementById("condicao").value = "";
    editIndex = null;
    document.getElementById("btnSalvar").textContent = "Salvar";
}

function listarItens() {
    let itens = JSON.parse(localStorage.getItem("itens")) || [];
    const tbody = document.getElementById("tabelaItensBody");
    tbody.innerHTML = "";

    itens.forEach((item, index) => {
        const tr = document.createElement("tr");

        // Formatação da condição para exibição e cor
        let condicaoTexto = '';
        let corClasse = ''; // Classe de cor para o <td>
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
                corClasse = ''; // Sem cor se vazio
        }

        tr.innerHTML = `
            <td class="py-3 px-4 border-b border-gray-200">${item.codigo}</td>
            <td class="py-3 px-4 border-b border-gray-200">${item.nome}</td>
            <td class="py-3 px-4 border-b border-gray-200">${item.descricao}</td>
            <td class="py-3 px-4 border-b border-gray-200 ${corClasse}">${condicaoTexto}</td>
            <td class="py-3 px-4 border-b border-gray-200">${new Date(item.data).toLocaleDateString('pt-BR')}</td>
            <td class="py-3 px-8 border-b border-gray-200 bg-gray-50 border-l border-gray-200 min-w-64 flex justify-between items-center">
                <button 
                    class="bg-yellow-400 text-black px-5 py-2 rounded hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                    onclick="editarItem(${index})"
                    aria-label="Editar item ${item.nome}"
                >
                    Editar
                </button>
                <button 
                    class="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
                    onclick="removerItem(${index})"
                    aria-label="Remover item ${item.nome}"
                >
                    Remover
                </button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

function editarItem(index) {
    let itens = JSON.parse(localStorage.getItem("itens")) || [];
    const item = itens[index];

    document.getElementById("codigo").value = item.codigo;
    document.getElementById("nome").value = item.nome;
    document.getElementById("descricao").value = item.descricao;
    document.getElementById("condicao").value = item.condicao || '';

    editIndex = index;
    document.getElementById("btnSalvar").textContent = "Atualizar";

    // Foco no campo nome para melhor UX
    document.getElementById("nome").focus();
}

function removerItem(index) {
    confirmarAcao("⚠️ Tem certeza que deseja remover este item?\n\nEle será movido para itens de saída no histórico.", (confirmado) => {
        if (!confirmado) return;

        let itens = JSON.parse(localStorage.getItem("itens")) || [];
        let removidos = JSON.parse(localStorage.getItem("removidos")) || [];

        const [itemRemovido] = itens.splice(index, 1);
        itemRemovido.dataSaida = new Date().toISOString();

        removidos.push(itemRemovido);

        localStorage.setItem("itens", JSON.stringify(itens));
        localStorage.setItem("removidos", JSON.stringify(removidos));

        listarItens();

        if (editIndex === index) {
            limparFormulario();
        }

        mostrarToast("Item removido com sucesso! Ele agora aparece no relatório de saídas.");
    });
}