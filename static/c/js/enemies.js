var Enemy, Snake,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Enemy = (function(superClass) {
  extend(Enemy, superClass);

  function Enemy(options) {
    Enemy.__super__.constructor.call(this, options);
    this.bad = true;
    this.solid = true;
  }

  Enemy.prototype.destroy = function() {
    var cell;
    cell = gamestate.map()[this.x][this.y];
    cell.things.remove(this);
    this.room.monsters.remove(this);
    return destroy_sprite(this.sprite);
  };

  Enemy.prototype.die = function() {
    return this.destroy();
  };

  Enemy.prototype.set_stats = function() {
    var key, ref, val;
    this.stats = {};
    ref = this.stat_config;
    for (key in ref) {
      val = ref[key];
      this.stats[key] = round_pos(ROT.RNG.getNormal(val.mean, val.stddev));
    }
    return this.movement_bar = this.stats.spd;
  };

  Enemy.prototype.check_movement = function() {
    var extra, turns;
    turns = 0;
    if (this.movement_bar <= 0) {
      extra = 0 - this.movement_bar;
      turns += 1;
      this.movement_bar = this.stats.spd - extra;
      turns += this.check_movement();
    }
    return turns;
  };

  Enemy.prototype.normal_move = function(player) {
    var count, path, to, turns;
    to = {
      x: player.x,
      y: player.y
    };
    this.movement_bar -= player.stats.spd;
    turns = this.check_movement();
    if (turns > 0) {
      path = new ROT.Path.Dijkstra(to.x, to.y, gamestate.cell_is_passable);
      count = 0;
      path._fromX = this.x;
      path._fromY = this.y;
      return path.compute(this.x, this.y, (function(_this) {
        return function(x, y) {
          var at_destination, i, results;
          at_destination = x === to.x && y === to.y;
          if (indexOf.call((function() {
            results = [];
            for (var i = 1; 1 <= turns ? i <= turns : i >= turns; 1 <= turns ? i++ : i--){ results.push(i); }
            return results;
          }).apply(this), count) >= 0) {
            if (at_destination) {
              _this.attack_object(gamestate.map()[x][y].things, 'good');
            } else {
              _this.move_to_cell(x, y);
            }
          }
          return count += 1;
        };
      })(this));
    }
  };

  return Enemy;

})(MovableObject);

Snake = (function(superClass) {
  extend(Snake, superClass);

  Snake.prototype.stat_config = {
    spd: {
      mean: 50,
      stddev: 5
    },
    hp: {
      mean: 10,
      stddev: 2
    },
    att: {
      mean: 3,
      stddev: 2
    },
    dex: {
      mean: 3,
      stddev: 2
    },
    def: {
      mean: 5,
      stddev: 2
    },
    arm: {
      mean: 0,
      stddev: 0
    }
  };

  function Snake(options) {
    Snake.__super__.constructor.call(this, options);
    this.set_stats();
    this.sprite = createSprite('static/img/snake.png');
    this.draw();
  }

  Snake.prototype.move = function(player) {
    return this.normal_move(player);
  };

  return Snake;

})(Enemy);
