const favicon = require('serve-favicon');
const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');

module.exports = app => {
    app.engine(".hbs", exphbs({
        defaultlayout: "main",
        extname : ".hbs"
    }))
    app.set("view engine", ".hbs");
    app.use(express.static(path.join(__dirname, '..', 'public')))
    app.use(favicon(path.join(__dirname, '..', 'public', 'images', 'favicon.ico')))
}