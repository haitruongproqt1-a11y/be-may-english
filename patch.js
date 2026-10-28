// =====================================================================
// Bé Mây English - OTA Hot Patch v1.4.0
// - Xóa bỏ hoàn toàn 7 trò Camera AR theo yêu cầu
// - Lộ trình 4 bước tinh gọn, mượt mà, trực quan
// - Mục Thẻ Từ: đọc chuẩn xác đúng 1 lần duy nhất khi bé chạm vào thẻ
// - Đập tay High-Five xong nhận sticker và có nút bấm về lại Bản Đồ
// =====================================================================

(function() {
  console.log("🌸 Đang áp dụng Bé Mây English OTA Patch v1.4.0...");

  // 1. Dọn dẹp nút Camera AR trong Header nếu có
  const camGlobalBtn = document.getElementById('btn-open-cam-global');
  if (camGlobalBtn) camGlobalBtn.remove();

  // 2. Dọn dẹp Khối Siêu Sân Chơi Camera AR trên Trang Chủ
  const playgroundAr = document.querySelector('.mb-6.bg-gradient-to-br.from-indigo-900\\/90');
  if (playgroundAr) playgroundAr.remove();

  // 3. Dọn dẹp DOM Camera Overlay & Modal chọn trò chơi nếu có
  const camOverlay = document.getElementById('cam-overlay');
  if (camOverlay) camOverlay.remove();

  const camGamesModal = document.getElementById('cam-games-modal');
  if (camGamesModal) camGamesModal.remove();

  // Dừng mọi media stream camera đang chạy nếu có
  if (window.camStream) {
    try {
      window.camStream.getTracks().forEach(t => t.stop());
      window.camStream = null;
    } catch(e) {}
  }

  // 4. Cập nhật dòng chữ phụ đề trên Trang Chủ
  const pathSubtitle = document.querySelector('#view-path > p');
  if (pathSubtitle) {
    pathSubtitle.textContent = 'Mỗi ngày 4 bước vui • Học mà chơi, chơi mà học';
  }

  // 5. Cập nhật 4 bước học hàng ngày
  window.stepNames = ['🎴 Thẻ Từ', '🎯 Chạm Hình', '🧩 Tư Duy', '✋ Vận Động & Nhận Sticker'];

  // Cập nhật hàm nút tiếp theo
  window.nextStepButton = function(label) {
    const wrap = document.createElement('div');
    wrap.className = 'text-center mt-6';
    if (state.currentStep < 3) {
      const b = document.createElement('button');
      b.className = 'big-btn bg-gradient-to-r from-emerald-400 to-green-500 text-white font-black text-lg rounded-3xl px-8 py-4 shadow-lg';
      b.textContent = label || `Bước tiếp theo: ${window.stepNames[state.currentStep + 1]} ➜`;
      b.addEventListener('click', () => {
        if (typeof playPop === 'function') playPop();
        if (typeof switchStep === 'function') switchStep(state.currentStep + 1);
      });
      wrap.appendChild(b);
    }
    return wrap;
  };

  // Cập nhật hàm hiển thị nội dung 4 bước
  window.renderStepContent = function() {
    const lesson = getLesson(state.currentDay);
    const c = $('lesson-content');
    c.innerHTML = '';
    switch (state.currentStep) {
      case 0: window.renderStep1_Flashcards(lesson, c); break;
      case 1: renderStep2_TouchFind(lesson, c); break;
      case 2: renderStep3_Logic(lesson, c); break;
      case 3: window.renderStep4_TPR(lesson, c); break;
    }
  };

  // 6. BƯỚC 1: THẺ TỪ - ĐỌC ĐÚNG 1 LẦN DUY NHẤT
  window.renderStep1_Flashcards = function(lesson, c) {
    c.innerHTML = `
      <div class="bg-white/80 rounded-3xl p-4 mb-4 shadow text-center slide-up">
        <div class="font-black text-xl text-sky-700">🎴 Chạm vào thẻ để nghe Bé Mây đọc nhé!</div>
        <div class="text-sm font-semibold text-slate-500">Mỗi lần chạm Bé Mây sẽ đọc đúng 1 lần từ vựng tiếng Anh chuẩn cho bé</div>
      </div>
      <div id="flash-grid" class="word-grid"></div>`;
    const grid = c.querySelector('#flash-grid');
    lesson.words.forEach((w, i) => {
      const card = document.createElement('div');
      card.className = 'big-btn bounce-in rounded-3xl p-4 shadow-lg text-center border-4 border-white cursor-pointer';
      card.style.background = w.bg;
      card.style.animationDelay = i * 0.08 + 's';
      card.innerHTML = `
        <div class="emoji text-8xl my-2 drop-shadow">${w.emoji}</div>
        <div class="fc-en text-3xl font-black text-slate-800">${w.en}</div>
        <div class="fc-vi text-base font-bold text-slate-500">${w.vi}</div>
        <div class="mt-2 inline-flex items-center gap-1 bg-white/70 rounded-full px-3 py-1 text-sm font-bold text-sky-600"><span class="emoji">🔊</span> Nghe 1 lần</div>`;
      let toggled = false;
      card.addEventListener('click', () => {
        if (typeof playPop === 'function') playPop();
        if (typeof animate === 'function') animate(card, 'card-tap');
        if (typeof showConfetti === 'function') showConfetti('light');
        toggled = !toggled;
        if (lesson.week === 2 && w.tint) {
          card.style.background = toggled ? w.tint : w.bg;
          card.querySelector('.fc-en').style.color = toggled ? '#fff' : '';
          card.querySelector('.fc-vi').style.color = toggled ? 'rgba(255,255,255,0.9)' : '';
        } else {
          card.style.background = toggled ? pastelPalette[(i + 3) % pastelPalette.length] : w.bg;
        }
        if (typeof setMascot === 'function') {
          setMascot(w.en, `${w.en} nghĩa là "${w.vi}".`);
        }
        // Hủy mọi âm thanh đang đọc dở để đọc từ mới đúng 1 lần duy nhất
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        if (typeof speak === 'function') speak(w.en);
      });
      grid.appendChild(card);
    });
    c.appendChild(window.nextStepButton());
    if (typeof setMascot === 'function') {
      setMascot("Let's look at our new words!", `Hôm nay mình học ${lesson.words.length} từ mới. Chạm vào thẻ để nghe đọc 1 lần nhé!`, false);
    }
  };

  // 7. BƯỚC 4: VẬN ĐỘNG & NHẬN STICKER - HOÀN THÀNH BÀI HỌC VỀ BẢN ĐỒ
  window.renderStep4_TPR = function(lesson, c) {
    const done = state.completedDays.includes(lesson.day);
    c.innerHTML = `
      <div class="grid sm:grid-cols-2 gap-4 mb-5">
        <div class="slide-up bg-amber-50 border-4 border-amber-200 rounded-3xl p-5 shadow">
          <div class="font-black text-amber-700 text-lg mb-2">👨‍👩‍👧 Bố Mẹ Cùng Bé Vận Động (TPR)</div>
          <p class="font-semibold text-slate-600 leading-relaxed">${lesson.tprGuide}</p>
          <div class="flex flex-wrap gap-2 mt-3">${lesson.words.map(w => `<span class="bg-white rounded-full px-3 py-1 font-black text-sm shadow-sm"><span class="emoji">${w.emoji}</span> ${w.en}</span>`).join('')}</div>
        </div>
        <div class="slide-up bg-sky-50 border-4 border-sky-200 rounded-3xl p-5 shadow" style="animation-delay:.1s">
          <div class="font-black text-sky-700 text-lg mb-2">🎵 Bài Hát Gợi Ý Hôm Nay</div>
          <div class="flex items-center gap-3">
            <div class="emoji text-6xl wiggle">🎶</div>
            <div class="font-black text-slate-700 text-lg leading-tight">${lesson.song}</div>
          </div>
          <p class="text-sm font-semibold text-slate-500 mt-2">Bố mẹ có thể tìm bài hát này trên YouTube kênh Super Simple Songs và nhún nhảy cùng bé.</p>
        </div>
      </div>
      <div class="text-center">
        <button id="btn-high-five" class="high-five-btn rounded-full w-64 h-64 sm:w-72 sm:h-72 text-white font-black shadow-2xl inline-flex flex-col items-center justify-center p-6">
          <span class="emoji text-8xl">✋</span>
          <span class="text-xl leading-tight mt-2">ĐẬP TAY HIGH FIVE<br>CÙNG BÉ MÂY!</span>
        </button>
        <div id="high-five-result" class="mt-5">${done ? `<div class="font-black text-emerald-600">✅ Bé đã hoàn thành ngày ${lesson.day}! Sticker <span class="emoji text-2xl">${lesson.sticker}</span> đã có trong Sổ Sticker.</div>` : ''}</div>
      </div>`;
    c.querySelector('#btn-high-five').addEventListener('click', e => {
      const btn = e.currentTarget;
      if (typeof animate === 'function') animate(btn, 'card-tap');
      if (typeof playFanfareAndClap === 'function') playFanfareAndClap();
      if (typeof showConfetti === 'function') showConfetti('full');
      const firstTime = !state.completedDays.includes(lesson.day);
      if (firstTime) {
        state.completedDays.push(lesson.day);
        if (!state.stickers.includes(lesson.day)) state.stickers.push(lesson.day);
        if (typeof saveState === 'function') saveState();
        if (typeof addStars === 'function') addStars(3);
      }
      $('high-five-result').innerHTML = `
        <div class="bounce-in bg-white rounded-3xl p-5 shadow-xl inline-block">
          <div class="emoji text-7xl">${lesson.sticker}</div>
          <div class="font-black text-pink-500 text-xl">${firstTime ? 'Bé nhận được Sticker mới! +3 ⭐' : 'High five! Bé giỏi lắm!'}</div>
          <div class="font-bold text-slate-500">Hoàn thành Ngày ${lesson.day}: ${lesson.title}</div>
        </div>`;
      const finishWrap = document.createElement('div');
      finishWrap.className = 'mt-5';
      finishWrap.innerHTML = `
        <button id="btn-finish-lesson-to-path" class="big-btn bg-gradient-to-r from-emerald-400 to-green-500 text-white font-black text-lg rounded-3xl px-8 py-4 shadow-xl">
          🎉 Hoàn Thành Bài Học & Về Bản Đồ ➜
        </button>`;
      $('high-five-result').appendChild(finishWrap);
      const finishBtn = finishWrap.querySelector('#btn-finish-lesson-to-path');
      if (finishBtn) finishBtn.onclick = () => {
        if (typeof playPop === 'function') playPop();
        if (typeof goBackToPath === 'function') goBackToPath();
      };
      if (typeof setMascot === 'function') {
        setMascot('High five! Great job! You are a star!', 'Đập tay nào! Bé đã hoàn thành xuất sắc bài học hôm nay!', true);
      }
    });
    if (typeof setMascot === 'function') {
      setMascot('Stand up! Let\'s move together!', 'Bố mẹ cùng bé đứng lên vận động theo hướng dẫn nhé, rồi đập tay với Bé Mây!', true);
    }
  };

  // 8. Đồng bộ phiên bản OTA lên 1.4.0
  if (typeof OTAEngine !== 'undefined') {
    OTAEngine.VERSION = "1.4.0";
    try {
      const cfg = OTAEngine.getConfig();
      cfg.otaVersion = "1.4.0";
      OTAEngine.saveConfig(cfg);
    } catch(e) {}
  }

  // 9. Làm mới giao diện nếu đang mở
  if (typeof state !== 'undefined') {
    if (state.currentView === 'path' && typeof renderDayCards === 'function') {
      renderDayCards();
    } else if (state.currentView === 'lesson') {
      if (typeof renderLessonTabs === 'function') renderLessonTabs();
      if (typeof renderStepContent === 'function') renderStepContent();
    }
  }

  console.log("✅ Bé Mây English OTA Patch v1.4.0 đã sẵn sàng!");
})();
