


// Voir : http://bl.ocks.org/mbostock/4183330

var width = 1200,
    height = 600;

var proj = d3.geo
    .august()
    // .orthographic()
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

  // var zoom = d3.behavior.zoom()
  //     .translate([0, 0])
  //     .scale(1)
  //     .scaleExtent([1, 8]);

  // var zoom = d3.geo.zoom().projection(proj).translate([0, 0]).scale(3).scaleExtent([3, 8]);
  
  var zoom = d3.geo.zoom().projection(proj).scale(500).scaleExtent([500, 1000]);

  zoom.on("zoom.redraw", function () {
    d3.event.sourceEvent.preventDefault();
    draw();
  });

  canvas.call(zoom);


  // canvas.call(zoom.on("zoom", zoomed));


  function draw () {
    c.clearRect(0, 0, width, height);
    c.fillStyle = "#369";
    c.beginPath();
    path(land);
    c.fill();
  }

  // function zoomed() {

  //   var t = zoom.translate(),
  //       s = zoom.scale();

  //   // console.log(s, t);

  //   // c.clearRect(0, 0, width, height);
  //   c.save();
  //   c.translate(t[0], t[1]);
  //   c.scale(s, s);
  //   draw();
  //   c.restore();
  // }









});



/*
var width = 960,
    height = 960;

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

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", "0, 0, " + width + ", " + height);

var proj = d3.geo.orthographic()
  .center([0, 0])
  .rotate([50, -20, 90])
  .scale(250)
  // .scale(800)
  .clipAngle(90)
  .translate([(width / 2), (height / 2)]);

var path = d3.geo.path().projection(proj);

// d3.json("https://raw.githubusercontent.com/mbostock/topojson/master/examples/world-50m.json", function(error, world) {
d3.json("https://raw.githubusercontent.com/mbostock/topojson/master/examples/world-110m.json", function(error, world) {
// d3.json("world.json", function(error, world) {
  if (error) return console.log(error);

  svg.append("path") // Globe
    .datum({ type: "Sphere" })
    .attr("class", "globe")
    .attr("d", path);

  svg.append("path") // Topography
    .datum(topojson.feature(world, world.objects.countries))
    .attr("class", "land")
    .attr("d", path);

  svg.selectAll(".arc") // Arcs
    .data(arcs(voyages(places)))
    .enter()
    .append("path")
    .attr("class", "arc")
    .attr("d", function (d) {
      return path(d);
    });

  svg.selectAll(".pin") // Places
    .data(places)
    .enter()
    .append("circle")
    .attr("class", "pin")
    .attr("r", 4)
    .attr("transform", function(d) {
      return "translate(" + proj([ d.lng, d.lat ]) + ")";
    });

    var zoom = d3.geo.zoom()
      .projection(proj)
      //.scaleExtent([projection.scale() *.7, projection.scale() *10])
      .on("zoom.redraw", function(){
        d3.event.sourceEvent.preventDefault();
        svg.selectAll("path").attr("d",path);
        svg.selectAll(".pin").attr("transform", function(d) {
          return "translate(" + proj([ d.lng, d.lat ]) + ")";
        });

      });

      d3.selectAll("path").call(zoom);


});

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