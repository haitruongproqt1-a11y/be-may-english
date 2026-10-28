// =====================================================================
// Bé Mây English - OTA Hot Patch v1.3.3
// - Tối ưu độ nhạy chuẩn xác của Micro: bé đọc to, rõ ràng là nhận ngay
// - Hiển thị song ngữ Anh - Việt khi bé đọc đúng (🗣️ LION - Sư Tử Vàng ✅)
// - Game lập tức chuyển màn, biến hình, cộng sao thưởng pháo hoa mượt mà
// - Nút Cài đặt ⚙️ không bao giờ bị che trên mọi điện thoại
// =====================================================================

(function() {
  console.log("🌸 Đang áp dụng Bé Mây English OTA Patch v1.3.3...");

  // 1. Tối ưu Header đảm bảo nút Cài đặt ⚙️ không bao giờ bị che
  const header = document.getElementById('app-header');
  if (header) {
    const quickSpeedLabel = document.getElementById('quick-speed-label');
    if (quickSpeedLabel) quickSpeedLabel.classList.add('hidden', 'sm:inline');
    const logoBtn = document.getElementById('btn-logo');
    if (logoBtn) {
      const enSpan = logoBtn.querySelector('.text-pink-500');
      if (enSpan) enSpan.classList.add('hidden', 'sm:inline');
    }
    const btnSettings = document.getElementById('btn-open-settings');
    if (btnSettings) {
      btnSettings.classList.remove('w-9', 'w-10', 'h-9', 'h-10');
      btnSettings.classList.add('w-8', 'h-8', 'sm:w-9', 'sm:h-9', 'shrink-0');
    }
  }

  // 2. Thêm nút Cài đặt trực tiếp vào Camera AR HUD nếu chưa có
  const camOverlay = document.getElementById('cam-overlay');
  if (camOverlay) {
    const topHud = camOverlay.querySelector('.absolute.top-0');
    if (topHud && !document.getElementById('cam-settings-btn')) {
      const btn = document.createElement('button');
      btn.id = 'cam-settings-btn';
      btn.className = 'big-btn shrink-0 w-9 h-9 rounded-full bg-white/90 text-slate-700 shadow-lg flex items-center justify-center font-black text-base border border-slate-200 ml-0.5';
      btn.title = 'Cài đặt';
      btn.innerHTML = '⚙️';
      btn.onclick = (e) => {
        e.stopPropagation();
        if (typeof playPop === 'function') playPop();
        if (typeof openSettings === 'function') openSettings();
      };
      topHud.appendChild(btn);
    }
  }

  // 3. Tối ưu vị trí thanh Micro và Huy hiệu nói nổi bật
  const micBar = document.getElementById('cam-mic-bar');
  if (micBar) {
    micBar.className = 'absolute top-13 inset-x-0 flex items-center justify-center pointer-events-none z-40 px-3';
  }

  // 4. Hàm cập nhật trạng thái Micro
  window.setMicStatusText = function(text, color = '#FFFFFF') {
    const micLabel = document.getElementById('cam-mic-label');
    if (micLabel) {
      micLabel.textContent = text;
      if (color) micLabel.style.color = color;
    }
  };

  // 5. Hiển thị huy hiệu lời nói trực quan song ngữ Anh - Việt
  window.showSpokenBadge = function(text, isCorrect = false, viTranslation = '') {
    if (!text) return;
    window.lastSpokenDisplayTime = Date.now();

    const bubble = document.getElementById('cam-speech-bubble');
    const bubbleText = document.getElementById('cam-speech-text');

    const displayText = viTranslation ? `${text} (${viTranslation})` : text;

    if (bubble && bubbleText) {
      bubbleText.textContent = `"${displayText}"`;
      bubble.classList.remove('hidden');
      setTimeout(() => {
        if (Date.now() - (window.lastSpokenDisplayTime || 0) >= 2600) {
          bubble.classList.add('hidden');
        }
      }, 2700);
    }

    window.setMicStatusText(`🗣️ Bé vừa đọc: "${displayText}" ${isCorrect ? '✅' : '...'}`, isCorrect ? '#4ADE80' : '#38BDF8');
  };

  // 6. Xác định từ vựng mục tiêu kèm bản dịch tiếng Việt
  window.getActiveGameTargetWord = function() {
    if (!window.GameRegistry) return null;
    const id = window.GameRegistry.activeGameId;
    if (id === 'classic') {
      const w = typeof currentCamWord === 'function' ? currentCamWord() : null;
      return w ? { en: w.en, vi: w.vi, word: w.en } : null;
    }
    const g = window.GameRegistry.activeGame;
    if (!g) return null;
    if (id === 'magic_mask') {
      if (g.masks && g.masks[g.currentIdx]) {
        const m = g.masks[g.currentIdx];
        return { en: m.word, vi: m.name, word: m.word };
      }
    }
    if (id === 'peek_a_boo') {
      if (g.characters && g.characters[g.charIdx]) {
        const c = g.characters[g.charIdx];
        return { en: c.word, vi: c.name, word: c.word };
      }
    }
    if (id === 'voice_bubbles') {
      return g.targetWord ? { en: g.targetWord, vi: 'Bong bóng', word: g.targetWord } : null;
    }
    if (id === 'feed_animal') {
      if (g.requested) {
        return { en: g.requested.word, vi: g.requested.vi, word: g.requested.word };
      }
    }
    if (id === 'object_hunter') {
      if (g.missions && g.missions[g.currentIdx]) {
        const m = g.missions[g.currentIdx];
        return { en: m.target, vi: m.label, word: m.target };
      }
    }
    if (id === 'polaroid_studio') {
      return { en: 'Cheese', vi: 'Cười lên nào', word: 'Cheese' };
    }
    return null;
  };

  // 7. Xử lý khi bé phát âm giọng đọc vào Micro
  window.handleToddlerUtteranceDetected = function() {
    const now = Date.now();
    const echoWindow = window.isSpeaking || (now - (window.speakingEndedAt || 0) < 700);
    if (echoWindow) return;

    const target = window.getActiveGameTargetWord();
    if (!target) return;

    // Hiển thị huy hiệu song ngữ Anh - Việt
    window.showSpokenBadge(target.en, true, target.vi);

    if (window.GameRegistry && window.GameRegistry.activeGameId === 'classic') {
      if (window.camState && window.camState.locked) return;
      if (typeof camCorrect === 'function') camCorrect();
    } else if (window.GameRegistry && window.GameRegistry.activeGame && window.GameRegistry.activeGame.onSpeech) {
      window.GameRegistry.activeGame.onSpeech(target.word);
    }
  };

  // 8. Bộ phân tích âm thanh giọng nói trẻ em siêu nhạy và chuẩn xác (Web Audio API)
  window.startMicAudioAnalyser = function(stream) {
    try {
      if (!stream || !stream.getAudioTracks().length) return;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!window.micAudioCtx) window.micAudioCtx = new AC();
      if (window.micAudioCtx.state === 'suspended') window.micAudioCtx.resume();

      if (window.micSource) {
        try { window.micSource.disconnect(); } catch (e) {}
      }
      window.micSource = window.micAudioCtx.createMediaStreamSource(stream);
      window.micAnalyser = window.micAudioCtx.createAnalyser();
      window.micAnalyser.fftSize = 128;
      window.micAnalyser.smoothingTimeConstant = 0.4;
      window.micSource.connect(window.micAnalyser);

      const dataArray = new Uint8Array(window.micAnalyser.frequencyBinCount);
      let speechActiveFrames = 0;
      let speechVocalSum = 0;
      let speechTotalSum = 0;
      let speechPeakVol = 0;

      const updateAudioLoop = () => {
        const overlay = document.getElementById('cam-overlay');
        if (!window.camState || !window.camState.isRunning || (overlay && overlay.classList.contains('hidden'))) return;
        window.micAnalyser.getByteFrequencyData(dataArray);

        let totalSum = 0;
        let vocalSum = 0;
        let noiseSum = 0;

        for (let i = 0; i < dataArray.length; i++) {
          const val = dataArray[i];
          totalSum += val;
          if (i >= 1 && i <= 14) vocalSum += val; // Dải âm thanh giọng người (180Hz - 2600Hz)
          else if (i === 0 || i >= 26) noiseSum += val; // Tạp âm va đập hoặc rít
        }

        const avg = totalSum / dataArray.length;
        const vol = avg / 255;

        if (window.GameRegistry && window.GameRegistry.activeGame && window.GameRegistry.activeGame.onVoiceEnergy) {
          window.GameRegistry.activeGame.onVoiceEnergy(vol);
        }

        const bars = [' ', '▂', '▃', '▄', '▅', '▆', '▇', '█'];
        const barCount = Math.min(7, Math.floor(vol * 22));
        const visualWave = bars.slice(0, Math.max(1, barCount)).join('');

        const now = Date.now();
        // Nhận diện khung giọng nói nhạy và chuẩn: vol > 0.020 (phù hợp khoảng cách cầm điện thoại 25-50cm)
        const isVoice = (vol > 0.020) && (vocalSum > noiseSum * 0.55);

        if (isVoice) {
          speechActiveFrames++;
          speechVocalSum += vocalSum;
          speechTotalSum += totalSum;
          if (vol > speechPeakVol) speechPeakVol = vol;

          if (speechActiveFrames >= 4 && (now - (window.lastSpokenDisplayTime || 0) > 2600)) {
            window.setMicStatusText(`🎤 Đang nghe bé đọc: [${visualWave}] (Đọc to nhé!)`, '#38BDF8');
          }
        } else {
          // Khi dứt tiếng: kiểm tra đúng độ dài 1 từ vựng (6 đến 95 frames = 100ms đến 1.6s)
          if (speechActiveFrames >= 6 && speechActiveFrames <= 95 && speechPeakVol >= 0.030) {
            const vocalRatio = speechVocalSum / Math.max(1, speechTotalSum);
            if (vocalRatio >= 0.16 && (now - (window.lastVoiceTriggerAt || 0) > 1100)) {
              window.lastVoiceTriggerAt = now;
              window.handleToddlerUtteranceDetected();
            }
          }
          speechActiveFrames = 0;
          speechVocalSum = 0;
          speechTotalSum = 0;
          speechPeakVol = 0;

          if (now - (window.lastSpokenDisplayTime || 0) > 2600) {
            window.setMicStatusText('🎤 Bé Mây đang lắng nghe giọng bé đọc...', '#FFFFFF');
          }
        }

        window.micAnimId = requestAnimationFrame(updateAudioLoop);
      };

      if (window.micAnimId) cancelAnimationFrame(window.micAnimId);
      window.micAnimId = requestAnimationFrame(updateAudioLoop);

    } catch (err) {
      console.warn("Could not start audio analyser in patch:", err);
    }
  };

  // Kích hoạt ngay bộ phân tích nếu stream camera đang chạy
  if (window.camStream) {
    window.startMicAudioAnalyser(window.camStream);
  }

  // 9. Override window.handleSpokenCandidates khi nhận diện qua Native/WebSpeech
  window.handleSpokenCandidates = function(candidates, isFinal) {
    if (!window.camState || !window.camState.isRunning || !candidates || candidates.length === 0) return;
    const spokenDisplay = (candidates[0] || '').trim();
    if (!spokenDisplay) return;

    window.showSpokenBadge(spokenDisplay, false);

    const echoWindow = window.isSpeaking || (Date.now() - (window.speakingEndedAt || 0) < 700);
    if (echoWindow) return;

    if (window.GameRegistry && window.GameRegistry.activeGameId === 'classic') {
      if (window.camState.locked) return;
      const w = typeof currentCamWord === 'function' ? currentCamWord() : null;
      if (!w) return;
      let matched = false;
      for (const cand of candidates) {
        if (typeof checkToddlerPronunciation === 'function' && checkToddlerPronunciation(cand, w.en)) {
          matched = true;
          break;
        }
      }
      if (matched) {
        window.lastVoiceTriggerAt = Date.now();
        window.showSpokenBadge(spokenDisplay, true, w.vi);
        if (typeof camCorrect === 'function') camCorrect();
      } else if (isFinal && spokenDisplay) {
        window.showSpokenBadge(spokenDisplay, false);
        if (typeof camWrong === 'function') camWrong();
      }
      return;
    }

    if (window.GameRegistry && window.GameRegistry.activeGame && window.GameRegistry.activeGame.onSpeechCandidates) {
      window.GameRegistry.activeGame.onSpeechCandidates(candidates, isFinal);
    } else if (window.GameRegistry && window.GameRegistry.activeGame && window.GameRegistry.activeGame.onSpeech) {
      for (const cand of candidates) {
        window.GameRegistry.activeGame.onSpeech(cand);
      }
    }
  };

  // 10. Chống chạm màn hình tự thắng trong Peek-a-boo
  if (window.GameRegistry) {
    const peek = window.GameRegistry.get('peek_a_boo');
    if (peek) {
      peek.onTouch = function(x, y) {
        if (!this.isHiding) return;
        const c = this.characters[this.charIdx];
        if (typeof playPop === 'function') playPop();
        if (typeof speak === 'function') speak(c.word);
        window.showSpokenBadge(`Bé hãy đọc to: "${c.word}" 🎤`, false, c.name);
      };
      const origPeekSpeech = peek.onSpeech;
      peek.onSpeech = function(heard) {
        if (!this.isHiding) return;
        const c = this.characters[this.charIdx];
        let matched = typeof checkToddlerPronunciation === 'function' && checkToddlerPronunciation(heard, c.word);
        if (!matched && c.alias) {
          for (const al of c.alias) {
            if (checkToddlerPronunciation(heard, al)) { matched = true; break; }
          }
        }
        const h = (heard || '').toLowerCase();
        if (!matched && (h.includes('peek') || h.includes('boo') || h.includes('hello') || h.includes('hi') || h.includes('hoa') || h.includes('ua'))) {
          matched = true;
        }
        if (matched) {
          window.lastVoiceTriggerAt = Date.now();
          window.showSpokenBadge(c.word, true, c.name);
        }
        if (origPeekSpeech) origPeekSpeech.call(this, heard);
      };
    }

    // 11. Chống chạm sticker tự thắng trong Magic Mask
    const maskGame = window.GameRegistry.get('magic_mask');
    if (maskGame) {
      const origMaskSpeech = maskGame.onSpeech;
      maskGame.onSpeech = function(heard) {
        if (!heard) return;
        const cur = this.masks[this.currentIdx];
        if (typeof checkToddlerPronunciation === 'function' && checkToddlerPronunciation(heard, cur.word)) {
          window.lastVoiceTriggerAt = Date.now();
          window.showSpokenBadge(cur.word, true, cur.name);
        }
        if (origMaskSpeech) origMaskSpeech.call(this, heard);
      };
    }

    // 12. Chống chạm bong bóng tự nổ trong Voice Bubbles
    const bubblesGame = window.GameRegistry.get('voice_bubbles');
    if (bubblesGame) {
      bubblesGame.onTouch = function(x, y) {
        for (let i = this.bubbles.length - 1; i >= 0; i--) {
          const b = this.bubbles[i];
          if (Math.hypot(x - b.x, y - b.y) <= b.r + 20) {
            if (typeof playPop === 'function') playPop();
            if (typeof speak === 'function') speak(b.word);
            window.showSpokenBadge(`Bé hãy đọc to: "${b.word}" 🎤`, false);
            return;
          }
        }
      };
    }

    // 13. Chống chạm trái cây tự rụng trong Feed Animal
    const animalGame = window.GameRegistry.get('feed_animal');
    if (animalGame) {
      animalGame.onTouch = function(x, y) {
        if (this.fallingFruit || this.isEating) return;
        if (y < 160 && this.displayFruits && this.displayFruits.length > 0) {
          const gap = window.innerWidth / (this.displayFruits.length + 1);
          for (let i = 0; i < this.displayFruits.length; i++) {
            const fx = gap * (i + 1);
            if (Math.abs(x - fx) < 45) {
              if (typeof playPop === 'function') playPop();
              const f = this.displayFruits[i];
              if (typeof speak === 'function') speak(f.word);
              window.showSpokenBadge(`Bé hãy đọc to: "${f.word}" để cho ăn 🎤`, false, f.vi);
              return;
            }
          }
        }
      };
    }
  }

  console.log("✅ Bé Mây English OTA Patch v1.3.3 đã áp dụng thành công!");
})();
