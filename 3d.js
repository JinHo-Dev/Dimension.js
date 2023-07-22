
let D = 530; // distance (m)
let R = 0.7; // delta (rad)
let F = 550;

let theta = 0;

let sinR, cosR, tanR, itanR, DsinR, DcosR;

const DRF = () => {
	D = D - 0;
	R = R - 0;
	F = F - 0;
	sinR = Math.sin(R);
	cosR = Math.cos(R);
	tanR = Math.tan(R);
	itanR = 1 / tanR;
	DsinR = D * sinR;
	DcosR = D * cosR;
}

DRF();


const gridGraphic = () => {
	for(let Y = -100; Y < 100; Y += 10) {
		for(let X = -100; X < 100; X += 10) {
			const t = reversePoint({X:X, Y:Y});
			//ctx.fillRect(W/2 + t.x, H/2 + t.y, 6, 6);
			
			
			let cosTheta = Math.cos(theta);
			let sinTheta = Math.sin(theta);
			let tt = new Point();
			tt.x = cosTheta * t.x - sinTheta * t.y;
			tt.y = sinTheta * t.x + cosTheta * t.y;
			ctx.fillStyle = "#E2E";
			ctx.fillRect(W/2 + tt.x, H/2 + tt.y, 6, 6);
		}
	}
}



