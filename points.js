

let W = 600;
let H = 400;

const cvs = document.querySelector("canvas");
const ctx = cvs.getContext("2d");

let Point = class {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.i = y * W + x;
	}
	valueOf() {
		return this.i;
	}
}

function crossPoint(v1x1, v1y1, v1x2, v1y2, v2x1, v2y1, v2x2, v2y2) {
	let d1, d2;
	if(v1x1 != v1x2) {
		d1 = (v1y1 - v1y2) / (v1x1 - v1x2);
	}
	else {
		d1 = 2e9;
	}
	if(v2x1 != v2x2) {
		d2 = (v2y1 - v2y2) / (v2x1 - v2x2);
	}
	else {
		d2 = 2e9;
	}
	let y1, y2;
	y1 = v1y1 - d1 * v1x1;
	y2 = v2y1 - d2 * v2x1;
	
	let x;
	if(d2 != d1) {
		x = (y1 - y2) / (d2 - d1);
	}
	else {
		x = 2e9;
	}
	let y = d1 * x + y1;
	return {x:x, y:y};
}

const pillar = (a, b) => { // a와 b점이 두개가 주어짐
	if(a < b) [a , b] = [b , a];
	const A = transPoint(a);
	const B = transPoint(b);
	const dX = A.X - B.X;
	const dY = A.Y - B.Y;
	const dis = Math.sqrt(dX * dX + dY * dY);
	const height = DsinR * dis / (dis + Math.sqrt(A.X * A.X + Math.pow(DcosR - A.Y, 2)));
	return {point: a, height: height};
	// 둘중에 어느점이 바닥에 위치했는지, 높이가 얼마인지
}

const distance = (a, b) => { // a와 b점이 두개가 주어짐
	const A = transPoint(a);
	const B = transPoint(b);
	const dX = A.X - B.X;
	const dY = A.Y - B.Y;
	return Math.sqrt(dX * dX + dY * dY);
	// 두 점 사이 거리가 얼마나 되는 지
}

const distanceCeiling = (a, b, h) => { // a와 b점이 두개가 주어짐
	const A = transPointCeiling(a, h);
	const B = transPointCeiling(b, h);
	const dX = A.X - B.X;
	const dY = A.Y - B.Y;
	return Math.sqrt(dX * dX + dY * dY);
	// 두 점 사이 거리가 얼마나 되는 지
}

const transPoint = (p) => { // Point 를 가져옴
	const x = p.x;
	const y = p.y;
	const t = R + Math.atan(y / F);
	const Y = DsinR * (itanR - 1 / Math.tan(t));
	const X = x * DsinR / Math.sin(t) / Math.sqrt(y * y + F * F);
	return {X: X, Y: Y};
	// 바닥면위의 좌표로 바꿔줌
}

const transPointCeiling = (p, h) => {
	const tD = D - h / sinR;
	const x = p.x;
	const y = p.y;
	const t = R + Math.atan(y / F);
	const Y = tD * sinR * (itanR - 1 / Math.tan(t));
	const X = x * tD * sinR / Math.sin(t) / Math.sqrt(y * y + F * F);
	return {X: X, Y: Y};
}

const reversePoint = (P) => {
	const {X, Y} = P;
	const y = F * Math.tan(Math.atan(1 / (itanR - Y / DsinR))- R);
	const t = R + Math.atan(y / F);
	if(t < 0) return {x:0, y:0};
	if(t > 3.1416) return {x:0, y:0};
	const x = X / DsinR * Math.sin(t) * Math.sqrt(y * y + F * F);
	return {x:x, y:y};
}
