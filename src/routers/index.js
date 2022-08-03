const newsRouter = require('./news');
const BookRouter = require('./book');

function route(app) {
    app.use('/book', BookRouter);
    app.use('/', newsRouter);
}

module.exports = route;
