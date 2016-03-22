createSprite = (file) ->
	texture = PIXI.Texture.fromImage(file)
	new PIXI.Sprite(texture)

class BaseObject
	sprite: null
	solid: false

	constructor: (@x, @y) ->

	draw: () ->
		@sprite.x = @x * CELL_SIZE
		@sprite.y = @y * CELL_SIZE
		stage.addChild(@sprite)
		return

class MovableObject extends BaseObject
	move: (direction) ->

		none_are_solid = (targets) ->
			for target in targets
				return false if target.solid
			return true

		if direction is 'left'
			targets = map[@x - 1][@y]

			if none_are_solid(targets)
				@x -= 1
				@sprite.x -= CELL_SIZE

				if @player and @sprite.x < SCREEN_WIDTH / 3 - camera.x
					camera.x += 25

		if direction is 'right'
			targets = map[@x + 1][@y]

			if none_are_solid(targets)
				@x += 1
				@sprite.x += CELL_SIZE

				if @player and @sprite.x > SCREEN_WIDTH / 3 - camera.x
					camera.x -= 25

		if direction is 'up'
			targets = map[@x][@y - 1]

			if none_are_solid(targets)
				@y -= 1
				@sprite.y -= CELL_SIZE

				if @player and @sprite.y < SCREEN_HEIGHT / 3 - camera.y
					camera.y += 25

		if direction is 'down'
			targets = map[@x][@y + 1]

			if none_are_solid(targets)
				@y += 1
				@sprite.y += CELL_SIZE

				if @player and @sprite.y > 2 * SCREEN_HEIGHT / 3 - camera.y
					camera.y -= 25



class Player extends MovableObject
	player: true
	sprite: new PIXI.Text('@', {'fill': 'white', 'font': '17px Arial'})
	solid: true

class StoneWall extends BaseObject
	solid: true

	constructor: (x, y) ->
		super(x, y)
		@sprite = createSprite('static/img/wall20.png')

