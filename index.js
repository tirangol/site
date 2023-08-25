/********************************************************
 Helper Functions
 ********************************************************/
function cssSetToValues(element, propertyValueList) {
	if (propertyValueList.length % 2 != 0) throw "Error in cssSetToValues: " + propertyValueList + " must have an even-numbered length";
	for (let i = 0; i < propertyValueList.length; i += 2) {
		element.style.setProperty(propertyValueList[i], propertyValueList[i + 1]);
	}
}
function cssGetId(id) {
	return document.getElementById(id);
}
function cssSetId(id, property, value) {
    cssGetId(id).style.setProperty(property, value);
}
function cssSetIdToValues(id, propertyValueList) {
	let element = cssGetId(id);
	cssSetToValues(element, propertyValueList);
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
function cssSetClassToValues(className, propertyValueList) {
	let elements = cssGetClass(className);
	for (let element of elements.length) {
		cssSetToValues(element, propertyValueList);
	}
	
}
function cssFind(queryProperty) {
	return document.querySelector(queryProperty);
}
function cssFindAll(queryProperty) {
	return document.querySelectorAll(queryProperty);
}
function cssSetAll(queryProperty, property, value) {
	let elements = cssFindAll(queryProperty);
	for (let element of elements) {
		element.style.setProperty(property, value);
	}
}
function cssSetAllMany(queryProperty, propertyValueList) {
	let elements = cssFindAll(queryProperty);
	for (let element of elements) {
		cssSetToValues(element, propertyValueList);
	}
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function bound(value, min, max) {
	if (min > max) throw "Error in bound: " + min + " > " + max;
	return Math.min(Math.max(value, min), max);
}

window.addEventListener('resize', handleScreenResize);

/********************************************************
 Handling Keyboard Presses
 ********************************************************/
document.onkeydown = checkKey;
function checkKey(e) {
	e = e || window.event;
	
	if (e.keyCode == 27) { // escape
		if (currScreen == 0 && inAboutSubmenu)
			aboutSubmenuBack()
		else
			goToMenu(-1)
	} else if (currScreen == 2) {
		if (e.keyCode == 37) // left
			previousAlbum();
		else if (e.keyCode == 39) // right
			nextAlbum();
	}
}

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
		scrollDrag();
	}
}


// Scales/moves main menu background buildings based on cursor position
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

let albumIsFlipping = false;
let rotateFactor = 0.01;
let rotateDiffX;
let rotateDiffY;

// Rotates the album cover image to face the cursor's direction
function rotateAlbum() {	
	let album = cssGetId('album');
	/**
	let albumRect = album.getBoundingClientRect();
	let albumX = 0.5 * (albumRect.left + albumRect.right);
	let albumY = 0.5 * (albumRect.top + albumRect.bottom);
	**/
	let albumX = 0.5 * (150 + 500);
	let albumY = 0.5 * (0.2 * screen.height + 500);
	rotateDiffY = bound(-rotateFactor * (cursorX - albumX), min=-10, max=10);
	rotateDiffX = bound(rotateFactor * (cursorY - albumY), min=-10, max=10);
	
	if (albumIsFlipping)	return;
	
	let transform = 'rotateX(' + rotateDiffX + 'deg) rotateY(' + rotateDiffY + 'deg)';
	album.style.setProperty('transform', transform);
	cssSetIdToValues('album_section_title', ['transform-origin', albumX + 'px ' + albumY + 'px',
										'transform', transform])
}


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

const particleScale = [0.08, 0.15, 0.2, 0.04, 0.1, 0.2, 0.1];
const particleXOffset = [15, 10, -18, 25, 30, 10, 5];
const particleYOffset = [6, 5, 12, 15, 16, 8, 10];

function getParticleScale(p) { return readParticleList(particleScale, p); }
function getParticleXOffset(p) { return readParticleList(particleXOffset, p); }
function getParticleYOffset(p) { return readParticleList(particleYOffset, p); }
function readParticleList(lst, p) {
    let i = p.src[p.src.length - 5];
    return lst[parseInt(i) - 1];
}

