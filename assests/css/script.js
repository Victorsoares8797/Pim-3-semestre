// ========== SLIDER DE CARDS (Favoritos / Pratos) ==========

// Seleciona os elementos principais do slider
const track    = document.getElementById('trackFav');
const prev     = document.getElementById('prevFav');
const next     = document.getElementById('nextFav');
const wrapper  = track.parentElement;

// Seleciona todos os cards dentro da trilha e define o índice inicial
const cards    = track.querySelectorAll('.slide-card');
let current    = 0;

// Retorna quantos cards ficam visíveis de acordo com o tamanho da tela
function getVisiveis() {
  return window.innerWidth <= 768 ? 1 : 3;
}

// Retorna o total de passos possíveis no slider
function getTotalSteps() {
  return cards.length - getVisiveis();
}

// Move o slider para o índice informado e atualiza os botões
function go(idx) {
  const steps = getTotalSteps();
  current = Math.max(0, Math.min(idx, steps)); // Garante que o índice fique dentro dos limites
  const largura = wrapper.offsetWidth / getVisiveis(); // Calcula a largura de cada card
  track.style.transform = `translateX(-${current * largura}px)`; // Desloca a trilha horizontalmente

  // Desabilita os botões quando estiver no início ou no fim
  prev.disabled = current === 0;
  next.disabled = current === steps;
}

// Eventos de clique dos botões de navegação
prev.addEventListener('click', () => go(current - 1));
next.addEventListener('click', () => go(current + 1));

// Recalcula o slider ao redimensionar a janela
window.addEventListener('resize', () => go(current));

// ========== SUPORTE A TOUCH (SWIPE) NO SLIDER ==========

let touchStartX = 0;

// Registra a posição inicial do toque
track.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });

// Detecta a direção do swipe e navega para o card correspondente
track.addEventListener('touchend', (e) => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) { // Só considera como swipe se o movimento for maior que 50px
    diff > 0 ? go(current + 1) : go(current - 1);
  }
});


// ========== BARRA DE COMENTÁRIOS E AVALIAÇÃO (Página do Perfil do Comércio) ==========

let selectedRating = null; // Armazena a nota selecionada pelo usuário

// Retorna a classe CSS de cor conforme a nota (baixa, média ou alta)
function getRatingClass(n) {
  if (n <= 4) return 'low';
  if (n <= 7) return 'mid';
  return 'high';
}

// Retorna o rótulo textual correspondente à nota
function getRatingLabel(n) {
  if (n <= 4) return 'Ruim';
  if (n <= 7) return 'Regular';
  if (n <= 9) return 'Bom';
  return 'Excelente';
}

// Gera dinamicamente os botões de nota de 1 a 10 na grade de avaliação
const grid = document.getElementById('ratingGrid');
for (let i = 1; i <= 10; i++) {
  const btn = document.createElement('button');
  btn.className = 'rating-btn ' + getRatingClass(i);
  btn.textContent = i;
  btn.dataset.value = i;
  btn.onclick = () => selectRating(i);
  grid.appendChild(btn);
}

// Marca o botão de nota selecionado e atualiza o estado visual
function selectRating(n) {
  selectedRating = n;
  document.querySelectorAll('.rating-btn').forEach(b => {
    b.classList.toggle('selected', parseInt(b.dataset.value) === n);
  });
}

// Abre ou fecha a barra de comentários ao clicar no botão "Comentar"
function toggleComment() {
  const bar = document.getElementById('commentBar');
  const btn = document.getElementById('toggleBtn');
  const open = bar.classList.toggle('open');
  btn.classList.toggle('active', open);
}

// Envia a avaliação e adiciona o comentário na lista
function submitComment() {
  // Se nenhuma nota foi selecionada, destaca a grade com borda vermelha por 1 segundo
  if (!selectedRating) {
    const g = document.getElementById('ratingGrid');
    g.style.outline = '2px solid #E24B4A';
    g.style.borderRadius = '8px';
    setTimeout(() => g.style.outline = 'none', 1000);
    return;
  }

  // Coleta os elementos necessários para exibir o comentário
  const input = document.getElementById('commentInput');
  const list = document.getElementById('commentsList');
  const empty = document.getElementById('emptyState');
  const text = input.value.trim();

  // Remove a mensagem de "nenhuma avaliação ainda" se existir
  if (empty) empty.remove();

  // Prepara os dados do comentário
  const cls = getRatingClass(selectedRating);
  const lbl = getRatingLabel(selectedRating);
  const now = new Date();
  const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  // Cria o elemento HTML do novo comentário
  const item = document.createElement('div');
  item.className = 'comment-item';
  item.innerHTML = `
    <div class="comment-meta">
      <span class="rating-badge badge-${cls}"> ${selectedRating}/10 · ${lbl}</span>
      <span>Você · ${time}</span>
    </div>
    ${text ? `<div>${text}</div>` : ''}
  `;

  // Adiciona o comentário no topo da lista
  list.prepend(item);

  // Limpa o campo de texto e reseta a nota selecionada
  input.value = '';
  selectedRating = null;
  document.querySelectorAll('.rating-btn').forEach(b => b.classList.remove('selected'));
}