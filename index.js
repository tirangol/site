let zoomFactor = 0.05;

function handleMouseMove(event) {
    let x = event.clientX;
    let y = event.clientY;

    let zoom1 = zoomFactor * x / screen.width;
    let zoom2 = 2000 * zoomFactor * y / screen.width;
    cssScaleMany(zoom1, zoom2, [0.5, 0.44, 0.37, 1, 0.8, 0.9, 1, 0.8, 0.8, 0.3, 0.65, 0.6, 0.2]);

    function formatValue(x, y) {
        return "rotateX(" + x + "deg) rotateY(" + y + "deg)";
    }
    updateSelectAnimation(x, y);
}


function cssScaleMany(zoom1, zoom2, s) {
    let property1 = "transform";
    function formatValue1(i) {
        let c = s[i] * zoom1 + 1;
        return "scale(" + c + ", " + c + ")";
    }

    let property2 = "background-position";
    function formatValue2(i) {
        let c = s[i] * zoom2 + 50;
        return "50% " + c + "%";
    }

    for (i = 0; i < 13; i++) {
        cssSetId("c" + (i + 1), property1, formatValue1(i));
        cssSetId("c" + (i + 1), property2, formatValue2(i));
    }
}

function cssSetId(id, property, value) {
    document.getElementById(id).style.setProperty(property, value);
}

const p1 = new Image(); p1.src = "assets/particles/p1.png";

function updateSelectAnimation(x, y) {
    let canvas = document.getElementById("select_animation");
    let context = canvas.getContext("2d");
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawImage(context, p1, 0, 0, 0.1);
}

function drawImage(context, image, x, y, scale) {
    context.drawImage(image, x, y, scale * image.width, scale * image.height);
}