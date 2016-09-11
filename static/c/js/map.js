var Room, map_utils;

map_utils = {
  create_map: function(x_size, y_size) {
    var map, x, y;
    return map = (function() {
      var j, ref, results;
      results = [];
      for (x = j = 0, ref = x_size; 0 <= ref ? j < ref : j > ref; x = 0 <= ref ? ++j : --j) {
        results.push((function() {
          var k, ref1, results1;
          results1 = [];
          for (y = k = 0, ref1 = y_size; 0 <= ref1 ? k < ref1 : k > ref1; y = 0 <= ref1 ? ++k : --k) {
            results1.push({
              things: [],
              room: null
            });
          }
          return results1;
        })());
      }
      return results;
    })();
  },
  draw_box: function(map, x_size, y_size, x_left, y_top, sprite, visible) {
    var j, k, ref, ref1, ref2, ref3, x, x_right, y, y_bottom;
    if (visible == null) {
      visible = true;
    }
    x_right = x_left + x_size - 1;
    y_bottom = y_top + y_size - 1;
    for (x = j = ref = x_left, ref1 = x_right; ref <= ref1 ? j <= ref1 : j >= ref1; x = ref <= ref1 ? ++j : --j) {
      if (map[x][y_top].things.length < 1) {
        map[x][y_top].things.push(new sprite({
          x: x,
          y: y_top,
          visible: visible
        }));
      }
      if (map[x][y_bottom].things.length < 1) {
        map[x][y_bottom].things.push(new sprite({
          x: x,
          y: y_bottom,
          visible: visible
        }));
      }
    }
    for (y = k = ref2 = y_top, ref3 = y_bottom; ref2 <= ref3 ? k <= ref3 : k >= ref3; y = ref2 <= ref3 ? ++k : --k) {
      if (map[x_left][y].things.length < 1) {
        map[x_left][y].things.push(new sprite({
          x: x_left,
          y: y,
          visible: visible
        }));
      }
      if (map[x_right][y].things.length < 1) {
        map[x_right][y].things.push(new sprite({
          x: x_right,
          y: y,
          visible: visible
        }));
      }
    }
  },
  create_town_map: function() {
    var center, door_x, door_y, i, map, size, start, store_size, visible, y;
    size = 39;
    center = Math.floor(size / 2);
    map = this.create_map(size, size);
    this.draw_box(map, size, size, 0, 0, Wall, visible = true);
    store_size = 5;
    y = 5;
    i = 3;
    while (i < 37) {
      this.draw_box(map, store_size, store_size, i, y, Wall, visible = true);
      door_x = i + Math.floor(store_size / 2);
      door_y = y + store_size - 1;
      destroy_sprite(map[door_x][door_y].things.pop().sprite);
      map[door_x][door_y].things = [
        new Door({
          x: door_x,
          y: door_y,
          visible: true
        })
      ];
      i += 7;
    }
    start = {
      x: 15,
      y: 20
    };
    map[15][20].things.push(new Stairs({
      x: start.x,
      y: start.y,
      visible: true
    }));
    return [map, start];
  },
  create_map_from_data: function(level) {
    var map, max, min, start, x_size, y_size;
    min = level * 10 + 400;
    max = level * 10 + 700;
    x_size = randomNum(min, max);
    y_size = randomNum(min, max);
    map = this.create_map(x_size, y_size);
    start = {
      x: randomNum(1, map.length - 1),
      y: randomNum(1, map[0].length - 1)
    };
    this.generate_map(map, start, level);
    return [map, start];
  },
  create_starting_room: function(map, start, level) {
    var stairs;
    stairs = new Stairs({
      x: start.x,
      y: start.y,
      up: true,
      visible: true
    });
    map[start.x][start.y].things.push(stairs);
    return new Room({
      map: map,
      start: start,
      stairs: stairs,
      level: level
    });
  },
  create_ajoining_room: function(map, room) {
    var DIRECTIONS, direction, directions, door_cell, i, j, k, len, new_room, ref, results;
    DIRECTIONS = ['left', 'right', 'top', 'bottom'];
    directions = [];
    for (i = j = 0, ref = DIRECTIONS.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      direction = random_choice(DIRECTIONS);
      DIRECTIONS.remove(direction);
      directions.push(direction);
    }
    results = [];
    for (k = 0, len = directions.length; k < len; k++) {
      direction = directions[k];
      if (direction === 'left' || direction === 'right') {
        door_cell = {
          x: room[direction],
          y: randomNum(room.top + 1, room.bottom - 1)
        };
      } else if (direction === 'top' || direction === 'bottom') {
        door_cell = {
          x: randomNum(room.left + 1, room.right - 1),
          y: room[direction]
        };
      }
      new_room = new Room({
        map: map,
        level: room.level,
        door_cell: door_cell,
        direction: direction,
        prev_room: room
      });
      if (new_room.created) {
        results.push(this.create_ajoining_room(map, new_room));
      } else {
        results.push(new_room = null);
      }
    }
    return results;
  },
  generate_map: function(map, start, level) {
    var doors_to_attach, starting_room;
    doors_to_attach = [];
    starting_room = this.create_starting_room(map, start, level);
    return this.create_ajoining_room(map, starting_room);
  }
};