function drawImage(context, pInfo) {
	let image = pInfo.get('image');
	let x = pInfo.get('currX');
	let y = pInfo.get('currY');
	let scale = pInfo.get('currScale');
	let opacity = pInfo.get('currOpacity');
	
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
 Menu Select Canvas Animation
 ********************************************************/
const fps = 60;
const maxIterations = 70;
let pauseAnimation = true; // Stop generating particles?
let doneAnimation = true;  // Have all particles finished their iteration?

let currSelectedMenu = 0;	// Currently selected menu ID
let prevSelectedMenu = 0;	// Previously selected menu ID
function menuDiff() { return currSelectedMenu - prevSelectedMenu; }

// Particle start/end information
let defaultStartX = 250;
let defaultStartY = 15;
let defaultEndX = 50;
let defaultEndY = 15;
const endXPositions = [60, 30, 60, 0, 30];

function enterSelect(i) {
    prevSelectedMenu = currSelectedMenu;
    currSelectedMenu = i;

    defaultStartY += menuDiff() * 42;
    defaultEndY += menuDiff() * 42;
    defaultEndX = endXPositions[i];
	
	// Bugfix
	defaultStartY = bound(defaultStartY, 0, 42 * 5);
	defaultEndY = bound(defaultStartY, 0, 42 * 5);
    
    pauseAnimation = false;
    if (doneAnimation) {
		doneAnimation = false;
        window.requestAnimationFrame(updateSelectAnimation);
    }
}
function leaveSelect() {
    pauseAnimation = true;
}

function updateSelectAnimation() {
    let canvas = cssGetId("select_animation");
    let context = canvas.getContext("2d");
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawParticles(context);

    if (!doneAnimation) {
        setTimeout(() => {
            window.requestAnimationFrame(updateSelectAnimation);
        }, 1000 / fps);
    }
}


/********************************************************
 Particle Data
 ********************************************************/
let particles = new Array();
for (let i = 0; i < 10; i++) {
    createParticle(p1, i * 7);
    createParticle(p2, i * 7 + 1);
    createParticle(p3, i * 7 + 2);
    createParticle(p4, i * 7 + 3);
    createParticle(p5, i * 7 + 4);
    createParticle(p6, i * 7 + 5);
    createParticle(p7, i * 7 + 6);
}
function createParticle(p, id) {
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
	map.set('id', id);						// ID - determines delay
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
            drawImage(context, pInfo);
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
        updateParticleY(pInfo);
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
	if (pauseAnimation) {
		pInfo.set('restartAnimation', false);
    } else {
        let moveX = defaultStartX - defaultEndX;
        let rand = randomInteger(0, moveX * 0.6);
        pInfo.set('startX',         defaultStartX - rand);
        pInfo.set('endX',           defaultEndX + randomInteger(0, 50) + moveX * 0.6 - rand);
        pInfo.set('startY',         defaultStartY + randomInteger(-7, 3));
        pInfo.set('endY',           defaultEndY + randomInteger(2, 6));
        pInfo.set('startScale',     0.6 * Math.random() + 0.6);
        pInfo.set('endScale',       0.5 * Math.random() + 0.5);
        pInfo.set('currX',          pInfo.get('startX'));
        pInfo.set('currY',          pInfo.get('startY'));
        pInfo.set('currScale',      pInfo.get('startScale'));
        pInfo.set('iterations',     maxIterations * fps / 100);
        pInfo.set('currIteration',  0);
		
		// Animation running like usual
		if (pInfo.get('restartAnimation')) {
			pInfo.set('delay', 0);
		// Animation just restarted
		} else {
            pInfo.set('delay',            pInfo.get('id') * fps / 100);
            pInfo.set('restartAnimation', true);
        }
    }
    pInfo.set('currOpacity', 0);
}

/* Jump new flame particle y-ToValues when user hovers to a new option */
function updateParticleY(pInfo) {
    pInfo.set('startY',	defaultStartY);
    pInfo.set('endY',	defaultEndY);
    pInfo.set('currY',	defaultStartY);
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
    }, 5);
}

