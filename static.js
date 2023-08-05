function cssGetId(id) {
	return document.getElementById(id);
}

function resizeCanvas() {
	let canvas = cssGetId('static');
	canvas.height = window.innerHeight * 0.8;
	canvas.width = window.innerWidth * 0.8;
	
	canvas = cssGetId('static_top');
	canvas.height = window.innerHeight * 0.8;
	canvas.width = window.innerWidth * 0.8;
}





function static1() {
	let canvas = cssGetId('static');
	let context = canvas.getContext('2d');
	let width = canvas.width;
	let height = canvas.height;
	
	context.clearRect(0, 0, width, height);
	draw(context, width, height, 0.5);
}


function draw(context, width, height, opacity) {
	context.clearRect(0, 0, width, height);
	
	drawStatic(opacity);
	/*
	context.fillStyle = 'rgba(255, 255, 255, ' + whiteness + ')';
	context.fillRect(0, 0, width, height)
	whiteness = Math.min(0.9, whiteness + 0.1);
	*/
	setTimeout(() => {
		window.requestAnimationFrame(() => draw(context, width, height, opacity));
	}, 40);
	
	// White Gradient that just goes down
	
	// Big light transparent noise bar that goes up quickly
}


// https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
function gaussian_random(mean, stdev) {
    const u = 1 - Math.random();
    const v = Math.random();
    const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    return z * stdev + mean;
}

const noise1 = new Image(); noise1.src = "assets/noise1.png";
const noise2 = new Image(); noise2.src = "assets/noise2.png";
const staticWave = new Image(); staticWave.src = "assets/static_wave.png";

const boxHeights = [0.02, 0.05, 0.12];
const boxOffsetYMeans = [0.1, 0.4, 0.3];
const boxOffsetYStds = [0.03, 0.006, 0.04];

function drawStatic(opacity) {
	let canvas = cssGetId('static');
	let context = canvas.getContext('2d');
	let width = canvas.width;
	let height = canvas.height;
	
	// Base Noise
	context.globalCompositeOperation = "overlay";
    context.globalAlpha = opacity;
	context.filter = 'none';
	
	let offsetX = 0;
	let offsetY = 0;
	let rotation = 90 * Math.round(Math.random() * 4);
	let flip = Math.round(Math.random()) > 0.5;
	let noise = Math.round(Math.random()) > 0.5 ? noise1 : noise2;
	let size = noise.height;
	
	while (offsetX < width) {
		while (offsetY < height) {
			context.save();
			context.translate(offsetX, offsetY);
			context.scale(flip ? -1 : 1, 1);
			context.rotate(rotation * Math.PI / 180);
			
			let x = 0;
			let y = 0;
			if (rotation % 360 == 0 && flip)	x = -size;
			else if (rotation == 90) {
				y = -size;
				if (flip)	y = 0;
			} else if (rotation == 180) {
				x = -size;
				y = -size;
				if (flip) 	x = 0;
			} else if (rotation == 270) {
				x = -size;
				if (flip) 	y = -size;
			}
			
			context.drawImage(noise, x, y, size, size);
			context.restore();
			offsetY += size;
		}
		offsetX += size;
		offsetY = 0;
	}
	
	// Wavy static
	context.globalCompositeOperation = "darken";
	context.globalAlpha = gaussian_random(opacity / 2, 0.01);
	offsetY = gaussian_random(-0.2, 0.2) * height;
	context.drawImage(staticWave, 0, offsetY, width, width * staticWave.height / staticWave.width);
	
	// Middle grey boxes
	context.globalAlpha = 1;
	context.globalCompositeOperation = "normal";
	let numBoxes = Math.round(Math.random() * 1) + 2;
	for (let i = 0; i < numBoxes; i++) {
		let boxHeight = Math.round(gaussian_random(boxHeights[i], 0.1) * height);
		rotation = (Math.round(gaussian_random(0.5, 0.25) * 2) - 1) * Math.PI / 180;
		offsetY = Math.round(gaussian_random(boxOffsetYMeans[i], boxOffsetYStds[i]) * 1.5 * height - boxHeight);
		
		let color = Math.round(Math.random() * 122 + 123);
		context.filter = 'blur(' + gaussian_random(5, 2) + 'px)';
		context.rotate(rotation);
		context.fillStyle = "rgba(" + color + ", " + color + ", " + color + ", " + gaussian_random(opacity / 2, 0.1) + ")";
		context.fillRect(-10, offsetY, width + 20, boxHeight);
		context.rotate(-rotation);
	}
	
	// Gradient boxes
	for (let i = 0; i < 2; i++) {
		offsetY = Math.round(gaussian_random(i == 0 ? 0.7 : 0.2, 0.05) * height);
		boxHeight = Math.round(gaussian_random(i == 0 ? 0.1 : 0.15, 0.05) * height);
		let gradient = context.createLinearGradient(0, offsetY, 0, offsetY + boxHeight);
		if (i == 0) {
			gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
			gradient.addColorStop(1, 'rgba(255, 255, 255, ' + opacity / 1.5 + ')');
		} else {
			gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
			gradient.addColorStop(1, 'rgba(0, 0, 0, ' + opacity / 1.5 + ')');
		}
		context.fillStyle = gradient;
		context.fillRect(-10, offsetY, width + 20, boxHeight);
	}
	
	// Bottom black box
	let blackBoxOffsetY = Math.round(gaussian_random(0.1 * (1 - opacity) + 0.9, opacity * 0.03) * height);
	boxHeight = height - offsetY;
	context.filter = 'blur(1px)';
	context.fillStyle = 'rgb(0, 0, 0)';
	context.fillRect(-2, blackBoxOffsetY, width + 4, boxHeight);
}



function static2() {
	
}