/**
 * Card
 * Manages the card pane (right half of window)
 *
 */
var card = (function () {
  var elemCardContainer = document.querySelector(".cardContainer");

  var template = {};
  _.templateSettings.interpolate = /{{([\s\S]+?)}}/g; // Set mustache-style interpolate delimiters
  template.card = _.template("<div class='card' data-id='{{ id }}'><% _.forEach(img, function (i) { %><img src='http://cf.pasoliniroma.com/static/ruiz/img/{{ i }}.jpg'><% }); %><% _.forEach(video, function (i) { %><iframe class='video ratio{{ i.ratio }}' src='//player.vimeo.com/video/{{ i.id }}' width='640' height='360' frameborder='0' webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe><% }); %><h2>{{ title }}</h2><p>{{ text }}</p><ul class='places'><% _.forEach(points, function (p) { %><li data-pointId='{{ p.id }}'>{{ p.name }}</li><% }); %></ul></div>");

  var points, cards;


  function init() {
    points = arguments[0];
    cards = arguments[1];
    $(elemCardContainer).perfectScrollbar();
  }


  function show(point) {
    $(elemCardContainer).empty();
    _.forEach(point.cards, function (c, i) {
      var cardData = _.find(cards, { id: c });
      var $card =  $(template.card(cardData)).hide().prependTo($(elemCardContainer));
      window.setTimeout(function () {
        $card.slideToggle(350, function () {
        });
      }, (i + 1) * 250);
    });
  }

  return {
    init: init,
    show: show
  };

})();
