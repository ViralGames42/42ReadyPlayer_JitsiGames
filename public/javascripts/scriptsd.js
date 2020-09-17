




 function onResize() {
	if (canvas == null)
		return;

	var w = (window.innerWidth-marginLR*2)/canvas.width;
	var h = (window.innerHeight-marginUD*2)/canvas.height;
	var scale = Math.min(h, w);

	canvas.style.width = (canvas.width*scale)+'px';
	canvas.style.height = (canvas.height*scale)+'px';
	canvas.style.position = 'absolute';
	canvas.style.left = '50%';
	canvas.style.top = '50%';
	canvas.style.marginLeft = -(canvas.width*scale)/2+'px';
	canvas.style.marginTop = -(canvas.height*scale)/2+'px';
}

function checkCapabilities() {
	var errores = "";

	video = document.createElement("video");
	if (video == null)
		errores += "Video tag is not supported\n";
	if (!hasCanvas())
		errores += "Canvas tag is not supported\n";
	if (!hasGetUserMedia())
		errores += "GetUserMedia API is not supported\n";
	if (!hasURL())
		errores += "URL is not supported\n";

	if (errores != "") {
		return "Your web browser is older than "
			+"necesari to support this modern "
			+"aplication.\n" + errores;
	}
	return "";
}

function hasCanvas() {
	var elem = document.createElement('canvas');
	return !!(elem.getContext && elem.getContext('2d'));
}

function hasGetUserMedia() {
	navigator.getUserMedia = navigator.getUserMedia ||
		navigator.webkitGetUserMedia ||
		navigator.mozGetUserMedia ||
		navigator.msGetUserMedia;

	if (navigator.getUserMedia) {
		return true
	}
	return false;
}

function hasURL() {
	window.URL = window.URL ||
		window.webkitURL ||
		window.mozURL ||
		window.msURL;

	if (window.URL && window.URL.createObjectURL) {
		return true;
	}
	return false;
}

function webcamError(e) {
	alert("We are experiencing problems to obtain "
		+"webcam stream. Details: "+e);
}

function setWebcamStream(stream) {
	video.src = window.URL.createObjectURL(stream);
	video.play();
	setInterval(updateWorld, 1000/10);
	startTime = Date.now();
	canvas.style.boxShadow = "0px 0px 10px #FFF";
}

function updateWorld() {
	update();
	paint();
}

function update() {
	for (var i=0; i<buttons.length; i++) {
		if (buttons[i].hasMotion()) {
			if (estado == "esperando" &&
				Date.now()-startTime >= 1000) {
				estado = "reproduciendo";
				setTimeout(getNotes, timeActive);
				break;
			} else if (estado == "jugando") {
				if (combinacion[turno] != i) {
					estado = "perdiendo";
					document.getElementById("fin").play();
					setTimeout(function () {
						estado = "esperando";
						turno = 0;
						combinacion = [];
					}, timeActive*5);
				} else {
					if (++turno == combinacion.length) {
						estado = "ok";
						setTimeout(getNotes, timeActive*2);
						turno++;
					}
				}
			}
		}
	}
}

function paint() {
	ctx.save();
	if (mirror) {
		ctx.translate(width, 0);
		ctx.scale(-1, 1);
	}
	ctx.drawImage(video, width/2-video.videoWidth/2,
		height/2-video.videoHeight/2);
	ctx.restore();

	for (var i=0; i<buttons.length; i++) {
		buttons[i].paint();
	}

	if (estado == "esperando") {
		ctx.textBaseline = "bottom";
		ctx.font = "25px san-serif";

		ctx.lineWidth = 4;
		ctx.strokeStyle = "#FFF";
		ctx.strokeText(" touch any screen color"
			+" to start the game.", 0, height-25);
		ctx.strokeText(" Posteriormente memoriza la "
			+"secuencia y repítela.", 0, height);
		ctx.fillText(" Toca cualquier color de la pantalla"
			+" para iniciar la partida.", 0, height-25);
		ctx.fillText(" Posteriormente memoriza la secuencia"
			+" y repítela.", 0, height);
	} else if (estado == "perdiendo") {
		ctx.textBaseline = "bottom";
		ctx.font = "30px san-serif";
		ctx.lineWidth = 4;
		ctx.strokeStyle = "#FFF";
		ctx.strokeText(" ¡Fallaste! Puntuación: "
			 +(combinacion.length-1), 0, height);
		ctx.fillStyle = "red";
		ctx.fillText(" ¡Fallaste! Puntuación: "
			 +(combinacion.length-1), 0, height);
		ctx.fillStyle = "#000"
	} else if (estado == "ok") {
		ctx.textBaseline = "bottom";
		ctx.font = "30px san-serif";
		ctx.lineWidth = 4;
		ctx.strokeStyle = "#FFF";
		ctx.strokeText("¡Bien! Puntuación: "
			+combinacion.length, 0, height);
		ctx.fillStyle = "green";
		ctx.fillText("¡Bien! Puntuación: "
			+combinacion.length, 0, height);
		ctx.fillStyle = "#00";
	}


	var pixels1 = motionCtx.getImageData(0, 0,
		motionWidth, motionHeight);

	motionCtx.save();
	if (mirror) {
		motionCtx.translate(motionWidth, 0);
		motionCtx.scale(-1, 1);
	}
	motionCtx.drawImage(video, 0, 0, motionWidth,motionHeight);
	motionCtx.restore();

	var pixels2 = motionCtx.getImageData(0, 0,
		motionWidth, motionHeight);

	var binaryPixels = getBinaryImage(pixels1, pixels2);
	binaryCtx.putImageData(binaryPixels, 0, 0);
}