let menuTransitioning = false;
let currScreen = -1;	// Current menu
function goToMenu(i) {
	if (menuTransitioning || currScreen == i) return;
	
	menuTransitioning = true;
	setTimeout(() => {menuTransitioning = false;}, 750);
	
	if (i == -1)		goToMainMenu();
	else if (i == 0)	goToAboutMenu();
	else if (i == 1)	goToProjectsMenu();
	else if (i == 2)	goToMusicMenu();
	else if (i == 3)	goToResourcesMenu();
	else if (i == 4)	goToResumeMenu();
	
	currScreen = i;
	handleScreenResize();
}

function goToMainMenu() {
	if (currScreen == 0)
		goToMainMenuAbout();
	else if (currScreen == 1) {
		
	} else if (currScreen == 2)
		goToMainMenuMusic();
	else if (currScreen == 3) {
		
	} else if (currScreen == 4) {
		
	}
	scaleMainMenuBackground()
}
function goToMainMenuAbout() {
	cssSetIdToValues('tv',			['height', '', 'bottom', '', 'right', '']);
	cssSetIdToValues('tv_body',		['height', '', 'bottom', '', 'right', '']);
	cssSetIdToValues('tv_screen',	['height', '', 'bottom', '', 'right', '', 'opacity', '0']);
	cssSetIdToValues('stand',		['height', '285%', 'bottom', '-333%', 'right', '-80%']);
	cssSetIdToValues('background',	['width', '100%', 'height', '100%', 'right', '0px', 'bottom', '0px',
									'min-width', '1000px', 'transform', 'scale(1)']);
		
	cssSetId('room_zoom', 'transform', 'scale(3) translate(10%)');
	cssSetId('music_block', 'display', 'none');
		
	updateStaticCanvasSize(false)
	turnTVDefault();
		
	setTimeout(() => {
		cssSetId('c15', 'display', 'block');			// Reshow the blue above-cloud background
		cssSetId('background', 'overflow', 'visible');	// Reshow the overpeeking top building
		cssSetId("tv_body", 'z-index', '-5');
		cssSetId("tv_screen", 'z-index', '-5');
	}, 500);
}
function goToMainMenuMusic() {
	cssSetId('background', 'transform', 'translate(0%, 0%)');
	cssSetId('c14', 'transform', 'translate(0%, -100%)');
		
	cssSetId('music_block_title', 'right', '-500px');
	cssSetId('cd', 'right', '-1000px');
	cssSetId('album_block', 'top', '-100%');
	
	cssSetIdToValues('c5',	['display', 'block',
						'filter', 'opacity(1)']);
	cssSetIdToValues('c13',	['transition', '0s',
						'background-position', '50% 0%']);
		
	setTimeout(() => {
		cssSetId('music_block', 'display', 'none');
		cssSetId('music_block_back', 'display', 'none');
		cssSetId('music_block_album_scroll', 'display', 'none');
		cssSetId('music_block_title', 'right', '75px');
		cssSetId('cd', 'right', '-300px');
		cssSetId('album_block', 'top', '0%');
	}, 500)
}

let aboutMenuTransitioning = false;
function goToAboutMenu() {
	cssSetIdToValues('tv',			['height', '65%', 'bottom', '27%', 'right', '120px']);
	cssSetIdToValues('tv_body',		['height', '65%', 'bottom', '27%', 'right', '120px', 'z-index', '11']);
	cssSetIdToValues('tv_screen',	['height', '65%', 'bottom', '27%', 'right', '120px', 'z-index', '11', 'opacity', '0.8']);
	
	cssSetIdToValues('stand',		['height', '55%', 'bottom', '-25%', 'right', '75px']);
	cssSetIdToValues('background',	['width', 'calc(1.4 * max(100vh, 600px))', 'height', "calc(1.05 * max(100vh, 600px))",
									'right', "calc(min(-12.72vh, -76.36px) + 30px)", 'bottom', "min(-1.05vh, -6.3px)",
									'min-width', '1px', 'transform', 'scale(0.35)', 'overflow', 'hidden']);
	
	cssSetId('room_zoom', 'transform', 'scale(1) translate(0)');
	cssSetId('c15', 'display', 'none');
	cssSetId('music_block', 'display', 'none');
	
	turnTVOn();
	
	aboutMenuTransitioning = true;		
	for (let i = 1; i <= 11; i++) {
		setTimeout(() => {
			updateStaticCanvasSize(true);
			handleScreenResize();
			if (i == 11) aboutMenuTransitioning = false;
		}, 50 * i);
	}
}

