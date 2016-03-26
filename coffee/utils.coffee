sleep = (ms) ->
  start = new Date().getTime()
  continue while new Date().getTime() - start < ms

createSprite = (file) ->
	texture = PIXI.Texture.fromImage(file)
	new PIXI.Sprite(texture)

get_targets = (direction, x, y) ->
		targets = map[x - 1][y] if direction is 'left'
		targets = map[x + 1][y] if direction is 'right'
		targets = map[x][y - 1] if direction is 'up'
		targets = map[x][y + 1] if direction is 'down'

		return targets

destroy_sprite = (sprite) ->
	if sprite
		stage.removeChild(sprite)
		sprite.destroy()

