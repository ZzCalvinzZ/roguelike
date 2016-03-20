class BaseObject
	sprite: null
	solid: false

	constructor: (@x, @y) ->

	draw: (x, y) ->
		spriteInstance = new PIXI.Sprite(@sprite)
		spriteInstance.x = @x * CELL_SIZE
		spriteInstance.y = @y * CELL_SIZE
		stage.addChild(spriteInstance)

class Player extends BaseObject
	sprite: new PIXI.Text('@', {'fill': 'white', 'font': '17px Arial'})
	solid: true

	#constructor: (options={}) ->

class StoneWall extends BaseObject
	sprite: PIXI.Texture.fromImage('static/img/wall20.png')

	#constructor: () ->
	#	{@sprite, @solid = true} = options
