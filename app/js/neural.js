//new perceptron
var percept = new synaptic.Architect.Perceptron(2, 10, 2);

var s = 500;

var mPos = {x: 50, y: 50};
var running = false;
var radius = 6;
var circlePos;
var drawnCircles = [];

//get canvas context
var canvas = $("#nn").get(0);
var context = canvas.getContext("2d");
//circle object that vill be put on canvas
//var circle = {x: mPos.x, y: mPos.y, radius: 10, start: 0, end: 2*Math.PI};
var circles = [];
for(var i = 0; i < 5; i ++){
	circles.push({x: mPos.x, y: mPos.y, radius: radius - i, start: 0, end: 2*Math.PI})
}
var rect = canvas.getBoundingClientRect();


function go(){
	running = true;
	run();
}

function run(){
	//empty canvas
	context.clearRect(0, 0, canvas.width, canvas.height);
	
	var rate = .05;
	
	for(var i = 0; i < circles.length; i ++){
		//activate
		percept.activate([circles[i].x/s, circles[i].y/s]);
		//propagate with mousepos
		percept.propagate(rate * (i+1), [mPos.x/s,  mPos.y/s]);			

		draw(circles[i]);			
	}
	//this draws stamped circles but no works why i dunno
	for(var i = 0; i < drawnCircles.length; i ++){
		context.beginPath();
		context.arc(drawnCircles[i].x, drawnCircles[i].y, drawnCircles[i].radius, drawnCircles[i].start, drawnCircles[i].end);
		context.stroke();
	}

	if(running) window.requestAnimationFrame(run);
}
function getMousepos(e){
	mPos = {x: ((e.clientX - rect.left) < 0 ? 0 : (e.clientX - rect.left)), 
				y: ((e.clientY - rect.top) < 0 ? 0 : (e.clientY - rect.top))};
}

$("#nn").on('click',function(){
	drawnCircles.push(circles[0]);
});

function draw(circle){

	//get new coordinates for circle
	var c = percept.activate([circle.x/s, circle.y/s]);
	circle.x = c[0]*s;
	circle.y = c[1]*s;
	//this paints the circle
	context.beginPath();
	context.arc(circle.x, circle.y, circle.radius, circle.start, circle.end);
	context.stroke();
}
