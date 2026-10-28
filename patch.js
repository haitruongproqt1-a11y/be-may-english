// =====================================================================
// Bé Mây English - OTA Hot Patch v1.3.1
// Khắc phục triệt để:
// 1. Nút Cài đặt (⚙️) không bao giờ bị che trên mọi màn hình điện thoại
// 2. Hiển thị huy hiệu giọng đọc trực quan (🗣️ Bé vừa đọc: "...")
// 3. Xóa cơ chế chạm màn hình tự thắng trong tất cả game Micro
// =====================================================================

(function() {
  console.log("🌸 Đang áp dụng Bé Mây English OTA Patch v1.3.1...");

  // 1. Tối ưu thanh tiêu đề App Header đảm bảo nút ⚙️ không bị che
  const header = document.getElementById('app-header');
  if (header) {
    const quickSpeedLabel = document.getElementById('quick-speed-label');
    if (quickSpeedLabel) {
      quickSpeedLabel.classList.add('hidden', 'sm:inline');
    }
    const logoText = document.getElementById('btn-logo');
    if (logoText) {
      const enSpan = logoText.querySelector('.text-pink-500');
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

  // 3. Tối ưu vị trí Mic Status Bar và Speech Bubble
  const micBar = document.getElementById('cam-mic-bar');
  if (micBar) {
    micBar.className = 'absolute top-13 inset-x-0 flex items-center justify-center pointer-events-none z-40 px-3';
  }

  // 4. Override hiển thị trạng thái micro an toàn, không làm mất thẻ con
  window.setMicStatusText = function(text, color = '#FFFFFF') {
    const micLabel = document.getElementById('cam-mic-label');
    if (micLabel) {
      micLabel.textContent = text;
      if (color) micLabel.style.color = color;
    }
  };

  // 5. Hiển thị huy hiệu giọng nói trực quan
  window.showSpokenBadge = function(text, isCorrect = false) {
    if (!text) return;
    if (typeof lastSpokenDisplayTime !== 'undefined') {
      window.lastSpokenDisplayTime = Date.now();
    }

    const bubble = document.getElementById('cam-speech-bubble');
    const bubbleText = document.getElementById('cam-speech-text');

    if (bubble && bubbleText) {
      bubbleText.textContent = `"${text}"`;
      bubble.classList.remove('hidden');
      setTimeout(() => {
        bubble.classList.add('hidden');
      }, 2800);
    }

    window.setMicStatusText(`🗣️ Bé vừa nói: "${text}" ${isCorrect ? '✅' : '...'}`, isCorrect ? '#4ADE80' : '#38BDF8');
  };

  // 6. Override window.onNativeSpeechStatus
  window.onNativeSpeechStatus = function(state, msg) {
    if (state === 'ready' || state === 'listening') {
      window.setMicStatusText('🎤 Bé Mây đang lắng nghe bé đọc...', '#38BDF8');
    } else if (state === 'permission_denied') {
      window.setMicStatusText('🔇 Micro bị chặn - Bố mẹ hãy cho phép quyền Micro trong cài đặt nhé', '#EF4444');
    }
  };

  // 7. Override handleSpokenCandidates
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
        window.showSpokenBadge(spokenDisplay, true);
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

  // 8. Vô hiệu hóa tính năng chạm màn hình tự thắng trong Peek-a-boo
  if (window.GameRegistry) {
    const peek = window.GameRegistry.get('peek_a_boo');
    if (peek) {
      peek.onTouch = function(x, y) {
        if (!this.isHiding) return;
        const c = this.characters[this.charIdx];
        if (typeof playPop === 'function') playPop();
        if (typeof speak === 'function') speak(c.word);
        window.showSpokenBadge(`Bé hãy đọc to: "${c.word}" 🎤`, false);
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
          window.showSpokenBadge(c.word, true);
        }
        if (origPeekSpeech) origPeekSpeech.call(this, heard);
      };
    }

    // 9. Vô hiệu hóa tính năng chạm sticker tự thắng trong Magic Mask
    const maskGame = window.GameRegistry.get('magic_mask');
    if (maskGame) {
      const origMaskSpeech = maskGame.onSpeech;
      maskGame.onSpeech = function(heard) {
        if (!heard) return;
        const cur = this.masks[this.currentIdx];
        if (typeof checkToddlerPronunciation === 'function' && checkToddlerPronunciation(heard, cur.word)) {
          window.showSpokenBadge(cur.word, true);
        }
        if (origMaskSpeech) origMaskSpeech.call(this, heard);
      };
    }

    // 10. Vô hiệu hóa chạm bong bóng tự nổ trong Voice Bubbles
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

    // 11. Vô hiệu hóa chạm trái cây tự rụng trong Feed Animal
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
              window.showSpokenBadge(`Bé hãy đọc to: "${f.word}" để cho ăn 🎤`, false);
              return;
            }
          }
        }
      };
    }
  }

  console.log("✅ Bé Mây English OTA Patch v1.3.1 đã áp dụng thành công!");
})();
