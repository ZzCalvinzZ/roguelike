BaseObject = (info) ->
	@sprite = info.sprite
	@info = solid: info.solid or true
	return

Player = (info) ->
	info.sprite = new (PIXI.Text)('@',
	'fill': 'white'
	'font': '17px Arial')
	BaseObject.call(this, info)
	return

StoneWall = (info) ->
	info.sprite = PIXI.Texture.fromImage('static/img/wall20.png')
	BaseObject.call(this, info)
	return

BaseObject.prototype =
	constructor: BaseObject
	draw: (x, y) ->
		spriteInstance = new (PIXI.Sprite)(@sprite)
		spriteInstance.x = x
		spriteInstance.y = y
		stage.addChild spriteInstance
		return

Player.prototype = Object.create(BaseObject.prototype)
StoneWall.prototype = Object.create(BaseObject.prototype)

