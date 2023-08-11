async function u2net() {
  let W = 320,
    H = 320;
  const ctx_result = document.querySelectorAll("canvas")[1].getContext("2d");

  const session = await ort.InferenceSession.create(model, {
    executionProviders: ["wasm"],
  }).then(console.log("model loaded"));

  let input_imageData = ctx.getImageData(0, 0, W, H); // change this for input
  let floatArr = new Float32Array(W * H * 3);
  let floatArr1 = new Float32Array(W * H * 3);
  let floatArr2 = new Float32Array(W * H * 3);

  let j = 0;
  for (let i = 1; i < input_imageData.data.length + 1; i++) {
    if (i % 4 != 0) {
      floatArr[j] = input_imageData.data[i - 1].toFixed(2) / 255;
      j = j + 1;
    }
  }
  for (let i = 1; i < floatArr.length + 1; i += 3) {
    floatArr1[i - 1] = (floatArr[i - 1] - 0.485) / 0.229; // red color
    floatArr1[i] = (floatArr[i] - 0.456) / 0.224; // green color
    floatArr1[i + 1] = (floatArr[i + 1] - 0.406) / 0.225; // blue color
  }
  let k = 0;
  for (let i = 0; i < floatArr.length; i += 3) {
    floatArr2[k] = floatArr[i];
    k = k + 1;
  }
  let l = 102400;
  for (let i = 1; i < floatArr.length; i += 3) {
    floatArr2[l] = floatArr[i];
    l = l + 1;
  }
  let m = 204800;
  for (let i = 2; i < floatArr.length; i += 3) {
    floatArr2[m] = floatArr[i];
    m = m + 1;
  }
  let n = 409600;
  for (let i = 2; i < floatArr.length; i += 3) {
    floatArr2[n] = floatArr[i]; // red   color
    n = n + 1;
  }
  let o = 819200;
  for (let i = 2; i < floatArr.length; i += 3) {
    floatArr2[o] = floatArr[i]; // red   color
    o = o + 1;
  }

  let p = 1638400;
  for (let i = 2; i < floatArr.length; i += 3) {
    floatArr2[p] = floatArr[i]; // red   color
    p = p + 1;
  }
  const input = new ort.Tensor("float32", floatArr2, [1, 3, W, H]);
  const feeds = { "input.1": input };
  const results = await session.run(feeds).then();
  const pred = Object.values(results)[0];
  console.log(pred);
  let myImageData = ctx.createImageData(W, H);
  for (let i = 0; i < pred.data.length * 4; i += 4) {
    let pixelIndex = i;
    if (i != 0) {
      t = i / 4;
    } else {
      t = 0;
    }
    if (Math.round(pred.data[t] * 255)) {
      myImageData.data[pixelIndex] = 255; // red color
      myImageData.data[pixelIndex + 1] = 0; // green color
      myImageData.data[pixelIndex + 2] = 255; // blue color
      myImageData.data[pixelIndex + 3] = Math.round(pred.data[t] * 255);
    }
  }
  // Apply image mask
  console.log(ctx_result, myImageData);
  ctx_result.putImageData(myImageData, 0, 0);
}
