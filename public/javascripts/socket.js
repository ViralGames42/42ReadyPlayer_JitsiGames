let socket = io('http://192.168.1.73:3000', {
    'forceNew':true
});

function render(data, location){
    document.getElementById(location).innerHTML = data;
}

socket.on('messages', (data) => {
    var html = data.map((message, index) => {
        return(`
            <div class="message">
                <strong>${message.nickname}</strong>
                <p>${message.message}</p>
            </div>
            </br>
        `);
    });
    console.log(data);
    render(html, 'messages');
});

/*
**   PEDIR PREGUNTA
**      activacion: boton
**      emit: pedir-pregunta
*/

$("#pedir-pregunta").submit(function (e){
    e.preventDefault();
    let form = {
        nickname: $("#nickname").val()
    }
    console.log(form)
    socket.emit('pedir-pregunta', form);
});


/*
**  EVENTO DEVOLVER PREGUNTA
*/

socket.on('devolver-pregunta', (data) => {
    console.log("llegó el evento devolver-pregunta.");
    let html = `<div class="message">
                    <strong>
                        ${data.msg}
                        </br>
                        ${data.pregunta.pregunta}
                    </strong>
                    <input id="index-pregunta" 
                    style="display:none;"
                    value=${data.pregunta.index}>
                </div>
                </br>`;

    console.log(data);
    render(html, 'preguntas');
});

$("#devolver-respuesta").submit(function (e){
    e.preventDefault();
    console.log('llego al evento responder pregunta')
    let form = {
        pregunta: $('#index-pregunta').val(),
        respuesta: $('#respuesta').val()
    };
    console.log(form)
    socket.emit('responder-pregunta', form);
});


/*
**  EVENTO RESPUESTA CORRECTA
**      event:respuesta-correcta
*/

socket.on('respuesta', (data) => {
    console.log("llegó el evento respuesta.");
    let html = `<div class="message">
                    <strong>
                        ${data.msg}
                    </strong>
                </div>
                </br>`;

    console.log(data);
    render(html, 'respuestas');
});