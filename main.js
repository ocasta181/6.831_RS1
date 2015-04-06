




var EWRatio = { "small": 1.33, "medium": 2, "large": 3 };
var cursorType = { "Point":"Point", "Bubble":"Bubble" };
var amplitude;
var width;
var mainTarget;
var mouseX;
var mouseY;

var initializeExperiment = function(){
	var c = document.getElementById("experiment");
	ctx=c.getContext("2d");

	width = 8;
	mainTarget = { "x":getRandomDim(c.width), "y":getRandomDim(c.height) };
	addTarget(mainTarget.x, mainTarget.y, width, "green");
	addDistractors();
	
	console.log(EWRatio.small)




};

var getRandomDim = function(to, from){
	from = typeof from !== "undefined" ? from : 0;

	return Math.floor(Math.random() * to) + from;

}

var addTarget = function(x, y, radius, color){
	color = typeof color !== "undefined" ? color : "grey";
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, 2 * Math.PI);
	ctx.fillStyle = color;
	ctx.fill();
	ctx.closePath();

};

var addDistractors = function(){
	var mod = width*EWRatio.small+2*width;
	addTarget(mainTarget.x+mod, mainTarget.y, width);
	addTarget(mainTarget.x, mainTarget.y+mod, width);
	addTarget(mainTarget.x-mod, mainTarget.y, width);
	addTarget(mainTarget.x, mainTarget.y-mod, width);

};

var addIntermediates = function(){

};



$(document).ready(function() {

	initializeExperiment();
	var parentOffset = $("#experiment").offset();


	$("#experiment").mousemove(function(e){
    	e.preventDefault();
        mouseX = e.pageX - parentOffset.left;
        mouseY = e.pageY - parentOffset.top;
	});



});