function getBinaryImage(pixels1, pixels2) {
	var data1 = pixels1.data;
	var data2 = pixels2.data;

	for (var i=0; i<data1.length; i+=4) {
		if (Math.abs(data1[i]-data2[i])>limit ||
			Math.abs(data1[i+1]-data2[i+1])>limit ||
			Math.abs(data1[i+2]-data2[i+2])>limit)
		{
			data1[i] = data1[i+1] = data1[i+2] = 255;
		} else {
			data1[i] = data1[i+1] = data1[i+2] = 0;
		}
		data1[i+3] = 255;
	}

	return pixels1;
}

function getNotes() {
	estado = "reproduciendo";
	combinacion.push(~~(Math.random()*buttons.length));
	timeActive = 500-turno*15;
	timeActive = (timeActive < 200) ? 200: timeActive;
	for (var i=0; i<combinacion.length; i++) {
		getNote(i);
	}
	setTimeout(function () {
		estado = "jugando";
		turno = 0;
	}, timeActive*i);
	timeActive = 500;
}

function getNote(number) {
	setTimeout(function () {
		if (number-1 > 0) {
			buttons[combinacion[number-1]].active = false;
			buttons[combinacion[number-1]].paint();
		}
		buttons[combinacion[number]].setActive();
	}, timeActive*number);
}

function Button (x, y, w, h, img, audio) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.img = img;
	this.active = false;
	this.timeActive = 0;
	this.audio = [];
	for (var i=0; i<this.NUM_AUDIO; i++) {
		this.audio[i] = new Audio();
		this.audio[i].src = audio.src;
	}
	this.nAudio = 0;
}

Button.prototype = {
	NUM_AUDIO: 10,
	paint: function () {
		ctx.save();
		if (this.active) {
			ctx.globalCompositeOperation = "lighter";
			//ctx.fillStyle = "red";
		} //else {
			//ctx.fillStyle = "black";
		//}
		//ctx.fillRect(this.x, this.y, this.w, this.h);
		//ctx.fillStyle = "white";
		//ctx.fillRect(this.x+marginDetect, this.y+marginDetect,
		//     this.w-marginDetect*2, this.h-marginDetect*2);
		ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
		ctx.restore();
	},
	hasMotion: function () {
		if (estado == "ok" || estado == "perdiendo") {
			return;
		}

		var pixels = binaryCtx.getImageData(
			motionWidth*this.x/width+marginDetect,
			motionHeight*this.y/height+marginDetect,
			motionWidth*this.w/width-marginDetect*2,
			motionHeight*this.h/height-marginDetect*2);
		var data = pixels.data;
		var whitePixels = 0;

		for (var i=0; whitePixels<nPixels &&
			 i<data.length; i+=4) {
			if (data[i] == 255) {
				whitePixels++;
			}
		}

		if (whitePixels >= nPixels && estado!="reproduciendo") {
			if (!this.active) {
				if (estado != "esperando") {
					this.setActive();
				}
				return true;
			}
		} else {
			if (Date.now()-this.timeActive >= timeActive)
				this.active = false;
		}

		return false;
	},
	setActive: function () {
		this.timeActive = Date.now();
		this.active = true;
		this.audio[this.nAudio].play();
		this.nAudio = (this.nAudio+1)%this.NUM_AUDIO;
	},
	isActive: function () {
		return this.active;
	}
};
