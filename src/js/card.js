

/**
 * Card
 * Manages the card pane (right half of window)
 *
 */
var card = (function () {
  var elemCardContainer = document.querySelector(".cardContainer");

  var renderTemplate = {};
  _.templateSettings.interpolate = /{{([\s\S]+?)}}/g; // Set mustache-style interpolate delimiters
  renderTemplate.card = _.template("<div class='card' data-id='{{ id }}'><% _.forEach(img, function (i) { %><img src='http://cf.pasoliniroma.com/static/ruiz/img/{{ i }}.jpg'><% }); %><% _.forEach(video, function (i) { %><iframe class='video ratio{{ i.ratio }}' src='//player.vimeo.com/video/{{ i.id }}' width='320' height='240' frameborder='0'></iframe><% }); %><h2>{{ title }}</h2><p>{{ text }}</p><ul class='places'><% _.forEach(points, function (p) { %><li data-pointId='{{ p.id }}'>{{ p.name }}</li><% }); %></ul></div>");

  var points, cards;
  var deck = []; // Array: DOM elements of cards

  function init() {
    points = arguments[0];
    $(elemCardContainer).perfectScrollbar();
  }

  function show(point) {
    _.forEach(point.cards, function (card) {
      deck.push($(renderTemplate.card(card)));
    });

    (function display(deck) {
      if (deck.length === 0) {
        $(elemCardContainer).perfectScrollbar("update");
        $.publish("load");
        return;
      }
      var $card = deck[0];
      if (_.isUndefined($card.isRemove) === false) {
        deck.shift();
        $card.slideUp(250, function () {
          $card.remove();
          display(deck);
        });
      } else {
        _.assign($card, { isRemove: true }); // Marked for removal on next call
        $card.imagesLoaded(function () { // https://github.com/desandro/imagesloaded
          $card.hide().prependTo($(elemCardContainer)).slideDown(500, function () {
            window.setTimeout(function () {
              display(_.tail(deck));
            }, 100);
          });
        });
      }
    })(deck);
  }

  function on(event, callback) {
    $.subscribe(event, callback);
  }

  return {
    init: init,
    on: on,
    show: show
  };

})();
