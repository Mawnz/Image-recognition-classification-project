//activation function for later
var activation = function(val){
	return val/2;
}

//--Building network--

//create layers
var A = new synaptic.Layer(5);
var B = new synaptic.Layer(3);

A.project(B);

//Training

//Learning rate
var learningRate = .3;

for(var i = 0; i < 20000; i ++){
	//When A activates "activation"
	A.activate([1, 0, 2, 0, 1]);

	//train B to activate 0
	B.activate();
	B.propagate(learningRate, [1, 5, 1]);
}

//testing
console.log(A.activate([1, 0, 2, 0, 1]));
console.log(B.activate());