let windowWidth = Math.max(window.innerWidth, 1000);
let windowHeight = Math.max(window.innerHeight, 600);

function handleScreenResize() {
	windowWidth = Math.max(window.innerWidth, 1000)
	windowHeight = Math.max(window.innerHeight, 600);
	
	if (currScreen == 0) {
		handleScreenResizeAbout();
	} else if (currScreen == 1) {
		
	} else if (currScreen == 2) {
		handleScreenResizeMusic();
	} else if (currScreen == 3) {
		
	} else if (currScreen == 4) {
		
	}
}
function handleScreenResizeAbout() {
	if (aboutMenuTransitioning) return;
	
	updateStaticCanvasSize(true);
	staticLoop();
	
	let stand = cssGetId('stand');
	cssSetId("about",				"width", 'calc(100% - ' + (stand.offsetWidth + 375) + 'px');
	cssSetId("about_background",	"width", 'calc(100% - ' + (stand.offsetWidth + 375) + 'px');
	cssSetId("about_submenu",		"width", 'calc(100% - ' + (stand.offsetWidth + 270) + 'px');
		
	let aboutSubmenuWidth = cssGetId('about_submenu').offsetWidth;
	
	if (currAboutSubmenu == 'sources') {
		paper1.classList.remove('paper_hoverable');
		paper1.style.setProperty('left', 'max(0px, calc(100% * 0.5 - 186px))');
		
		cssSetId('sources_block',		'margin-top', '0%');
		cssSetId('sources_block_box',	'margin-top', '50px');
		
		// Anchor the right column of the sources box
		let sourcesBoxTop = cssGetId('sources_block_box').offsetTop;
		cssSetId('sources_block_right', 'top', (sourcesBoxTop) + 'px');
		cssSetId('sources_block_box', 'height', Math.max(cssGetId('sources_block_left').offsetHeight, cssGetId('sources_block_right').offsetHeight) + 'px');
		
	} else {
		let paper1Width = Math.min(aboutSubmenuWidth, Math.max(0.6 * windowHeight * 0.9, 0.6 * aboutSubmenuWidth));
		paper1.classList.add('paper_hoverable');
		paper1.style.setProperty('width', paper1Width + 'px');
		paper1.style.setProperty('left', 'calc((100% - ' + (paper1Width) + 'px) / 2)');
		paper1.style.setProperty('top', 'calc((100% - ' + (paper1Width / 0.9) + 'px) / 2)');
		
		document.documentElement.style.setProperty("--language_select_font_size", (paper1Width / 6.9) + 'px');
	}
}
function handleScreenResizeMusic() {
	let albumHeight = Math.min(700, windowHeight * 0.8 - 300 * windowHeight / windowWidth + 100);
	cssSetIdToValues('album_holder',	['height', albumHeight + "px",
										'top', 0.6 * (windowHeight - albumHeight) + "px"]);
	cssSetId('album_descriptions', 'width', 'calc(100% - ' + (245 + albumHeight) + 'px)');
		
	if (!albumIsFlipping)
		updateAlbumCoverDetails(albumHeight);
	
	cssSetClass('album_section_title_active', 'font-size', (albumHeight / 30) + 'pt');
	cssSetAll('#album_section_title span', 'font-size', (albumHeight / 35) + 'pt');

	scrollAlbumDescription();
}

