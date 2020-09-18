/* puzzle init script */

var piezas, wPieza, hPieza;
var PIEZAS_X, PIEZAS_Y;
var canvas, ctx, webcam;
var xPoint, yPoint, down;
var modo = "move", anteriorClick = -1;

function hasGetUserMedia() {
    navigator.getUserMedia = navigator.getUserMedia || // Opera
        navigator.webkitGetUserMedia || // Chrome, Safari
        navigator.mozGetUserMedia || // Mocilla nightly
        navigator.msGetUserMedia; // Explorer
    if (navigator.getUserMedia) {
        return true
    }
    return false;
} // fin de hasGetUserMedia();

function hasURL() {
    window.URL = window.URL || window.webkitURL
        || window.mozURL || window.msURL;
        alert (window.URL);
    if (window.URL && window.URL.createObjectURL) {
        return true;
    }
    return false;
} // fin de hasURL();

function onLoadpzz () {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    webcam = document.getElementById("webcam");
    canvas.addEventListener("mousedown", mouseDown);
    canvas.addEventListener("mouseup", mouseUp);
    canvas.addEventListener("mouseout", mouseUp);
    canvas.addEventListener("mousemove", movePoint);
    if (!hasGetUserMedia() || !hasURL()) {
        alert("Tu navegador no soporta getUserMedia()");
    } else {
        navigator.getUserMedia(
            {video: true, audio: false},
            setStream,
            error
        );
    }
} // fin de onLoad();

function error(e) {
    alert("Fallo en la aplicación. "+e);
} // fin de error();

function setStream(stream) {
    webcam.src = window.URL.createObjectURL(stream);
	iniciarJuego();
    // Cuando todo esté correctamente cargado se iniciará.
	webcam.addEventListener("loadedmetadata", function () {
		canvas.width = webcam.videoWidth;
		canvas.height = webcam.videoHeight;
        wPieza = webcam.videoWidth/PIEZAS_X;
        hPieza = webcam.videoHeight/PIEZAS_Y;
	});
	webcam.addEventListener("canplay", function () {
		setInterval(updateCanvas, 100);
	});
	webcam.play();
} // fin de getStream();

function mouseDown(e) {
    down = true;
    movePoint(e);
}

function mouseUp(e) {
    down = false;
}

function movePoint(e) {
    var ie = navigator.userAgent.toLowerCase()
        .indexOf('msie')!=-1;
    if (ie) {
        e = window.event;
        e.pageX = e.clientX+window.pageXOffset;
        e.pageY = e.clientY+window.pageYOffset;
    }
    xPoint = e.pageX-canvas.offsetLeft;
    yPoint = e.pageY-canvas.offsetTop;
}

function updateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i=0; i<piezas.length; i++) {
        var pieza = piezas[i];
        // Si es la pieza libre seguimos iterando.
        if (pieza == -1) {
            continue;
        }
        if (down) {
            var piezaClick = 0;
            piezaClick += Math.floor(yPoint/hPieza)*PIEZAS_X;
            piezaClick += Math.floor(xPoint/wPieza);
            down = false;
            if (modo=="move") {
                muevePieza(piezaClick);
            } else if (modo=="interchange") {
                intercambiaPiezas(piezaClick);
            }
        }
        var sx = pieza%PIEZAS_X*wPieza;
        var sy = Math.floor(pieza/PIEZAS_X)*hPieza;
        var x = i%PIEZAS_X*wPieza;
        var y = Math.floor(i/PIEZAS_X)*hPieza;
        ctx.drawImage(webcam, sx, sy, wPieza, hPieza, x, y, wPieza, hPieza);
        if (isComplete()) {
            ctx.font = "bold 40px Arial";
            ctx.fillStyle = "#FFF";
            ctx.fillText("¡Hiciste el puzzle!", 100, 98);
            ctx.fillText("¡Hiciste el puzzle!", 102, 100);
            ctx.fillText("¡Hiciste el puzzle!", 100, 102);
            ctx.fillText("¡Hiciste el puzzle!", 98, 100);
            ctx.fillStyle = "#000";
            ctx.fillText("¡Hiciste el puzzle!", 100, 100);
        }
    }
}

function muevePieza(piezaClick) {
    if (piezas[piezaClick] != -1) {
        if (piezaClick+PIEZAS_X < piezas.length
            && piezas[piezaClick+PIEZAS_X] == -1) {
                piezas[piezaClick+PIEZAS_X] = piezas[piezaClick];
                piezas[piezaClick] = -1;
        } else if (piezaClick-PIEZAS_X >= 0
            && piezas[piezaClick-PIEZAS_X] == -1) {
                piezas[piezaClick-PIEZAS_X] = piezas[piezaClick];
                piezas[piezaClick] = -1;
        } else if (piezaClick-1 >= 0
            && piezas[piezaClick-1] == -1
            && piezaClick%PIEZAS_X != 0) {
                piezas[piezaClick-1] = piezas[piezaClick];
                piezas[piezaClick] = -1;
        } else if (piezaClick+1 < piezas.length
            && piezas[piezaClick+1] == -1
            && piezaClick%PIEZAS_X != PIEZAS_X-1) {
                piezas[piezaClick+1] = piezas[piezaClick];
                piezas[piezaClick] = -1;
        }
    }
}

function intercambiaPiezas(piezaClick) {
    console.log(piezaClick+" - "+anteriorClick);
    if (anteriorClick == piezaClick)
        return;
    else if (anteriorClick == -1) {
        anteriorClick = piezaClick;
        return;
    }

    var aux;
    if (piezaClick+PIEZAS_X == anteriorClick
        || piezaClick-PIEZAS_X == anteriorClick
        || (piezaClick-1 == anteriorClick
        && piezaClick%PIEZAS_X != 0)
        || (piezaClick+1 == anteriorClick
        && piezaClick%PIEZAS_X != PIEZAS_X-1)) {
            aux = piezas[piezaClick];
            piezas[piezaClick] = piezas[anteriorClick];
            piezas[anteriorClick] = aux;
            anteriorClick = -1;
    } else {
        anteriorClick = piezaClick;
    }
}

function isComplete() {
    var complete = true;
    for (var i = 0; complete && i < piezas.length; i++) {
        if (piezas[i] != i && piezas[i] != -1)
            complete = false;
    }
    return complete;
}

function cambiarBackgroundColor() {
    document.body.style.backgroundColor = document.getElementById
        ("color").value;
}

function iniciarJuego() {
    modo = document.getElementById("modo").value;
    PIEZAS_X = parseInt(document.getElementById("piezasx").value);
    PIEZAS_Y = parseInt(document.getElementById("piezasy").value);
    piezas = new Array(PIEZAS_X*PIEZAS_Y);
    // Damos un valor inicial, desordenamos las piezas.
    var todasPiezas = new Array(piezas.length);
    for (var i=0; i<todasPiezas.length; i++) {
         todasPiezas[i] = i;
    }
    for (var i=0; i<piezas.length; i++) {
        var random = Math.floor(Math.random()*todasPiezas.length);
        piezas[i] = todasPiezas[random];
        todasPiezas[random] = -1;
        var aux = [];
        for (var j=0; j<todasPiezas.length; j++) {
            if (todasPiezas[j] != -1) {
                aux.push(todasPiezas[j]);
            }
        }
        todasPiezas = aux;
    }
    if (modo=="move") {
        var random = Math.floor(Math.random()*piezas.length);
        piezas[random] = -1;
    }
    if (canvas.width != 0) {
        wPieza = canvas.width/PIEZAS_X;
        hPieza = canvas.height/PIEZAS_Y;
    }
}
