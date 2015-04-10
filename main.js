



// Server defined globals 
var EWRatio = 3; 			// { "small": 1.33, "medium": 2, "large": 3 };
var cursorType = "Bubble"; 	//{ "Point":"Point", "Bubble":"Bubble" }
var amplitude = 512; 		// 256, 512, 768;
var distractDensity = 1;	// between 0 and 1
var width = 16; 			// 8, 16, 32


// client defined globals
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
var density;
var points = [];


var initializeExperiment = function(){
	c = document.getElementById("experiment");
	ctx=c.getContext("2d");
	radius = width/2;
	mod = width*EWRatio+radius;
	offset = mod+width;
	mainTarget = {"x":c.width/2, "y":c.height/2};
	addTarget(mainTarget, radius, "green");
	b = document.getElementById("bubble");
	b_ctx=b.getContext("2d");
};


var randomize = function(){
	points = [];
	ctx.clearRect(0,0,c.width,c.height);
	mainTarget = getNextPosition(mainTarget);
	addTarget(mainTarget, radius, "green");
	calculateVector();
	randomDistractors();
	addIntermediates();

};

var getNextPosition = function(last, deg){
	var deltaRad = typeof deg !== "undefined" ? deg : getRandomDim(Math.PI*2);
	var target = { "x": Math.round(amplitude*Math.cos(deltaRad)+ last.x), 
					"y": Math.round(amplitude*Math.sin(deltaRad)+ last.y) };
	if(target.x > radius && target.x < c.width-radius && target.y > radius && target.y < c.height-radius){
		return target;
	} else {
		return getNextPosition(last, deltaRad+Math.PI/180);
	};
	
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
	if(color == "green"){
		ctx.fillStyle = color;
		ctx.fill();		
	} else {
		ctx.lineWidth = radius/4;
		ctx.strokeStyle = color;
		ctx.stroke();
	}

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
	amplitude = getDistance(mousePoint, mainTarget);
	slope = getSlope(mousePoint, mainTarget);
};

var is_in_triangle = function(test, a, b, c){

	//credit: http://www.blackpawn.com/texts/pointinpoly/default.html

	var v0 = [c.x-a.x,c.y-a.y];
	var v1 = [b.x-a.x,b.y-a.y];
	var v2 = [test.x-a.x,test.y-a.y];

	var dot00 = (v0[0]*v0[0]) + (v0[1]*v0[1]);
	var dot01 = (v0[0]*v1[0]) + (v0[1]*v1[1]);
	var dot02 = (v0[0]*v2[0]) + (v0[1]*v2[1]);
	var dot11 = (v1[0]*v1[0]) + (v1[1]*v1[1]);
	var dot12 = (v1[0]*v2[0]) + (v1[1]*v2[1]);

	var invDenom = 1/ (dot00 * dot11 - dot01 * dot01);

	var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
	var v = (dot00 * dot12 - dot01 * dot02) * invDenom;

	return ((u >= 0) && (v >= 0) && (u + v < 1));
};

var is_in_circle = function(test, center, radius){
	return (getDistance(test, center)<radius);
};

var is_overlaping = function(center1, center2, radius){
	return (getDistance(center1, center2)<2*radius);
}


