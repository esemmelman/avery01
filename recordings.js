'use strict';
(() => {
  const player = document.getElementById('player');
  const status = document.getElementById('playback-status');
  let current, frame, activeWord = -1;
  function highlight(index) {
    if (activeWord === index) return;
    activeWord = index;
    document.querySelectorAll('[data-word]').forEach(row => {
      const active = Number(row.dataset.word) === index;
      row.classList.toggle('active', active);
      if (active) row.setAttribute('aria-current', 'true');
      else row.removeAttribute('aria-current');
    });
  }
  function sync() {
    const time = player.currentTime + 0.005;
    const mark = current?.marks.find(item => time >= item.time && time < item.end);
    highlight(mark ? mark.word : -1);
  }
  function tick() {
    sync();
    if (!player.paused && !player.ended) frame = requestAnimationFrame(tick);
  }
  function load() {
    player.pause(); cancelAnimationFrame(frame);
    current = sharedRecordings[picker.value];
    activeWord = -2; highlight(-1);
    document.getElementById('prayer-content').classList.add('playback-only');
    status.hidden = true;
    player.src = current.src;
    player.load();
  }
  function selectWord(event) {
    const row = event.target.closest('[data-word]');
    if (!row || !current) return;
    const mark = current.marks.find(item => item.word === Number(row.dataset.word));
    if (mark) { player.currentTime = mark.time; sync(); }
  }
  player.addEventListener('play', () => { cancelAnimationFrame(frame); tick(); });
  player.addEventListener('pause', () => cancelAnimationFrame(frame));
  ['timeupdate', 'seeked', 'loadedmetadata'].forEach(event => player.addEventListener(event, sync));
  player.addEventListener('ended', () => { cancelAnimationFrame(frame); highlight(-1); });
  player.addEventListener('error', () => {
    status.textContent = 'The recording could not load. Check your connection and refresh the page.';
    status.hidden = false;
  });
  document.getElementById('words').addEventListener('click', selectWord);
  document.getElementById('words').addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectWord(event); }
  });
  document.getElementById('pdf').onclick = () => window.print();
  picker.addEventListener('change', load);
  load();
})();
