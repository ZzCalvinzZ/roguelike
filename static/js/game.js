var BaseObject, CELL_SIZE, Player, SCREEN_HEIGHT, SCREEN_WIDTH, StoneWall, camera, keyboard, player, setupKeybindings, stage,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

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
    var ref;
    if (ref = event.keyCode, indexOf.call(key.codes, ref) >= 0) {
      if (key.isUp && key.press) {
        key.press();
        key.isDown = true;
        key.isUp = false;
        event.preventDefault();
      }
    }
  };
  key.upHandler = function(event) {
    var ref;
    if (ref = event.keyCode, indexOf.call(key.codes, ref) >= 0) {
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

BaseObject = (function() {
  BaseObject.prototype.sprite = null;

  BaseObject.prototype.solid = true;

  function BaseObject() {}

  BaseObject.prototype.draw = function(x, y) {
    var spriteInstance;
    spriteInstance = new PIXI.Sprite(this.sprite);
    spriteInstance.x = x;
    spriteInstance.y = y;
    return stage.addChild(spriteInstance);
  };

  return BaseObject;

})();

Player = (function(superClass) {
  extend(Player, superClass);

  Player.prototype.sprite = new PIXI.Text('@', {
    'fill': 'white',
    'font': '17px Arial'
  });

  function Player() {}

  return Player;

})(BaseObject);

StoneWall = (function(superClass) {
  extend(StoneWall, superClass);

  StoneWall.prototype.sprite = PIXI.Texture.fromImage('static/img/wall20.png');

  function StoneWall() {}

  return StoneWall;

})(BaseObject);

player = new Player({});

stage = new PIXI.Container;

camera = new PIXI.Container;

$(document).ready(function() {
  var gameLoop, i, renderer, stoneWall;
  gameLoop = function() {
    requestAnimationFrame(gameLoop);
    renderer.render(camera);
  };
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
