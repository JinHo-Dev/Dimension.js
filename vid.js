/*
	const vid;
	navigator.mediaDevices();
	realTime();
*/




const vid = document.querySelector("video");

navigator.mediaDevices
	.getUserMedia({
		audio: false,
		video: {
			frameRate: {max: 30},
			facingMode: { exact: "environment"},
			width: {ideal: 1920},
			height: {ideal: 1080},
		},
	})
	.then((stream) => {
		vid.srcObject = stream;
		vid.onloadedmetadata = () => {
			vid.play();
			W = vid.videoWidth;
			H = vid.videoHeight;
			vid.width = W;
			vid.height = H;
			setInterval(realTime, 100);
		}
	});


let img;
function realTime() {
	let cap = new cv.VideoCapture(vid);
	img = new cv.Mat({width: W, height: H}, cv.CV_8UC4);
	cap.read(img);
	
	cvs.width = W;
	cvs.height= H;
	
	let gray = new cv.Mat();
	cv.cvtColor(img, gray, cv.COLOR_BGR2GRAY);
	
	let thr = new cv.Mat();
	cv.threshold(gray, thr, 0, 255, cv.THRESH_OTSU);
	
	cv.imshow(cvs, thr);
	
	let hierarchy = new cv.Mat();
	let contours = new cv.MatVector();
	
	cv.findContours(thr, contours, hierarchy, cv.RETR_TREE, cv.CHAIN_APPROX_NONE);
	
	for(let i = 0; i < contours.size(); i++) {
		let parent_node = hierarchy.data32S[4*i + 3];
		if(parent_node == -1) continue;
		
		let grand_node = hierarchy.data32S[4*parent_node + 3];
		if(grand_node == -1) continue;
		
		cont = contours.get(i);
		let t = cv.boundingRect(cont);
		if(t.width < 10 || t.height < 10) continue;
		
		let approx_self = new cv.Mat();
		// 0.02 수정하면 속도 빨라짐
		cv.approxPolyDP(cont, approx_self, cv.arcLength(cont, true) * 0.02, true);
		if(approx_self.size().height < 6) {
			continue;
		}
		
		
		// parent 랑 grand 는 이제 메모이제이션 해둬야하는게 아닐까
		cont_parent = contours.get(parent_node);
		let approx_parent = new cv.Mat();
		cv.approxPolyDP(cont_parent, approx_parent, cv.arcLength(cont, true) * 0.02, true);
		if(approx_parent.size().height != 4) {
			continue;
		}
		
		cont_grand = contours.get(grand_node);
		let approx_grand = new cv.Mat();
		cv.approxPolyDP(cont_grand, approx_grand, cv.arcLength(cont, true) * 0.02, true);
		if(approx_grand.size().height != 4) {
			continue;
		}
		
		
		// 이거 각도 구할때도 쓰면 딱좋을듯
		let area_self = cv.contourArea(cont, false);
		let area_parent = cv.contourArea(cont_parent, false);
		let ans = 624*624 / Math.PI / 200 / 200;
		// 정사각형 한변 624
		// 원 반지름 200
		
		// 오차 한계를 0.2 로 설정함
		if(Math.abs(area_parent / area_self - ans) > 0.2) continue;
		
		refCandidate(cont_parent, approx_parent, cont, approx_self);
		break;
		
		// delete 로 메모리 잊지말고 비워두기 : todo
		
	}
	
	img.delete();
	gray.delete();
	thr.delete();
	contours.delete();
	hierarchy.delete();
};

