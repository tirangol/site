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
        if (i == 4)
            c = cZoom[i] * zoom1 * 0.75 + 1;
            
        let value = "scale(" + c + ", " + c + ")";
        return value;
    }
    function formatValue2(i) {
        let c = cZoom[i] * zoom2 + 50;
        if (i == 4)
            c = cZoom[i] * zoom2 * 0.5 + 75;
        
		return "50% " + c + "%";
    }

    for (let i = 0; i < 13; i++) {
        cssSetId("c" + (i + 1), "transform", formatValue1(i));
        cssSetId("c" + (i + 1), "background-position", formatValue2(i));
    }
}

let rotating = false;
let rotateFactor = 0.01;
let rotateDiffX;
let rotateDiffY;
function rotateAlbum() {	
	let album = cssGetId('album');
	/**
	let albumRect = album.getBoundingClientRect();
	let albumX = 0.5 * (albumRect.left + albumRect.right);
	let albumY = 0.5 * (albumRect.top + albumRect.bottom);
	**/
	let albumX = 0.5 * (150 + 500);
	let albumY = 0.5 * (0.2 * screen.height + 500);
	rotateDiffY = Math.min(Math.max(-rotateFactor * (cursorX - albumX), -10), 10);
	rotateDiffX = Math.min(Math.max(rotateFactor * (cursorY - albumY), -10), 10);
	
	if (rotating)	return;
	
	let transform = 'rotateX(' + rotateDiffX + 'deg) rotateY(' + rotateDiffY + 'deg)';
	album.style.setProperty('transform', transform);
	cssSetId('album_section_title', 'transform-origin', albumX + 'px ' + albumY + 'px');
	cssSetId('album_section_title', 'transform', transform);
}

function cssFind(queryProperty) {
	return document.querySelector(queryProperty);
}
function cssFindAll(queryProperty) {
	return document.querySelectorAll(queryProperty);
}

/********************************************************
 Background Resizing
 ********************************************************/
window.addEventListener('resize', handleScreenResize);


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
    menuDiff = 0;

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

let fps = 60;
let maxIterations = 33;
let pauseAnimation = true; // Stop generating particles?
let doneAnimation = true;  // Have all particles finished their iteration?

let currSelect = 0; // Selected menu ID
let menuDiff = 0;       // Difference in current selected menu ID from previous selected menu ID

