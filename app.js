const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const exphbs = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override')
const socket = require('socket.io');
const app = express()

//load modals
require('./models/User');
require('./models/Chat');
const Chat = mongoose.model('chats')
const User = mongoose.model('users')

//load routes
const chats = require('./routes/chats');
const users = require('./routes/users');

//passport Config
require('./config/passport')(passport);

//database config
const db = require('./config/database');

//connect to mongoose
mongoose.connect(db.mongoURI)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

//handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
//set view engine
app.set('view engine', 'handlebars');

//static folder
app.use(express.static(path.join(__dirname, 'public')));

//parse middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//override middleware
app.use(methodOverride('_method'));

app.use(cors())

//session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//flash middleware
app.use(flash());

//global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.warning_msg = req.flash('warning_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.info_msg = req.flash('info_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    res.locals.ioURI = db.ioURI;
    next();
})

//routes
const port = process.env.PORT || 5000;

//welcome
app.get('/', (req, res) => { res.render('welcome') })

//use routes
app.use('/chats', chats);
app.use('/users', users);

//listen 
var server = app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})
var io = socket(server);

io.on('connection', (socket) => {
    console.log('Socket connection ', socket.id);

    socket.on('chat', function (data) {
        const newMessage = {
            message: data.message,
            userFrom: data.userFrom,
        }
        new Chat(newMessage)
            .save()
            .then(story => {
                io.sockets.emit('chat', data);
            })
    });

    socket.on('typing', function (data) {
        socket.broadcast.emit('typing', data);
    });

});