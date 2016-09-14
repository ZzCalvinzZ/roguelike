$(window).on("load", function() {
  var SCREEN_HEIGHT, SCREEN_WIDTH, gameLoop, renderer;
  $.get('/data', function(result) {
    var enemy, i, len, ref, results;
    ref = result.enemies;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      enemy = ref[i];
      results.push(gamestate.enemies.push(enemy));
    }
    return results;
  });
  window.onresize = function(event) {
    var SCREEN_HEIGHT, SCREEN_WIDTH;
    SCREEN_WIDTH = window.innerWidth;
    SCREEN_HEIGHT = window.innerHeight;
    return renderer.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
  };
  SCREEN_HEIGHT = $(window).height();
  SCREEN_WIDTH = $(window).width();
  gameLoop = function() {
    requestAnimationFrame(gameLoop);
    renderer.render(camera);
  };
  renderer = PIXI.autoDetectRenderer(SCREEN_WIDTH, SCREEN_HEIGHT, {
    backgroundColor: 0x000000
  });
  document.body.appendChild(renderer.view);
  setupKeybindings();
  gamestate.move_level(0);
  gamestate.ready = true;
  gameLoop();
});
