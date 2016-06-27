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
              things: []
            });
          }
          return results1;
        })());
      }
      return results;
    })();
  },
  draw_box: function(map, x_size, y_size, x_left, y_top, sprite) {
    var j, k, ref, ref1, ref2, ref3, x, x_right, y, y_bottom;
    x_right = x_left + x_size - 1;
    y_bottom = y_top + y_size - 1;
    for (x = j = ref = x_left, ref1 = x_right; ref <= ref1 ? j <= ref1 : j >= ref1; x = ref <= ref1 ? ++j : --j) {
      map[x][y_top].things.push(new sprite({
        x: x,
        y: y_top
      }));
      map[x][y_bottom].things.push(new sprite({
        x: x,
        y: y_bottom
      }));
    }
    for (y = k = ref2 = y_top, ref3 = y_bottom; ref2 <= ref3 ? k <= ref3 : k >= ref3; y = ref2 <= ref3 ? ++k : --k) {
      map[x_left][y].things.push(new sprite({
        x: x_left,
        y: y
      }));
      map[x_right][y].things.push(new sprite({
        x: x_right,
        y: y
      }));
    }
  },
  create_town_map: function() {
    var center, door_x, door_y, i, map, size, start, store_size, y;
    size = 39;
    center = Math.floor(size / 2);
    map = this.create_map(size, size);
    this.draw_box(map, size, size, 0, 0, Wall);
    store_size = 5;
    y = 5;
    i = 3;
    while (i < 37) {
      this.draw_box(map, store_size, store_size, i, y, Wall);
      door_x = i + Math.floor(store_size / 2);
      door_y = y + store_size - 1;
      destroy_sprite(map[door_x][door_y].things.pop().sprite);
      map[door_x][door_y].things = [
        new Door({
          x: door_x,
          y: door_y
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
      y: start.y
    }));
    return [map, start];
  },
  create_map_from_data: function(level) {
    var map, max, min, start, x_size, y_size;
    min = level * 10 + 100;
    max = level * 10 + 200;
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
      up: true
    });
    map[start.x][start.y].things.push(stairs);
    return new Room({
      map: map,
      start: start,
      stairs: stairs,
      level: level
    });
  },
  generate_map: function(map, start, level) {
    var doors_to_attach;
    doors_to_attach = [];
    return this.create_starting_room(map, start, level);
  }
};

Room = (function() {
  Room.prototype.origin = {
    x: null,
    y: null
  };

  Room.prototype.x_len = null;

  Room.prototype.y_len = null;

  Room.prototype.map = null;

  Room.prototype.level = null;

  Room.prototype.stairs = [];

  function Room(options) {
    this.map = options.map;
    this.level = gamestate.level;
    this.level.rooms.push(this);
    this.x_len = randomNum(MIN_ROOM_SIZE, MAX_ROOM_SIZE);
    this.y_len = randomNum(MIN_ROOM_SIZE, MAX_ROOM_SIZE);
    if (options.start != null) {
      this.stairs.push(options.stairs);
      this.origin = {
        x: options.start.x - randomNum(1, this.x_len - 1),
        y: options.start.y - randomNum(1, this.y_len - 1)
      };
      this.move_room_in_bounds();
    }
    this.put_room_on_map();
    map_utils.draw_box(this.map, this.x_len, this.y_len, this.origin.x, this.origin.y, Wall);
  }

  Room.prototype.put_room_on_map = function() {
    var j, ref, ref1, results, x, y;
    results = [];
    for (x = j = ref = this.origin.x, ref1 = this.origin.x + this.x_len; ref <= ref1 ? j < ref1 : j > ref1; x = ref <= ref1 ? ++j : --j) {
      results.push((function() {
        var k, ref2, ref3, results1;
        results1 = [];
        for (y = k = ref2 = this.origin.y, ref3 = this.origin.y + this.y_len; ref2 <= ref3 ? k < ref3 : k > ref3; y = ref2 <= ref3 ? ++k : --k) {
          results1.push(this.map[x][y].room = this);
        }
        return results1;
      }).call(this));
    }
    return results;
  };

  Room.prototype.move_room_in_bounds = function() {
    if (this.origin.x < 0) {
      this.origin.x = 0;
    } else if (this.origin.x + this.x_len > this.map.length - 1) {
      this.origin.x = this.map.length - this.x_len;
    }
    if (this.origin.y < 0) {
      return this.origin.y = 0;
    } else if (this.origin.y + this.y_len > this.map[0].length - 1) {
      return this.origin.y = this.map[0].length - this.y_len;
    }
  };

  return Room;

})();
