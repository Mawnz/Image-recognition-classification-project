//Creating canvas for putting and later getting image information
var can = $("<canvas/>").get(0);
var h, w;
var downsize = 50;
var k = 0;
var r = .1;
var net;
var grayImg;

//loading image
var imge = new Image();
img.onload = function(){
	//Setting height width
	h = imge.height, w = imge.width;
	can.height = h;
	can.width = w;

	training();
};
imge.src = "../img/data/hands/Z_P_hgr1_id11_1.jpg";

function training(){
	//canvas context and drawing image
	var cc = can.getContext("2d");
	cc.drawImage(imge, 0, 0, w, h,
						0, 0, downsize, downsize);

	//get the data
	var data = cc.getImageData(0, 0, downsize, downsize).data;

	//get grayscale of data
	grayImg = gray(data);

	//make network
	var inputLay = new synaptic.Layer(grayImg.length);

	var hid = new synaptic.Layer(20);

	var outputLay = new synaptic.Layer(1);

	inputLay.project(hid);
	hid.project(outputLay);

	//change squashing method if wanted
	//hid.squash = *your squashing method here*

	net = new synaptic.Network({
		input: inputLay,
		hidden: [hid],
		output: outputLay
	})
	console.log(grayImg);
	iter();
}


function iter(){
	++k;
	console.log(k);
	net.activate(grayImg);
	net.propagate(r, [1]);
	if(k == 100) console.log(net.activate(grayImg));
	else window.requestAnimationFrame(iter);	
}

function gray(pixels){
	var avgImg = [];
	var t = 0;
	for(var i = 0; i < size * size; i ++){
		var r = pixels[t];
		var g = pixels[1 + t];
		var b = pixels[2 + t];
		var avg = (r + g + b) / 3;

		t += 4;
		//so all values are 0-1
		avgImg.push(avg/255);
	}
	return avgImg;
}

