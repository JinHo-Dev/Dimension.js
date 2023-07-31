const gridGraphic = () => {
  if (!DRF_measure) return;
  for (let Y = -2000; Y < 2000; Y += 40) {
    for (let X = -2000; X < 2000; X += 40) {
      let t = new Point(X, Y, 1);
      t.screen();
      ctx.fillStyle = "#E2E";
      ctx.fillRect(t.x(), t.y(), 6, 6);
    }
  }
};
