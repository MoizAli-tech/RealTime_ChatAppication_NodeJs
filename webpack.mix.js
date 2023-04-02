const mix = require("laravel-mix");

mix.js('src/js/app.js', 'dist/js/app.js').sass("src/scss/app.scss","dist/css/app.css");