const express = require('express');
const path = require('path');
const morgan = require('morgan');
const favicon = require('express-favicon');
const sequelize = require('./models').sequelize;

//const indexRouter = require('./routes');

const app = express();
sequelize.sync();

app.set('port', process.env.PORT || 4000);
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended : false , limit: '50mb'}));

//app.use('/', indexRouter);

// 해당 라우터가 없을시 404 Error 발생
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// 에러 핸들러
app.use((err, req, res) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render(error);
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});