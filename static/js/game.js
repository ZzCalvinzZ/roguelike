var BaseObject, CELL_SIZE, Player, SCREEN_HEIGHT, SCREEN_WIDTH, StoneWall, camera, keyboard, player, setupKeybindings, stage;

CELL_SIZE = 20;

SCREEN_WIDTH = 800;

SCREEN_HEIGHT = 400;

keyboard = function(keyCodes) {
  var key;
  key = {};
  key.codes = keyCodes;
  key.isDown = false;
  key.isUp = true;
  key.press = void 0;
  key.release = void 0;
  key.downHandler = function(event) {
    if ($.inArray(event.keyCode, key.codes) >= 0) {
      if (key.isUp && key.press) {
        key.press();
        key.isDown = true;
        key.isUp = false;
        event.preventDefault();
      }
    }
  };
  key.upHandler = function(event) {
    if ($.inArray(event.keyCode, key.codes) >= 0) {
      if (key.isDown && key.release) {
        key.release();
        key.isDown = false;
        key.isUp = true;
        event.preventDefault();
      }
    }
  };
  window.addEventListener('keydown', key.downHandler.bind(key), false);
  window.addEventListener('keyup', key.upHandler.bind(key), false);
  return key;
};

setupKeybindings = function() {
  var down, left, right, up;
  left = keyboard([37, 72]);
  up = keyboard([38, 75]);
  right = keyboard([39, 76]);
  down = keyboard([40, 74]);
  left.press = function() {
    player.sprite.x -= CELL_SIZE;
    if (player.sprite.x < SCREEN_WIDTH / 3 - camera.x) {
      camera.x += 25;
    }
  };
  left.release = function() {};
  right.press = function() {
    player.sprite.x += CELL_SIZE;
    if (player.sprite.x > 2 * SCREEN_WIDTH / 3 - camera.x) {
      camera.x -= 25;
    }
  };
  right.release = function() {};
  up.press = function() {
    player.sprite.y -= CELL_SIZE;
    if (player.sprite.y < SCREEN_HEIGHT / 3 - camera.y) {
      camera.y += 25;
    }
  };
  up.release = function() {};
  down.press = function() {
    player.sprite.y += CELL_SIZE;
    if (player.sprite.y > 2 * SCREEN_HEIGHT / 3 - camera.y) {
      camera.y -= 25;
    }
  };
  return down.release = function() {};
};

BaseObject = function(info) {
  this.sprite = info.sprite;
  this.info = {
    solid: info.solid || true
  };
};

Player = function(info) {
  info.sprite = new PIXI.Text('@', {
    'fill': 'white',
    'font': '17px Arial'
  });
  BaseObject.call(this, info);
};

StoneWall = function(info) {
  info.sprite = PIXI.Texture.fromImage('static/img/wall20.png');
  BaseObject.call(this, info);
};

BaseObject.prototype = {
  constructor: BaseObject,
  draw: function(x, y) {
    var spriteInstance;
    spriteInstance = new PIXI.Sprite(this.sprite);
    spriteInstance.x = x;
    spriteInstance.y = y;
    stage.addChild(spriteInstance);
  }
};

Player.prototype = Object.create(BaseObject.prototype);

StoneWall.prototype = Object.create(BaseObject.prototype);

player = new Player({});

stage = new PIXI.Container;

camera = new PIXI.Container;

$(document).ready(function() {
  var gameLoop, i, renderer, stoneWall;
  gameLoop = function() {
    var stoneWall;
    requestAnimationFrame(gameLoop);
    renderer.render(camera);
  };
  $('h2').css('color', 'white').css('text-align', 'center');
  renderer = PIXI.autoDetectRenderer(SCREEN_WIDTH, SCREEN_HEIGHT, {
    backgroundColor: 0x000000
  });
  document.body.appendChild(renderer.view);
  player.sprite.x = 20;
  player.sprite.y = 20;
  setupKeybindings();
  stage.addChild(player.sprite);
  i = 0;
  while (i < SCREEN_WIDTH / CELL_SIZE) {
    stoneWall = new StoneWall({});
    stoneWall.draw(i * CELL_SIZE, 0);
    stoneWall.draw(i * CELL_SIZE, SCREEN_HEIGHT - CELL_SIZE);
    i++;
  }
  i = 1;
  while (i < SCREEN_HEIGHT / CELL_SIZE - 1) {
    stoneWall = new StoneWall({});
    stoneWall.draw(0, i * CELL_SIZE);
    stoneWall.draw(SCREEN_WIDTH - CELL_SIZE, i * CELL_SIZE);
    i++;
  }
  camera.addChild(stage);
  gameLoop();
});
