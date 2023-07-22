


// 기미 잡티 제거 알고리즘 필요함



// scenario 1 (두면이 앞으로 보이는 경우 -> 기둥 3개 처리)
const sevenPoints = (points) => {
	let height, width, depth;
	// 컨벡스헐로 가운데 갇힌 점 찾기
	// 갇힌 점의 바닥면을 찾기 => 아래 있는 점 두개 찾고 두 점 중 x좌표 가까운 거 고르기
	// 나머지 점들 중 왼쪽 두개 오른쪽 두개 짝지으면 됨
	// 점 하나 남는 건 버려도 됨
	// 세개의 쌍을 구했다고 가정함 왼쪽 lefts, 오른쪽 right, 가운데 middl : 각 바닥면 인덱스가 0 이라고 하자
	
	
	// 근데 임시로는 그냥 왼쪽 두개, 오른쪽 두개, 아래쪽 두개 뽑기로 함
	
	points.sort((a, b) => {
		return a.x - b.x;
	});
	let lefts = [points[0], points[1]];
	points.shift();
	points.shift();
	
	points.sort((a, b) => {
		return b.x - a.x;
	});
	let right = [points[0], points[1]];
	points.shift();
	points.shift();
	
	points.sort((a, b) => {
		return b.y - a.y;
	});
	let middl = [points[0], points[1]];
	
		lefts.sort((a, b) => {
		return b.y - a.y;
	});
	right.sort((a, b) => {
		return b.y - a.y;
	});
	middl.sort((a, b) => {
		return b.y - a.y;
	});
	
	const P1 = pillar(lefts[0], lefts[1]);
	const P2 = pillar(right[0], right[1]);
	const P3 = pillar(middl[0], middl[1]);
	height = (P1.height + P2.height + P3.height) / 3;
	width = distance(lefts[0], middl[0]);
	depth = distance(middl[0], right[0]);
	return {height: height, width: width, depth: depth};
}

// scenario 2 (한면이 앞으로 나와있어서 다른 면이 뒤에 가려진 경우 -> 앞면과 윗면으로)
const sixPoints = (points) => {
	let height, width, depth;
	// 해당 경우에는 무조건 좌 우 3개씩 있게됨
	points.sort((a, b) => {
		return a.x - b.x;
	});
	let lefts = [points[0], points[1], points[2]];
	let right = [points[3], points[4], points[5]];
	lefts.sort((a, b) => {
		return b.y - a.y;
	});
	right.sort((a, b) => {
		return b.y - a.y;
	});
	const P1 = pillar(lefts[0], lefts[1]);
	const P2 = pillar(right[0], right[1]);
	
	height = (P1.height + P2.height) / 2;
	width = distance(lefts[0], right[0]);
	
	// 깊이 구하는 거
	points.sort((a, b) => {
		return b.y - a.y;
	});
	points.shift();
	points.shift();
	points.sort((a, b) => {
		return a.x - b.x;
	});
	const depth1 = distance(points[0], points[1], height);
	const depth2 = distance(points[2], points[3], height);
	
	depth = (depth1 + depth2) / 2; 
	
	return {height: height, width: width, depth: depth};
}

