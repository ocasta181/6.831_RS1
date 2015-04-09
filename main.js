




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

	width = 32;
	radius = width/2;
	mod = width*EWRatio.large+width;
	mainTarget = {"x":c.width/2, "y":c.height/2};
	addTarget(mainTarget, radius, "green");
	b = document.getElementById("bubble");
	b_ctx=b.getContext("2d");
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

var getDistance = function(point1, point2){
	var rise = point1.y - point2.y;
	var run = point1.x - point2.x;
	var distance = Math.sqrt(Math.pow(rise,2)+Math.pow(run,2));
	return distance;
}

var getSlope = function(point1, point2){
	var rise = point1.y - point2.y;
	var run = point1.x - point2.x;
	var slope = rise/run;
	return slope;
}



var calculateVector = function(){
	distance = getDistance(mousePoint, mainTarget);
	slope = getSlope(mousePoint, mainTarget);
};




var addIntermediates = function(){

	var angle_bisect_len = distance-mod-radius;
	var num_intermediates = Math.floor(angle_bisect_len/width)*distractDensity;
	var len_between_inter = angle_bisect_len/(num_intermediates);
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

};


var drawBubble = function(point1, radius1, point2, radius2, color){
	b_ctx.clearRect(0,0,b.width,b.height);
	b_ctx.beginPath();
	b_ctx.arc(point1.x, point1.y, radius1, 0, 2 * Math.PI);
	b_ctx.arc(point2.x, point2.y, radius2, 0, 2 * Math.PI);
	b_ctx.fillStyle = color;
	b_ctx.fill();
	b_ctx.closePath();

	

}


$(document).ready(function() {

	var timer = 0;

	initializeExperiment();
	var parentOffset = $("#experiment").offset();
	var equal_spaced;
	var _closest_point;

	$("#bubble").mousemove(function(e){
    	e.preventDefault();
        mouseX = e.pageX - parentOffset.left;
        mouseY = e.pageY - parentOffset.top;
        mousePoint = {"x": mouseX, "y": mouseY};


        setInterval(function(){
        	var closest_point;
        	var next_point;
        	var closest_distance;
        	var next_distance;
        	for(var i = 0; i<points.length; i++){
        		var this_distance = getDistance(mousePoint, points[i]);
        		if (typeof closest_point == "undefined"){
        			closest_point = points[i];
        			closest_distance = this_distance;
        		} else if (this_distance <= closest_distance) {
        			next_point = closest_point;
        			next_distance = closest_distance;
        			closest_point = points[i];
        			closest_distance = this_distance;
        		} else if (typeof next_point == "undefined"){
        			next_point = points[i];
        			next_distance = this_distance;
        		} else if (this_distance <= next_distance){
        				next_point = points[i];
        				next_distance = this_distance; 
        		};
        	};
        	
        	var bubble_size = next_distance-radius;
        	equal_spaced = next_distance == closest_distance;
        	bubble_color = "rgba(204, 255, 255, 0.8)"

        	if(equal_spaced){
        		b_ctx.clearRect(0,0,b.width,b.height);
        	} else {
        		_closest_point = closest_point;
        		drawBubble(mousePoint, bubble_size, closest_point, radius*1.33, bubble_color);
        	};
        	


        }, 100);

	});


	$("#bubble").click(function(e){
		var distance = getDistance(mousePoint, mainTarget);
		
		if (!equal_spaced && _closest_point == points[0]){

			console.log("success!");
			randomize();	
			timer = 0;
		} else {
			console.log("fail!");
		}

	});


});