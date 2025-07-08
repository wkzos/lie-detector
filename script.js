const button = document.getElementById("shareBtn");
const video = document.getElementById("screenVideo");

const targetImage = new Image();
targetImage.src = "target.png";  // 감지하고 싶은 이미지 경로

button.addEventListener("click", async () => {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false
    });
    video.srcObject = stream;

    // wait until video is ready
    video.onloadedmetadata = () => {
      startDetection();
    };
  } catch (err) {
    console.error("화면 공유 실패:", err);
    alert("화면 공유 권한을 허용해주세요.");
  }
});

function startDetection() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");

  // 1초마다 감지
  setInterval(() => {
    const w = video.videoWidth;
    const h = video.videoHeight;
    if (w === 0 || h === 0) return; // 초기 로딩 시 무시

    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(video, 0, 0, w, h);

    // 타겟 이미지도 같은 크기로 맞추기
    tempCanvas.width = targetImage.width;
    tempCanvas.height = targetImage.height;
    tempCtx.drawImage(targetImage, 0, 0);

    const screenData = ctx.getImageData(0, 0, w, h).data;
    const targetData = tempCtx.getImageData(0, 0, targetImage.width, targetImage.height).data;

    // 단순히 영상 전체에서 일부 색상이 일치하는지를 확인 (픽셀 매칭 간단화)
    let match = false;
    for (let i = 0; i < screenData.length; i += 4) {
      const r1 = screenData[i], g1 = screenData[i + 1], b1 = screenData[i + 2];
      const r2 = targetData[0], g2 = targetData[1], b2 = targetData[2]; // 첫 픽셀 기준

      if (Math.abs(r1 - r2) < 10 && Math.abs(g1 - g2) < 10 && Math.abs(b1 - b2) < 10) {
        match = true;
        break;
      }
    }

    if (match) {
      alert("타겟 이미지가 화면에 감지되었습니다!");
    }

  }, 1000);
}