function enterSelect(i) {
    menuDiff = i - currSelect;
    currSelect = i;
    
    defaultStartY += menuDiff * 42;
    defaultEndY += menuDiff * 42;
    defaultEndX = endXPositions[i];
	
	defaultStartY = Math.min(Math.max(0, defaultStartY), 42 * 5);
	defaultEndY = Math.min(Math.max(0, defaultStartY), 42 * 5);
    
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
        if (menuDiff != 0) {
            jumpParticleY(pInfo);
        } if (!pauseAnimation)
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
            pInfo.set('delay',            randomInteger(0, maxIterations) * fps / 100);
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
    pInfo.set('startY', Math.min(5 * 42, Math.max(0, pInfo.get('startY') + menuDiff * 42)));
    pInfo.set('endY', Math.min(5 * 42, Math.max(0, pInfo.get('endY') + menuDiff * 42)));
    pInfo.set('currY', Math.min(5 * 42, Math.max(0, pInfo.get('startY') + menuDiff * 42)));
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

let menuTransitioning = false;
let currScreen = -1;	// Current menu
function goToMenu(i) {
	if (menuTransitioning || currScreen == i) return;
	
	menuTransitioning = true;
	setTimeout(() => {menuTransitioning = false;}, 750);
	
	if (i == -1)		goToOriginalMenu();
	else if (i == 0)	goToAboutMenu();
	else if (i == 1)	goToProjectsMenu();
	else if (i == 2)	goToMusicMenu();
	else if (i == 3)	goToResourcesMenu();
	else if (i == 4)	goToResumeMenu();
	
	currScreen = i;
	handleScreenResize();
}

function goToOriginalMenu() {
	/*
	cssSetId('background', 'width', "100%");
    cssSetId('background', 'height', "100%");
    cssSetId('background', 'min-width', "1000px");
    cssSetId('background', 'right', "0%");*/
	if (currScreen == 0) {
		cssSetId('tv', 'height', '');   cssSetId('tv_body', 'height', '');  cssSetId('tv_screen', 'height', '');
		cssSetId('tv', 'bottom', '');   cssSetId('tv_body', 'bottom', '');  cssSetId('tv_screen', 'bottom', '');
		cssSetId('tv', 'right', '');   	cssSetId('tv_body', 'right', ''); 	cssSetId('tv_screen', 'right', '');
																			cssSetId("tv_screen", 'opacity', '0');
		cssSetId('stand', 'height', '285%');
		cssSetId('stand', 'bottom', '-333%');
		cssSetId('stand', 'right', '-80%');
		cssSetId('room_zoom', 'transform', 'scale(2) translate(10%)');
		
		cssSetId('background', 'width', '100%');
		cssSetId('background', 'height', '100%');
		cssSetId('background', 'min-width', '1000px');
		cssSetId('background', 'right', '0px');
		cssSetId('background', 'bottom', '0px');
		cssSetId('background', 'transform', 'scale(1)');
		cssSetId('background', 'transition', '0.5s');
		cssSetId('music_block', 'display', 'none');
		
		setTimeout(() => {
			cssSetId('background', 'overflow', 'visible');
			cssSetId('c15', 'display', 'block');
			cssSetId("tv_body", 'z-index', '-5');
			cssSetId("tv_screen", 'z-index', '-5');
		}, 500);
		
	} else if (currScreen == 1) {
		
	} else if (currScreen == 2) {
		cssSetId('background', 'transform', 'translate(0%, 0%)');
		cssSetId('c14', 'transform', 'translate(0%, -100%)');
		
		cssSetId('music_block_title', 'right', '-500px');
		cssSetId('cd', 'right', '-1000px');
		cssSetId('album_block', 'top', '-100%');
		
		cssSetId('c5', 'display', 'block');
		cssSetId('c5', 'transition', '0s');
		cssSetId('c5', 'filter', 'opacity(1)');
		
		cssSetId('c13', 'transition', '0s');
		cssSetId('c13', 'background-position', '50% 0%');
		
		setTimeout(() => {
			cssSetId('music_block', 'display', 'none');
			cssSetId('music_block_back', 'display', 'none');
			cssSetId('music_block_album_scroll', 'display', 'none');
			cssSetId('c13', 'transition', '0s');
			
			cssSetId('music_block_title', 'right', '75px');
			cssSetId('cd', 'right', '-300px');
			cssSetId('album_block', 'top', '0%');
		}, 500)
	}
	
	
	
	scaleMainMenuBackground()
}

function goToAboutMenu() {
	cssSetId('tv', 'height', '65%');    cssSetId('tv_body', 'height', '65%');   cssSetId('tv_screen', 'height', '65%');
	cssSetId('tv', 'bottom', '27%');    cssSetId('tv_body', 'bottom', '27%');   cssSetId('tv_screen', 'bottom', '27%');
	cssSetId('tv', 'right', '120px');   cssSetId('tv_body', 'right', '120px');  cssSetId('tv_screen', 'right', '120px');
                                        cssSetId("tv_body", 'z-index', '11');   cssSetId("tv_screen", 'z-index', '11');
                                                                                cssSetId("tv_screen", 'opacity', '1');
    cssSetId('stand', 'height', '55%');
	cssSetId('stand', 'bottom', '-25%');
	cssSetId('stand', 'right', '75px');
	cssSetId('room_zoom', 'transform', 'scale(1) translate(0)');
	
	cssSetId('background', 'transform', 'scale(0.35)');
	cssSetId('background', 'overflow', 'hidden');
	cssSetId('c15', 'display', 'none');
	cssSetId('music_block', 'display', 'none');
}

function cssGetClass(className) {
	return document.getElementsByClassName(className);
}
function cssSetClass(className, property, value) {
	let elements = cssGetClass(className)
	for (let element of elements) {
		element.style.setProperty(property, value);
	}
}

function handleScreenResize() {
	let windowWidth = Math.max(window.innerWidth, 1000);
	let windowHeight = Math.max(window.innerHeight, 600);
    
	if (currScreen == 0) {	
		cssSetId('about', 'width', 'calc(100% - ' + (0.65 * windowHeight + 500) + "px)");
		cssSetId('about_background', 'width', 'calc(100% - ' + (0.65 * windowHeight + 500) + "px)");
        // cssSetId('about', 'width', (windowWidth - 1.5 * tvWidth - 75) + "px");
		
		let width = windowHeight * 1.4;
        let height = windowHeight * 1.05;
        let right = -width / 11 + 30;
        let bottom = height * -0.01;
		cssSetId('background', 'width', width + "px");
        cssSetId('background', 'height', height + "px");
        cssSetId('background', 'min-width', "1px");
        cssSetId('background', 'right', right + "px");
        cssSetId('background', 'bottom', bottom + "px");
		
		setTimeout(() => {cssSetId('background', 'transition', '0s');}, 750);
    } else if (currScreen == 1) {
		
	} else if (currScreen == 2) {
		let albumHeight = Math.min(700, windowHeight * 0.8 - 300 * windowHeight / windowWidth + 100);
		cssSetId('album_holder', 'height', albumHeight + "px");
		cssSetId('album_holder', 'top', 0.6 * (windowHeight - albumHeight) + "px");
		cssSetId('album_descriptions', 'width', 'calc(100% - 245px - ' + albumHeight + 'px)');
		if (!rotating)
			updateAlbumDetails(albumHeight);
		
		let albumSectionTitles = cssFindAll('#album_section_title span');
		albumSectionTitles.forEach(x => x.style.setProperty('font-size', albumHeight / 35 + 'pt'));
		cssSetClass('album_section_title_active', 'font-size', albumHeight / 30 + 'pt');
	} else if (currScreen == 3) {
		
	} else if (currScreen == 4) {
		
	}
}

let albumDetails = [[['font-size', 7.125, 'right', 20, 'bottom', 30],	['font-size', 10.6875, 'right', 3.3, 'bottom', 7.5],	['font-size', 18.3225, 'right', 1.9, 'bottom', 5.9],	['top', 20, 'right', 20, 'width', 15, 'height', 7.5]],
					[['font-size', 10, 'right', 20, 'top', 11.3],		['font-size', 18, 'right', 3.9, 'top', 5.7],			['font-size', 30, 'right', 20, 'top', 25],				['left', 3.1, 'top', 12, 'width', 1.49, 'height', 5.5]],
					[[], [], [], []],
					[[], [], [], []],
					[[], [], [], []],
					[[], [], [], []],
					[[], [], [], []],
					[[], [], [], []]];

function updateAlbumDetails(albumHeight) {
	let h1 = cssFind('#album h1');
	let h2 = cssFind('#album h2');
	let h3 = cssFind('#album h3');
	let seal = cssFind('#album div');
	
	function removeCss(item) {
		item.style.removeProperty('left');
		item.style.removeProperty('top');
		item.style.removeProperty('right');
		item.style.removeProperty('bottom');
		item.style.removeProperty('width');
		item.style.removeProperty('height');
	}
	removeCss(h1);
	removeCss(h2);
	removeCss(h3);
	removeCss(seal);
	
	let albumDetail = albumDetails[currAlbum - 1];
	for (let i = 0; i < albumDetail[0].length; i += 2) { h1.style.setProperty(albumDetail[0][i], (albumHeight / albumDetail[0][i + 1]) + 'px'); }
	for (let i = 0; i < albumDetail[1].length; i += 2) { h2.style.setProperty(albumDetail[1][i], (albumHeight / albumDetail[1][i + 1]) + 'px'); }
	for (let i = 0; i < albumDetail[2].length; i += 2) { h3.style.setProperty(albumDetail[2][i], (albumHeight / albumDetail[2][i + 1]) + 'px'); }
	for (let i = 0; i < albumDetail[3].length; i += 2) { seal.style.setProperty(albumDetail[3][i], (albumHeight / albumDetail[3][i + 1]) + 'px'); }
	
	/*
	h1.style.setProperty('font-size', (albumHeight / 9.5) + "pt");
	h2.style.setProperty('font-size', (albumHeight / 14.25) + 'pt');
	h3.style.setProperty('font-size', (albumHeight / 24.43) + 'pt');
	h1.style.setProperty('right', (albumHeight / 20) + "px");
	h1.style.setProperty('bottom', (albumHeight / 30) + "px");
	h2.style.setProperty('right', (albumHeight / 3.3) + "px");
	h2.style.setProperty('bottom', (albumHeight / 7.5) + "px");
	h3.style.setProperty('right', (albumHeight / 1.9) + "px");
	h3.style.setProperty('bottom', (albumHeight / 5.9) + "px");
	
	seal.style.setProperty('top', (albumHeight / 20) + 'px');
	seal.style.setProperty('right', (albumHeight / 20) + 'px');
	seal.style.setProperty('width', (albumHeight / 15) + 'px');
	seal.style.setProperty('height', (albumHeight / 7.5) + 'px');
	*/
}

function goToProjectsMenu() {
	
}

function goToMusicMenu() {
	cssSetId('music_block', 'display', 'block');
	cssSetId('background', 'transform', 'translate(0, 150%)');
    cssSetId('c14', 'transform', 'translate(0%, 33.33%)');
	cssSetId('c13', 'transition', '0.1s');
	cssSetId('c13', 'background-position', '50% 0%');
	
	setTimeout(() => {
		cssSetId('c13', 'transition', '0s');
		cssSetId('c5', 'transition', '0.1s');
		cssSetId('c5', 'filter', 'opacity(0)');
		cssSetId('music_block_back', 'display', 'block');
		cssSetId('music_block_album_scroll', 'display', 'block');
	}, 500);
	setTimeout(() => {
		cssSetId('c5', 'display', 'none');
	}, 600);
	
	rotateAlbum();
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

Image Sources: ...

*/
// About: zoom out, revealing current screen to be screen of TV of my current laptop
// Projects: glitchy thing
// Music: zoom up
// Resources: cloud up?
// Resume: no animation

// Font - Outfit

document.onkeydown = checkKey;
function checkKey(e) {
	e = e || window.event;
	
	if (e.keyCode == 27)
		goToMenu(-1)
	else if (currScreen == 2) {
		if (e.keyCode == 37)
			previousAlbum();
		else if (e.keyCode == 39)
			nextAlbum();
	}
}



/********************************************************
 Music Menu
 ********************************************************/
function cssGetPseudoElement(id, pseudo) {
	return window.getComputedStyle(cssGetId(id), pseudo);
}

let currAlbum = 0;
let totalAlbums = 0;

function onHTMLLoad() {
	currAlbum = parseInt(cssGetId('album_number').innerHTML.replace(/\D/g,''));
	totalAlbums = parseInt(cssGetPseudoElement('album_number', ":after").getPropertyValue('content').replace(/\D/g,''));
	
	let spans = cssFindAll('#music_block_album_scroll span');
	for (let i = 0; i < spans.length; i++) {
		spans[i].style.setProperty('background-image', "url('assets/albums/album_" + albumImages[i] + "')")
	}
}

function updateAlbum() {
	let scroller = cssGetId('album_descriptions_scroller');
	scroller.scrollTop = 0;
	updateAlbumNumber();
	updateAlbumCoverAndInfo();
	updateAlbumSectionTitle();
	updateAlbumScrollActive();
}
function skipToAlbum(number) {
	if (rotating || currAlbum == number + 1) 		return;
	else if (currAlbum < number + 1) 	albumRotateNext = true;
	else								albumRotateNext = false;
	currAlbum = number + 1;
	updateAlbum();
}
function scrollAlbumDescription() {
	let scroller = cssGetId('album_descriptions_scroller');
	document.documentElement.style.setProperty("--scroll_transition", "0s");
	document.documentElement.style.setProperty("--scroll_offset", (-scroller.scrollTop) + "px");
	setTimeout(() => {
		document.documentElement.style.setProperty("--scroll_transition", "0.3s");
	}, 1);
}
function updateAlbumScrollActive() {
	let oldActive = cssGetClass('music_block_album_scroll_active')[0];
	let newActive = cssFindAll('#music_block_album_scroll span')[currAlbum - 1];
	oldActive.classList.remove('music_block_album_scroll_active');
	newActive.classList.add('music_block_album_scroll_active');
}
function updateAlbumSectionTitle() {
	let oldActive = cssGetClass('album_section_title_active')[0];
	let i;
	if (currAlbum <= 2)			i = 0;
	else if (currAlbum <= 6) 	i = 1;
	else if (currAlbum == 7)	i = 2;
	else if (currAlbum == 8)	i = 3;
	let newActive = cssFindAll('#album_section_title span')[i];
	oldActive.classList.remove('album_section_title_active');
	newActive.classList.add('album_section_title_active');
	handleScreenResize();
}
function previousAlbum() {
	if (rotating)	return;
	if (currAlbum == 1)		currAlbum = totalAlbums;
	else					currAlbum -= 1;
	albumRotateNext = false;
	updateAlbum();
}
function nextAlbum() {
	if (rotating)	return;
	if (currAlbum == totalAlbums)	currAlbum = 1;
	else							currAlbum += 1;
	albumRotateNext = true;
	updateAlbum();
}
function updateAlbumNumber() {
	let number = (currAlbum < 10) ? '0' + currAlbum : currAlbum;
	let albumNumber = cssGetId('album_number');
	albumNumber.innerHTML = number;
}

function updateAlbumCoverAndInfo() {
	let albumName = albumNames[currAlbum - 1];
	let albumId = 'album_' + albumName.toLowerCase().replaceAll(',', '').replaceAll(' ', '_');	
	
	displayAlbum(albumId);
	changeAlbumTitle(albumName);
	changeAlbumTable(albumId);
}

let albumNames = ['Classical Compositions, Solo', 'Classical Arrangements', 'Xenoblade Chronicles OST',
				  'Fire Emblem OST', 'The Great Ace Attorney OST', 'Video Game OSTs, Other', 'Anime OSTs', 'Other'];
let albumImages = ['classical_compositions_solo.jpg', 'classical_arrangements.jpg', 'unknown.jpg', 'unknown.jpg',
					'unknown.jpg', 'unknown.jpg', 'unknown.jpg', 'unknown.jpg'];

let albumRotateNext = true;
let albumDisplayFrames = 60;
function displayAlbum(albumId) {
	if (rotating)	return;
	let album = cssGetId('album');
	let albumSectionTitle = cssGetId('album_section_title');
	rotating = true;
	for (let i = 1; i <= albumDisplayFrames; i++) {
		let x = i / albumDisplayFrames;
		setTimeout(() => {
			let rotation = rotateDiffY;
			if (albumRotateNext)	rotation += 180 * x;
			else					rotation -= 180 * x;
			if (i >= Math.round(albumDisplayFrames / 2))
				rotation += 180;
			album.style.setProperty('transform', 'rotateX(' + rotateDiffX + 'deg) rotateY(' + rotation + 'deg)');
			if (i == Math.round(albumDisplayFrames / 2)) {
				let windowWidth = Math.max(window.innerWidth, 1000);
				let windowHeight = Math.max(window.innerHeight, 600);
				let albumHeight = Math.min(700, windowHeight * 0.8 - 300 * windowHeight / windowWidth + 100);
				album.style.setProperty('background-image', "url('assets/albums/" + albumImages[currAlbum - 1] + "')");
				album.classList.remove(album.classList[0]);
				album.classList.add(albumId);
				updateAlbumDetails(albumHeight);
			}
			if (i == albumDisplayFrames)
				rotating = false;
		}, 150 * (2 / (1 + Math.exp(-2.2 * (x - 0.5)))) - 0.5);
	}
}

function findFirstDifferentIndex(from, to) {
	if (from == to) return from.length;
	let i = 0;
	while (from[i] == to[i] && i < from.length && i < to.length) {
		i += 1;
	}
	return i;
}

let typingSpeed = 10;
function changeAlbumTitle(to) {
	let titleElement = cssFind('#album_descriptions h2');
	let from = titleElement.innerHTML;
	let startIndex = findFirstDifferentIndex(from, to);
	let frames = [from];
	
	for (let i = 0; i < titleElement.innerHTML.length - startIndex; i++) {
		let lastElement = frames[frames.length - 1];
		frames.push(lastElement.slice(0, lastElement.length - 1));
	}
	for (let i = startIndex; i < to.length; i++) {
		let lastElement = frames[frames.length - 1];
		frames.push(lastElement + to.charAt(i));
	}
	for (let i = 0; i < frames.length; i++) {
		setTimeout(() => {
			titleElement.innerHTML = frames[i] + ((i != frames.length - 1) ? '|' : '');
		}, i * typingSpeed)
	}
}

// Title, Year, Duration, Instrumentation, Composer
let albumInfo = {
	album_classical_compositions_solo: 	[['Sonata no. 1 in E♭ Minor (Mov. 1)',		'2019', 'Piano',			''],
										['Prelude no. 1 in G# Minor',				'2019', 'Piano',			''],
										['Prelude no. 2 in F# Minor',				'2017', 'Piano',			''],
										['Pentanote Etude no. 1',					'2019', 'Piano',			''],
										['Miniature for Flute and Piano',			'2021', 'Piano, Flute',		'']],
	album_classical_arrangements: 		[['Three Movements from "The Firebird"',	'2023', 'Concert Band',		'Stravinsky, Igor'],
										['Toccata from "Le tombeau de Couperin"',	'2022', 'Wind Quintet',		'Ravel, Maurice'],
										['À la manière de Borodine',				'2021', 'Orchestra',		'Ravel, Maurice'],
										['Introduction et allegro',					'2022', 'Piano',			'Ravel, Maurice']],
	album_xenoblade_chronicles_ost:		[['Agniratha, Mechonis Capital (Daytime)',	'2020',	'Ensemble',		''],
										['Mechonis Field',							'2023', 'Piano',		''],
										['The End Lies Ahead',						'2022', 'Ensemble',		''],
										['Colony 9 (Daytime)',						'2020', 'Ensemble',		''],
										['Gaur Plains (Daytime)',					'2020',	'Piano',		''],
										['Millick Meadow (Daytime)',				'2023', 'Piano',		'']],
	album_fire_emblem_ost:				[['Fire Emblem: Radiant Dawn Medley',		'2023', 'Piano',		''],
										['Proud Flight',							'2023', 'Ensemble',		''],
										['Path of the Hero King',					'2023', 'Piano',		'']],
	album_the_great_ace_attorney_ost:	[['Pursuit ~ Time for a Great Turnabout',	'2021',	'Ensemble',		''],
										['The Great Cross-Examination',				'2022',	'Ensemble',		''],
										['Naruhodou Ryuutarou - Objection!',		'2021', 'Ensemble',		'']],
	album_video_game_osts_other:		[['The One Ruling Everything',				'2022', 'Ensemble',		'The Last Story'],
										["Team, This One's Stronger!",				'2022', 'Piano',		'Bug Fables'],
										['Here We Are',								'2020', 'Ensemble',		'Undertale'],
										['Snowy',									'2020', 'Ensemble',		'Undertale'],
										['Ruins',									'2018', 'Ensemble',		'Undertale'],
										['Faint Courage',							'2022', 'Ensemble',		'Deltarune'],
										['Autumn Mountain Battle',					'2021', 'Piano',		'Paper Mario'],
										['Geometry Dash OST Collection',			'2023', 'Piano',		'Geometry Dash'],
										['Persona 5 Piano Medley',					'2020',	'Piano',		'Persona 5'],
										['KK Lovers',								'2023', 'Ensemble',		'Animal Crossing']],
	album_anime_osts:					[['Kami-iro Awase',							'2021',	'OP',	'Danganronpa 3'],
										['Shadow and Truth',						'2022',	'OP',	'ACCA 13-ku Kansatsu-ka'],
										['Seija no Koushin',						'2022', 'OP',	'Heion Sedai no Itaden-tachi'],
										['Shinzou wo Sasageyo!',					'2017', 'OP',	'Attack on Titan'],
										['Re:Re',									'2017',	'OP',	'Boku dake ga Inai Machi'],
										['Sore wa Chiisana Hikari no Youna',		'2022', 'ED',	'Boku dake ga Inai Machi'],
										['Mushishi no Theme',						'2016',	'OST',	'Mushishi'],
										['La parfum de fleurs',						'2020',	'OST',	'Yuri!!! on Ice'],
										['Mephisto',								'2023', 'ED',	'Oshi no Ko'],
										['The Beautiful World',						'2022', 'ED',	'Kino no Tabi'],
										['Reason',									'2021',	'ED',	'Hunter x Hunter'],
										['Nagareboshi Kirari',						'2021',	'ED',	'Hunter x Hunter'],
										['Hyori Ittai',								'2020',	'ED',	'Hunter x Hunter']],
	album_other:						[['Warhead',								'2023', 'Ensemble',		'Zircon'],
										['Lit Fuse',								'2023', 'Piano',		'Cacola'],
										["The Undertaker's Daughter",				'2020',	'Piano',		'Steampianist']]
};
let albumColumnWidths = {
	album_classical_compositions_solo:	[60, 10, 30, 0],
	album_classical_arrangements:		[50, 8, 17, 25],
	album_xenoblade_chronicles_ost:		[60, 10, 30, 0],
	album_fire_emblem_ost:				[60, 10, 30, 0],
	album_the_great_ace_attorney_ost:	[60, 10, 30, 0],
	album_video_game_osts_other:		[42, 8, 15, 35],
	album_anime_osts:					[40, 8, 10, 42],
	album_other:						[50, 8, 17, 25]
};
let albumColumnTitles = {
	album_classical_compositions_solo:	['Title', 'Year', 'For', ''],
	album_classical_arrangements:		['Title', 'Year', 'For', 'Composer'],
	album_xenoblade_chronicles_ost:		['Title', 'Year', 'For', ''],
	album_fire_emblem_ost:				['Title', 'Year', 'For', ''],
	album_the_great_ace_attorney_ost:	['Title', 'Year', 'For', ''],
	album_video_game_osts_other:		['Title', 'Year', 'For', 'Video Game'],
	album_anime_osts:					['Title', 'Year', 'For', 'Anime'],
	album_other:						['Title', 'Year', 'For', 'Composer']
};
function changeAlbumTable(to) {
	let tableWidthInfo = albumColumnWidths[to];
	let tableColumnInfo = albumColumnTitles[to];
	let tableInfo = albumInfo[to];
	let table = cssFind('#album_descriptions table');
	let tableBody = table.children[0];
	
	let headers = tableBody.children[0].children;
	for (let i = 0; i < headers.length; i++) {
		headers[i].style.setProperty('width', tableWidthInfo[i] + "%");
	}
	while (tableBody.children.length - 1 < tableInfo.length) {
		let newRow = table.insertRow(tableBody.children.length);
		let newCell1 = newRow.insertCell(0); newCell1.innerHTML = '';
		let newCell2 = newRow.insertCell(1); newCell2.innerHTML = '';
		let newCell3 = newRow.insertCell(2); newCell3.innerHTML = '';
		let newCell4 = newRow.insertCell(3); newCell4.innerHTML = '';
	}
	
	let numFrames = 8;
	let frames = getAlbumTableFrames(tableBody.children, tableInfo, numFrames, tableColumnInfo);
	for (let i = 0; i < numFrames; i++) {
		setTimeout(() => {
			for (let j = 0; j < frames[i].length; j++) {
				for (let k = 0; k < frames[i][j].length; k++) {
					try { tableBody.children[j].children[k].innerHTML = frames[i][j][k]; } catch (err) {}
				}
			}
		}, i * typingSpeed * 4);
	}
	setTimeout(() => {
		while (tableBody.children.length - 1 > tableInfo.length) {
			table.deleteRow(tableBody.children.length - 1);
		}
	}, numFrames * typingSpeed * 4);
}
function getAlbumTableFrames(rows, tableInfo, numFrames, tableColumnInfo) {
	let frames = [];
	for (let i = 0; i < numFrames; i++) {
		rowText = [];
		for (let j = 0; j < rows.length; j++) {
			cellText = [];
			for (let k = 0; k < rows[j].children.length; k++) {
				let cell = rows[j].children[k];
				let oldText = cell.innerHTML;
				let newText;
				if (j == 0) 						newText = tableColumnInfo[k];	// Changing header
				else if (j - 1 >= tableInfo.length)	newText = '';					// Row will no longer exist
				else								newText = tableInfo[j - 1][k];  // Default row change
				
				if (oldText == newText) {
					cellText.push(newText);
					continue;
				}
				
				let x = (i + 1) / numFrames;
				let textLength = Math.round(oldText.length * (1 - x) + newText.length * x);
				
				let currText = '';
				let oldWeight = 1 - x;
				let noiseWeight = 3 * x * (1 - x);
				let sumWeight = 1 + noiseWeight;
				for (let l = 0; l < textLength; l++) {
					if (oldText[l] == newText[l]) {
						currText += oldText[l];
						continue;
					}
					let random = Math.random();
					if (random < oldWeight / sumWeight && oldText.length > l)	currText += oldText[l];
					else if (random < 1 / sumWeight && newText.length > l)		currText += newText[l];
					else														currText += String.fromCharCode(Math.round(Math.random() * (126 - 32) + 32));						
				}
				cellText.push(currText);
			}
			rowText.push(cellText);
		}
		frames.push(rowText);
	}
	return frames
}