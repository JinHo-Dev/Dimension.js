const crossPoint = (p1, p2, p3, p4) => {
  let d1;
  if (p1.x() != p2.x()) {
    d1 = (p1.y() - p2.y()) / (p1.x() - p2.x());
  } else {
    d1 = 2e9;
  }
  let d2;
  if (p3.x() != p4.x()) {
    d2 = (p3.y() - p4.y()) / (p3.x() - p4.x());
  } else {
    d2 = 2e9;
  }
  const y1 = p1.y() - d1 * p1.x();
  const y2 = p3.y() - d2 * p3.x();
  const ret = new Point();
  if (d2 != d1) {
    ret.x((y1 - y2) / (d2 - d1));
  } else {
    ret.x(2e9);
  }
  ret.y(d1 * ret.x() + y1);
  return ret;
};
