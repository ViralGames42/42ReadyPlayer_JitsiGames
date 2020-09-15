const express = require('express');
const router = express.Router();

// Endpoints
router.get('/', (req, res) => {
    res.render('');
})

router.get('/register', (req, res) => {
    res.render('register');
})

router.get('/room', (req, res) => {
    res.render('partials/_Room');
})


module.exports = router
