// Elementos do DOM para toast
const toast = document.getElementById('toast');

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

function cadastrarUsuario() {
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value;

  if (!nome || !email || !senha) {
    mostrarToast("Preencha todos os campos!", 'erro');
    return;
  }

  let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

  // Verifica se já existe um usuário com esse email
  if (usuarios.some(u => u.email === email)) {
    mostrarToast("Já existe uma conta com esse email.", 'erro');
    return;
  }

  usuarios.push({ nome, email, senha });
  localStorage.setItem('usuarios', JSON.stringify(usuarios));

  mostrarToast("Cadastro realizado com sucesso! Redirecionando para login...");
  
  // Redireciona após 2 segundos para o usuário ver o toast
  setTimeout(() => {
    window.location.href = "login.html"; // volta para o login
  }, 2000);
}