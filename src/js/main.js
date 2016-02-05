


// Voir : http://bl.ocks.org/mbostock/4183330

var height = window.innerHeight,
    width = window.innerWidth;

var scaleRange = [Math.max(width, height) * 0.33, [Math.max(width, height)]]


// var width = 1200,
//     height = 600;

var places = [
  { name: "Puerto Montt", lat: -41.47, lng: -72.94 },
  { name: "Mexico", lat: 19.43, lng: -99.13 },
  { name: "Honduras", lat: 14.15, lng: -87.14 },
  { name: "Jamaïque", lat: 17.98, lng: -76.8 },
  { name: "Madère", lat: 32.75, lng: -17 },
  { name: "Lisbonne", lat: 38.71, lng: -9.14 },
  { name: "Baleal", lat: 39.38, lng: -9.34 },
  { name: "Paris", lat: 48.86, lng: 2.35 },
  { name: "Le Havre", lat: 49.49, lng: 0.13 },
  { name: "Allemagne", lat: 50.73, lng: 7.1 },
  { name: "New York", lat: 40.71, lng: -74.01 },
  { name: "Bâton-Rouge", lat: 30.42, lng: -91.1 },
  { name: "Durham", lat: 36, lng: -78.94 },
  { name: "Santa Fe", lat: -31.64, lng: -60.70 },
  { name: "Santiago", lat: -33.44, lng: -70.65 },
  { name: "Valparaíso", lat: -33.05, lng: -71.62 },
  { name: "Nice", lat: 43.71, lng: 7.26 },
  { name: "Chambord", lat: 47.61, lng: 1.52 },
  { name: "Hollande", lat: 51.63, lng: 4.67 },
  { name: "Patagonie", lat: -41.73, lng: -68.92 },
  { name: "Castel di Tusa", lat: 38.01, lng: 14.25 },
  { name: "Taiwan", lat: 25.04, lng: 121.55 },
  { name: "Tunis", lat: 36.8, lng: 10.18 },
  { name: "Maroc", lat: 31.63, lng: -7.98 },
  { name: "Grenoble", lat: 45.19, lng: 5.72 },
  { name: "Angola", lat: -8.89, lng: 13.33 },
  { name: "Mer du Groenland", lat: 73.86, lng: -7.5 },
  { name: "Suisse", lat: 46.62, lng: 6.49 }
];

var proj = d3.geo
    .orthographic() // Projection type
    // .mercator() // Projection type
    // .august() // Projection type
    .center([0, 0])
    .rotate([-2.35, -48.86, -30])
    .scale(scaleRange[0])
    .clipAngle(90)
    .translate([(width / 2), (height / 2)]);

var canvas = d3.select("body").append("canvas")
    .attr("width", width)
    .attr("height", height);

var c = canvas.node().getContext("2d");
var path = d3.geo.path().projection(proj).context(c).pointRadius(6);

d3.json("https://raw.githubusercontent.com/mbostock/topojson/master/examples/world-110m.json", function(error, world) {
// d3.json("https://raw.githubusercontent.com/mbostock/topojson/master/examples/world-50m.json", function(error, world) {

  if (error) throw error;

  // topojson.presimplify(world); // http://bl.ocks.org/mbostock/7755778

  var land = topojson.feature(world, world.objects.land);
  var zoom = d3.geo.zoom().projection(proj).scale(scaleRange[0]).scaleExtent(scaleRange);

  var pins = {
    type: "MultiPoint",
    coordinates: _.map(places, function (d) {
      return [d.lng, d.lat];
    })
  }

  zoom.on("zoom.redraw", function () {
    // d3.event.sourceEvent.preventDefault();
    draw();
  });

  canvas.call(zoom).call(zoom.event);
  draw();

  // Just for fun: transition through all points
  var count = 0;
  var interval = window.setInterval(function () {
    proj.rotate(zoom.rotateTo(coordsPlace(count++))); // https://github.com/BBC-News-Labs/newsmap/blob/master/js/utilities/zoom_functions.js#L6
    canvas.transition().duration(500).call(zoom.projection(proj).event);
    if (count >= places.length) window.clearInterval(interval);
  }, 500);


  function draw () {
    // Land
    c.clearRect(0, 0, width, height);
    c.fillStyle = "#99805c";
    c.shadowColor = "#333";
    c.shadowOffsetX = 0;
    c.shadowOffsetY = 0;
    c.shadowBlur = 20;

    c.beginPath();
    path(land);
    c.fill();

    // Pins
    c.strokeStyle = "#111";
    c.fillStyle = "#999";
    c.shadowBlur = 0;
    c.beginPath();
    path(pins);
    c.fill();
    c.stroke();
  }


  function geoPlaces(places) {
    return places.map(function(d) {
      return {
        type: "Point",
        coordinates: [d.lng, d.lat]
      };
    });
  }


  function coordsPlace(i) {
    return [places[i].lng, places[i].lat, 0];
  }





});

