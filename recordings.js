'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const player = $('player');
  let db, current, objectUrl, recorder, stream, started, marks = [], word = 0, busy = false;
  let key = picker.value;
  const status = message => { $('record-status').textContent = message; };
  const database = new Promise((resolve, reject) => {
    const request = indexedDB.open('prayer-recordings', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('recordings', { keyPath: 'key' });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  const get = async id => {
    const database = await db;
    return new Promise((resolve, reject) => {
      const request = database.transaction('recordings').objectStore('recordings').get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };
  const put = async value => {
    const database = await db;
    return new Promise((resolve, reject) => {
      const tx = database.transaction('recordings', 'readwrite');
      tx.objectStore('recordings').put(value);
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  };
  db = database;
  function highlight(index) {
    document.querySelectorAll('[data-word]').forEach(row => {
      const active = Number(row.dataset.word) === index;
      row.classList.toggle('active', active);
      if (active) row.setAttribute('aria-current', 'true');
      else row.removeAttribute('aria-current');
    });
  }
  function recordingControls(active) {
    busy = active;
    picker.disabled = active;
    $('record').disabled = active;
    $('stop-record').disabled = !recorder || recorder.state !== 'recording';
    $('next-word').disabled = !recorder || recorder.state !== 'recording' || word >= prayers[key].words.length - 1;
    $('restore').disabled = active;
    $('pdf').disabled = active;
    $('backup').disabled = active || !current;
    $('rewind').disabled = $('forward').disabled = active || !current;
    player.hidden = active;
  }
  async function alignRecording(recording) {
    if (!recording) return recording;
    const digest = await crypto.subtle.digest('SHA-256', await recording.blob.arrayBuffer());
    const hash = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
    const alignment = prayerAlignments[hash];
    if (alignment && alignment.key === recording.key) {
      return { ...recording, marks: alignment.marks, complete: true, aligned: true };
    }
    return recording;
  }
  function attach(recording) {
    player.pause();
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    current = recording;
    $('prayer-content').classList.toggle('playback-only', !!recording);
    player.removeAttribute('src');
    if (recording) { objectUrl = URL.createObjectURL(recording.blob); player.src = objectUrl; }
    player.load();
    highlight(-1);
    recordingControls(false);
  }
  async function load() {
    key = picker.value;
    const requested = key;
    attach(null);
    status('Loading recording…');
    try {
      const value = await alignRecording(await get(requested));
      if (key !== requested) return;
      attach(value);
      status(value ? (value.complete ? 'Recording ready. Press play to follow the highlighted words.' : 'Recording ready, with incomplete word timings. Record again for full highlighting.') : 'No recording yet. Record this prayer to begin.');
    } catch { status('Browser storage is unavailable. Enable browser storage to save recordings.'); $('record').disabled = true; }
  }
  function mark(index) {
    if (!recorder || recorder.state !== 'recording' || index <= word) return;
    if (index !== word + 1) { status('Select the next word in order so every word gets a timing.'); return; }
    word = index;
    marks.push({ word, time: (performance.now() - started) / 1000 });
    highlight(word);
    $('next-word').disabled = word === prayers[key].words.length - 1;
    status(`Recording word ${word + 1} of ${prayers[key].words.length}.`);
  }
  $('record').onclick = async () => {
    if (busy) return;
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) { status('Recording is unavailable in this browser. Try current Chrome, Edge, Firefox, or Safari over HTTPS.'); return; }
    if (current && !window.confirm('Replace this prayer’s saved recording? Download a backup first if you want to keep it.')) return;
    player.pause(); recordingControls(true); status('Waiting for microphone access…');
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const chunks = [];
      let failed = false;
      recorder = new MediaRecorder(stream);
      recorder.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
      recorder.onerror = () => { failed = true; status('Recording failed. Your previous saved recording is still available.'); if (recorder.state !== 'inactive') recorder.stop(); };
      recorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        if (failed) { recordingControls(false); return; }
        const duration = (performance.now() - started) / 1000;
        const blob = new Blob(chunks, { type: recorder.mimeType || chunks[0]?.type || 'audio/webm' });
        if (!blob.size) { recordingControls(false); status('No audio captured. Please try again.'); return; }
        // If the user did not mark every word, keep the audio but explicitly flag incomplete timing.
        const complete = marks.length === prayers[key].words.length;
        const saved = { key, blob, marks, duration, complete, savedAt: new Date().toISOString() };
        attach(saved); recordingControls(true);
        try { await put(saved); status(complete ? 'Recording and word timings saved. Press play to review.' : 'Audio saved. Word timings are incomplete; record again and advance through every word for full highlighting.'); }
        catch { status('Audio is available now, but could not be saved in this browser. Download a backup before leaving.'); }
        finally { recordingControls(false); }
      };
      word = 0; marks = [{ word: 0, time: 0 }]; started = performance.now();
      recorder.start(); recordingControls(true); highlight(0);
      status(`Recording word 1 of ${prayers[key].words.length}. Say the highlighted word, then advance.`);
    } catch (error) {
      stream?.getTracks().forEach(track => track.stop());
      recordingControls(false);
      status(error.name === 'NotAllowedError' ? 'Microphone permission was denied. Allow microphone access in your browser and try again.' : 'Could not start the microphone. Check that it is connected and try again.');
    }
  };
  $('stop-record').onclick = () => {
    if (recorder?.state === 'recording') { $('stop-record').disabled = true; $('next-word').disabled = true; recorder.stop(); status('Saving recording…'); }
  };
  $('next-word').onclick = () => mark(word + 1);
  document.addEventListener('keydown', event => {
    if (event.code === 'Space' && recorder?.state === 'recording' && !['BUTTON', 'INPUT', 'SELECT'].includes(event.target.tagName)) { event.preventDefault(); mark(word + 1); }
  });
  function selectWord(event) {
    const row = event.target.closest('[data-word]');
    if (!row) return;
    const index = Number(row.dataset.word);
    if (recorder?.state === 'recording') mark(index);
    else if (current) {
      const mark = current.marks.find(item => item.word === index);
      if (mark) { player.currentTime = mark.time; highlight(index); }
      else status('This word has no recorded timing. Record again and advance through every word.');
    }
  }
  $('words').addEventListener('click', selectWord);
  $('words').addEventListener('keydown', event => { if (event.key === 'Enter') selectWord(event); });
  function sync() {
    if (!current || busy) return;
    const time = player.currentTime;
    let index = -1;
    for (const mark of current.marks) { if (mark.time > time) break; index = mark.end !== undefined && time >= mark.end ? -1 : mark.word; }
    highlight(index);
  }
  let frame;
  function tick() { sync(); if (!player.paused && !player.ended) frame = requestAnimationFrame(tick); }
  player.addEventListener('play', () => { cancelAnimationFrame(frame); tick(); });
  player.addEventListener('pause', () => cancelAnimationFrame(frame));
  ['timeupdate', 'seeked', 'play'].forEach(event => player.addEventListener(event, sync));
  player.addEventListener('ended', () => highlight(-1));
  player.addEventListener('error', () => { if (current) status('This browser cannot play the recording format. Try the browser used to record it.'); });
  $('rewind').onclick = () => { player.currentTime = Math.max(0, player.currentTime - 5); sync(); };
  $('forward').onclick = () => { player.currentTime = Math.min(current.duration, player.currentTime + 5); sync(); };
  $('pdf').onclick = () => window.print();
  function download(blob, filename) {
    const url = URL.createObjectURL(blob), link = document.createElement('a');
    link.href = url; link.download = filename; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }
  $('backup').onclick = async () => {
    const saved = current;
    if (!saved) return;
    const reader = new FileReader();
    reader.onload = () => download(new Blob([JSON.stringify({ version: 1, ...saved, blob: undefined, audio: reader.result })], { type: 'application/json' }), saved.key + '-recording.json');
    reader.readAsDataURL(saved.blob);
  };
  $('restore').onchange = async event => {
    const file = event.target.files[0];
    if (!file || busy) return;
    recordingControls(true);
    try {
      const value = JSON.parse(await file.text());
      const count = prayers[key].words.length;
      if (value.version !== 1 || value.key !== key || !/^data:audio\/[\w.+-]+(?:;[^,]*)?;base64,/.test(value.audio) || !Number.isFinite(value.duration) || value.duration <= 0 || !Array.isArray(value.marks) || !value.marks.length || value.marks.length > count || value.marks.some((mark, i) => mark.word !== i || !Number.isFinite(mark.time) || mark.time < 0 || mark.time > value.duration || (i && mark.time < value.marks[i - 1].time))) throw Error('Invalid backup');
      if (current && !window.confirm('Replace the current saved recording with this backup?')) return;
      const blob = await (await fetch(value.audio)).blob();
      const saved = { key, blob, marks: value.marks, duration: value.duration, complete: value.marks.length === count, savedAt: value.savedAt };
      await put(saved); attach(saved); status(saved.complete ? 'Recording and word timings restored.' : 'Recording restored with incomplete word timings.');
    } catch { status('Could not restore. Choose a valid recording backup for the selected prayer.'); }
    finally { event.target.value = ''; recordingControls(false); }
  };
  picker.addEventListener('change', load);
  window.addEventListener('beforeunload', event => { if (busy) { event.preventDefault(); event.returnValue = ''; } });
  load();
})();
