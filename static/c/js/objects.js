var BaseObject, CombatObject, Door, MovableObject, Openable, Player, Stairs, Wall,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

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

CombatObject = (function(superClass) {
  extend(CombatObject, superClass);

  function CombatObject(options) {
    CombatObject.__super__.constructor.call(this, options);
    this.damage = 0;
    this.room = options.room;
  }

  CombatObject.prototype.attack_object = function(targets, type) {
    var i, len, results, target;
    results = [];
    for (i = 0, len = targets.length; i < len; i++) {
      target = targets[i];
      if (target[type] === true) {
        results.push(target.defend(this));
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  CombatObject.prototype.defend = function(attacker) {
    if (this.successful_hit()) {
      this.damage += attacker.attack();
    }
    if (this.hp() < 0) {
      return this.die();
    }
  };

  CombatObject.prototype.defense = function() {
    return this.stats.stats.def;
  };

  CombatObject.prototype.attack = function() {
    return this.stats.att;
  };

  CombatObject.prototype.hp = function() {
    return this.stats.hp - this.damage;
  };

  CombatObject.prototype.die = function() {
    return console.log("immplement this method");
  };

  CombatObject.prototype.successful_hit = function(attacker) {
    return true;
  };

  return CombatObject;

})(BaseObject);

MovableObject = (function(superClass) {
  extend(MovableObject, superClass);

  function MovableObject() {
    return MovableObject.__super__.constructor.apply(this, arguments);
  }

  MovableObject.prototype.move_to_cell = function(x, y) {
    var curr_cell, next_cell, ref;
    curr_cell = gamestate.map()[this.x][this.y];
    next_cell = gamestate.map()[x][y];
    curr_cell.things.remove(this);
    if (curr_cell.room === null) {
      this.room.monsters.remove(this);
      this.room = next_cell.room;
      this.room.monsters.push(this);
    }
    next_cell.things.push(this);
    ref = [x, y], this.x = ref[0], this.y = ref[1];
    return this.draw();
  };

  MovableObject.prototype.move = function(direction) {
    var moved, new_cell, none_are_solid, targets;
    targets = get_targets(direction, this.x, this.y);
    none_are_solid = (function(_this) {
      return function(targets) {
        var i, len, target;
        for (i = 0, len = targets.length; i < len; i++) {
          target = targets[i];
          if (target.solid) {
            _this.attack_object(targets, 'bad');
            return false;
          }
        }
        return true;
      };
    })(this);
    new_cell = {
      x: this.x,
      y: this.y
    };
    moved = false;
    if (direction === 'left' && none_are_solid(targets)) {
      new_cell.x -= 1;
      this.x -= 1;
      this.sprite.x -= CELL_SIZE;
      if (this.player && this.sprite.x < SCREEN_WIDTH / 3 - camera.x) {
        camera.x += CELL_SIZE;
      }
      moved = true;
    } else if (direction === 'right' && none_are_solid(targets)) {
      new_cell.x += 1;
      this.x += 1;
      this.sprite.x += CELL_SIZE;
      if (this.player && this.sprite.x > 2 * SCREEN_WIDTH / 3 - camera.x) {
        camera.x -= CELL_SIZE;
      }
      moved = true;
    } else if (direction === 'up' && none_are_solid(targets)) {
      new_cell.y -= 1;
      this.y -= 1;
      this.sprite.y -= CELL_SIZE;
      if (this.player && this.sprite.y < SCREEN_HEIGHT / 3 - camera.y) {
        camera.y += CELL_SIZE;
      }
      moved = true;
    } else if (direction === 'down' && none_are_solid(targets)) {
      new_cell.y += 1;
      this.y += 1;
      this.sprite.y += CELL_SIZE;
      if (this.player && this.sprite.y > 2 * SCREEN_HEIGHT / 3 - camera.y) {
        camera.y -= CELL_SIZE;
      }
      moved = true;
    }
    if (moved) {
      this.move_to_cell(new_cell.x, new_cell.y);
    }
    if (DEBUG === true) {
      console.log("x: " + this.x);
      console.log("y: " + this.y);
      console.log(gamestate.level.map_data[this.x][this.y]);
    }
    return moved;
  };

  return MovableObject;

})(CombatObject);

Player = (function(superClass) {
  extend(Player, superClass);

  function Player(options) {
    Player.__super__.constructor.call(this, options);
    this.good = true;
    this.set_stats(options);
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

  Player.prototype.move_enemies = function() {
    var cell, door, i, j, k, l, len, len1, len2, len3, monster, monsters, ref, ref1, results, room, rooms, this_room;
    cell = gamestate.map()[this.x][this.y];
    door = _.findWhere(cell.things, {
      door: true
    });
    rooms = door !== void 0 ? door.rooms : [];
    if (rooms.length === 0) {
      this_room = cell.room;
      if (this_room) {
        ref = this_room.doors;
        for (i = 0, len = ref.length; i < len; i++) {
          door = ref[i];
          ref1 = door.rooms;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            room = ref1[j];
            if (indexOf.call(rooms, room) < 0) {
              rooms.push(room);
            }
          }
        }
      }
    }
    if (rooms.length > 0) {
      monsters = [];
      for (k = 0, len2 = rooms.length; k < len2; k++) {
        room = rooms[k];
        monsters.push.apply(monsters, room.monsters);
      }
      results = [];
      for (l = 0, len3 = monsters.length; l < len3; l++) {
        monster = monsters[l];
        results.push(monster.move(this));
      }
      return results;
    }
  };

  Player.prototype.set_stats = function(options) {
    return this.stats = {
      spd: options.speed || 50,
      hp: options.health || 50,
      att: options.attack || 10,
      dex: options.dexterity || 10,
      def: options.defense || 10,
      rm: options.defense || 10
    };
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
    this.door = true;
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
