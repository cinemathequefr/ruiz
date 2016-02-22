

/**
 * Card
 * Manages the card pane (right half of window)
 *
 */
var card = (function () {
  var elemCardContainer = document.querySelector(".cardContainer");

  var renderTemplate = {};
  _.templateSettings.interpolate = /{{([\s\S]+?)}}/g; // Set mustache-style interpolate delimiters
  renderTemplate.card = _.template("<div class='card' data-id='{{ id }}'><% _.forEach(img, function (i) { %><img src='http://cf.pasoliniroma.com/static/ruiz/img/{{ i }}.jpg'><% }); %><% _.forEach(video, function (i) { %><iframe class='video ratio{{ i.ratio }}' src='//player.vimeo.com/video/{{ i.id }}' width='640' height='360' frameborder='0' webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe><% }); %><h2>{{ title }}</h2><p>{{ text }}</p><ul class='places'><% _.forEach(points, function (p) { %><li data-pointId='{{ p.id }}'>{{ p.name }}</li><% }); %></ul></div>");

  var points, cards;
  var deck = []; // Array: DOM elements of cards

  function init() {
    points = arguments[0];
    $(elemCardContainer).perfectScrollbar();
  }

  // function show(point) {
  //   $(elemCardContainer).empty();
  //   _.forEach(point.cards, function (card, i) {
  //     var $card =  $(renderTemplate.card(card)).hide().prependTo($(elemCardContainer));
  //     window.setTimeout(function () {
  //       $card.slideToggle(350, function () {
  //       });
  //     }, (i + 1) * 250);
  //   });
  // }

  function show(point) {
    _.forEach(point.cards, function (card) {
      deck.push($(renderTemplate.card(card)));
    });


    (function display(deck) {
      if (deck.length === 0) {
        $(elemCardContainer).perfectScrollbar("update");
        return;
      }
      var $card = deck[0];
      if (_.isUndefined($card.isRemove) === false) {
        deck.shift();
        $card.slideUp(350, function () {
          $card.remove();
          display(deck);
        });
      } else {
        _.assign($card, { isRemove: true }); // Marked for removal on next call
        $card.imagesLoaded(function () { // https://github.com/desandro/imagesloaded
          $card.hide().prependTo($(elemCardContainer)).slideDown(350, function () {
            window.setTimeout(function () {
              display(_.tail(deck));
            }, 150);
          });
        });
      }
    })(deck);



  }

  return {
    init: init,
    show: show
  };

})();
