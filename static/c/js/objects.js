var BaseObject, Door, MovableObject, Openable, Player, Stairs, Wall,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BaseObject = (function() {
  BaseObject.prototype.sprite = null;

  BaseObject.prototype.solid = false;

  function BaseObject(options) {
    this.x = options.x, this.y = options.y;
  }

  BaseObject.prototype.draw = function() {
    this.sprite.x = this.x * CELL_SIZE;
    this.sprite.y = this.y * CELL_SIZE;
    gamestate.level.stage.addChild(this.sprite);
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
      var i, len, target;
      for (i = 0, len = targets.length; i < len; i++) {
        target = targets[i];
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
    var i, len, results, target, targets;
    targets = get_targets(direction, this.x, this.y);
    results = [];
    for (i = 0, len = targets.length; i < len; i++) {
      target = targets[i];
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
    var i, len, results, target, targets;
    targets = get_targets('here', this.x, this.y);
    results = [];
    for (i = 0, len = targets.length; i < len; i++) {
      target = targets[i];
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

  Door.prototype.rooms = [];

  function Door(options) {
    Door.__super__.constructor.call(this, options);
    this.is_open = options.is_open || false;
    this.sprite = createSprite('static/img/door_closed.png');
    if (this.is_open) {
      this.open();
    } else {
      this.close();
    }
    this.rooms = options.rooms || [];
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
    if (this.up) {
      gamestate.go_up_a_level();
    }
    if (this.down) {
      return gamestate.go_down_a_level();
    }
  };

  return Stairs;

})(BaseObject);
