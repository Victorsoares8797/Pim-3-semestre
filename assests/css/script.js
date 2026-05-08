const track = document.getElementById('trackFav');
  const prev  = document.getElementById('prevFav');
  const next  = document.getElementById('nextFav');

  const visiveis = 3;
  const cards = track.querySelectorAll('.slide-card');
  const steps = cards.length - visiveis;
  let current = 0;

  function go(idx) {
    current = Math.max(0, Math.min(idx, steps));
    const largura = cards[0].offsetWidth + 16;
    track.style.transform = `translateX(-${current * largura}px)`;
    prev.disabled = current === 0;
    next.disabled = current === steps;
  }

  prev.addEventListener('click', () => go(current - 1));
  next.addEventListener('click', () => go(current + 1));
  
  function toggleComment() {
      document.getElementById('commentBar').classList.toggle('open');
    }

    function submitComment() {
      const input = document.getElementById('commentInput');
      const text = input.value.trim();
      if (!text) return;
      const list = document.getElementById('commentsList');
      const now = new Date().toLocaleString('pt-BR');
      const item = document.createElement('div');
      item.className = 'comment-item';
      item.innerHTML = `<small>${now}</small>${text}`;
      list.prepend(item);
      input.value = '';
    }