function onHTMLLoad() {
	currAlbum = parseInt(cssGetId('album_number').innerHTML.replace(/\D/g,''));
	totalAlbums = parseInt(cssGetPseudoElement('album_number', ":after").getPropertyValue('content').replace(/\D/g,''));
	
	updateStaticCanvasSize(false);
	
	let spans = cssFindAll('#music_block_album_scroll span');
	for (let i = 0; i < spans.length; i++) {
		spans[i].style.setProperty('background-image', "url('assets/albums/album_" + albumImages[i] + "')")
	}
}
function updateStaticCanvasSize(inAboutMenu) {
	let canvas = cssGetId('tv_static');
	let canvasHeight = (windowWidth / windowHeight <= 1.57) ? windowHeight : windowWidth / 1.57;
	let canvasWidth = (windowWidth / windowHeight <= 1.57) ? windowHeight * 1.57 : windowWidth;
	canvas.height = canvasHeight;
	canvas.width = canvasWidth;
	canvas.style.setProperty('top', ((windowHeight - canvasHeight) / 2) + 'px');
	
	if (inAboutMenu) {
		canvas.style.setProperty('right', '120px');
		canvas.style.setProperty('pointer-events', 'auto');
		canvas.style.setProperty('cursor', 'pointer');	
		canvas.style.setProperty('transform', 'scale(' + (0.47 * windowHeight / canvasHeight) + ') translateY(-2%)');
	} else {
		canvas.style.setProperty('right', ((canvasWidth - windowWidth) / 2) + 'px');
		canvas.style.setProperty('pointer-events', 'none');
		canvas.style.setProperty('cursor', 'auto');
		canvas.style.setProperty('transform', 'scale(1) translateY(0%)');
	}
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
		cssSetId('c5', 'transition', '0s');
		cssSetId('c5', 'display', 'none');
	}, 600);
	
	rotateAlbum();
}

function goToResourcesMenu() {
	
}

function goToResumeMenu() {
	
}



/********************************************************
 About Submenu, Sources and Languages
 ********************************************************/
let sourcesData = [['top', '20%',		'transform', 'translateZ(0px) rotateZ(-2deg)'],
					['top', '-2%',		'transform', 'translateZ(0px) rotateZ(-1.5deg)'],
					['bottom', '-2%',	'transform', 'translateZ(0px) rotateZ(1deg)'],
					['bottom', '-2%',	'transform', 'translateZ(0px) rotateZ(0.5deg)'],
					['top', '-2%',		'transform', 'translateZ(0px) rotateZ(1.5deg)'],
					['bottom', '0%',	'transform', 'translateZ(0px)']];
let languageData = [['transform', 'translateZ(0px)'],
					['top', '0%',		'transform', 'translateZ(0px)'],
					['bottom', '0%',	'transform', 'translateZ(0px)'],
					['bottom', '0%',	'transform', 'translateZ(0px)'],
					['top', '0%',		'transform', 'translateZ(0px)'],
					['bottom', '0%',	'transform', 'translateZ(0px)']];

let inAboutSubmenu = false;
let currAboutSubmenu = 'language';
function sources() {
	cssSetClass('language_select', 'display', 'none');
	currAboutSubmenu = 'sources';
	aboutSubmenuOn(sourcesData);
}
function language() {
	cssSetClass('language_select', 'display', 'block');
	currAboutSubmenu = 'language';
	aboutSubmenuOn(languageData);
}
function aboutSubmenuOn(data) {
	if (currScreen != 0) return;
	inAboutSubmenu = true;
	cssSetId('about_submenu_quitter', 'display', 'block');
	cssSetId('about_submenu', 'display', 'block');
	
	cssSetId('tv_static', 'transition', '0s');
	cssSetId('tv_static', 'background-color', 'black');
	setTimeout(() => cssSetId('tv_static', 'transition', '0.5s'), 5);
	
	// Changing classes
	let papers = cssGetClass('paper');
	for (let i = 0; i < papers.length; i++) {
		papers[i].classList.remove((currAboutSubmenu == 'language') ? 'map' + (i + 1) : 'newspaper' + (i + 1));
		papers[i].classList.add((currAboutSubmenu == 'language') ? 'newspaper' + (i + 1) : 'map' + (i + 1));
	}
	
	// Animations with transition
	setTimeout(() => {
		cssSetId('about_submenu_quitter', 'opacity', '1');
		for (let i = 0; i < papers.length; i++) {
			papers[i].style.setProperty('transition', '0.3s');
			setTimeout(() => {
				cssSetToValues(papers[i], data[i]);
			}, Math.random() * 50);
		}
		handleScreenResize();
	}, 50);
}
function english() { changeLanguage(cssGetClass('language_select')[0]); }
function french() { changeLanguage(cssGetClass('language_select')[1]); }
function chinese() { changeLanguage(cssGetClass('language_select')[2]); }
function changeLanguage(language) {
	let currLanguage = cssGetClass('language_select_active')[0];
	currLanguage.classList.remove('language_select_active')
	language.classList.add('language_select_active');
}
function aboutSubmenuBack() {
	cssSetId('about_submenu_quitter', 'opacity', '0');
	cssSetId('sources_block', 'margin-top', '-300%');
	cssSetId('sources_block_box', 'margin-top', '-150%');
	
	let papers = cssGetClass('paper');
	for (let i = 0; i < papers.length; i++) {
		papers[i].style.removeProperty('width');
		papers[i].style.setProperty(sourcesData[i][0], (i == 5) ? '-500%' : '-150%');
		papers[i].style.setProperty('transform', 'translateZ(100px) rotateZ(0deg)')
	}
	setTimeout(() => {
		cssSetId('about_submenu_quitter', 'display', 'none');
		for (let i = 0; i < papers.length; i++) {
			papers[i].classList.remove('map' + (i + 1));
			papers[i].classList.remove('newspaper' + (i + 1));
			cssSetId('about_submenu', 'display', 'none');
		}
		inAboutSubmenu = false;
	}, 500);
}
function sourcesFocusOn(id) {
	let tab = cssGetId(id);
	let active = cssGetClass('sources_block_active')[0];
	active.classList.remove('sources_block_active');
	tab.classList.add('sources_block_active');
	
	let paragraphs = cssFindAll('#' + id + ' p');
	for (let i = 0; i < paragraphs.length; i++) {
		paragraphs[i].style.setProperty('display', 'block !important');
	}
}

