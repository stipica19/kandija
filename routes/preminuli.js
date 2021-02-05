const express = require("express");
const router = express.Router();

const Novosti = require("../models/posts");
const { response } = require("express");

/* router.get("/", (req, res) => {
  Novosti.find({ category: "Preminuli" }, (err, preminuli) => {
    res.render("preminuli", { preminuli: preminuli });
  });
});
 */
/*=================================================================== */
router.get("/", (req, res) => {
  console.log("USLI SMO U GET" + req.query.search);

  var perPage = 6;
  var pageQuery = parseInt(req.query.page, 10);
  var pageNum = pageQuery && pageQuery >= 1 ? pageQuery : 1;
  var noMatch = false;

  if (req.query.search) {
    console.log("USLI SMO U GET IF --" + req.query.search);
    const regex = new RegExp(escapeRegex(req.query.search), "gi");
    Novosti.find({ naslov: regex, category: "Preminuli" })
      .sort({ datum: -1 })
      .skip((pageNum - 1) * perPage)
      .limit(perPage)
      .exec(function (err, artikl) {
        if (err || !artikl) {
          req.flash("error", "Something Went Wrong");
          console.log("DOVDsfse");
          return res.redirect("/preminuli");
        }
        Novosti.find({ naslov: regex })
          .countDocuments()
          .exec(function (err, count) {
            var totalPages = Math.ceil(count / perPage);

            if (pageNum < 1 || pageNum > totalPages) {
              res.redirect("/preminuli");
            } else {
              res.render("preminuli", {
                preminuli: artikl,
                page: "preminuli",
                search: false,
                current: pageNum,
                totalPages: totalPages,
              });
            }
          });
      });
  } else {
    console.log("USLI SMO U GET ELSE  " + req.query.search);
    Novosti.find({ category: "Preminuli" })
      .sort({ datum: -1 })
      .skip((pageNum - 1) * perPage)
      .limit(perPage)
      .exec(function (err, artikl) {
        if (err || !artikl) {
          req.flash("error", "Something Went Wrong");
          return res.redirect("/preminuli");
        }
        Novosti.countDocuments().exec(function (err, count) {
          var totalPages = Math.ceil(count / perPage);

          if (err) {
            req.flash("error", "Something Went Wrong");
            res.redirect("/preminuli");
          } else if (pageNum < 1 || pageNum > totalPages) {
            //req.flash("error", "Page Index Out of Range"); //pado server zbog ovog :D
            res.redirect("/novosti");
          } else {
            res.render("preminuli", {
              preminuli: artikl,
              page: "preminuli",
              search: false,
              current: pageNum,
              totalPages: totalPages,
            });
          }
        });
      });
  }
});
/*==================================================================*/
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
module.exports = router;
