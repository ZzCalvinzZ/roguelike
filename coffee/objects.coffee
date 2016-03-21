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

class Player extends BaseObject
	sprite: new PIXI.Text('@', {'fill': 'white', 'font': '17px Arial'})
	solid: true

	#constructor: (options={}) ->

class StoneWall extends BaseObject
	solid: true

	constructor: (x, y) ->
		super(x, y)
		@sprite = createSprite('static/img/wall20.png')

