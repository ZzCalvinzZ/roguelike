var Enemy, Snake,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Enemy = (function(superClass) {
  extend(Enemy, superClass);

  function Enemy(options) {
    Enemy.__super__.constructor.call(this, options);
    this.enemy = true;
    this.solid = true;
    this.room = options.room;
  }

  Enemy.prototype.set_stats = function() {
    var key, ref, val;
    this.stats = {};
    ref = this.stat_config;
    for (key in ref) {
      val = ref[key];
      this.stats[key] = round_pos(ROT.RNG.getNormal(val.mean, val.stddev));
    }
    return this.movement_bar = this.stats.speed;
  };

  Enemy.prototype.check_movement = function() {
    var extra, turns;
    turns = 0;
    if (this.movement_bar <= 0) {
      extra = 0 - this.movement_bar;
      turns += 1;
      this.movement_bar = this.stats.speed - extra;
      turns += this.check_movement();
    }
    return turns;
  };

  Enemy.prototype.move_to_cell = function(x, y) {
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

  Enemy.prototype.normal_move = function(player) {
    var count, path, to, turns;
    to = {
      x: player.x,
      y: player.y
    };
    this.movement_bar -= player.stats.speed;
    turns = this.check_movement();
    if (turns > 0) {
      path = new ROT.Path.Dijkstra(to.x, to.y, gamestate.cell_is_passable);
      count = 0;
      path._fromX = this.x;
      path._fromY = this.y;
      return path.compute(this.x, this.y, (function(_this) {
        return function(x, y) {
          var i, results;
          if (indexOf.call((function() {
            results = [];
            for (var i = 1; 1 <= turns ? i <= turns : i >= turns; 1 <= turns ? i++ : i--){ results.push(i); }
            return results;
          }).apply(this), count) >= 0 && !(x === to.x && y === to.y)) {
            _this.move_to_cell(x, y);
          }
          return count += 1;
        };
      })(this));
    }
  };

  return Enemy;

})(CombatObject);

Snake = (function(superClass) {
  extend(Snake, superClass);

  Snake.prototype.stat_config = {
    speed: {
      mean: 50,
      stddev: 5
    },
    health: {
      mean: 10,
      stddev: 2
    },
    attack: {
      mean: 3,
      stddev: 2
    },
    defense: {
      mean: 5,
      stddev: 2
    },
    armor: {
      mean: 0,
      stddev: 0
    }
  };

  function Snake(options) {
    Snake.__super__.constructor.call(this, options);
    this.set_stats();
    console.log(this.stats);
    this.sprite = createSprite('static/img/snake.png');
    this.draw();
  }

  Snake.prototype.move = function(player) {
    return this.normal_move(player);
  };

  return Snake;

})(Enemy);
