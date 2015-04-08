




var EWRatio = { "small": 1.33, "medium": 2, "large": 3 };
var cursorType = { "Point":"Point", "Bubble":"Bubble" };
var amplitude;
var distractDensity = 1;
var width;
var radius;
var mainTarget;
var mouseX;
var mouseY;
var mod;
var slope;
var slopeRad;
var mousePoint;
var nearDistract;
var farDistract;
var leftDistract;
var rightDistract;
var distance;

var points = [];


var initializeExperiment = function(){
	c = document.getElementById("experiment");
	ctx=c.getContext("2d");

	width = 16;
	radius = width/2;
	mod = width*EWRatio.small+width;
	mainTarget = {"x":c.width/2, "y":c.height/2};
	addTarget(mainTarget, radius, "green");
	//initialDistractors();
	//addDistractors(nearDistract, farDistract, leftDistract, rightDistract);

};


var randomize = function(){
	points = [];
	ctx.clearRect(0,0,c.width,c.height);
	offset = mod+width;
	mainTarget = { "x": Math.round(getRandomDim(c.width-offset*2, offset)), 
					"y": Math.round(getRandomDim(c.height-offset*2, offset)) };
	addTarget(mainTarget, radius, "green");
	calculateVector();
	randomDistractors();
	addIntermediates();


};


var getRandomDim = function(to, from){
	from = typeof from !== "undefined" ? from : 0;
	value = Math.floor(Math.random() * to) + from;

	return value;
};


var addTarget = function(point, radius, color){
	color = typeof color !== "undefined" ? color : "grey";
	ctx.beginPath();
	ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
	ctx.fillStyle = color;
	ctx.fill();
	ctx.closePath();
	points.push(point);

};

var initialDistractors = function(){
	nearDistract = {"x":mainTarget.x+mod, "y":mainTarget.y};
	farDistract = {"x": mainTarget.x, "y": mainTarget.y+mod};
	leftDistract = {"x": mainTarget.x-mod, "y": mainTarget.y};
	rightDistract = { "x": mainTarget.x, "y": mainTarget.y-mod};
};

var randomDistractors = function(){

	slopeRad = Math.atan(slope);
	nearDistract = {"x": Math.round(mod*Math.cos(slopeRad)+ mainTarget.x), 
					"y": Math.round(mod*Math.sin(slopeRad)+ mainTarget.y)};
	farDistract = {"x": Math.round(mod*Math.cos(Math.PI+slopeRad)+ mainTarget.x), 
					"y": Math.round(mod*Math.sin(Math.PI+slopeRad)+ mainTarget.y)};
	
	leftDistract = {"x": Math.round(mod*Math.cos(Math.PI/2+slopeRad)+ mainTarget.x),
					"y": Math.round(mod*Math.sin(Math.PI/2+slopeRad)+ mainTarget.y)};	

	rightDistract = {"x": Math.round(mod*Math.cos((3*Math.PI)/2+slopeRad)+ mainTarget.x), 
					"y": Math.round(mod*Math.sin((3*Math.PI)/2+slopeRad)+ mainTarget.y)};


	addDistractors(nearDistract, farDistract, leftDistract, rightDistract);

};



var addDistractors = function(near, far, left, right){
	addTarget(near, radius);
	addTarget(far, radius);
	addTarget(left, radius);
	addTarget(right, radius);

};

var distance = function(point1, point2){
	var rise = point1.y - point2.y;
	var run = point1.x - point2.x;
	var slope = rise/run;
	var distance = Math.sqrt(Math.pow(rise,2)+Math.pow(run,2));
	return [distance, slope];
}


var calculateVector = function(){
	var newvalue = distance(mousePoint, mainTarget);
	distance = newvalue[0];
	slope = newvalue[1];

	//draw line
	/*
	ctx.beginPath();
	ctx.moveTo(mouseX,mouseY);
	ctx.lineTo(mainTarget.x, mainTarget.y);
	ctx.stroke();

	// draw circle
	ctx.beginPath()
	ctx.arc(mainTarget.x, mainTarget.y, mod, 0, 2*Math.PI);
	ctx.stroke();
	*/

};




