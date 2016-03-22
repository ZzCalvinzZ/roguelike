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

class BaseObject
	sprite: null
	solid: false

	constructor: (options) ->
		{@x, @y} = options

	draw: () ->
		@sprite.x = @x * CELL_SIZE
		@sprite.y = @y * CELL_SIZE
		stage.addChild(@sprite)
		return

class Openable extends BaseObject
	openable: true

class MovableObject extends BaseObject
	move: (direction) ->
		targets = get_targets(direction, @x, @y)

		none_are_solid = (targets) ->
			for target in targets
				return false if target.solid
			return true

		if direction is 'left' and none_are_solid(targets)
			@x -= 1
			@sprite.x -= CELL_SIZE

			if @player and @sprite.x < SCREEN_WIDTH / 3 - camera.x
				camera.x += 25

		if direction is 'right' and none_are_solid(targets)
			@x += 1
			@sprite.x += CELL_SIZE

			if @player and @sprite.x > SCREEN_WIDTH / 3 - camera.x
				camera.x -= 25

		if direction is 'up' and none_are_solid(targets)
			@y -= 1
			@sprite.y -= CELL_SIZE

			if @player and @sprite.y < SCREEN_HEIGHT / 3 - camera.y
				camera.y += 25

		if direction is 'down' and none_are_solid(targets)
			@y += 1
			@sprite.y += CELL_SIZE

			if @player and @sprite.y > 2 * SCREEN_HEIGHT / 3 - camera.y
				camera.y -= 25

class Player extends MovableObject
	player: true
	opening: false
	sprite: new PIXI.Text('@', {'fill': 'white', 'font': '17px Arial'})

	open: (direction) ->
		targets = get_targets(direction, @x, @y)

		for target in targets
			if target.openable
				if target.is_open then target.close() else target.open()

class StoneWall extends BaseObject
	solid: true

	constructor: (options) ->
		super(options)
		@sprite = createSprite('static/img/wall20.png')

class Door extends Openable
	open_texture: PIXI.Texture.fromImage('static/img/door_open.png')
	closed_texture: PIXI.Texture.fromImage('static/img/door_closed.png')

	constructor: (options) ->
		super(options)
		@is_open = options.is_open or false

		@sprite = createSprite('static/img/door_closed.png')

		if @is_open then @open() else @close()

	open: () ->
		#destroy_sprite(@sprite)
		#@sprite = createSprite('static/img/door_open.png')
		@sprite.setTexture(@open_texture)
		@solid = false
		@is_open = true
		@draw()

	close: () ->
		#destroy_sprite(@sprite)
		#@sprite = createSprite('static/img/door_closed.png')
		@sprite.setTexture(@closed_texture)
		@solid = true
		@is_open = false
		@draw()

