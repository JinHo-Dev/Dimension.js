// 기미 잡티 제거 알고리즘 필요함

// scenario 2 (한면이 앞으로 나와있어서 다른 면이 뒤에 가려진 경우 -> 앞면과 윗면으로)
const sixPoints = (points) => {
  let height, width, depth;
  // 해당 경우에는 무조건 좌 우 3개씩 있게됨
  points.forEach((point) => {
    point.plane();
  });
  points.sort((a, b) => {
    return a.x() - b.x();
  });
  let lefts = [points[0], points[1], points[2]];
  let right = [points[3], points[4], points[5]];
  lefts.sort((a, b) => {
    return b.y() - a.y();
  });
  right.sort((a, b) => {
    return b.y() - a.y();
  });
  const P1 = pillar(lefts[0], lefts[1]);
  const P2 = pillar(right[0], right[1]);

  height = (P1 + P2) / 2;
  width = distance(lefts[0], right[0]);

  // 깊이 구하는 거
  points.sort((a, b) => {
    return b.y - a.y;
  });
  points.shift();
  points.shift();
  points.sort((a, b) => {
    return a.x() - b.x();
  });
  const depth1 = distance(points[0], points[1], height);
  const depth2 = distance(points[2], points[3], height);

  depth = (depth1 + depth2) / 2;

  return { height: height, width: width, depth: depth };
};
