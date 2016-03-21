var BaseObject, CELL_SIZE, DEFAULT_MAP_SIZE, MovableObject, Player, SCREEN_HEIGHT, SCREEN_WIDTH, StoneWall, camera, createMap, createSprite, keyboard, map, player, setupKeybindings, stage,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

createSprite = function(file) {
  var texture;
  texture = PIXI.Texture.fromImage(file);
  return new PIXI.Sprite(texture);
};

BaseObject = (function() {
  BaseObject.prototype.sprite = null;

  BaseObject.prototype.solid = false;

  function BaseObject(x1, y1) {
    this.x = x1;
    this.y = y1;
  }

  BaseObject.prototype.draw = function() {
    this.sprite.x = this.x * CELL_SIZE;
    this.sprite.y = this.y * CELL_SIZE;
    stage.addChild(this.sprite);
  };

  return BaseObject;

})();

MovableObject = (function(superClass) {
  extend(MovableObject, superClass);

  function MovableObject() {
    return MovableObject.__super__.constructor.apply(this, arguments);
  }

  MovableObject.prototype.move = function(direction) {
    var none_are_solid, targets;
    none_are_solid = function(targets) {
      var k, len, target;
      for (k = 0, len = targets.length; k < len; k++) {
        target = targets[k];
        if (target.solid) {
          return false;
        }
      }
      return true;
    };
    if (direction === 'left') {
      targets = map[this.x - 1][this.y];
      if (none_are_solid(targets)) {
        this.x -= 1;
        this.sprite.x -= CELL_SIZE;
        if (this.sprite.x < SCREEN_WIDTH / 3 - camera.x) {
          camera.x += 25;
        }
      }
    }
    if (direction === 'right') {
      targets = map[this.x + 1][this.y];
      if (none_are_solid(targets)) {
        this.x += 1;
        this.sprite.x += CELL_SIZE;
        if (this.sprite.x > SCREEN_WIDTH / 3 - camera.x) {
          camera.x -= 25;
        }
      }
    }
    if (direction === 'up') {
      targets = map[this.x][this.y - 1];
      if (none_are_solid(targets)) {
        this.y -= 1;
        this.sprite.y -= CELL_SIZE;
        if (this.sprite.y < SCREEN_HEIGHT / 3 - camera.y) {
          camera.y += 25;
        }
      }
    }
    if (direction === 'down') {
      targets = map[this.x][this.y + 1];
      if (none_are_solid(targets)) {
        this.y += 1;
        this.sprite.y += CELL_SIZE;
        if (this.sprite.y > 2 * SCREEN_HEIGHT / 3 - camera.y) {
          return camera.y -= 25;
        }
      }
    }
  };

  return MovableObject;

})(BaseObject);

Player = (function(superClass) {
  extend(Player, superClass);

  function Player() {
    return Player.__super__.constructor.apply(this, arguments);
  }

  Player.prototype.sprite = new PIXI.Text('@', {
    'fill': 'white',
    'font': '17px Arial'
  });

  Player.prototype.solid = true;

  return Player;

})(MovableObject);

StoneWall = (function(superClass) {
  extend(StoneWall, superClass);

  StoneWall.prototype.solid = true;

  function StoneWall(x, y) {
    StoneWall.__super__.constructor.call(this, x, y);
    this.sprite = createSprite('static/img/wall20.png');
  }

  return StoneWall;

})(BaseObject);

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
    return player.move('left');
  };
  left.release = function() {};
  right.press = function() {
    return player.move('right');
  };
  right.release = function() {};
  up.press = function() {
    return player.move('up');
  };
  up.release = function() {};
  down.press = function() {
    return player.move('down');
  };
  return down.release = function() {};
};

createMap = function(map_size) {
  var map, x, y;
  return map = (function() {
    var k, ref, results;
    results = [];
    for (x = k = 0, ref = map_size; 0 <= ref ? k < ref : k > ref; x = 0 <= ref ? ++k : --k) {
      results.push((function() {
        var l, ref1, results1;
        results1 = [];
        for (y = l = 0, ref1 = map_size; 0 <= ref1 ? l < ref1 : l > ref1; y = 0 <= ref1 ? ++l : --l) {
          results1.push([]);
        }
        return results1;
      })());
    }
    return results;
  })();
};

CELL_SIZE = 20;

SCREEN_WIDTH = 800;

SCREEN_HEIGHT = 400;

DEFAULT_MAP_SIZE = 15;

map = createMap(DEFAULT_MAP_SIZE);

player = new Player(2, 2);

stage = new PIXI.Container;

camera = new PIXI.Container;

$(document).ready(function() {
  var gameLoop, i, j, k, l, renderer, stoneWall;
  gameLoop = function() {
    requestAnimationFrame(gameLoop);
    renderer.render(camera);
  };
  renderer = PIXI.autoDetectRenderer(SCREEN_WIDTH, SCREEN_HEIGHT, {
    backgroundColor: 0x000000
  });
  document.body.appendChild(renderer.view);
  setupKeybindings();
  player.draw();
  i = 0;
  while (i < DEFAULT_MAP_SIZE) {
    for (j = k = 1; k <= 2; j = ++k) {
      stoneWall = j === 1 ? new StoneWall(i, 0) : new StoneWall(i, DEFAULT_MAP_SIZE - 1);
      map[stoneWall.x][stoneWall.y].push(stoneWall);
      stoneWall.draw();
    }
    i++;
  }
  i = 1;
  while (i < DEFAULT_MAP_SIZE) {
    for (j = l = 1; l <= 2; j = ++l) {
      stoneWall = j === 1 ? new StoneWall(0, i) : new StoneWall(DEFAULT_MAP_SIZE - 1, i);
      map[stoneWall.x][stoneWall.y].push(stoneWall);
      stoneWall.draw();
    }
    i++;
  }
  camera.addChild(stage);
  gameLoop();
});
