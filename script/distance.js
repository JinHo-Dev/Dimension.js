const distance = (a, b, h) => {
  let A = a.copy();
  let B = b.copy();
  const tD = D;
  if (h) {
    D = D - h / sinR;
    DRF();
  }
  A.plane();
  B.plane();
  if (h) {
    D = tD;
    DRF();
  }
  const dX = A.x() - B.x();
  const dY = A.y() - B.y();
  return Math.sqrt(dX * dX + dY * dY);
};
