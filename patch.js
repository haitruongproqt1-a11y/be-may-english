// =====================================================================
// Bé Mây English - OTA Hot Patch v1.6.0
// - Đồ họa 3D Sống Động (Three.js 3D Background & 3D Claymorphism)
// - 4 Hòn Đảo Nổi 3D với Bục Đá Quý nhấp nhô & Cột sáng dẫn đường
// - Thẻ từ vựng lật xoay 3D 360 độ kèm emoji nổi khối chiều sâu
// - Hiệu ứng Hologram 3D, sóng âm 3D và Hộp quà 3D mở bung nắp trong Camera AR
// =====================================================================

(function() {
  console.log("🌸 Đang áp dụng Bé Mây English OTA Patch v1.6.0...");

  if (typeof OTAEngine !== 'undefined') {
    OTAEngine.VERSION = "1.6.0";
    try {
      const cfg = OTAEngine.getConfig();
      cfg.otaVersion = "1.6.0";
      OTAEngine.saveConfig(cfg);
    } catch(e) {}
  }

  // Khởi động ThreeWorld nếu chưa chạy
  if (typeof ThreeWorld !== 'undefined' && !ThreeWorld.isRunning) {
    try {
      ThreeWorld.init();
    } catch(e) {}
  }
})();
