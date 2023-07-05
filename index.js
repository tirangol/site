/********************************************************
 Background Zoom
 ********************************************************/
let zoomFactor = 0.05;
let cursorX = 0;
let cursorY = 0;
const cZoom = [0.5, 0.44, 0.37, 1, 0.8, 0.9, 1, 0.8, 0.8, 0.3, 0.65, 0.6, 0.2];

function handleMouseMove(event) {
    cursorX = event.clientX;
    cursorY = event.clientY;
	
	if (currScreen == -1) {
		scaleMainMenuBackground();
	} else if (currScreen == 2) {
		rotateAlbum();
	}
}

function cssGetId(id) {
	return document.getElementById(id);
}

function cssSetId(id, property, value) {
    cssGetId(id).style.setProperty(property, value);
}

function scaleMainMenuBackground() {
    let zoom1 = zoomFactor * (screen.width - cursorX) / screen.width;
	let zoom2 = 1200 * zoomFactor * cursorY / screen.height;
	
	function formatValue1(i) {
        let c = cZoom[i] * zoom1 + 1;
        if (i == 4) {
            c = cZoom[i] * zoom1 * 0.75 + 1;
        }
            
        let value = "scale(" + c + ", " + c + ")";
        return value;
    }
    function formatValue2(i) {
        let c = cZoom[i] * zoom2 + 50;
        if (i == 4) {
            c = cZoom[i] * zoom2 * 0.5 + 75;
        }
        return "50% " + c + "%";
    }

    for (let i = 0; i < 13; i++) {
        cssSetId("c" + (i + 1), "transform", formatValue1(i));
        cssSetId("c" + (i + 1), "background-position", formatValue2(i));
    }
}

let rotateFactor = 0.01;
function rotateAlbum() {	
	let album = cssGetId('album_classical_compositions_solo');
	let albumRect = album.getBoundingClientRect();
	let albumX = 0.5 * (albumRect.left + albumRect.right);
	let albumY = 0.5 * (albumRect.top + albumRect.bottom);
	let diffX = Math.min(Math.max(-rotateFactor * (cursorX - albumX), -10), 10);
	let diffY = Math.min(Math.max(rotateFactor * (cursorY - albumY), -10), 10);
	let transform = 'rotateX(' + diffY + 'deg) rotateY(' + diffX + 'deg)';
	album.style.setProperty('transform', transform);
	cssSetId('album_section_title', 'transform-origin', albumX + 'px ' + albumY + 'px');
	cssSetId('album_section_title', 'transform', transform);
	
}

function findCss(queryProperty) {
	return document.querySelector(queryProperty);
}

/********************************************************
 Background Resizing
 ********************************************************/
let resolution = "low";
function backgroundResize() {
    // low: 1441 x 810
    // med: 1920 x 1080
    // high: 3840 x 2160
    function updateImage(size) {
        for (i = 1; i < 15; i++) {
            let property = "background-image";
            let value = "url(\"assets/" + size + "_resolution/c" + i + ".png\")";
            cssSetId("c" + i, property, value);
        }
    }
    let width = window.innerWidth;
    if (width <= 1920 && resolution != "low") {
        updateImage("low");
        resolution = "low";
    } else if (width < 3000 && resolution != "med") {
        updateImage("med");
        resolution = "med";
    } else if (resolution != "high") {
        updateImage("high");
        resolution = "high";
    }
}
window.addEventListener('resize', backgroundResize);
window.addEventListener('resize', updateBackgroundSize);


/********************************************************
 Particle Drawing
 ********************************************************/
const p1 = new Image(); p1.src = "assets/particles/p1.png";
const p2 = new Image(); p2.src = "assets/particles/p2.png";
const p3 = new Image(); p3.src = "assets/particles/p3.png";
const p4 = new Image(); p4.src = "assets/particles/p4.png";
const p5 = new Image(); p5.src = "assets/particles/p5.png";
const p6 = new Image(); p6.src = "assets/particles/p6.png";
const p7 = new Image(); p7.src = "assets/particles/p7.png";

let particleScale = [0.08, 0.15, 0.2, 0.04, 0.1, 0.2, 0.1];
let particleXOffset = [15, 10, -18, 25, 30, 10, 5];
let particleYOffset = [6, 5, 12, 15, 16, 8, 10];

