var keyboard, setupKeybindings,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

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
      player.opening = false;
    } else {
      player.move(direction);
    }
    return player.move_enemies();
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
