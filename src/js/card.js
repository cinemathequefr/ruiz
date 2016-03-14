

/**
 * Card
 * Manages the card pane (right half of window)
 *
 */
var card = (function () {
  var elemCardContainer = document.querySelector(".cardContainer");

  var renderTemplate = {};
  _.templateSettings.interpolate = /{{([\s\S]+?)}}/g; // Set mustache-style interpolate delimiters
  renderTemplate.card = _.template("<div class='card' data-id='{{ id }}'><div class='mediaContainer'><% _.forEach(assets, function (asset) { %><div class='asset'><% if (asset.type === 'img') { %><img src='http://cf.pasoliniroma.com/static/ruiz/img/{{ asset.id }}.jpg'><% } else if (asset.type === 'video') { %><iframe class='video' src='//player.vimeo.com/video/{{ asset.id }}' frameborder='0'></iframe><% } %></div><% }); %></div><p><span class='title'>{{ title }}.</span> {{ text }}</p><ul class='places'><% _.forEach(points, function (p) { %><li data-pointId='{{ p.id }}'>{{ p.name }}</li><% }); %></ul></div>");
  // renderTemplate.card = _.template("<div class='card' data-id='{{ id }}'><div class='mediaContainer'><% _.forEach(assets, function (asset) { %><div class='asset'><% if (asset.type === 'img') { %><img src='http://cf.pasoliniroma.com/static/ruiz/img/{{ asset.id }}.jpg'><% } else if (asset.type === 'video') { %><iframe class='video' src='//player.vimeo.com/video/{{ asset.id }}' frameborder='0'></iframe><% } %></div><% }); %></div><p><span class='title'>{{ title }}.</span> {{ text }}</p><ul class='places'><% _.forEach(points, function (p) { %><li data-pointId='{{ p.id }}'>{{ p.name }}</li><% }); %></ul><ul class='films'><% _.forEach(films, function (f) { %><a href='http://www.cinematheque.fr/film/{{ f.id }}.html'>{{ f.title }}</a></li><% }); %></ul></div>");

  var points, cards;
  var deck = []; // Array: DOM elements of cards

  function init() {
    points = arguments[0];
    $(elemCardContainer).perfectScrollbar();
  }

  function show(point) {

    _.forEach(_.reverse(point.cards), function (card) {

      // Development only (lorem ipsum)
      card.text = card.text || "Quam quidem partem accusationis admiratus sum et moleste tuli potissimum esse Atratino datam. Neque enim decebat neque aetas illa postulabat neque, id quod animadvertere poteratis, pudor patiebatur optimi adulescentis in tali illum oratione versari. Vellem aliquis ex vobis robustioribus hunc male dicendi locum suscepisset; aliquanto liberius et fortius et magis more nostro refutaremus istam male dicendi licentiam. Tecum, Atratine, agam lenius, quod et pudor tuus moderatur orationi meae et meum erga te parentemque tuum beneficium tueri debeo.";

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
          $card.hide().prependTo($(elemCardContainer)).slideDown(350, function () {
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