function sourcesMainPage()	{ sourcesFocusOn('sources_block_main_page'); }
function sourcesAbout()		{ sourcesFocusOn('sources_block_about'); }
function sourcesProjects()	{ sourcesFocusOn('sources_block_projects'); }
function sourcesMusic()		{ sourcesFocusOn('sources_block_music'); }
function sourcesResources()	{ sourcesFocusOn('sources_block_resources'); }
function sourcesResources()	{ sourcesFocusOn('sources_block_resources'); }
function sourcesResume()	{ sourcesFocusOn('sources_block_resume'); }

/********************************************************
 TV Static
 ********************************************************/

let TVOn = false;
let TVAnimationDone = true;
let forceTVAnimationDone = false;
let opacity = 0;
let progress = 0;
let brightness = 0;
let frameFrequency = 30;
let flicker = 0;

function turnTVOn() {
	forceTVAnimationDone = false;
	TVOn = true;
	
	cssSetId('tv_static', 'transition', '0s');
	cssSetId('tv_static', 'background-color', '');
	setTimeout(() => cssSetId('tv_static', 'transition', '0.5s'), 5);
	
	if (!TVAnimationDone) return;
	TVAnimationDone = false;
	staticLoop();
}

function turnTVOff() {
	if (forceTVAnimationDone) return;
	TVOn = false;
}
function turnTVDefault() {
	TVOn = true;
	forceTVAnimationDone = true;
}

function staticLoop() {
	let canvas = cssGetId('tv_static');
	let context = canvas.getContext('2d');
	let width = canvas.width;
	let height = canvas.height;	
	context.clearRect(0, 0, width, height);
	drawStatic(context, width, height, opacity, brightness);
	drawBorders(context, width, height, progress);
	
	let deltaOpacity = 0;
	let deltaBrightness = 0;
	let deltaProgress = 0;
	let deltaFlicker = -0.02;
	if (TVOn) {
		deltaBrightness = -0.15;
		deltaProgress = -0.15;
		if (progress <= 0.5) {
			if (flicker > 0) {
				deltaOpacity = -0.02;
			} else {
				deltaOpacity = -0.1;
			}
		}
	} else {
		deltaOpacity = 0.2;
		if (opacity >= 0.8) {
			deltaBrightness = 0.15;
			deltaProgress = 0.15;
		}
	}
	if (forceTVAnimationDone) {
		deltaOpacity = -0.2;
		deltaBrightness = -0.2;
		deltaProgress = -0.2;
		deltaFlicker = -0.2;
	}
	opacity = bound(opacity + deltaOpacity, forceTVAnimationDone ? -0.1 : 0, 1);
	brightness = bound(brightness + deltaBrightness, 0 ,1);
	progress = bound(progress + deltaProgress, 0, 1.2);
	flicker = bound(flicker + deltaFlicker, 0, 1);
	
	if (Math.random() < 0.01 && !forceTVAnimationDone) {
		let rand = Math.random();
		flicker = rand * 0.5;
		opacity += rand * 0.3;
	}
	
	TVAnimationDone = (!forceTVAnimationDone && opacity == 1 && brightness == 1 && progress == 1.2) || (forceTVAnimationDone && opacity == -0.1 && brightness == 0 && progress == 0);
	
	setTimeout(() => {
		if (!TVAnimationDone) {
			window.requestAnimationFrame(() => staticLoop(context));
		} else if (TVOn) {
			context.clearRect(0, 0, width, height);
		}
	}, frameFrequency);
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
	if (opacity < 0) return;
	
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
	
	// Flicker box
	context.fillStyle = 'rgba(200, 200, 200, ' + flicker + ')';
	context.fillRect(0, height / 10, width, height / 3);
	context.fillRect(0, height / 1.4, width, height / 8);
	
	// Bottom black box
	blackBoxOffsetY = Math.round(gaussianRandom(0.1 * (1 - opacity) + 0.9, opacity * 0.03) * height);
	boxHeight = height - offsetY;
	context.filter = 'blur(1px)';
	context.fillStyle = 'rgb(0, 0, 0)';
	context.fillRect(-2, blackBoxOffsetY, width + 4, boxHeight);
}


