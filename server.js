const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const app = express();
const path = require("path");
const Novosti = require("./models/posts");

const pocetnaRoutes = require("./routes/index"),
  novostiRoutes = require("./routes/novosti"),
  preminuliRoutes = require("./routes/preminuli");
const grobljaRoutes = require("./routes/groblja");

app.use(express.static("views")); //omogucava serviranje statickih fajlova u browser
app.use("/", express.static(__dirname + "/"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

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

app.get("/add", (req, res) => {
  res.render("addPost");
});
app.get("/", (req, res) => {
  Novosti.find({}, (err, sveNovosti) => {
    if (err) console.log(err);
    else {
      console.log("PODACI" + sveNovosti);
      res.render("index", { novosti: sveNovosti });
    }
  });
});
app.get("/admin", (req, res) => {
  Novosti.find({}, (err, sveNovosti) => {
    if (err) console.log(err);
    else {
      res.render("adminPanel", { novosti: sveNovosti });
    }
  });
});

app.use("/novosti", novostiRoutes);
app.use("/preminuli", preminuliRoutes);
app.use("/groblja", grobljaRoutes);

app.listen(3000, (req, res) => {
  console.log("SERVER JE STARTOVAN NA PORTU 3000");
});
