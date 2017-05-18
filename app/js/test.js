var img = new Image;
var size = 100;
var iteration = 0;
var iterations = 100000;
var training = false;

//building a network
//start with input layer of 2 pixelcoordinates
var input = new synaptic.Layer(2);
//hidden layers
var hidden1 = new synaptic.Layer(15);
var hidden2 = new synaptic.Layer(15);
var hidden3 = new synaptic.Layer(15);
var hidden4 = new synaptic.Layer(15);
var hidden5 = new synaptic.Layer(15);
//output yields pixelvalue
var output = new synaptic.Layer(1);

//projections
input.project(hidden1);
hidden1.project(output);

//make the network
var network = new synaptic.Network({
	input: input,
	hidden: [hidden1],
	output: output
});

//load image into first canvas
img.onload = function(){
	var input = $("#input").get(0);
	input.getContext("2d").drawImage(img, 0, 0, img.width, img.height,	//img size
											0, 0, size, size);			//canvas size
}
//needs to image after onload ?
img.src = "../img/cat.jpg";

function stop(){
	training = false;
}

//Test with image
function start(){
	training = true;
	iteration = 0;

	//we want reference canvas, input
	var input = $("#input").get(0);
	//also need the pixels, but they need to be grayscale for simplicity
	var pixels = input.getContext("2d").getImageData(0, 0, size, size).data;

	//we want canvas for output
	var output = $("#output").get(0);
	//need context in order to draw image on canvas
	var ctx = output.getContext("2d");

	var p = new synaptic.Architect.Perceptron(2, 15, 1);

	//all functions
	var train = function(){
		preview();
	}

	var iterate = function(){
		for(var x = 0; x < size; x ++){
			for(var y = 0; y < size; y ++){
				var dynamicRate =  .01/(1+.0005*iteration);
				network.activate([x/size, y/size]);
				//p.activate([x/size, y/size]);
				//p.propagate(dynamicRate, [avgImg[(x * size) + y]/255]);
				network.propagate(dynamicRate, [avgImg[(x * size) + y]/255]);
				//network.propagate(dynamicRate, [150/255]);
			}
		}
		$("#counter").html(++iteration);
		if(training) training = (iteration < iterations) ? true : false;
		preview();
	}

	var preview = function(){
		var imgData = ctx.getImageData(0, 0, size, size);
		var t = 0;
		for(var x = 0; x < size; x ++){
			for(var y = 0; y < size; y ++){
				var pixel = network.activate([x/size, y/size]);
				//var pixel = p.activate([x/size, y/size]);
				//imgData.data[((size * y) + x) * 4] = pixel * 255;
				//imgData.data[((size * y) + x) * 4 + 1] = pixel * 255;
				//imgData.data[((size * y) + x) * 4 + 2] = pixel * 255;
				//imgData.data[((size * y) + x) * 4 + 3] = 255;

				imgData.data[t + 0] = pixel * 255;	//r
				imgData.data[t + 1] = pixel * 255;	//g
				imgData.data[t + 2] = pixel * 255;	//b
				imgData.data[t + 3] = 255;			//a

				t += 4;
			}
		}
		ctx.putImageData(imgData, 0, 0);
		if(training){
			window.requestAnimationFrame(iterate);
		}
		
	}

	var grayscale = function(pixels){
		var avgImg = [];
		var t = 0;
		for(var i = 0; i < size * size; i ++){
			var r = pixels[t];
			var g = pixels[1 + t];
			var b = pixels[2 + t];

			var avg = (r + g + b) / 3;

			t += 4;

			avgImg.push(avg);
		}
		return avgImg;
	}

	var avgImg = grayscale(pixels);

	//Lastly start training
	train();
}
