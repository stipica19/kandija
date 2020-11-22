const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const app = express();
const path = require("path");
const Novosti = require("./models/posts");
const LocalStrategy = require("passport-local");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const expressSanitizer = require("express-sanitizer");

const novostiRoutes = require("./routes/novosti");
const preminuliRoutes = require("./routes/preminuli");
const grobljaRoutes = require("./routes/groblja");
const indexRoutes = require("./routes/index");
const MongoStore = require("connect-mongo")(session);
const User = require("./models/user");

app.use(express.static("views")); //omogucava serviranje statickih fajlova u browser

app.use("/", express.static(__dirname + "/"));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));

const uri = `mongodb+srv://stipica97:<stipica1910>@cluster0.irnfl.mongodb.net/<zupa>?retryWrites=true&w=majority`;
// connects mongoose to the uri and sets some mongoose keys to true to combat mongoose's deprecation warnings
mongoose.connect("mongodb://localhost:27017/kandija", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
// make sure that MongoDB connected successfully
connection.once("open", () => {
  console.log("MongoDB database connected!!");
});

// PASSPORT CONFIGURATION
//PASSPORT CONFIGURATIONgit
app.use(
  require("express-session")({
    secret: "bilo sta mozes ovdje napisat nije bitno",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
    }),
    cookie: { maxAge: 100 * 60 * 100 },
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session(User.authenticate()));
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  // res.locals.error = req.flash("error");
  next();
});

app.use("/novosti", novostiRoutes);
app.use("/preminuli", preminuliRoutes);
app.use("/groblja", grobljaRoutes);
app.use(indexRoutes);

app.listen(3001, (req, res) => {
  console.log("SERVER JE STARTOVAN NA PORTU 3000");
});
