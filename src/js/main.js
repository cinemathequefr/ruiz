map.load("data/world-110m.json", "data/places.json");

map.on("ready", function () {
  var points = map.points();
});

map.on("click", function (e, point) {
  map.panTo(point);
});