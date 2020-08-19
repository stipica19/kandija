const express = require("express");
const multer = require("multer");
const router = express.Router();

const path = require("path");
const Groblje = require("../models/groblja");

router.use(express.static("views"));
isAdmin = (req, res, next) => {
  if (req.user == undefined) {
    return res.redirect("/");
  } else if (req.user.isAdmin == false) {
    return res.redirect("/");
  }
  next();
};
//Set Storage Engine
const storage = multer.diskStorage({
  destination: "./views/public/",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
// INIT Upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("images");

function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

router.get("/", (req, res) => {
  Groblje.find({}, (err, groblja) => {
    if (err) {
      console.log("Greška kod dohvacanja groblja" + err);
    } else {
      console.log(groblja);
      res.render("groblja", { groblja: groblja });
    }
  });
});

router.get("/add", isAdmin, (req, res) => {
  res.render("addGroblje");
});

router.post("/upload", isAdmin, (req, res) => {
  console.log("USao u post");
  upload(req, res, (err) => {
    if (err) {
      res.render("addGroblja", { msg: err });
    } else {
      if (req.file == undefined) {
        res.render("addGroblje", {
          msg: "Error: No File Selected!",
        });
      } else {
        console.log(req.file);
        const groblje = new Groblje({
          images: req.file.filename,
          description: req.body.description,
          groblje: req.body.groblje,
        });
        Groblje.findOne({ groblje: req.body.groblje }, (err, rez) => {
          if (rez) {
            console.log("Postoji groblje s tim imenom");
            Groblje.findOneAndUpdate(
              { groblje: req.body.groblje },
              { $push: { images: req.file.filename } },
              (err, sss) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log("fafaf " + groblje.images);
                }
              }
            );
          } else {
            console.log("NE Postoji groblje s tim imenom");
            groblje
              .save()
              .then((res) => {
                console.log(`Uspjesno spremljeno groblje  ${req.body.groblje}`);
              })
              .catch((err) => {
                console.log(err);
              });
          }
        });
      }
    }
  });
});

router.get("/:groblje", (req, res) => {
  console.log(req.params.groblje);
  Groblje.find({ groblje: req.params.groblje }, (err, trazenoGroblje) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Usli smo u rutu ${req.params.groblje}`);
      res.render("Groblje", { groblje: trazenoGroblje });
    }
  });
});

/*EDITOVANJE GROBLJA */
/*EDITOVANJE GROBLJA */
router.get("/:groblje/edit", (req, res) => {
  Groblje.findOne({ groblje: req.params.groblje }, (err, trazenoGroblje) => {
    if (err) {
      console.log("Greška u traženjuGROBLJA ZA UPDATE " + err);
    } else {
      //console.log("Nadjeno je + " + trazenoGroblje);
      res.render("updateGroblje", { groblje: trazenoGroblje });
    }
  });
});

router.post("/delete/:images", (req, res) => {
  console.log("izbrisansssssssssssssssssssso");
  Groblje.findOneAndUpdate(
    { images: req.params.images },
    { $pull: { images: req.params.images } },
    { new: true },
    (err, node) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Uspiješno izbrisana slika od groblja" + node.images);
      }
    }
  );
});

/*AZURIRANJE GROBLJA JEDNOG */
router.post("/:groblje", isAdmin, (req, res) => {
  console.log("DOslo za update :  " + req.body.description);
  Groblje.findOneAndUpdate(
    { groblje: req.params.groblje },
    { $set: { description: req.body.description } },
    { new: true },
    (err, azuriranoGroblje) => {
      if (err) {
        console.log(err);
      } else {
        console.log("USPJESNO AZURIRANJA GROBLJA" + azuriranoGroblje);
      }
      res.redirect("/groblja/" + req.params.groblje);
    }
  );
});

module.exports = router;
