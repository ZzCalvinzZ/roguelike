var BaseObject, CELL_SIZE, DEFAULT_MAP_SIZE, Door, MovableObject, Openable, Player, SCREEN_HEIGHT, SCREEN_WIDTH, Stairs, Wall, camera, center_camera_on, createSprite, create_map, create_town_map, destroy_sprite, draw_box, gamestate, get_camera_center, get_targets, keyboard, map_data, player, setupKeybindings, sleep, stage,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

sleep = function(ms) {
  var results, start;
  start = new Date().getTime();
  results = [];
  while (new Date().getTime() - start < ms) {
    continue;
  }
  return results;
};

createSprite = function(file) {
  var texture;
  texture = PIXI.Texture.fromImage(file);
  return new PIXI.Sprite(texture);
};

get_targets = function(direction, x, y) {
  var targets;
  if (direction === 'left') {
    targets = gamestate.map[x - 1][y];
  }
  if (direction === 'right') {
    targets = gamestate.map[x + 1][y];
  }
  if (direction === 'up') {
    targets = gamestate.map[x][y - 1];
  }
  if (direction === 'down') {
    targets = gamestate.map[x][y + 1];
  }
  if (direction === 'here') {
    targets = gamestate.map[x][y];
  }
  return targets;
};

destroy_sprite = function(sprite) {
  if (sprite) {
    stage.removeChild(sprite);
    return sprite.destroy();
  }
};

get_camera_center = function() {
  var x, y;
  x = camera.x + SCREEN_WIDTH / 2;
  y = camera.y + SCREEN_HEIGHT / 2;
  return {
    x: x,
    y: y
  };
};

