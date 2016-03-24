CELL_SIZE = 20
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 400
DEFAULT_MAP_SIZE = 50

stage = new(PIXI.Container)
camera = new(PIXI.Container)

player = new Player({x:5,y:5})
#[camera.x, camera.y] = [player.sprite.x, player.sprite.y - SCREEN_HEIGHT/2]
