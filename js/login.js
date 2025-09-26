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

function fazerLogin() {
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value;

  if (!email || !senha) {
    mostrarToast("Preencha todos os campos!", 'erro');
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  const usuario = usuarios.find(u => u.email === email && u.senha === senha);

  if (usuario) {
    mostrarToast(`Login bem-sucedido! Bem-vindo, ${usuario.nome} ✅`);
    
    // Redireciona após 2 segundos para o usuário ver o toast
    setTimeout(() => {
      window.location.href = "menu.html"; // vai para o menu
    }, 2000);
  } else {
    mostrarToast("Email ou senha incorretos!", 'erro');
  }
}