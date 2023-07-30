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

    cont_parent = contours.get(parent_node);
    let approx_parent = new cv.Mat();
    cv.approxPolyDP(
      cont_parent,
      approx_parent,
      cv.arcLength(cont, true) * 0.02,
      true
    );
    if (approx_parent.size().height != 4) {
      approx_self.delete();
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
      approx_self.delete();
      approx_parent.delete();
      approx_grand.delete();
      continue;
    }
    approx_grand.delete();

    let area_self = cv.contourArea(cont, false);
    let area_parent = cv.contourArea(cont_parent, false);
    let ans =
      (rect_length * rect_length) / Math.PI / circle_radius / circle_radius;

    if (Math.abs(area_parent / area_self - ans) > max_error_rate) continue;

    refCandidate(cont_parent, approx_parent, cont, approx_self);

    approx_self.delete();
    approx_parent.delete();
    break;
  }
  contours.delete();
  hierarchy.delete();
};

let ref = [new Point(0, -100), new Point(0, -70), new Point(0, -20)];

const refCheck = (ref_origin, d) => {
  let ref = [];
  ref[0] = ref_origin[0];
  ref[1] = ref_origin[1];
  ref[2] = ref_origin[2];
  let theta_saved = theta;
  theta = 0;
  ref.sort((a, b) => {
    return a.y() - b.y();
  });
  let D_S = 0,
    D_E = 2e9;
  while (D_S + 0.1 <= D_E) {
    D = (D_S + D_E) / 2;
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
    if (distance(ref[0], ref[1]) > d) {
      D_E = D;
    } else {
      D_S = D;
    }
  }
  theta = theta_saved;
  gridGraphic();
};

function refCandidate(cont_parent, approx_parent, cont, approx) {
  let t = cv.boundingRect(cont_parent);
  ctx.beginPath();
  ctx.lineWidth = "2";
  ctx.strokeStyle = "red";
  ctx.rect(t.x, t.y, t.width, t.height);
  ctx.stroke();

  let ap = approx_parent.data32S;
  ctx.beginPath();
  ctx.moveTo(ap[0], ap[1]);
  ctx.lineTo(ap[2], ap[3]);
  ctx.lineTo(ap[4], ap[5]);
  ctx.lineTo(ap[6], ap[7]);
  ctx.lineTo(ap[7], ap[8]);
  ctx.stroke();

  let centerPoint = crossPoint(
    new Point(ap[0], ap[1]),
    new Point(ap[4], ap[5]),
    new Point(ap[2], ap[3]),
    new Point(ap[6], ap[7])
  );

  theta = findHorizon(ap);

  t = cv.boundingRect(cont);
  ctx.beginPath();
  ctx.lineWidth = "2";
  ctx.strokeStyle = "red";
  ctx.rect(t.x, t.y, t.width, t.height);
  ctx.stroke();

  let temp_large = new cv.Mat(2 * H, 2 * W, 0);
  let temp = new cv.Mat(H, W, 0);
  temp.setTo(new cv.Scalar(0));

  let mv = new cv.MatVector();
  mv.push_back(cont);
  cv.drawContours(temp, mv, -1, new cv.Scalar(255), -1);
  let M = cv.matFromArray(2, 3, cv.CV_64FC1, [1, 0, W / 2, 0, 1, H / 2]);
  cv.warpAffine(temp, temp_large, M, temp_large.size());
  M = cv.getRotationMatrix2D(new cv.Point(W, H), (theta / Math.PI) * 180, 1.0);
  cv.warpAffine(temp_large, temp_large, M, temp_large.size());

  let hierarchy = new cv.Mat();
  let contours = new cv.MatVector();
  cv.findContours(
    temp_large,
    contours,
    hierarchy,
    cv.RETR_EXTERNAL,
    cv.CHAIN_APPROX_NONE
  );
  contours.get(0);
  t = contours.get(0);
  let area = cv.contourArea(t, false);
  t = cv.boundingRect(t);

  R = Math.PI / 2 - Math.acos((area * 4) / t.width / t.width / Math.PI);
  DRF();

  ref[0].y(t.y - H / 2);
  ref[2].y(ref[0].y() + t.height);

  centerPoint.y(centerPoint.y() - H / 2);
  centerPoint.x(centerPoint.x() - W / 2);
  let cosTheta = Math.cos(-theta);
  let sinTheta = Math.sin(-theta);

  ref[1].y(sinTheta * centerPoint.x() + cosTheta * centerPoint.y() + H / 2);

  refCheck(ref, circle_radius);

  DRF();

  temp.delete();
  temp_large.delete();
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
