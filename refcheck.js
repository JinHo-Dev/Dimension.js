

let ref = [new Point(0, -100), new Point(0, -70), new Point(0,-20)];


const refCheck = (ref_origin, d) => {
	let ref = [];
	ref[0] = ref_origin[0];
	ref[1] = ref_origin[1];
	ref[2] = ref_origin[2];
	ref.sort((a, b) => {
		return a.y - b.y;
	});
	let D_S = 0, D_E = 2e9;
	while(D_S + 0.1 <= D_E) {
		D = (D_S + D_E) / 2;
		let F_S = 0, F_E = 2e9;
		while(F_S + 0.1 <= F_E) {
			F = (F_S + F_E) / 2;
			DRF();
			if(distance(ref[0], ref[1]) > distance(ref[1], ref[2])) {
				F_S = F;
			}
			else {
				F_E = F;
			}
		}
		if(distance(ref[0], ref[1]) > d) {
			D_E = D;
		}
		else {
			D_S = D;
		}
	}
	new Point(ref[0].x, ref[0].y);
	new Point(ref[1].x, ref[1].y);
	new Point(ref[2].x, ref[2].y);
	gridGraphic();
}


function refCandidate(cont_parent, approx_parent, cont, approx) {
	let t = cv.boundingRect(cont_parent);
	ctx.beginPath();
	ctx.lineWidth = "2";
	ctx.strokeStyle = "red";
	ctx.rect(t.x, t.y, t.width, t.height);
	ctx.stroke();
	
	let ap = approx_parent.data32S;
	ctx.beginPath();
	ctx.moveTo(ap[0], ap[1]);
	ctx.lineTo(ap[2], ap[3]);
	ctx.lineTo(ap[4], ap[5]);
	ctx.lineTo(ap[6], ap[7]);
	ctx.lineTo(ap[7], ap[8]);
	ctx.stroke();
	
	let centerPoint = crossPoint(ap[0], ap[1], ap[4], ap[5], ap[2], ap[3], ap[6], ap[7]);
	
	theta = findHorizon(ap);
	
	t = cv.boundingRect(cont);
	ctx.beginPath();
	ctx.lineWidth = "2";
	ctx.strokeStyle = "red";
	ctx.rect(t.x, t.y, t.width, t.height);
	ctx.stroke();
	
	
	let temp_large = new cv.Mat(2 * H, 2 * W, 0);
	let temp = new cv.Mat(H, W, 0);
	temp.setTo(new cv.Scalar(0));
	
	let mv = new cv.MatVector();
	mv.push_back(cont);
	cv.drawContours(temp, mv, -1, new cv.Scalar(255), -1);
	let M = cv.matFromArray(2, 3, cv.CV_64FC1, [1, 0, W/2, 0, 1, H/2]);
	cv.warpAffine(temp, temp_large, M, temp_large.size());
	M = cv.getRotationMatrix2D(new cv.Point(W,H), (theta) / Math.PI * 180, 1.0);
	cv.warpAffine(temp_large, temp_large, M, temp_large.size());
	
	let hierarchy = new cv.Mat();
	let contours = new cv.MatVector();
	cv.findContours(temp_large, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_NONE);
	contours.get(0);
	t = contours.get(0);
	let area = cv.contourArea(t, false);
	t = cv.boundingRect(t);
	
	R = Math.PI/2 - Math.acos(area * 4 / t.width / t.width / Math.PI);
	DRF();
	
	
	ref[0].y = t.y - H;
	ref[2].y = ref[0].y + t.height;
	
	centerPoint.y -= H/2;
	centerPoint.x -= W/2;
	let cosTheta = Math.cos(-theta);
	let sinTheta = Math.sin(-theta);
	
	ref[1].y = sinTheta * centerPoint.x + cosTheta * centerPoint.y;
	
	refCheck(ref, 30);//반지름 크기
	
	DRF();
	
	temp.delete();
	temp_large.delete();
}


const findHorizon = (ap) => {
	let d1, d2;
	if(ap[2] != ap[0]) {
		d1 = (ap[3] - ap[1]) / (ap[2] - ap[0]);
	}
	else {
		d1 = 2e9;
	}
	if(ap[6] != ap[4]) {
		d2 = (ap[7] - ap[5]) / (ap[6] - ap[4]);
	}
	else {
		d2 = 2e9;
	}
	let y1, y2;
	y1 = ap[1] - d1 * ap[0];
	y2 = ap[5] - d2 * ap[4];
	
	let p1x;
	if(d2 != d1) {
		p1x = (y1 - y2) / (d2 - d1);
	}
	else {
		p1x = 2e9;
	}
	let p1y = d1 * p1x + y1;
	
	// 점근선 1 구하기 완료
	
	
	if(ap[4] != ap[2]) {
		d1 = (ap[5] - ap[3]) / (ap[4] - ap[2]);
	}
	else {
		d1 = 2e9;
	}
	if(ap[0] != ap[6]) {
		d2 = (ap[1] - ap[7]) / (ap[0] - ap[6]);
	}
	else {
		d2 = 2e9;
	}
	y1 = ap[3] - d1 * ap[2];
	y2 = ap[7] - d2 * ap[6];
	
	let p2x;
	if(d2 != d1) {
		p2x = (y1 - y2) / (d2 - d1);
	}
	else {
		p2x = 2e9;
	}
	let p2y = d1 * p2x + y1;
	
	// 점근선 2 구하기 완료
	
	
	if(p1x == p2x) {
		if(p1y < H / 2) {
			return Math.PI/2;
		}
		else {
			return 3 * Math.PI/2;
		}
	}
	else {
		return Math.atan((p1y - p2y) / (p1x - p2x));
	}
}


