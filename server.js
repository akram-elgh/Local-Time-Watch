const express = require("express");
const https = require("https");
const app = express();
const timezone = require(__dirname + "/timezoneList.js");

var regions = timezone.timezones();
var region = "";
var url = "";
var text = "";

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
https.get("https://worldtimeapi.org/api/ip", function (res) {
  res.on("data", function (data) {
    let object = JSON.parse(data);
    region = object.timezone;
  });
});

app.get("/", function (req, res) {
  url = "https://worldtimeapi.org/api/timezone/" + region;
  var city = region.split("/");
  text = "The time in " + city[1].replaceAll("_", " ") + " is ";
  https.get(url, function (response) {
    response.on("data", function (data) {
      const object = JSON.parse(data);
      const localtime = object.datetime;
      const time = localtime.slice(11, 19);
      res.render("time", {
        text: text,
        time: time,
        regions: regions,
        url: url,
      });
    });
  });
  // },1000)
});

app.post("/", function (req, res) {
  if (req.body.region != "") region = req.body.region;
  res.redirect("/");
});

app.listen(3000, function () {
  console.log("Server listening on port 3000");
});
