let game = {};
let jugador = {
    nickName : undefined,
    score : 0
}

let room = {
    nombre : undefined,
    jugadores : [],
    presentador : undefined,
    palabras : ["home", "covid", "party", "game", "42", "adictive", "enjoy", "team", "sport"],
    palabraActual : undefined,
    palabrasAcertadas : [],
    ronda : undefined,
    metodos : {},
};

game.rooms =[room]

room.metodos.compareWord = (respuesta) => {
    if (respuesta === room.palabraActual) {
        let pos = room.palabras.indexOf(respuesta);
        let palabra = room.palabras.splice(pos,1);
        room.palabrasAcertadas.push(palabra);
        room.metodos.newWord();
        return true;
    } else {
        return false;
    }
};

room.metodos.addJugador = (nickName) => {
    let flag = true;
    let i = 0;
    if (room.jugadores.length < 8) {
        while (i < room.jugadores.length && flag) {
            if (room.jugadores[i].nickName !== nickName)
                i++;
            else {flag = false}
        }
        if(flag == true) {
            room.jugadores.push({
                nickName : nickName,
                score : 0
            });
        }
    }
}

room.metodos.newWord = () => {
    let randIndex = Math.floor(Math.random() * Math.floor(room.palabras.length));
    room.palabraActual = room.palabras[randIndex];
    return room.palabraActual;
}

room.metodos.selectPresentador = () => {
    let randIndex = Math.floor(Math.random() * Math.floor(room.jugadores.length));
    room.presentador = room.jugadores[randIndex];
    return room.presentador.nickName;
}

room.metodos.startGame = () => {
    room.metodos.selectPresentador();
    room.metodos.newWord();
}



module.exports = game;