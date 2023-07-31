const start = () => {
  navigator.mediaDevices
    .getUserMedia({
      audio: false,
      video: {
        frameRate: { max: 30 },
        facingMode: { exact: "environment" },
        width: { ideal: 3840 },
        height: { ideal: 2160 },
        // iphone maximum
        // width: { ideal: 3024 },
        // height: { ideal: 4032 },
        // 1080p
        // width: { ideal: 1920 },
        // height: { ideal: 1080 },
      },
    })
    .then((stream) => {
      vid.srcObject = stream;
      vid.onloadedmetadata = () => {
        vid.play();
        W = vid.videoWidth;
        H = vid.videoHeight;
        vid.width = W;
        vid.height = H;
        cvs.width = W;
        cvs.height = H;
        cap = new cv.VideoCapture(vid);
        img = new cv.Mat({ width: W, height: H }, cv.CV_8UC4);
        thr = new cv.Mat();
        setInterval(realTime, interval_time);
      };
    });
};

let cap, img, thr;
function realTime() {
  cap.read(img);
  cv.imshow(cvs, img);

  if (DRF_measure || numF < 60) {
    cv.cvtColor(img, thr, cv.COLOR_BGR2GRAY);
    cv.threshold(thr, thr, 0, 255, cv.THRESH_OTSU);
    refCV(img, thr);
  }
}
