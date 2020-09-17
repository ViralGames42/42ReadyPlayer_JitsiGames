const express = require('express');
const { route } = require('../app');
const userController = require('../controllers/UserController');
const roomController = require('../controllers/RoomController');
const router = express.Router();

// Endpoints

/*
** LANDING PAGE
*/

router.get('/', (req, res) => {
    res.render('index');
});

/*
**  VISTAS
*/

router.get('/register', (req, res) => {
    res.render('register');
});

//juego de simon
router.get('/simon', (req, res) => {
    res.render('simon');
});

//juego de puzzle
router.get('/puzzle', (req, res) => {
    res.render('puzzle');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/new-game', (req, res) => {
    res.render('new-game');
});
router.get('/room/:id', (req, res) => {
    res.render('room', {data:req.params});
})

// pagina de instrucciones
router.get('/howto', (req, res) => {
    res.render('howto');
});
// pagina de quienes somos
router.get('/about', (req, res) => {
    res.render('about');
});


/* router.get('/room/:id', (req, res) => {
    res.render('room');
}); */


/*
** USER CONTROLLERS
*/

router.post('/signup', (req, res) => {
    userController.signup(req, res);
});

router.post("/login", (req, res) => {
    userController.login(req, res);
});

/*
**  ROOM CONTROLLERS
*/

router.post('/room/create', (req, res) => {
    roomController.create(req, res);
});

router.post('/room-join/:id', (req,res) => {
    roomController.addUser(req, res);
});

module.exports = router
