var page = (function () {

  var nameOpen = null;
  var $page = $(".page");


  var html = {
    intro: "<div class='inner'><a href='#!/'>Voi ch'entrate.</a></div>",
    index: "<div class='inner'><h1>Index</h1></div>",
    credits: "<div class='inner'><h1>Credits</h1></div>"
  };


  function open(name) {
    if (name in html === false) return;

    if (nameOpen !== null && nameOpen !== name) { // If another page is open,
      close(function () { open(name); }); // Close it and set callback to open the requested page
      return;
    }

    nameOpen = name;
    $page.hide().html(html[name]).fadeIn(250);

  }

  function close(cb) {
    if (nameOpen === null) return;

    var callback = (typeof cb === "function" ? cb : _.noop);

    $(window).off("keyup");

    $page.fadeOut(250, function () {
      $page.empty();
      callback();
    });
    nameOpen = null;

  }

  function isOpen () {
    return nameOpen !== null;
  }

  return {
    open: open,
    close: close
  };

})();