center_camera_on = function(object) {
  camera.x = SCREEN_WIDTH / 2 - object.sprite.x;
  camera.y = SCREEN_HEIGHT / 2 - object.sprite.y;
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

  BaseObject.prototype.save = function() {
    return JSON.stringify(this);
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
      var j, len, target;
      for (j = 0, len = targets.length; j < len; j++) {
        target = targets[j];
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
        camera.x += CELL_SIZE;
      }
    }
    if (direction === 'right' && none_are_solid(targets)) {
      this.x += 1;
      this.sprite.x += CELL_SIZE;
      if (this.player && this.sprite.x > 2 * SCREEN_WIDTH / 3 - camera.x) {
        camera.x -= CELL_SIZE;
      }
    }
    if (direction === 'up' && none_are_solid(targets)) {
      this.y -= 1;
      this.sprite.y -= CELL_SIZE;
      if (this.player && this.sprite.y < SCREEN_HEIGHT / 3 - camera.y) {
        camera.y += CELL_SIZE;
      }
    }
    if (direction === 'down' && none_are_solid(targets)) {
      this.y += 1;
      this.sprite.y += CELL_SIZE;
      if (this.player && this.sprite.y > 2 * SCREEN_HEIGHT / 3 - camera.y) {
        return camera.y -= CELL_SIZE;
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
    var j, len, results, target, targets;
    targets = get_targets(direction, this.x, this.y);
    results = [];
    for (j = 0, len = targets.length; j < len; j++) {
      target = targets[j];
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

  Player.prototype.use_stairs = function() {
    var j, len, results, target, targets;
    targets = get_targets('here', this.x, this.y);
    results = [];
    for (j = 0, len = targets.length; j < len; j++) {
      target = targets[j];
      if (target.stairs) {
        results.push(target.use());
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  return Player;

})(MovableObject);

Wall = (function(superClass) {
  extend(Wall, superClass);

  Wall.prototype.solid = true;

  function Wall(options) {
    Wall.__super__.constructor.call(this, options);
    this.sprite = createSprite('static/img/wall20.png');
    this.draw(this.x, this.y);
  }

  return Wall;

})(BaseObject);

Door = (function(superClass) {
  extend(Door, superClass);

  Door.prototype.open_texture = PIXI.Texture.fromImage('static/img/door_open.png');

  Door.prototype.closed_texture = PIXI.Texture.fromImage('static/img/door_closed.png');

  function Door(options) {
    Door.__super__.constructor.call(this, options);
    this.is_open = options.is_open || false;
    this.sprite = createSprite('static/img/door_closed.png');
    if (this.is_open) {
      this.open();
    } else {
      this.close();
    }
  }

  Door.prototype.open = function() {
    this.sprite.texture = this.open_texture;
    this.solid = false;
    this.is_open = true;
    return this.draw();
  };

  Door.prototype.close = function() {
    this.sprite.texture = this.closed_texture;
    this.solid = true;
    this.is_open = false;
    return this.draw();
  };

  return Door;

})(Openable);

Stairs = (function(superClass) {
  extend(Stairs, superClass);

  Stairs.prototype.stairs = true;

  function Stairs(options) {
    Stairs.__super__.constructor.call(this, options);
    if (options.up) {
      this.sprite = createSprite('static/img/stairs_up.png');
      this.up = true;
    } else {
      this.sprite = createSprite('static/img/stairs_down.png');
      this.down = true;
    }
    this.draw(this.x, this.y);
  }

  Stairs.prototype.use = function() {
    return console.log('booya');
  };

  return Stairs;

})(BaseObject);

keyboard = function(keyCodes) {
  var key, timeOut;
  key = {};
  key.codes = keyCodes;
  key.started = 0;
  key.first = true;
  key.isDown = false;
  key.isUp = true;
  key.press = void 0;
  key.release = void 0;
  timeOut = null;
  key.downHandler = function(event) {
    var press, ref;
    if ((ref = event.keyCode, indexOf.call(key.codes, ref) >= 0) && gamestate.ready) {
      if (key.isUp && key.press) {
        clearTimeout(timeOut);
        press = function() {
          if (key.isDown) {
            key.press();
            if (key.first) {
              timeOut = setTimeout(press, 200);
              return key.first = false;
            } else {
              return timeOut = setTimeout(press, 75);
            }
          }
        };
        key.isDown = true;
        key.isUp = false;
        press();
        event.preventDefault();
      }
    }
  };
  key.upHandler = function(event) {
    var ref;
    if ((ref = event.keyCode, indexOf.call(key.codes, ref) >= 0) && gamestate.ready) {
      if (key.isDown && key.release) {
        key.release();
        key.isDown = false;
        key.isUp = true;
        key.first = true;
        event.preventDefault();
      }
    }
  };
  key.pressHandler = function(event) {
    var charStr;
    charStr = String.fromCharCode(event.keyCode);
    if (indexOf.call(key.codes, charStr) >= 0 && gamestate.ready) {
      return key.press();
    }
  };
  window.addEventListener('keydown', key.downHandler.bind(key), false);
  window.addEventListener('keyup', key.upHandler.bind(key), false);
  window.addEventListener('keypress', key.pressHandler.bind(key), false);
  return key;
};

setupKeybindings = function() {
  var descend, do_direction, down, left, open, right, up;
  left = keyboard([37, 72]);
  up = keyboard([38, 75]);
  right = keyboard([39, 76]);
  down = keyboard([40, 74]);
  open = keyboard([79]);
  descend = keyboard(['>']);
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
  open.release = function() {};
  descend.press = function() {
    return player.use_stairs();
  };
  return descend.release = function() {};
};

CELL_SIZE = 20;

SCREEN_WIDTH = 800;

SCREEN_HEIGHT = 400;

DEFAULT_MAP_SIZE = 50;

stage = new PIXI.Container;

camera = new PIXI.Container;

player = new Player({
  x: 25,
  y: 25
});

map_data = {
  level_0: null,
  level_1: null
};

gamestate = {
  level: 0,
  map: null,
  ready: false,
  go_up_a_level: function() {
    level -= 1;
    return this.map = create_map_from_data('level_' + level);
  },
  go_down_a_level: function() {
    level += 1;
    return this.map = create_map_from_data('level_' + level);
  }
};

create_map = function(map_size) {
  var map, x, y;
  return map = (function() {
    var j, ref, results;
    results = [];
    for (x = j = 0, ref = map_size; 0 <= ref ? j < ref : j > ref; x = 0 <= ref ? ++j : --j) {
      results.push((function() {
        var k, ref1, results1;
        results1 = [];
        for (y = k = 0, ref1 = map_size; 0 <= ref1 ? k < ref1 : k > ref1; y = 0 <= ref1 ? ++k : --k) {
          results1.push([]);
        }
        return results1;
      })());
    }
    return results;
  })();
};

draw_box = function(map, size, x_left, y_top, sprite) {
  var j, k, ref, ref1, ref2, ref3, x, x_right, y, y_bottom;
  x_right = x_left + size - 1;
  y_bottom = y_top + size - 1;
  for (x = j = ref = x_left, ref1 = x_right; ref <= ref1 ? j <= ref1 : j >= ref1; x = ref <= ref1 ? ++j : --j) {
    map[x][y_top].push(new sprite({
      x: x,
      y: y_top
    }));
    map[x][y_bottom].push(new sprite({
      x: x,
      y: y_bottom
    }));
  }
  for (y = k = ref2 = y_top, ref3 = y_bottom; ref2 <= ref3 ? k <= ref3 : k >= ref3; y = ref2 <= ref3 ? ++k : --k) {
    map[x_left][y].push(new sprite({
      x: x_left,
      y: y
    }));
    map[x_right][y].push(new sprite({
      x: x_right,
      y: y
    }));
  }
};

create_town_map = function() {
  var center, door_x, door_y, i, map, size, store_size, y;
  size = 39;
  center = Math.floor(size / 2);
  map = create_map(size);
  draw_box(map, size, 0, 0, Wall);
  store_size = 5;
  y = 5;
  i = 3;
  while (i < 37) {
    draw_box(map, store_size, i, y, Wall);
    door_x = i + Math.floor(store_size / 2);
    door_y = y + store_size - 1;
    destroy_sprite(map[door_x][door_y].pop().sprite);
    map[door_x][door_y] = [
      new Door({
        x: door_x,
        y: door_y
      })
    ];
    i += 7;
  }
  map[15][20].push(new Stairs({
    x: 15,
    y: 20
  }));
  return map;
};

$(document).ready(function() {
  var gameLoop, renderer;
  window.onresize = function(event) {
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
  gamestate.map = create_town_map();
  gamestate.ready = true;
  player.draw();
  center_camera_on(player);
  camera.addChild(stage);
  gameLoop();
});