var addIntermediates = function(){
	/*
	console.log("width: ",c.width);
	console.log("height: ",c.height);
	console.log("distract: ", distractDensity);
	*/
	//console.log("distance: ",distance);
	var angle_bisect_len = distance-mod-radius;
	var num_intermediates = Math.floor(angle_bisect_len/width)*distractDensity;
	var len_between_inter = angle_bisect_len/(num_intermediates);
	//console.log("slope: ",slope);
	//console.log("slopeRad: ",slopeRad);
	
	var adjacentRad = Math.atan(10);
	var TOA = Math.tan(20);
	for(var i = 1; i<=num_intermediates-1; i++){
		var pointDistance = len_between_inter*i;
		var adjacent_len = TOA*pointDistance;
		var adjacent_len = getRandomDim(adjacent_len);
		var mu = Math.atan(adjacent_len/pointDistance);
		var new_len = adjacent_len/Math.sin(mu);


		if(mainTarget.x > mouseX){
			//var new_x = new_len*Math.cos(slopeRad+mu)+mouseX
			//var new_y = new_len*Math.sin(slopeRad+mu)+mouseY
			var new_x = Math.round(pointDistance*Math.cos(slopeRad)+mouseX);
			var new_y = Math.round(pointDistance*Math.sin(slopeRad)+mouseY);
			//var adjusted_x = new_len*Math.cos(Math.PI/2+slopeRad)+new_x;
			//var adjusted_y = new_len*Math.sin(Math.PI/2+slopeRad)+new_y;
		} else {
			//var new_x = new_len*Math.cos(Math.PI+slopeRad+mu)+mouseX
			//var new_y = new_len*Math.sin(Math.PI+slopeRad+mu)+mouseY
			var new_x = Math.round(pointDistance*Math.cos(Math.PI+slopeRad)+mouseX);
			var new_y = Math.round(pointDistance*Math.sin(Math.PI+slopeRad)+mouseY);
			//var adjusted_x = adjacent_len*Math.cos(3*Math.PI/2+slopeRad)+new_x;
			//var adjusted_y = adjacent_len*Math.sin(3*Math.PI/2+slopeRad)+new_y;
		};
		var point = {"x": new_x,"y": new_y};
		console.log(points);
		
		//console.log(adjacent_len);
		//console.log(Math.atan(adjacent_len/pointDistance));


		//adjusted_point = {"x": adjusted_x,"y": adjusted_y};

		addTarget(point,radius);
	};




	//var slice_x = Math.floor(c.width/distractDensity);
	//var slice_y = Math.floor(c.height/distractDensity);
	//console.log("slice_x: ", slice_x);
	//console.log("slice_y: ", slice_y);
	/**
	for (var i = 0; i < slice_x; i++){
		for(var j = 0; j < slice_y; j++){
			var randomPoint = {"x": getRandomDim(i*c.width-offset*2, offset), 
								"y":getRandomDim(j*c.height-offset*2, offset)};
			console.log("randomPoint: ",randomPoint);
			addTarget(randomPoint, radius);

		};
	};
	*/


};


$(document).ready(function() {

	var timer = 0;

	initializeExperiment();
	var parentOffset = $("#experiment").offset();


	$("#experiment").mousemove(function(e){
    	e.preventDefault();
        mouseX = e.pageX - parentOffset.left;
        mouseY = e.pageY - parentOffset.top;
        mousePoint = {"x": mouseX, "y": mouseY};


        setInterval(function(){
        	var closest_point;
        	var next_point;
        	for(var i = 0; i<points.length; i++){
        		var bubble_distance;
        		if (points[i]){
        			var oops;
        		};
        	}

        }, 100) // set to 30-50 for production

	});


	$("#experiment").click(function(e){
		var rise = mainTarget.y - mouseY;
		var run = mainTarget.x - mouseX;
		var distance = Math.sqrt(rise*rise+run*run);
		/**
		console.log(mouseX+","+mouseY);
		console.log("mainTarget: ", mainTarget)
		console.log("mouseX: ", mouseX);
		console.log("mouseY: ", mouseY);
		console.log("rise: ",rise);
		console.log("run: ",run);
		console.log("distance: ",distance);
		*/


		if(distance <= radius){
			console.log("success!");
			randomize();	
			timer = 0;
		} else {
			console.log("fail!");
		}
		//
	});


});