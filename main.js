const getScript = (local, online, asyncMode) => {
  const myURL = "";
  if (online === undefined) {
    online = myURL + local;
  }
  if (asyncMode === undefined) {
    asyncMode = true;
  }
  let scriptEle = document.createElement("script");
  if (window.location.host) {
    scriptEle.setAttribute("src", online);
  } else {
    scriptEle.setAttribute("src", local);
  }
  scriptEle.setAttribute("async", asyncMode ? "true" : "false");
  document.body.appendChild(scriptEle);
};

getScript("script/4.8.0.js", "https://docs.opencv.org/4.8.0/opencv.js");

getScript("config.js");
getScript("script/DRF.js");
getScript("script/gridGraphic.js");
getScript("script/sixPoints.js");
getScript("script/sevenPoints.js");
getScript("script/ccw.js");
getScript("script/realTime.js");
getScript("script/pointClass.js");
getScript("script/crossPoint.js");
getScript("script/pillar.js");
getScript("script/distance.js");
getScript("script/reversePoint.js");
getScript("script/refcheck.js");

let itv = setInterval(function () {
  if (typeof cv != "undefined" && typeof start != "undefined") {
    clearInterval(itv);
    start();
  }
}, 33);

document.querySelector("button").onclick = () => {
  DRF_measure = true;
  let sumR = 0;
  let sumD = 0;
  let sumTheta = 0;
  setTimeout(() => {
    sumR += R;
    sumD += D;
    sumTheta += theta;
  }, 500);
  setTimeout(() => {
    sumR += R;
    sumD += D;
    sumTheta += theta;
  }, 700);
  setTimeout(() => {
    sumR += R;
    sumD += D;
    sumTheta += theta;
  }, 900);
  setTimeout(() => {
    sumR += R;
    sumD += D;
    sumTheta += theta;
    DRF_measure = false;
    D = sumD / 4;
    R = sumR / 4;
    theta = sumTheta / 4;
    DRF();
    document.querySelector("textarea").value = `D: ${Math.round(D)} \nR: ${
      Math.round(R * 100) / 100
    } \nF: ${Math.round(F)} \ntheta: ${Math.round(theta * 100) / 100}`;
  }, 1100);
};