var addIntermediates = function(){
	var angle_bisect_len = amplitude-mod-radius;
	var num_intermediates = Math.floor(angle_bisect_len/width)*distractDensity;
	var triangleMass = num_intermediates;
	var triangleVolume = -Math.pow(angle_bisect_len,2)*Math.tan(160);
	var len_between_inter = angle_bisect_len/(num_intermediates);
	var b_point;
	var c_point;
	density = triangleMass/triangleVolume;
	//console.log("Triangle Mass: ", triangleMass);
	//console.log("Triangle Volume: ", triangleVolume);
	//console.log("Triangle Density: ",density);
	for(var i = 1; i<=num_intermediates-1; i++){
		var pointDistance = len_between_inter*i;
		var adjacent_len = Math.tan(160)*pointDistance;
		var adjacent_len = getRandomDim(-2*adjacent_len)+adjacent_len;
		
		if(mainTarget.x > mouseX){
			var new_x = Math.round(pointDistance*Math.cos(slopeRad)+mouseX);
			var new_y = Math.round(pointDistance*Math.sin(slopeRad)+mouseY);
			
			var new_x = Math.round(adjacent_len*Math.cos(Math.PI/2+slopeRad)+new_x);
			var new_y = Math.round(adjacent_len*Math.sin(Math.PI/2+slopeRad)+new_y);


		} else {
			var new_x = Math.round(pointDistance*Math.cos(Math.PI+slopeRad)+mouseX);
			var new_y = Math.round(pointDistance*Math.sin(Math.PI+slopeRad)+mouseY);
			
			var new_x = Math.round(adjacent_len*Math.cos(3*Math.PI/2+slopeRad)+new_x);
			var new_y = Math.round(adjacent_len*Math.sin(3*Math.PI/2+slopeRad)+new_y);
		};
		var point = {"x": new_x,"y": new_y};
		addTarget(point,radius);
	};


	var adjacent_len = Math.tan(160)*angle_bisect_len;
	if(mainTarget.x > mouseX){
		var b_x = Math.round(adjacent_len*Math.cos(Math.PI/2+slopeRad)+farDistract.x);
		var b_y = Math.round(adjacent_len*Math.sin(Math.PI/2+slopeRad)+farDistract.y);
		var c_x = Math.round(-adjacent_len*Math.cos(Math.PI/2+slopeRad)+farDistract.x);
		var c_y = Math.round(-adjacent_len*Math.sin(Math.PI/2+slopeRad)+farDistract.y);

	} else {
		var b_x = Math.round(adjacent_len*Math.cos(3*Math.PI/2+slopeRad)+nearDistract.x);
		var b_y = Math.round(adjacent_len*Math.sin(3*Math.PI/2+slopeRad)+nearDistract.y);
		var c_x = Math.round(-adjacent_len*Math.cos(3*Math.PI/2+slopeRad)+nearDistract.x);
		var c_y = Math.round(-adjacent_len*Math.sin(3*Math.PI/2+slopeRad)+nearDistract.y);

	};
	b_point = {"x": b_x,"y": b_y};
	c_point = {"x": c_x,"y": c_y};

	var mass = density*c.width*c.height
	//console.log("volume: ",c.width*c.height);
	//console.log("mass: ",mass);

	

	for (var i = 0; i<= mass; i++){
		var overlap = false;
		var random_x = getRandomDim(c.width);
		var random_y = getRandomDim(c.height);
		var random_point = {"x": random_x, "y": random_y};
		if((!is_in_circle(random_point, mainTarget, mod+radius)) 
						&& (!is_in_triangle(random_point, mousePoint, b_point, c_point))) {
			for (var j = 0; j<points.length; j++){
				//console.log("j is: ",j)
				if(is_overlaping(points[j], random_point, radius)){
					overlap = true;
				};
			};
			if (!overlap){
				addTarget(random_point, radius);	
			};
			
		};
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

};

var sendData = function(){

};



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

        if(cursorType == "Bubble"){
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
	        	var bubble_color = "rgba(204, 255, 255, 0.8)"

	        	if(equal_spaced){
	        		b_ctx.clearRect(0,0,b.width,b.height);
	        	} else {
	        		_closest_point = closest_point;
	        		drawBubble(mousePoint, bubble_size, closest_point, radius*1.33, bubble_color);
	        	};
        	}, 100);	
        }
        

	});


	$("#bubble").click(function(e){
		var distance = getDistance(mousePoint, mainTarget);
		
		if(cursorType == "Bubble"){
			if (!equal_spaced && _closest_point == points[0]){
				console.log("success!");
				randomize();	
				timer = 0;
			} else {
				console.log("fail!");
			};
		} else {
			if(distance <= radius){
				console.log("success!");
				randomize();	
				timer = 0;
			} else {
				console.log("fail!");
			}
		};


	});


});