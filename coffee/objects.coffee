class BaseObject
	sprite: null
	solid: true
	constructor: () ->

	draw: (x, y) ->
		spriteInstance = new (PIXI.Sprite)(@sprite)
		spriteInstance.x = x
		spriteInstance.y = y
		stage.addChild(spriteInstance)

class Player extends BaseObject
	sprite: new PIXI.Text('@', {'fill': 'white', 'font': '17px Arial'})
	constructor: () ->

class StoneWall extends BaseObject
	sprite: PIXI.Texture.fromImage('static/img/wall20.png')
	constructor: () ->
