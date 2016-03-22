var BaseObject, CELL_SIZE, DEFAULT_MAP_SIZE, Door, MovableObject, Openable, Player, SCREEN_HEIGHT, SCREEN_WIDTH, StoneWall, camera, createMap, createSprite, destroy_sprite, get_targets, keyboard, map, player, ref, setupKeybindings, stage,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

createSprite = function(file) {
  var texture;
  texture = PIXI.Texture.fromImage(file);
  return new PIXI.Sprite(texture);
};

get_targets = function(direction, x, y) {
  var targets;
  if (direction === 'left') {
    targets = map[x - 1][y];
  }
  if (direction === 'right') {
    targets = map[x + 1][y];
  }
  if (direction === 'up') {
    targets = map[x][y - 1];
  }
  if (direction === 'down') {
    targets = map[x][y + 1];
  }
  return targets;
};

destroy_sprite = function(sprite) {
  if (sprite) {
    stage.removeChild(sprite);
    return sprite.destroy();
  }
};

BaseObject = (function() {
  BaseObject.prototype.sprite = null;

  BaseObject.prototype.solid = false;

  function BaseObject(options) {
    this.x = options.x, this.y = options.y;
  }

  BaseObject.prototype.draw = function() {
    this.sprite.x = this.x * CELL_SIZE;
    this.sprite.y = this.y * CELL_SIZE;
    stage.addChild(this.sprite);
  };

  return BaseObject;

})();

Openable = (function(superClass) {
  extend(Openable, superClass);

  function Openable() {
    return Openable.__super__.constructor.apply(this, arguments);
  }

  Openable.prototype.openable = true;

  return Openable;

})(BaseObject);

MovableObject = (function(superClass) {
  extend(MovableObject, superClass);

  function MovableObject() {
    return MovableObject.__super__.constructor.apply(this, arguments);
  }

  MovableObject.prototype.move = function(direction) {
    var none_are_solid, targets;
    targets = get_targets(direction, this.x, this.y);
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
    if (direction === 'left' && none_are_solid(targets)) {
      this.x -= 1;
      this.sprite.x -= CELL_SIZE;
      if (this.player && this.sprite.x < SCREEN_WIDTH / 3 - camera.x) {
        camera.x += 25;
      }
    }
    if (direction === 'right' && none_are_solid(targets)) {
      this.x += 1;
      this.sprite.x += CELL_SIZE;
      if (this.player && this.sprite.x > SCREEN_WIDTH / 3 - camera.x) {
        camera.x -= 25;
      }
    }
    if (direction === 'up' && none_are_solid(targets)) {
      this.y -= 1;
      this.sprite.y -= CELL_SIZE;
      if (this.player && this.sprite.y < SCREEN_HEIGHT / 3 - camera.y) {
        camera.y += 25;
      }
    }
    if (direction === 'down' && none_are_solid(targets)) {
      this.y += 1;
      this.sprite.y += CELL_SIZE;
      if (this.player && this.sprite.y > 2 * SCREEN_HEIGHT / 3 - camera.y) {
        return camera.y -= 25;
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

  Player.prototype.player = true;

  Player.prototype.opening = false;

  Player.prototype.sprite = new PIXI.Text('@', {
    'fill': 'white',
    'font': '17px Arial'
  });

  Player.prototype.open = function(direction) {
    var k, len, results, target, targets;
    targets = get_targets(direction, this.x, this.y);
    results = [];
    for (k = 0, len = targets.length; k < len; k++) {
      target = targets[k];
      if (target.openable) {
        if (target.is_open) {
          results.push(target.close());
        } else {
          results.push(target.open());
        }
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  return Player;

})(MovableObject);

StoneWall = (function(superClass) {
  extend(StoneWall, superClass);

  StoneWall.prototype.solid = true;

  function StoneWall(options) {
    StoneWall.__super__.constructor.call(this, options);
    this.sprite = createSprite('static/img/wall20.png');
  }

  return StoneWall;

})(BaseObject);

Door = (function(superClass) {
  extend(Door, superClass);

  function Door(options) {
    Door.__super__.constructor.call(this, options);
    this.is_open = options.is_open || false;
    if (this.is_open) {
      this.open();
    } else {
      this.close();
    }
  }

  Door.prototype.open = function() {
    destroy_sprite(this.sprite);
    this.sprite = createSprite('static/img/door_open.png');
    this.solid = false;
    this.is_open = true;
    return this.draw();
  };

  Door.prototype.close = function() {
    destroy_sprite(this.sprite);
    this.sprite = createSprite('static/img/door_closed.png');
    this.solid = true;
    this.is_open = false;
    return this.draw();
  };

  return Door;

})(Openable);

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
  var do_direction, down, left, open, right, up;
  left = keyboard([37, 72]);
  up = keyboard([38, 75]);
  right = keyboard([39, 76]);
  down = keyboard([40, 74]);
  open = keyboard([79]);
  do_direction = function(direction) {
    if (player.opening === true) {
      player.open(direction);
      return player.opening = false;
    } else {
      return player.move(direction);
    }
  };
  left.press = function() {
    return do_direction('left');
  };
  left.release = function() {};
  right.press = function() {
    return do_direction('right');
  };
  right.release = function() {};
  up.press = function() {
    return do_direction('up');
  };
  up.release = function() {};
  down.press = function() {
    return do_direction('down');
  };
  down.release = function() {};
  open.press = function() {
    return player.opening = true;
  };
  return open.release = function() {};
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

DEFAULT_MAP_SIZE = 50;

map = createMap(DEFAULT_MAP_SIZE);

player = new Player({
  x: 20,
  y: 20
});

stage = new PIXI.Container;

camera = new PIXI.Container;

ref = [player.sprite.x, player.sprite.y - SCREEN_HEIGHT / 2], camera.x = ref[0], camera.y = ref[1];

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
  i = 15;
  while (i < 30) {
    for (j = k = 1; k <= 2; j = ++k) {
      stoneWall = j === 1 ? new StoneWall({
        x: i,
        y: 15
      }) : new StoneWall({
        x: i,
        y: 29
      });
      map[stoneWall.x][stoneWall.y].push(stoneWall);
      stoneWall.draw();
    }
    i++;
  }
  i = 16;
  while (i < 30) {
    for (j = l = 1; l <= 2; j = ++l) {
      if (i === 23) {
        stoneWall = j === 1 ? new Door({
          x: 15,
          y: i
        }) : new Door({
          x: 29,
          y: i
        });
      } else {
        stoneWall = j === 1 ? new StoneWall({
          x: 15,
          y: i
        }) : new StoneWall({
          x: 29,
          y: i
        });
      }
      map[stoneWall.x][stoneWall.y].push(stoneWall);
      stoneWall.draw();
    }
    i++;
  }
  camera.addChild(stage);
  gameLoop();
});
