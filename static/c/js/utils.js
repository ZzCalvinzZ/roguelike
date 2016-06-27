var center_camera_on, createSprite, destroy_sprite, get_camera_center, get_targets, randomNum, sleep;

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
    targets = gamestate.level.map_data[x - 1][y].things;
  }
  if (direction === 'right') {
    targets = gamestate.level.map_data[x + 1][y].things;
  }
  if (direction === 'up') {
    targets = gamestate.level.map_data[x][y - 1].things;
  }
  if (direction === 'down') {
    targets = gamestate.level.map_data[x][y + 1].things;
  }
  if (direction === 'here') {
    targets = gamestate.level.map_data[x][y].things;
  }
  return targets;
};

destroy_sprite = function(sprite) {
  if (sprite) {
    gamestate.level.stage.removeChild(sprite);
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

randomNum = function(max, min) {
  if (min == null) {
    min = 0;
  }
  return Math.floor(Math.random() * (max - min) + min);
};
