const pillar = (a, b) => {
  let A = a.copy();
  let B = b.copy();
  A.plane();
  B.plane();
  if (A < B) {
    [A, B] = [B, A];
  }
  const dX = A.x() - B.x();
  const dY = A.y() - B.y();
  const dis = Math.sqrt(dX * dX + dY * dY);
  const height =
    (DsinR * dis) / (dis + Math.sqrt(A.X * A.X + Math.pow(DcosR - A.Y, 2)));
  return height;
};