function readParticleList(lst, p) {
    let i = p.src[p.src.length - 5];
    return lst[parseInt(i) - 1];
}
function getParticleScale(p) {
    return readParticleList(particleScale, p);
}
function getParticleXOffset(p) {
    return readParticleList(particleXOffset, p);
}
function getParticleYOffset(p) {
    return readParticleList(particleYOffset, p);
}
function drawImage(context, image, x, y, scale, opacity) {
    if (opacity <= 0)
        return;
	
    context.globalCompositeOperation = "lighter";
    context.globalAlpha = opacity;
    context.drawImage(image,
                      x + getParticleXOffset(image),
                      y + getParticleYOffset(image),
                      scale * getParticleScale(image) * image.width,
                      scale * getParticleScale(image) * image.height);
}


/********************************************************
 HTML Menu Select Canvas Animation
 ********************************************************/
function updateSelectAnimation() {
    let canvas = cssGetId("select_animation");
    let context = canvas.getContext("2d");
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawParticles(context);
    diff = 0;

    if (!doneAnimation) {
        setTimeout(() => {
            window.requestAnimationFrame(updateSelectAnimation);
        }, 1000 / fps);
    }
}

// Particle start/end information
let defaultStartX = 250;
let defaultStartY = 15;
let defaultEndX = 50;
let defaultEndY = 15;
let endXPositions = [60, 30, 60, 0, 30];

let fps = 30;
let maxIterations = 100;
let pauseAnimation = true; // Stop generating particles?
let doneAnimation = true;  // Have all particles finished their iteration?

let currSelect = 0; // Selected menu ID
let diff = 0;       // Difference in current selected menu ID from previous selected menu ID

function enterSelect(i) {
    diff = i - currSelect;
    currSelect = i;
    
    defaultStartY += diff * 42;
    defaultEndY += diff * 42;
    defaultEndX = endXPositions[i];
    
    pauseAnimation = false;
    if (doneAnimation) {
        doneAnimation = false;
        window.requestAnimationFrame(updateSelectAnimation);
    }
}
function leaveSelect() {
    pauseAnimation = true;
}


/********************************************************
 Particle Data
 ********************************************************/
particles = new Array();
for (let _ = 0; _ < 10; _++) {
    createParticle(p1);
    createParticle(p2);
    createParticle(p3);
    createParticle(p4);
    createParticle(p5);
    createParticle(p6);
    createParticle(p7);
}
function createParticle(p) {
    let map = new Map();
    map.clear();
    map.set('startX', 0);					// Starting X position
    map.set('startY', 0);					// Starting Y position
    map.set('startScale', 0);				// Starting scaled size
    map.set('endX', 0);						// Ending X position
    map.set('endY', 0);						// Ending Y position
    map.set('endScale', 0);					// Ending scaled size
    map.set('currX', 0);					// Current X position
    map.set('currY', 0);					// Current Y position
    map.set('currScale', 0);				// Current scaled size
    map.set('iterations', 0);				// Animation iterations
    map.set('currIteration', 0);			// Current iteration
    map.set('currOpacity', 0);				// Current opacity
    map.set('delay', 0);					// Delay before restarting the particle  iteration
    map.set('restartAnimation', false);		// Whether to restart the particle iteration
    map.set('image', p);					// Source image
    particles.push(map);
}
/* Main drawing function that generates a single animation rendering frame. */
function drawParticles(context) {
    // console.log(particles[0].get('currIteration') + " / " + particles[0].get('iterations') + ", " + particles[0].get('restartAnimation') + ", " + particles[0].get('delay'));
    let doneAnimationSoFar = true;
    for (i = 0; i < particles.length; i++) {
        let pInfo = particles[i];
        let particleFinished = updateParticleInfo(pInfo);
		
        if (!particleFinished) {
            doneAnimationSoFar = false;
            drawImage(context,
					  pInfo.get('image'),
					  pInfo.get('currX'),
					  pInfo.get('currY'),
					  pInfo.get('currScale'),
					  pInfo.get('currOpacity'));
        }
    }
    doneAnimation = doneAnimationSoFar;
}

/* Mathematically update a single particle's information. Return whether the animation is complete. */
function updateParticleInfo(pInfo) {
    // Finished iterating
	if (pInfo.get('currIteration') >= pInfo.get('iterations')) {
        resetParticleInfo(pInfo);
        return pauseAnimation;
		
	// Waiting to start iterating	
    } else if (pInfo.get('delay') > 0) {
        if (diff != 0)
            jumpParticleY(pInfo);
        if (!pauseAnimation)
            pInfo.set('delay', pInfo.get('delay') - 1);
        return pauseAnimation;
    }
	
	// Currently iterating
    let x = pInfo.get('currIteration') / pInfo.get('iterations');
    let i1 = 1 - Math.sqrt(x);
    let i2 = Math.sin((Math.PI / 2) * (x));
    let i3 = 0.3 * (x - 1) * (5 * x * (x - 1) ** 3 - 0.5);
    pInfo.set('currX',          (1 - x) * pInfo.get('startX') + x * pInfo.get('endX'));
    pInfo.set('currY',          i1 * pInfo.get('startY') + (1 - i1) * pInfo.get('endY'));
    pInfo.set('currOpacity',    i3);
    pInfo.set('currScale',      (1 - i2) * pInfo.get('startScale') + i2 * pInfo.get('endScale'));
    pInfo.set('currIteration',  pInfo.get('currIteration') + 1);
    return false;
}

