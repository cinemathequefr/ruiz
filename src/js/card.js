/**
 * Card
 * Manages the card pane (right half of window)
 *
 */

var card = (function () {
  var elemCardContainer = document.querySelector(".cardContainer");


  function show(point) {


    _.forEach(point.cards, function (c) {
      var cardData = _.find(cards, { id: c });
      $("<div class='card'><h2>" + cardData.id + "</h2></div>").appendTo(elemCardContainer);
    });

  }

  return {
    show: show
  };

})();