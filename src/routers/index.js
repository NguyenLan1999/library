const newsRouter = require('./news');
const BookRouter = require('./book');
const userRouter = require('./user');

function route(app) {
    app.use('/user', userRouter)
    app.use('/book', BookRouter);
    app.use('/', newsRouter);
}

module.exports = route;
