var menu = (function () {
  var $menuIcon = $(".menuIcon");
  var $menu = $(".menu");
  var isOpen;
  close();

  $menuIcon.on("click", toggle);

  function open() {
    isOpen = true;
    $menuIcon.addClass("open");
    $menu.show();

    window.setTimeout(function () {
      $(document).one("click", close);
    }, 10);
  }

  function close() {
    isOpen = false;
    $menuIcon.removeClass("open");
    $menu.hide();
  }

  function toggle() {
    void(isOpen ? close() : open());
  }

  return {
    open: open,
    close: close,
    isOpen: isOpen
  };
})();