const refCV = (img, thr) => {
  let hierarchy = new cv.Mat();
  let contours = new cv.MatVector();

  cv.findContours(thr, contours, hierarchy, cv.RETR_TREE, cv.CHAIN_APPROX_NONE);

  for (let i = 0; i < contours.size(); i++) {
    let parent_node = hierarchy.data32S[4 * i + 3];
    if (parent_node == -1) continue;

    let grand_node = hierarchy.data32S[4 * parent_node + 3];
    if (grand_node == -1) continue;

    cont = contours.get(i);
    let t = cv.boundingRect(cont);
    if (t.width < 7 || t.height < 7) continue;

    let approx_self = new cv.Mat();
    cv.approxPolyDP(cont, approx_self, cv.arcLength(cont, true) * 0.02, true);
    if (approx_self.size().height < 6) {
      approx_self.delete();
      continue;
    }
    approx_self.delete();

    cont_parent = contours.get(parent_node);
    let approx_parent = new cv.Mat();
    cv.approxPolyDP(
      cont_parent,
      approx_parent,
      cv.arcLength(cont, true) * 0.02,
      true
    );
    if (approx_parent.size().height != 4) {
      approx_parent.delete();
      continue;
    }

    cont_grand = contours.get(grand_node);
    let approx_grand = new cv.Mat();
    cv.approxPolyDP(
      cont_grand,
      approx_grand,
      cv.arcLength(cont, true) * 0.02,
      true
    );
    if (approx_grand.size().height != 4) {
      approx_parent.delete();
      approx_grand.delete();
      continue;
    }

    let area_self = cv.contourArea(cont, false);
    let area_parent = cv.contourArea(cont_parent, false);
    let ans =
      (rect_length * rect_length) / Math.PI / circle_radius / circle_radius;

    if (Math.abs(area_parent / area_self - ans) > max_error_rate) continue;

    refCandidate(cont_parent, approx_parent, approx_grand, cont);

    approx_parent.delete();
    approx_grand.delete();
    break;
  }
  contours.delete();
  hierarchy.delete();
};

function refCandidate(cont_parent, approx_parent, approx_grand, cont) {
  let t = cv.boundingRect(cont_parent);
  ctx.beginPath();
  ctx.lineWidth = "2";
  ctx.strokeStyle = "red";
  ctx.rect(t.x, t.y, t.width, t.height);
  ctx.stroke();

  let ap = approx_parent.data32S;
  let ap_ = approx_grand.data32S;

  let centerPoint = crossPoint(
    new Point(ap[0], ap[1]),
    new Point(ap[4], ap[5]),
    new Point(ap[2], ap[3]),
    new Point(ap[6], ap[7])
  );
  const theta1 = findHorizon(ap);
  const theta2 = findHorizon(ap_);

  if (theta1 < 0 && theta2 > Math.PI) {
    theta = -Math.PI / 2;
  } else if (theta2 < 0 && theta1 > Math.PI) {
    theta = -Math.PI / 2;
  } else {
    theta = (theta1 + theta2) / 2;
  }

  D = 4096;
  R = Math.PI / 2;
  F = 1000;
  DRF();
  centerPoint.plane();
  ref = [];
  ref_LR = [];
  ref[0] = centerPoint.copy();
  ref[1] = centerPoint.copy();
  ref[2] = centerPoint.copy();
  ref_LR[0] = new Point(centerPoint.x(), 2e9, 1);
  ref_LR[1] = new Point(centerPoint.x(), 2e9, 1);
  const v = cont.data32S;
  const z = cont.size().height * 2;
  for (let i = 0; i < z; i += 2) {
    let p = new Point(v[i], v[i + 1]);
    p.plane();
    if (ref[0].y() > p.y()) {
      ref[0].y(p.y());
    } else if (ref[2].y() < p.y()) {
      ref[2].y(p.y());
    }
    if (
      p.x() < ref[1].x() &&
      Math.abs(ref_LR[0].y() - ref[1].y()) > Math.abs(ref[1].y() - p.y())
    ) {
      ref_LR[0].x(p.x());
      ref_LR[0].y(p.y());
    } else if (
      p.x() > ref[1].x() &&
      Math.abs(ref_LR[1].y() - ref[1].y()) > Math.abs(ref[1].y() - p.y())
    ) {
      ref_LR[1].x(p.x());
      ref_LR[1].y(p.y());
    }
  }
  ref_LR[0].y(ref[1].y());
  ref_LR[1].y(ref[1].y());
  ref[0].screen();
  ref[1].screen();
  ref[2].screen();
  ref_LR[0].screen();
  ref_LR[1].screen();

  refCheck(ref, circle_radius, ref_LR);
}

