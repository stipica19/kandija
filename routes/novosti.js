const express = require("express");
const router = express.Router();

const Novosti = require("../models/posts");

router.get("/", (req, res) => {
  Novosti.find({}, (err, sveNovosti) => {
    if (err) console.log(err);
    else {
      console.log("PODACI" + sveNovosti);
      res.render("blog", { novosti: sveNovosti });
    }
  });
});
router.post("/", (req, res) => {
  console.log("Usli smo u post od novosit");
  const novost = new Novosti({
    naslov: req.body.naslov,
    images: req.body.images,
    description: req.body.description,
    category: req.body.category,
    datum: new Date(),
  });

  novost
    .save()
    .then((res) => {
      console.log("Uspijesno smo spremili novost u bazu" + res);
    })
    .catch((err) => {
      console.log(err);
    });
  res.redirect("/");
});

router.get("/:id/edit", (req, res) => {
  Novosti.findById(req.params.id, (err, trazenaNovost) => {
    if (err) {
      console.log("Greška u traženju NOVOSTI ZA UPDATE" + err);
    } else {
      res.render("updatePost", { novost: trazenaNovost });
    }
  });
});

router.post("/:id", (req, res) => {
  Novosti.findByIdAndUpdate(req.params.id, req.body, (err, updateNovost) => {
    if (err) {
      console.log("GREŠKAA KOD POST ZAHTJEVA ZA UPDATE" + err);
      res.redirect("/");
    } else {
      console.log("Uspjesno azuriran POST", updateNovost);
    }
    res.redirect("/");
  });
});

router.delete("/delete/:id", (req, res) => {
  Novosti.findByIdAndRemove(req.params.id, (err, brisanaNovost) => {
    if (err) {
      console.log("Greška prilikom brisanja NOVOSTI" + err);
    } else {
      console.log("Uspiješno izbrisana novost" + brisanaNovost);
    }
  });
});

module.exports = router;
