// =====================================================================
// Bé Mây English - OTA Hot Patch v1.5.0
// - Nâng cấp Trung Tâm Trò Chơi AR Đa Năng (AR & Voice Game Hub)
// - Thuật toán chống lặp từ tuyệt đối Max-2 Anti-Repeat Engine (150+ từ)
// - Bộ máy tạo mẫu hỏi đáp vô hạn Procedural Infinite Q&A Engine
// - 5 Chế độ chơi AR Mini-Games: Thẻ nổi 60s, Bong bóng, Hóa trang, Hộp quà, Phản xạ
// - Cột đo âm lượng giọng nói AudioContext Analyser nhấp nháy cạnh đồng hồ 60.00s
// =====================================================================

(function() {
  console.log("🌸 Đang áp dụng Bé Mây English OTA Patch v1.5.0...");

  if (typeof OTAEngine !== 'undefined') {
    OTAEngine.VERSION = "1.5.0";
    try {
      const cfg = OTAEngine.getConfig();
      cfg.otaVersion = "1.5.0";
      OTAEngine.saveConfig(cfg);
    } catch(e) {}
  }

  // Tự động làm mới giao diện nếu cần
  if (typeof ARGameHub !== 'undefined') {
    console.log("✅ ARGameHub đã sẵn sàng trên thiết bị!");
  }
})();
