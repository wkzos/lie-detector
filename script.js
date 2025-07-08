window.addEventListener("load", () => {
  const img = document.getElementById("targetImage");
  const alertBox = document.getElementById("alert");

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  img.crossOrigin = "anonymous";
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    const original = canvas.toDataURL();

    setInterval(() => {
      ctx.drawImage(img, 0, 0);
      const current = canvas.toDataURL();
      if (current !== original) {
        alertBox.classList.remove("hidden");
      }
    }, 5000); // 5초마다 감지
  };
});
