/**
 * Card
 * Manages the card pane (right half of window)
 *
 */

var card = (function () {
  var elemCardContainer = document.querySelector(".cardContainer");

  var points, cards;

  function init() {
    points = arguments[0];
    cards = arguments[1];
  }

  function show(point) {
    _.forEach(point.cards, function (c) {
      var cardData = _.find(cards, { id: c });
      $("<div class='card'><h2>" + cardData.id + "</h2></div>").appendTo(elemCardContainer);
    });
  }

  return {
    init: init,
    show: show
  };

})();