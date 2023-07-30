const reversePoint = (P) => {
  const { X, Y } = P;
  const y = F * Math.tan(Math.atan(1 / (itanR - Y / DsinR)) - R);
  const t = R + Math.atan(y / F);
  if (t < 0) return { x: 0, y: 0 };
  if (t > 3.1416) return { x: 0, y: 0 };
  const x = (X / DsinR) * Math.sin(t) * Math.sqrt(y * y + F * F);
  return { x: x, y: y };
};
