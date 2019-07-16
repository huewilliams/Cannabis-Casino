const express = require('express');
const path = require('path');
const morgan = require('morgan');
require('dotenv').config({path: '.env'});
const favicon = require('express-favicon');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const WebSocket = require('./socket');

const sequelize = require('./models').sequelize;
const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const pokerRouter = require('./routes/poker');
const lottoRouter = require('./routes/lotto');

const app = express();
sequelize.sync();

app.set('port', process.env.PORT || 5000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(cors('http://18.220.117.207:5000/'));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false, limit: '50mb'}));
app.use(cookieParser('cannabisCasino'));
// login, signUp, gameSelect page
app.use(express.static(path.join(__dirname, 'public')));
// upload file directory
app.use(express.static(path.join(__dirname, 'uploads')));

app.use('/auth', authRouter);
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/poker', pokerRouter);
app.use('/lotto', lottoRouter);

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
});

const server = app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});

WebSocket(server, app);
module.exports = app;