const findHorizon = (ap) => {
  let d1, d2;
  if (ap[2] != ap[0]) {
    d1 = (ap[3] - ap[1]) / (ap[2] - ap[0]);
  } else {
    d1 = 2e9;
  }
  if (ap[6] != ap[4]) {
    d2 = (ap[7] - ap[5]) / (ap[6] - ap[4]);
  } else {
    d2 = 2e9;
  }
  let y1, y2;
  y1 = ap[1] - d1 * ap[0];
  y2 = ap[5] - d2 * ap[4];

  let p1x;
  if (d2 != d1) {
    p1x = (y1 - y2) / (d2 - d1);
  } else {
    p1x = 2e9;
  }
  let p1y = d1 * p1x + y1;

  // 점근선 1 구하기 완료

  if (ap[4] != ap[2]) {
    d1 = (ap[5] - ap[3]) / (ap[4] - ap[2]);
  } else {
    d1 = 2e9;
  }
  if (ap[0] != ap[6]) {
    d2 = (ap[1] - ap[7]) / (ap[0] - ap[6]);
  } else {
    d2 = 2e9;
  }
  y1 = ap[3] - d1 * ap[2];
  y2 = ap[7] - d2 * ap[6];

  let p2x;
  if (d2 != d1) {
    p2x = (y1 - y2) / (d2 - d1);
  } else {
    p2x = 2e9;
  }
  let p2y = d1 * p2x + y1;

  // 점근선 2 구하기 완료

  if (p1x == p2x) {
    if (p1y < H / 2) {
      return Math.PI / 2;
    } else {
      return (3 * Math.PI) / 2;
    }
  } else {
    let ccwv;
    if (p1x < p2x) {
      ccwv = ccw(
        new Point(p1x, p1y),
        new Point(p2x, p2y),
        new Point(ap[0], ap[1])
      );
    } else {
      ccwv = ccw(
        new Point(p2x, p2y),
        new Point(p1x, p1y),
        new Point(ap[0], ap[1])
      );
    }
    if (ccwv == 1) {
      return Math.atan((p1y - p2y) / (p1x - p2x));
    } else {
      return Math.atan((p1y - p2y) / (p1x - p2x)) + Math.PI;
    }
  }
};

let avgF = 1000;
let numF = 0;
const refCheck = (ref, d, ref_LR) => {
  let R_S = 0,
    R_E = Math.PI / 2;
  while (R_S + 0.001 <= R_E) {
    R = (R_S + R_E) / 2;
    if (fixed_F) {
      F = fixed_F;
      DRF();
    } else if (numF == 60) {
      F = avgF;
      DRF();
    } else {
      let F_S = 0,
        F_E = 2e9;
      while (F_S + 0.1 <= F_E) {
        F = (F_S + F_E) / 2;
        DRF();
        if (distance(ref[0], ref[1]) > distance(ref[1], ref[2])) {
          F_S = F;
        } else {
          F_E = F;
        }
      }
    }
    if (F < 1 || F > 1e9) {
      F = avgF;
      DRF();
    }
    if (distance(ref[0], ref[2]) > distance(ref_LR[0], ref_LR[1])) {
      R_S = R;
    } else {
      R_E = R;
    }
  }
  if (avgF != F) {
    avgF = (numF * avgF + F) / (numF + 1);
    numF++;
    F = avgF;
    DRF();
  }
  D *= (d + d) / distance(ref[0], ref[2]);
  DRF();
  gridGraphic();
};
