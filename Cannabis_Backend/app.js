const express = require('express');
const path = require('path');
const morgan = require('morgan');
const favicon = require('express-favicon');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const sequelize = require('./models').sequelize;
const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');

const app = express();
sequelize.sync();

app.set('port', process.env.PORT || 5000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(cors());
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