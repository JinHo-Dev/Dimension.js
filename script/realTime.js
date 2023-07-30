window.alert(-2);
const start = () => {
  window.alert(-1);
  navigator.mediaDevices
    .getUserMedia({
      audio: false,
      video: {
        frameRate: { max: 30 },
        facingMode: { exact: "environment" },
        width: { ideal: 1920 },
        height: { ideal: 1080 },
      },
    })
    .then((stream) => {
      window.alert(0);
      const vid = document.querySelector("video");
      vid.srcObject = stream;
      window.alert(1);
      vid.onloadedmetadata = () => {
        window.alert(2);
        vid.play();
        window.alert(3);
        // W = vid.videoWidth;
        // H = vid.videoHeight;
        // vid.width = W;
        // vid.height = H;
        // cvs.width = W;
        // cvs.height = H;
        // setInterval(realTime, interval_time);
      };
    });
};

document.querySelector("input").addEventListener(
  "change",
  (e) => {
    document.querySelector("img").src = URL.createObjectURL(e.target.files[0]);
  },
  false
);

document.querySelector("img").onload = function () {
  let img = cv.imread(this);
  W = this.width;
  H = this.height;
  cvs.width = W;
  cvs.height = H;
  let thr = new cv.Mat();
  cv.cvtColor(img, thr, cv.COLOR_BGR2GRAY);
  cv.threshold(thr, thr, 0, 255, cv.THRESH_OTSU);

  let thr2 = new cv.Mat();
  cv.cvtColor(img, thr2, cv.COLOR_BGR2GRAY);
  let block_size = 15;
  let C = 3;
  cv.imshow(cvs, thr2);
  cv.adaptiveThreshold(
    thr2,
    thr2,
    255,
    cv.ADAPTIVE_THRESH_MEAN_C,
    cv.THRESH_BINARY,
    block_size,
    C
  );
  thr2.delete();

  refCV(img, thr);
  img.delete();
  thr.delete();
};

function realTime() {
  let cap = new cv.VideoCapture(vid);
  let img = new cv.Mat({ width: W, height: H }, cv.CV_8UC4);
  cap.read(img);
  // let thr = new cv.Mat();
  // cv.cvtColor(img, thr, cv.COLOR_BGR2GRAY);
  // cv.threshold(thr, thr, 0, 255, cv.THRESH_OTSU);
  cv.imshow(cvs, img);

  // refCV(img, thr);

  img.delete();
  // thr.delete();
}
