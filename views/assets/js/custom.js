jQuery(document).ready(function ($) {
  "use strict";

  $(window).scroll(function () {
    var scroll = $(window).scrollTop();
    var box = $(".header-text").height();
    var header = $("header").height();

    if (scroll >= box - header) {
      $("header").addClass("background-header");
    } else {
      $("header").removeClass("background-header");
    }
  });
});

$(document).ready(function () {
  $(".kratki-tekst").each(function (f) {
    var newstr = $(this).text().substring(35, 280);
    $(this).text(newstr);

    $(".kratki-tekst").append(".");
  });
});

$(document).ready(function () {
  $(".kratki-tekst2").each(function (f) {
    var newstr = $(this).text().substring(59, 180);
    $(this).text(newstr);

    $(".kratki-tekst2").append(".");
  });
});

$(document).ready(function () {
  $("img").click(function () {
    console.log("HALo");
    var src = $(this).attr("src");
    $(".modal").modal("show");
    $("#popup-img").attr("src", src);
  });
});

$(function () {
  if ($("textarea#ta").length) {
    console.log("USLi");
    CKEDITOR.replace("ta");
  }
});
