let session;

async function u2net() {
  session = await ort.InferenceSession.create(
    "https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2netp.onnx",
    {
      executionProviders: ["wasm"],
    }
  ).then();
  detect();
}

const detect = async () => {
  const realW = W;
  const realH = H;
  let W = 320,
    H = 320;
  const ctx_result = document.querySelectorAll("canvas")[1].getContext("2d");

  let input_imageData = ctx.getImageData(0, 0, W, H); // change this for input
  let floatArr = new Float32Array(W * H * 3);
  let floatArr2 = new Float32Array(W * H * 3);

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
  const input = new ort.Tensor("float32", floatArr2, [1, 3, W, H]);
  const feeds = { "input.1": input };
  const results = await session.run(feeds).then();
  const pred = Object.values(results)[0];
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
  ctx_result.putImageData(myImageData, 0, 0);
  console.log(1);
  setTimeout(detect, 100);
};
