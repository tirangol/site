let zoomFactor = 0.05;
let cursorX = 0;
let cursorY = 0;
const cZoom = [0.5, 0.44, 0.37, 1, 0.8, 0.9, 1, 0.8, 0.8, 0.3, 0.65, 0.6, 0.2];

function handleMouseMove(event) {
    cursorX = event.clientX;
    cursorY = event.clientY;

    let zoom1 = zoomFactor * cursorX / screen.width;
    let zoom2 = 2000 * zoomFactor * cursorY / screen.width;
    cssScaleMany(zoom1, zoom2, cZoom);
}


function cssScaleMany(zoom1, zoom2, cZoom) {
    function formatValue1(i) {
        let c = cZoom[i] * zoom1 + 1;
        return "scale(" + c + ", " + c + ")";
    }
    function formatValue2(i) {
        let c = cZoom[i] * zoom2 + 50;
        return "50% " + c + "%";
    }

    for (i = 0; i < 13; i++) {
        cssSetId("c" + (i + 1), "transform", formatValue1(i));
        cssSetId("c" + (i + 1), "background-position", formatValue2(i));
    }
}

function cssSetId(id, property, value) {
    document.getElementById(id).style.setProperty(property, value);
}



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
    let varName = p.src[p.src.length - 5];
    return lst[parseInt(varName[varName.length - 1]) - 1];
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

let defaultStartX = 180;
let defaultStartY = 15;
let defaultEndX = 0;
let defaultEndY = 15;
let fps = 30;
let maxIterations = 200;

function updateParticleInfo(particleInfo) {
    startX = particleInfo[0];
    startY = particleInfo[1];
    endX = particleInfo[2];
    endY = particleInfo[3];
    iterations = particleInfo[4];
    iteration = particleInfo[5];
    // currX = particleInfo[6];
    // currY = particleInfo[7];
    // opacity = particleInfo[8];
    startScale = particleInfo[9];
    endScale = particleInfo[10];
    // currScale = particleInfo[11];
    delay = particleInfo[12];
    // particle = particleInfo[13];

    if (iteration >= iterations) {
        resetPath(particleInfo);
        return;
    } else if (delay > 0) {
        particleInfo[6] = startX;
        particleInfo[7] = startY;
        particleInfo[8] = 0.005 * ((maxIterations * fps / 100) - delay) / (maxIterations * fps / 100);
        particleInfo[11] = startScale * ((maxIterations * fps / 100) - delay) / (maxIterations * fps / 100);
        particleInfo[12] -= 1;
        return;
    }
    let x = iteration / iterations
    let i = 1 - Math.sqrt(x);
    let j = Math.sin((Math.PI / 2) * (x));
    let k = 0.5 * x * (x - 1) ** 2 + 0.05 / (1 + Math.exp(5 * (x - 0.5)));
    particleInfo[6] = (1 - x) * startX + x * endX;
    particleInfo[7] = i * startY + (1 - i) * endY;
    particleInfo[8] = k;
    particleInfo[11] = (1 - j) * startScale + j * endScale;
    particleInfo[5] += 1;
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function resetPath(particleInfo) {
    particleInfo[0] = defaultStartX + randomInteger(-10, 0);
    particleInfo[1] = defaultStartY + randomInteger(-15, 0);
    particleInfo[2] = defaultEndX + randomInteger(0, 50);
    particleInfo[3] = defaultEndY + randomInteger(4, 8);
    particleInfo[4] = randomInteger(100, maxIterations) * fps / 100;
    particleInfo[5] = 0;
    particleInfo[9] = 0.75 * Math.random() + 0.75;
    particleInfo[10] = 0.5 * Math.random() + 0.2;
    particleInfo[12] = randomInteger(0, maxIterations) * fps / 100;
}


particles = new Array();
for (i = 0; i < 20; i++) {
    createParticle(p1);
    createParticle(p2);
    createParticle(p3);
    createParticle(p4);
    createParticle(p5);
    createParticle(p6);
    createParticle(p7);
}


function createParticle(p) {
    particles.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, p]);
}
function drawParticle(context, particleInfo) {
    updateParticleInfo(particleInfo);
    drawImage(context, particleInfo[13], particleInfo[6], particleInfo[7], particleInfo[11], particleInfo[8]);
}
function drawParticles(context) {
    for (i = 0; i < particles.length; i++) {
        drawParticle(context, particles[i]);
    }
}

window.requestAnimationFrame(updateSelectAnimation);

function updateSelectAnimation() {
    let canvas = document.getElementById("select_animation");
    let context = canvas.getContext("2d");

    // context.globalCompositeOperation = "normal";
    // context.globalAlpha = 1;
    // context.fillRect(0, 0, canvas.width, canvas.height);
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    drawParticles(context, particles);
    setTimeout(() => {
        window.requestAnimationFrame(updateSelectAnimation);
    }, 1000 / fps);
}

function drawImage(context, image, x, y, scale, opacity) {
    context.filter = "sepia(100%)";
    context.globalCompositeOperation = "lighter";
    context.globalAlpha = opacity;
    context.drawImage(image,
                      x + getParticleXOffset(image),
                      y + getParticleYOffset(image),
                      scale * getParticleScale(image) * image.width,
                      scale * getParticleScale(image) * image.height);
}