/********************************************************
 Music Menu
 ********************************************************/
function cssGetPseudoElement(id, pseudo) {
	return window.getComputedStyle(cssGetId(id), pseudo);
}

let currAlbum = 0;
let totalAlbums = 0;

function updateAlbum() {
	updateAlbumNumber();
	updateAlbumCoverAndInfo();
	updateAlbumSectionTitle();
	updateAlbumScrollActive();
}
function skipToAlbum(number) {
	if (albumIsFlipping || currAlbum == number + 1) 		return;
	else if (currAlbum < number + 1) 	albumRotateNext = true;
	else								albumRotateNext = false;
	currAlbum = number + 1;
	updateAlbum();
}

function skipScroll() {
	let scroller = cssGetId('album_descriptions_scroller');
	let y = scroller.getBoundingClientRect().top;
	let scrollPixels = bound(cursorY - y, min=0, max=scroller.offsetHeight);
	let scrollAmount = scrollPixels / scroller.offsetHeight * (scroller.scrollHeight - scroller.offsetHeight);
	scroller.scrollTop = scrollAmount;
}
function scrollDrag() {
	let scrollBar = cssGetId('album_descriptions_scroll_button');
	if (window.getComputedStyle(scrollBar).getPropertyValue('cursor') != 'default') return;
	skipScroll();
}

