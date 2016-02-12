/* Map */
/* Dependencies: jquery, lodash, ba-tiny-pubsub, d3, topojson, d3-queue, d3.geo.zoom (+ extra projection august) */

var map = (function () {
  var height = window.innerHeight,
      width = window.innerWidth / 2,
      scaleRange = [Math.max(width, height) * 0.333, [Math.max(width, height) * 1.5]];

  var projection = d3.geo
      .august()
      .center([0, 0])
      // .rotate([10, 10, 150])
      .rotate([0, 0, 0])
      .scale(scaleRange[0])
      // .clipAngle(90)
      .translate([(width / 2), (height / 2)]);

  var path = d3.geo.path().projection(projection);
  var zoom = d3.geo.zoom().projection(projection).scale(scaleRange[0]).scaleExtent(scaleRange);
  var svg = d3.select("body").append("svg").attr("width", width).attr("height", height);
  var worldData, pointsData, compass;


  function load(worldDataUrl, pointsDataUrl) {
    d3_queue.queue()
    .defer(d3.json, worldDataUrl)
    .defer(d3.json, pointsDataUrl)
    .defer(d3.xml, "img/compass.svg")
    .awaitAll(function (error, data) {
      if (error) throw error;
      run(data);
    });
  }


  function run(data) {
    worldData = data[0];
    compass = data[2];
    pointsData = _.map(data[1], function (d) {  // Collection of GeoJSON points (w/ extra properties)
      return _.assign(d, {
        type: "Point",
        coordinates: [d.lng, d.lat]
      });
    });

    svg.append("path")
      .datum(topojson.feature(worldData, worldData.objects.land))
      .attr("class", "land")
      .attr("d", path);

    svg.node().appendChild(compass.getElementsByTagName("svg")[0]);

    svg.selectAll(".pin")
      .data(pointsData)
      .enter()
      .append("circle")
      .attr("class", "pin")
      .attr("r", 9)
      .attr("transform", function (d) {
        return "translate(" + projection([ d.coordinates[0], d.coordinates[1] ]) + ")";
      })
      .on("click", function (d) {
        $.publish("click", d);
      });

    svg.call(zoom).call(zoom.event);
    zoom.on("zoom.redraw", zoomed);
    $.publish("ready");
  }


  function on(event, callback) {
    $.subscribe(event, callback);
  }


  function panTo(point) {
    projection.rotate(zoom.rotateTo(point.coordinates)); // https://github.com/BBC-News-Labs/newsmap/blob/master/js/utilities/zoom_functions.js#L6
    svg.transition().duration(500).call(zoom.projection(projection).event);
  }


  function zoomed() {
    svg.selectAll(".land").attr("d", path);
    svg.selectAll(".pin")
    .attr("transform", function (d) {
      return "translate(" + projection([ d.coordinates[0], d.coordinates[1] ]) + ")";
    });
  }


  function points() {
    return pointsData;
  }

  return {
    load: load,
    on: on,
    panTo: panTo,
    points: points
  };
})();