const ccw = (p1, p2, p3) => {
  const v1 = [p2.x() - p1.x(), p2.y() - p1.y()];
  const v2 = [p3.x() - p2.x(), p3.y() - p2.y()];
  const t = v1[0] * v2[1] - v2[0] * v1[1];
  if (t > 0) {
    return 1; //CCW
  } else if (t < 0) {
    return -1; //CW
  }
  return 0; //Parallel
};
