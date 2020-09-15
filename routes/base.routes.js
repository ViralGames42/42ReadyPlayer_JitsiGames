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

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/new-game/:id', (req, res) => {
    res.render('new-game');
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

router.post('/room/:id', (req,res) => {
    roomController.addUser(req, res);
});

module.exports = router