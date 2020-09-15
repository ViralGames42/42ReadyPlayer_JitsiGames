let game = {};

game={
    preguntas: [
        {
            pregunta: "¿de que color es el caballo blanco de santiago?",
            respuesta: "blanco",
            index: 0
        },
        {
            pregunta: "¿Cuanto es 1+1?",
            respuesta: "2",
            index:1
        },
        {
            pregunta: "¿Como se llama la estrella de nuestro Sistema Solar?",
            respuesta: "sol",
            index: 2
        }
    ],
    usuarios:[],
    methods: {}
}

game.methods.compare = (req, res) => {
    return (req.respuesta === res.respuesta);
};

module.exports = game;