Room = (function() {
  function Room(options) {
    var ref, visible;
    ref = [[], []], this.stairs = ref[0], this.doors = ref[1];
    this.map = options.map;
    this.monsters = [];
    this.x_len = randomNum(MIN_ROOM_SIZE, MAX_ROOM_SIZE);
    this.y_len = randomNum(MIN_ROOM_SIZE, MAX_ROOM_SIZE);
    if (options.start != null) {
      this.stairs.push(options.stairs);
      this.origin = {
        x: options.start.x - randomNum(1, this.x_len),
        y: options.start.y - randomNum(1, this.y_len)
      };
    } else {
      if (options.direction === 'left') {
        this.origin = {
          x: options.door_cell.x - this.x_len + 2,
          y: options.door_cell.y - randomNum(1, this.y_len)
        };
      } else if (options.direction === 'right') {
        this.origin = {
          x: options.door_cell.x,
          y: options.door_cell.y - randomNum(1, this.y_len)
        };
      } else if (options.direction === 'top') {
        this.origin = {
          x: options.door_cell.x - randomNum(1, this.x_len),
          y: options.door_cell.y - this.y_len + 2
        };
      } else if (options.direction === 'bottom') {
        this.origin = {
          x: options.door_cell.x - randomNum(1, this.x_len),
          y: options.door_cell.y
        };
      }
    }
    this.out_of_bounds = this.check_out_of_bounds();
    this.set_bounds();
    if (options.start != null) {
      this.move_room_in_bounds();
      this.set_bounds();
    }
    this.created = this.can_create();
    this.visible = options.start != null ? true : false;
    if (this.created || (options.start != null)) {
      this.level = gamestate.level;
      this.level.rooms.push(this);
      this.level.cell_count += this.area();
      this.put_room_on_map();
      map_utils.draw_box(this.map, this.x_len + 1, this.y_len + 1, this.origin.x, this.origin.y, Wall, visible = this.visible);
      if (options.door_cell != null) {
        destroy_all_things_in_cell(this.map[options.door_cell.x][options.door_cell.y]);
        this.add_door(options.door_cell.x, options.door_cell.y, options.prev_room);
      }
      this.add_monsters();
    }
  }

  Room.prototype.add_door = function(x, y, prev_room) {
    var door, visible_door;
    visible_door = this.visible || prev_room.visible;
    door = new Door({
      x: x,
      y: y,
      visible: visible_door,
      rooms: [this, prev_room]
    });
    this.doors.push(door);
    prev_room.doors.push(door);
    return this.map[x][y].things.push(door);
  };

  Room.prototype.show = function() {
    var j, ref, ref1, results, thing, x, y;
    this.visible = true;
    results = [];
    for (x = j = ref = this.left, ref1 = this.right; ref <= ref1 ? j <= ref1 : j >= ref1; x = ref <= ref1 ? ++j : --j) {
      results.push((function() {
        var k, ref2, ref3, results1;
        results1 = [];
        for (y = k = ref2 = this.top, ref3 = this.bottom; ref2 <= ref3 ? k <= ref3 : k >= ref3; y = ref2 <= ref3 ? ++k : --k) {
          results1.push((function() {
            var l, len, ref4, results2;
            ref4 = this.map[x][y].things;
            results2 = [];
            for (l = 0, len = ref4.length; l < len; l++) {
              thing = ref4[l];
              thing.visible = true;
              results2.push(thing.draw());
            }
            return results2;
          }).call(this));
        }
        return results1;
      }).call(this));
    }
    return results;
  };

  Room.prototype.can_create = function() {
    var j, k, ref, ref1, ref2, ref3, x, y;
    if (typeof this.out_of_bounds === 'string') {
      return false;
    }
    for (x = j = ref = this.left, ref1 = this.right; ref <= ref1 ? j <= ref1 : j >= ref1; x = ref <= ref1 ? ++j : --j) {
      for (y = k = ref2 = this.top, ref3 = this.bottom; ref2 <= ref3 ? k <= ref3 : k >= ref3; y = ref2 <= ref3 ? ++k : --k) {
        if (this.map[x][y].room != null) {
          return false;
        }
      }
    }
    return true;
  };

  Room.prototype.set_bounds = function() {
    this.left = this.origin.x;
    this.top = this.origin.y;
    this.right = this.origin.x + this.x_len;
    return this.bottom = this.origin.y + this.y_len;
  };

  Room.prototype.check_out_of_bounds = function() {
    if (this.origin.x < 0) {
      return 'left';
    } else if (this.origin.x + this.x_len + 3 > this.map.length) {
      return 'right';
    } else if (this.origin.y < 0) {
      return 'top';
    } else if (this.origin.y + this.y_len + 3 > this.map[0].length) {
      return 'bottom';
    } else {
      return false;
    }
  };

  Room.prototype.put_room_on_map = function() {
    var j, k, ref, ref1, ref2, ref3, x, y;
    for (x = j = ref = this.origin.x + 1, ref1 = this.origin.x + this.x_len; ref <= ref1 ? j < ref1 : j > ref1; x = ref <= ref1 ? ++j : --j) {
      for (y = k = ref2 = this.origin.y + 1, ref3 = this.origin.y + this.y_len; ref2 <= ref3 ? k < ref3 : k > ref3; y = ref2 <= ref3 ? ++k : --k) {
        this.map[x][y].room = this;
      }
    }
  };

  Room.prototype.move_room_in_bounds = function() {
    if (this.out_of_bounds === 'left') {
      this.origin.x = 0;
    } else if (this.out_of_bounds === 'right') {
      this.origin.x = this.map.length - this.x_len + 1;
    }
    if (this.out_of_bounds === 'top') {
      return this.origin.y = 0;
    } else if (this.out_of_bounds === 'bottom') {
      return this.origin.y = this.map[0].length - this.y_len + 1;
    }
  };

  Room.prototype.area = function() {
    return (this.x_len - 1) * (this.y_len - 1);
  };

  Room.prototype.draw_on_random_cell = function(sprite) {
    var x, y;
    x = randomNum(this.left + 1, this.right);
    y = randomNum(this.top + 1, this.bottom);
    if (this.map[x][y].things.length === 0) {
      sprite = new sprite({
        x: x,
        y: y,
        visible: true,
        room: this
      });
      this.map[x][y].things.push(sprite);
      return this.monsters.push(sprite);
    }
  };

  Room.prototype.add_monsters = function() {
    var i, j, monster, monster_count, ref, results;
    monster_count = randomNum(0, this.area() * MONSTER_DENSITY);
    results = [];
    for (i = j = 0, ref = monster_count; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      monster = ROT.RNG.getWeightedValue(this.level.get_monsters());
      results.push(this.draw_on_random_cell(window[monster]));
    }
    return results;
  };

  return Room;

})();
