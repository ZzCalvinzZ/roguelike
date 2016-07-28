var BaseObject, Door, MovableObject, Openable, Player, Stairs, Wall,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BaseObject = (function() {
  function BaseObject(options) {
    this.sprite = null;
    this.solid = false;
    this.visible = false;
    this.distant = false;
    this.x = options.x;
    this.y = options.y;
    this.visible = options.visible || false;
  }

  BaseObject.prototype.remove_sprite = function() {
    return gamestate.level.stage.addChild(this.sprite);
  };

  BaseObject.prototype.draw = function() {
    this.sprite.x = this.x * CELL_SIZE;
    this.sprite.y = this.y * CELL_SIZE;
    if (this.visible) {
      gamestate.level.stage.addChild(this.sprite);
    }
  };

  BaseObject.prototype.save = function() {
    return JSON.stringify(this);
  };

  return BaseObject;

})();

Openable = (function(superClass) {
  extend(Openable, superClass);

  function Openable(options) {
    Openable.__super__.constructor.call(this, options);
    this.openable = true;
  }

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

  function Player(options) {
    Player.__super__.constructor.call(this, options);
    this.player = true;
    this.opening = false;
    this.sprite = createSprite('static/img/player_female.png');
  }

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

  function Wall(options) {
    Wall.__super__.constructor.call(this, options);
    this.solid = true;
    this.sprite = createSprite('static/img/wall20.png');
    this.draw();
  }

  return Wall;

})(BaseObject);

Door = (function(superClass) {
  extend(Door, superClass);

  function Door(options) {
    Door.__super__.constructor.call(this, options);
    this.open_texture = PIXI.Texture.fromImage('static/img/door_open.png');
    this.closed_texture = PIXI.Texture.fromImage('static/img/door_closed.png');
    this.rooms = [];
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
    var i, len, ref, room;
    this.sprite.texture = this.open_texture;
    this.solid = false;
    this.is_open = true;
    ref = this.rooms;
    for (i = 0, len = ref.length; i < len; i++) {
      room = ref[i];
      if (!room.visible) {
        room.show();
      }
    }
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

  function Stairs(options) {
    Stairs.__super__.constructor.call(this, options);
    this.stairs = true;
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
