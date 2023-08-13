function cssGetId(id) {
	return document.getElementById(id);
}

function resizeCanvas() {
	let canvas = cssGetId('static');
	canvas.height = window.innerHeight * 0.8;
	canvas.width = window.innerWidth * 0.8;
}



let TVOn = false;
let TVAnimationDone = true;
let staticOn = true;
let opacity = 1;
let progress = 1;
let brightness = 1;
let frameFrequency = 30;

function turnTVOn() {
	let canvas = cssGetId('static');
	let context = canvas.getContext('2d');
	let width = canvas.width;
	let height = canvas.height;	
	
	if (!TVAnimationDone) return;
	TVOn = true;
	TVAnimationDone = false;
	
	staticLoop(canvas, context, width, height);
	
	let frames = Math.round(400 / frameFrequency);
	for (let i = 1; i <= frames; i++) {
		setTimeout(() => {
			progress = 1 - i / frames;
			brightness = 1 - i / frames;
		}, i * frameFrequency);
	}
}

function staticLoop(canvas, context, width, height) {
	context.clearRect(0, 0, width, height);
	
	drawStatic(context, width, height, opacity, brightness);
	drawBorders(context, width, height, progress);
	
	setTimeout(() => {
		if (!TVAnimationDone) window.requestAnimationFrame(() => staticLoop(canvas, context, width, height));
	}, frameFrequency );
}
function drawBorders(context, width, height, progress) {
	if (progress == 0) return;
	context.fillstyle = 'black';
	if (progress == 1) {
		context.fillRect(0, 0, width, height);
		return;
	}
	context.filter = 'blur(' + gaussianRandom(10, 4) + 'px)';
	
	let bound = height * progress / 2;
	let startY = random(50) + bound;
	
	drawWavyBox(context, 0, width, bound, false, 50 * (1 - progress), 3);
	drawWavyBox(context, height - bound, width, bound, true, 50 * (1 - progress), 3);
}
function random(variation) {
	return Math.random() * variation - variation / 2;
}
function drawWavyBox(context, y, width, height, wavyOnTop, amplitude, juts) {
	if (wavyOnTop) {
		context.beginPath();
		context.moveTo(-10, y);
		drawWavyLine(context, width, y, amplitude, juts);
		context.lineTo(width + 10, y + height);
		context.lineTo(-10, y + height);
		context.lineTo(-10, y);
		context.fill();
	} else {
		context.beginPath();
		context.moveTo(-10, y);
		context.lineTo(-10, y + height);
		drawWavyLine(context, width, y + height, amplitude, juts);
		context.lineTo(width + 10, y);
		context.lineTo(-10, y);
		context.fill();
	}
}
function drawWavyLine(context, width, y, amplitude, juts) {
	let currX = -10;
	let currY = y;
	for (let i = 0; i < juts; i++) {
		let nextX = i / juts * width;
		let nextY = random(amplitude) + currY;
		let c1 = Math.random();
		let c2 = Math.random();
		
		context.bezierCurveTo(c1 * currX + (1 - c1) * nextX, currY,
							c2 * currX + (1 - c2) * nextX, nextY,
							nextX,
							nextY);
		currX = nextX;
		currY = nextY;
	}
	context.lineTo(width + 10, y);
}


// https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
function gaussianRandom(mean, stdev) {
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

function drawStatic(context, width, height, opacity, brightness) {
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
	context.globalAlpha = gaussianRandom(opacity / 2, 0.01);
	offsetY = gaussianRandom(-0.2, 0.2) * height;
	context.drawImage(staticWave, 0, offsetY, width, width * staticWave.height / staticWave.width);
	
	// Middle grey boxes
	context.globalAlpha = 1;
	context.globalCompositeOperation = "normal";
	let numBoxes = Math.round(Math.random() * 1) + 2;
	for (let i = 0; i < numBoxes; i++) {
		let boxHeight = Math.round(gaussianRandom(boxHeights[i], 0.1) * height);
		rotation = (Math.round(gaussianRandom(0.5, 0.25) * 2) - 1) * Math.PI / 180;
		offsetY = Math.round(gaussianRandom(boxOffsetYMeans[i], boxOffsetYStds[i]) * 1.5 * height - boxHeight);
		
		let color = Math.round(Math.random() * 122 + 123);
		context.filter = 'blur(' + gaussianRandom(5, 2) + 'px)';
		context.rotate(rotation);
		context.fillStyle = "rgba(" + color + ", " + color + ", " + color + ", " + gaussianRandom(opacity / 2, 0.1) + ")";
		
		context.fillRect(-10, offsetY, width + 20, boxHeight);
		context.rotate(-rotation);
	}
	
	// Gradient boxes
	for (let i = 0; i < 2; i++) {
		offsetY = Math.round(gaussianRandom(i == 0 ? 0.7 : 0.2, 0.05) * height);
		boxHeight = Math.round(gaussianRandom(i == 0 ? 0.1 : 0.15, 0.05) * height);
		let gradient = context.createLinearGradient(0, offsetY, 0, offsetY + boxHeight);
		if (i == 0) {
			gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
			gradient.addColorStop(1, 'rgba(255, 255, 255, ' + opacity / 1.5 + ')');
		} else {
			gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
			gradient.addColorStop(1, 'rgba(0, 0, 0, ' + opacity / 1.5 + ')');
		}
		context.fillStyle = gradient;
		//context.fillRect(-10, offsetY, width + 20, boxHeight);
		
		drawWavyBox(context, offsetY, width + 20, boxHeight, false, 10, 5);
	}
	// Brightness box
	context.fillStyle = 'rgba(255, 255, 255, ' + brightness + ')';
	context.fillRect(0, 0, width, height);
	
	// Bottom black box
	blackBoxOffsetY = Math.round(gaussianRandom(0.1 * (1 - opacity) + 0.9, opacity * 0.03) * height);
	boxHeight = height - offsetY;
	context.filter = 'blur(1px)';
	context.fillStyle = 'rgb(0, 0, 0)';
	context.fillRect(-2, blackBoxOffsetY, width + 4, boxHeight);
}

function turnTVOff() {
	if (!TVOn || !staticOn) return;
	TVOn = false;
	let frames = Math.round(400 / frameFrequency);
	for (let i = 1; i <= frames; i++) {
		setTimeout(() => {
			progress = (i / frames) ** 2;
			brightness = (i / frames) ** 0.5;
		}, i * frameFrequency);
	}
	setTimeout(() => {
		TVAnimationDone = true;
	}, (frames + 1) * frameFrequency)
}


function turnStaticOff() {
	if (!TVOn || !staticOn) return;
	staticOn = false;
	let frames = Math.round(400 / frameFrequency);
	for (let i = 1; i <= frames; i++) {
		setTimeout(() => {
			opacity = 1 - i / frames;
		}, i * frameFrequency);
	}
}

function turnStaticOn() {
	if (!TVOn || staticOn) return;
	staticOn = true;
	let frames = Math.round(400 / frameFrequency);
	for (let i = 1; i <= frames; i++) {
		setTimeout(() => {
			opacity = i / frames;
		}, i * frameFrequency);
	}
}