function resetParticleInfo(pInfo) {
    if (!pauseAnimation) {
        let move = defaultStartX - defaultEndX;
        let rand = randomInteger(0, move * 0.6);
        pInfo.set('startX',         defaultStartX - rand);
        pInfo.set('endX',           defaultEndX + randomInteger(0, 50) + move * 0.6 - rand);
        pInfo.set('startY',         defaultStartY + randomInteger(-7, 3));
        pInfo.set('endY',           defaultEndY + randomInteger(2, 6));
        pInfo.set('startScale',     0.6 * Math.random() + 0.6);
        pInfo.set('endScale',       0.5 * Math.random() + 0.5);
        pInfo.set('currX',          pInfo.get('startX'));
        pInfo.set('currY',          pInfo.get('startY'));
        pInfo.set('currScale',      pInfo.get('startScale'));
        pInfo.set('iterations',     randomInteger(50, maxIterations) * fps / 100);
        pInfo.set('currIteration',  0);
			
        if (!pInfo.get('restartAnimation')) {
            pInfo.set('delay',            randomInteger(0, maxIterations - 25) * fps / 100);
            pInfo.set('restartAnimation', true);
        } else {
            pInfo.set('delay', 0);
        }
    } else {
        pInfo.set('restartAnimation', false);
    }
    pInfo.set('currOpacity', 0);
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function jumpParticleY(pInfo) {
    pInfo.set('startY', pInfo.get('startY') + diff * 42);
    pInfo.set('endY', pInfo.get('endY') + diff * 42);
    pInfo.set('currY', pInfo.get('startY') + diff * 42);
}

/********************************************************
 Select Menu
 ********************************************************/
function selectMenu(event, i) {
    cursorX = event.clientX;
    cursorY = event.clientY;

    let text = document.querySelector("#menu_block h1:nth-child(" + (i + 1) + ")");
    let position = text.getBoundingClientRect();
    let centerX = position.x + position.width / 2;
    let centerY = position.y + position.height / 2;
    let diffX = (cursorX - centerX) * 0.15;
    let diffY = (cursorY - centerY) * -2;
    
	// Instant deform
    text.style.transition = '0s';
    text.style.transform = 'rotateX(' + diffY + 'deg) rotateY(' + diffX + 'deg)';
	
	// Gradual reshape
    setTimeout(() => {
        text.style.transition = '0.5s';
        text.style.transform = 'initial';
    }, 100);
}

let currScreen = -1;	// Current menu
function goToMenu(i) {
	if (currScreen == i)
		return
    currScreen = i;
	if (i == -1)		goToOriginalMenu();
	else if (i == 0)	goToAboutMenu();
	else if (i == 1)	goToProjectsMenu();
	else if (i == 2)	goToMusicMenu();
	else if (i == 3)	goToResourcesMenu();
	else if (i == 4)	goToResumeMenu();
	updateBackgroundSize();
}

function goToOriginalMenu() {
	cssSetId('background', 'width', "100%");
    cssSetId('background', 'height', "100%");
    cssSetId('background', 'min-width', "1000px");
    cssSetId('background', 'right', "0%");
}

function goToAboutMenu() {
	cssSetId('tv', 'height', '65%');    cssSetId('tv_body', 'height', '65%');   cssSetId('tv_screen', 'height', '65%');
	cssSetId('tv', 'bottom', '27%');    cssSetId('tv_body', 'bottom', '27%');   cssSetId('tv_screen', 'bottom', '27%');
	cssSetId('tv', 'right', '120px');   cssSetId('tv_body', 'right', '120px');  cssSetId('tv_screen', 'right', '120px');
                                        cssSetId("tv_body", 'z-index', '6');    cssSetId("tv_screen", 'z-index', '6');
                                                                                cssSetId("tv_screen", 'filter', 'opacity(1)');
    cssSetId('stand', 'height', '55%');
	cssSetId('stand', 'bottom', '-25%');
	cssSetId('stand', 'right', '75px');
	cssSetId('room_zoom', 'transform', 'scale(1) translate(0)');
	
	cssSetId('background', 'transform', 'scale(0.35)');
	cssSetId('background', 'overflow', 'hidden');
	cssSetId('c15', 'display', 'none');
	cssSetId('music_block', 'display', 'none');
		
	setTimeout(() => {
		cssSetId('background', 'transition', '0s');
	}, 100);
}

function cssGetClass(className) {
	return document.getElementsByClassName(className);
}
function cssSetClass(className, property, value) {
	let elements = cssGetClass(className)
	for (let i = 0; i < elements.length; i++) {
		elements[i].style.setProperty(property, value);
	}
}

function updateBackgroundSize() {
	let windowWidth = Math.max(window.innerWidth, 1000);
	let windowHeight = Math.max(window.innerHeight, 600);
    
	if (currScreen == 0) {	
		cssSetId('about', 'width', 'calc(100% - ' + (0.65 * windowHeight + 500) + "px)");
        // cssSetId('about', 'width', (windowWidth - 1.5 * tvWidth - 75) + "px");
		
		let width = windowHeight * 1.3;
        let height = windowHeight * 1.05;
        let right = width * -0.155 + windowWidth * 0.08;
        let bottom = height * -0.01;
		cssSetId('background', 'width', width + "px");
        cssSetId('background', 'height', height + "px");
        cssSetId('background', 'min-width', "1px");
        cssSetId('background', 'right', right + "px");
        cssSetId('background', 'bottom', bottom + "px");
    } else if (currScreen == 1) {
		
	} else if (currScreen == 2) {
		let albumHeight = windowHeight * 0.8 - 300 * windowHeight / windowWidth + 100;
		albumHeight = Math.min(albumHeight, 700);
		cssSetId('album_holder', 'height', albumHeight + "px");
		cssSetId('album_holder', 'top', 0.6 * (windowHeight - albumHeight) + "px");
		cssSetId('album_descriptions', 'width', 'calc(100% - 245px - ' + albumHeight + 'px)');
		
		let h1 = findCss('#album_classical_compositions_solo h1');
		let h2 = findCss('#album_classical_compositions_solo h2');
		let h3 = findCss('#album_classical_compositions_solo h3');
		h1.style.setProperty('font-size', (albumHeight / 9.5) + "pt");
		h2.style.setProperty('font-size', (albumHeight / 14.25) + 'pt');
		h3.style.setProperty('font-size', (albumHeight / 24.43) + 'pt');
		h1.style.setProperty('right', (albumHeight / 20) + "px");
		h1.style.setProperty('bottom', (albumHeight / 30) + "px");
		h2.style.setProperty('right', (albumHeight / 3.3) + "px");
		h2.style.setProperty('bottom', (albumHeight / 7.5) + "px");
		h3.style.setProperty('right', (albumHeight / 1.9) + "px");
		h3.style.setProperty('bottom', (albumHeight / 5.9) + "px");
		
		let seal = findCss('#album_classical_compositions_solo span');
		seal.style.setProperty('top', (albumHeight / 20) + 'px');
		seal.style.setProperty('right', (albumHeight / 20) + 'px');
		seal.style.setProperty('width', (albumHeight / 15) + 'px');
		seal.style.setProperty('height', (albumHeight / 7.5) + 'px');
		
		cssSetId('album_section_title', 'font-size', albumHeight / 30 + 'pt');
		rotateAlbum();
	} else if (currScreen == 3) {
		
	} else if (currScreen == 4) {
		
	}
}

function goToProjectsMenu() {
	
}

function goToMusicMenu() {
	cssSetId('background', 'transform', 'translate(0, 150%)');
    cssSetId('c14', 'transform', 'translate(0%, 33.33%)');
	
	setTimeout(() => {
		cssSetId('c5', 'transition', '0.1s');
		cssSetId('c5', 'filter', 'opacity(0)');
	}, 500);
	setTimeout(() => {
		cssSetId('c5', 'display', 'none');
	}, 600);

}

function goToResourcesMenu() {
	
}

function goToResumeMenu() {
	
}


/* About

Languages:
- Python
- Java
- HTML/CSS
- Javascript
- C
- R
- Matlab
- SQL

Links: 
- Github
- Musescore
- Youtube

Image Sources: ...

*/
// About: zoom out, revealing current screen to be screen of TV of my current laptop
// Projects: glitchy thing
// Music: zoom up
// Resources: cloud up?
// Resume: no animation

// Font - Outfit