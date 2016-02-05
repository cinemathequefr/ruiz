


// Voir : http://bl.ocks.org/mbostock/4183330

var width = 1200,
    height = 600;

var proj = d3.geo
    .august()
    .center([0, 0])
    .rotate([50, -20, 0])
    .scale(500)
    .clipAngle(90)
    .translate([(width / 2), (height / 2)]);

var canvas = d3.select("body").append("canvas")
    .attr("width", width)
    .attr("height", height);

var c = canvas.node().getContext("2d");
var path = d3.geo.path().projection(proj).context(c);

d3.json("https://raw.githubusercontent.com/mbostock/topojson/master/examples/world-110m.json", function(error, world) {
// d3.json("https://raw.githubusercontent.com/mbostock/topojson/master/examples/world-50m.json", function(error, world) {

  if (error) throw error;

  var land = topojson.feature(world, world.objects.land);
  var zoom = d3.geo.zoom().projection(proj).scale(500).scaleExtent([500, 1000]);

  zoom.on("zoom.redraw", function () {
    d3.event.sourceEvent.preventDefault();
    draw();
  });

  canvas.call(zoom);
  draw();

  function draw () {
    c.clearRect(0, 0, width, height);
    c.fillStyle = "#369";
    c.beginPath();
    path(land);
    c.fill();
  }
});



/*
var places = [
  { name: "Puerto Montt", lat: -41.47, lng: -72.94 },
  { name: "Mexico", lat: 19.43, lng: -99.13 },
  { name: "Jamaïque", lat: 17.98, lng: -76.8 },
  { name: "Madère", lat: 32.75, lng: -17 },
  { name: "Lisbonne", lat: 38.71, lng: -9.14 },
  { name: "Paris", lat: 48.86, lng: 2.35 },
  { name: "Allemagne", lat: 50.73, lng: 7.1 },
  { name: "New York", lat: 40.71, lng: -74.01 },
  { name: "Bâton-Rouge", lat: 30.42, lng: -91.1 },
  { name: "Santa Fe", lat: -31.64, lng: -60.70 },
  { name: "Santiago", lat: -33.44, lng: -70.65 },
  { name: "Valparaíso", lat: -33.05, lng: -71.62 },
  { name: "Chambord", lat: 47.61, lng: 1.52 },
  { name: "Hollande", lat: 51.63, lng: 4.67 },
  { name: "Castel di Tusa", lat: 38.01, lng: 14.25 },
  { name: "Taiwan", lat: 25.04, lng: 121.55 }
];


function arcs(data) {
  return _.map(data, function (i) {
    return {
      type: "LineString",
      coordinates: i
    };
  });
}

function voyages(places) {
  var v = [];
  for (var i = 0; i < places.length; i++) {
    v.push([(i === 0 ? [null, null] : [places[i - 1].lng, places[i - 1].lat]), [places[i].lng, places[i].lat]]);
  }
  return v.slice(1);
}

*/