function scrollAlbumDescription() {
	let scroller = cssGetId('album_descriptions_scroller');
	document.documentElement.style.setProperty("--scroll_transition", "0s");
	document.documentElement.style.setProperty("--scroll_offset", (-scroller.scrollTop) + "px");
	
	// Scroll the button
	let scrollProgress = scroller.scrollTop / (scroller.scrollHeight - scroller.offsetHeight);
	let scrollButton = cssFind('#album_descriptions_scroll_button div');
	scrollButton.style.setProperty('top', 'calc(' + (100 * scrollProgress) + '% - ' + (scrollProgress * 100) + 'px)');
	
	// Opacity/size changes if there is overflow
	setTimeout(() => {
		document.documentElement.style.setProperty("--scroll_transition", "0.3s");
		
		let overflow = scroller.scrollHeight != Math.max(scroller.offsetHeight, scroller.clientHeight);
		scrollButton.style.setProperty('height', overflow ? '100px' : '0px');
		
		let scrollBar = cssGetId('album_descriptions_scroll_button');
		scrollBar.style.setProperty('opacity', overflow ? '1' : '0');
		scrollBar.style.setProperty('height', overflow ? '55.5%' : '0%');
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
	if (albumIsFlipping)	return;
	if (currAlbum == 1)		currAlbum = totalAlbums;
	else					currAlbum -= 1;
	albumRotateNext = false;
	updateAlbum();
}
function nextAlbum() {
	if (albumIsFlipping)	return;
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
	if (albumIsFlipping)	return;
	let album = cssGetId('album');
	let albumSectionTitle = cssGetId('album_section_title');
	albumIsFlipping = true;
	for (let i = 1; i <= albumDisplayFrames; i++) {
		let x = i / albumDisplayFrames;
		setTimeout(() => {
			let rotation = rotateDiffY;
			if (albumRotateNext)	rotation += 180 * x;
			else					rotation -= 180 * x;
			if (i >= Math.round(albumDisplayFrames / 2)) {
				rotation += 180;
				if (i == Math.round(albumDisplayFrames / 2)) {
					let windowWidth = Math.max(window.innerWidth, 1000);
					let windowHeight = Math.max(window.innerHeight, 600);
					let albumHeight = Math.min(700, windowHeight * 0.8 - 300 * windowHeight / windowWidth + 100);
					album.style.setProperty('background-image', "url('assets/albums/" + albumImages[currAlbum - 1] + "')");
					album.classList.remove(album.classList[0]);
					album.classList.add(albumId);
					updateAlbumCoverDetails(albumHeight);
				}
			}
			album.style.setProperty('transform', 'rotateX(' + rotateDiffX + 'deg) rotateY(' + rotation + 'deg)');
			
			if (i == albumDisplayFrames)
				albumIsFlipping = false;
		}, 150 * (2 / (1 + Math.exp(-2.2 * (x - 0.5)))) - 0.5);
	}
}

let albumCoverDetails = [[['font-size', 7.125, 'right', 20, 'bottom', 30],	['font-size', 10.6875, 'right', 3.3, 'bottom', 7.5],	['font-size', 18.3225, 'right', 1.9, 'bottom', 5.9],	['top', 20, 'right', 20, 'width', 15, 'height', 7.5]],
						[['font-size', 10, 'right', 20, 'top', 11.3],		['font-size', 18, 'right', 3.9, 'top', 5.7],			['font-size', 30, 'right', 20, 'top', 25],				['left', 3.1, 'top', 12, 'width', 1.49, 'height', 5.5]],
						[[], [], [], []],
						[[], [], [], []],
						[[], [], [], []],
						[[], [], [], []],
						[[], [], [], []],
						[[], [], [], []]];

function updateAlbumCoverDetails(albumHeight) {
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
	
	let albumDetail = albumCoverDetails[currAlbum - 1];
	for (let i = 0; i < albumDetail[0].length; i += 2) { h1.style.setProperty(albumDetail[0][i], (albumHeight / albumDetail[0][i + 1]) + 'px'); }
	for (let i = 0; i < albumDetail[1].length; i += 2) { h2.style.setProperty(albumDetail[1][i], (albumHeight / albumDetail[1][i + 1]) + 'px'); }
	for (let i = 0; i < albumDetail[2].length; i += 2) { h3.style.setProperty(albumDetail[2][i], (albumHeight / albumDetail[2][i + 1]) + 'px'); }
	for (let i = 0; i < albumDetail[3].length; i += 2) { seal.style.setProperty(albumDetail[3][i], (albumHeight / albumDetail[3][i + 1]) + 'px'); }
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
	album_classical_arrangements:		[47, 8, 17, 28],
	album_xenoblade_chronicles_ost:		[60, 10, 30, 0],
	album_fire_emblem_ost:				[60, 10, 30, 0],
	album_the_great_ace_attorney_ost:	[60, 10, 30, 0],
	album_video_game_osts_other:		[42, 8, 15, 35],
	album_anime_osts:					[42, 8, 8, 42],
	album_other:						[50, 8, 17, 25]
};
let albumColumnTitles = {
	album_classical_compositions_solo:	['Title', 'Year', 'For', ''],
	album_classical_arrangements:		['Title', 'Year', 'For', 'Composer'],
	album_xenoblade_chronicles_ost:		['Title', 'Year', 'For', ''],
	album_fire_emblem_ost:				['Title', 'Year', 'For', ''],
	album_the_great_ace_attorney_ost:	['Title', 'Year', 'For', ''],
	album_video_game_osts_other:		['Title', 'Year', 'For', 'Video Game'],
	album_anime_osts:					['Title', 'Year', 'Type', 'Anime'],
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
		scrollAlbumDescription()
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