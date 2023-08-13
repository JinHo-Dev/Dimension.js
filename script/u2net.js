let session;

async function u2net_trigger() {
  session = await ort.InferenceSession.create(model, {
    executionProviders: ["wasm"],
  });
  detect();
}
const cvs_off = document.querySelectorAll("canvas")[1];
const ctx_off = cvs_off.getContext("2d");
const cvs_result = document.querySelectorAll("canvas")[2];
const ctx_result = cvs_result.getContext("2d");

let TW = 320,
  TH = 320;

const detect = async () => {
  if (!BOX_measure) {
    ctx_result.clearRect(0, 0, W, H);
    setTimeout(detect, interval_time);
    return;
  }
  ctx_off.drawImage(vid, 0, 0, 320, 320);

  let input_imageData = ctx_off.getImageData(0, 0, TW, TH); // change this for input
  let floatArr = new Float32Array(TW * TH * 3);
  let floatArr2 = new Float32Array(TW * TH * 3);

  let j = 0;
  for (let i = 1; i < input_imageData.data.length + 1; i++) {
    if (i % 4 != 0) {
      floatArr[j] = input_imageData.data[i - 1].toFixed(2) / 255;
      j = j + 1;
    }
  }
  let k = 0;
  for (let i = 0; i < floatArr.length; i += 3) {
    floatArr2[k] = floatArr[i];
    k = k + 1;
  }
  for (let i = 1; i < floatArr.length; i += 3) {
    floatArr2[k] = floatArr[i];
    k = k + 1;
  }
  for (let i = 2; i < floatArr.length; i += 3) {
    floatArr2[k] = floatArr[i];
    k = k + 1;
  }
  const input = new ort.Tensor("float32", floatArr2, [1, 3, TW, TH]);
  const feeds = { "input.1": input };
  const results = await session.run(feeds).then();
  const pred = Object.values(results)[0];
  let myImageData = ctx_off.createImageData(TW, TH);
  for (let i = 0; i < pred.data.length * 4; i += 4) {
    let pixelIndex = i;
    if (i != 0) {
      t = i / 4;
    } else {
      t = 0;
    }
    const t1 = Math.round(pred.data[t] * 255);
    myImageData.data[pixelIndex] = 255 - t1; // red color
    myImageData.data[pixelIndex + 1] = 255 - t1; // green color
    myImageData.data[pixelIndex + 2] = 255 - t1; // blue color
    myImageData.data[pixelIndex + 3] = 255 - t1;
  }
  // Apply image mask
  cvs_off.width = TW;
  cvs_off.height = TH;
  cvs_result.width = TW;
  cvs_result.height = TH;
  ctx_result.putImageData(myImageData, 0, 0);
  cvs_result.style.width = document.querySelector("video").clientWidth;
  cvs_result.style.height = document.querySelector("video").clientHeight;
  getPoints();
  setTimeout(detect, interval_time);
};

const getPoints = () => {
  let img = cv.matFromImageData(ctx_result.getImageData(0, 0, 320, 320));
  let thr = new cv.Mat();
  cv.cvtColor(img, thr, cv.COLOR_BGR2GRAY);
  cv.threshold(thr, thr, 0, 255, cv.THRESH_OTSU);
  let hierarchy = new cv.Mat();
  let contours = new cv.MatVector();

  cv.findContours(
    thr,
    contours,
    hierarchy,
    cv.RETR_EXTERNAL,
    cv.CHAIN_APPROX_NONE
  );

  for (let i = 0; i < contours.size(); i++) {
    let cont = contours.get(i);
    let approx = new cv.Mat();
    cv.approxPolyDP(cont, approx, cv.arcLength(cont, true) * 0.02, true);
    if (approx.size().height == 6) {
      const boxPoints = [
        new Point(approx.data32S[0], approx.data32S[1], 2),
        new Point(approx.data32S[2], approx.data32S[3], 2),
        new Point(approx.data32S[4], approx.data32S[5], 2),
        new Point(approx.data32S[6], approx.data32S[7], 2),
        new Point(approx.data32S[8], approx.data32S[9], 2),
        new Point(approx.data32S[10], approx.data32S[11], 2),
      ];
      const volume = sevenPoints(boxPoints);
      console.log(volume);
    }
    console.log(approx.size().height);
    cont.delete();
    approx.delete();
  }
  contours.delete();
  hierarchy.delete();
  img.delete();
  thr.delete();
};
