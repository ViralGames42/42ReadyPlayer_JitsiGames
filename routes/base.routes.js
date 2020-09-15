const express = require('express');
const { route } = require('../app');
const userController = require('../controllers/UserController');
const router = express.Router();

// Endpoints

/*
** LANDIN PAGE
*/
router.get('/', (req, res) => {
    res.render('index');
})

/*
**  VISTAS
*/

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/room', (req, res) => {
    res.render('room');
})

/*
** USER CONTROLLERS
*/
router.post('/signup', (req, res) => {
    userController.signup(req, res);
});

router.post("/login", (req, res) => {
    userController.login(req, res);
});


module.exports = router
