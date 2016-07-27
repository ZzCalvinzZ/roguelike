class Enemy extends BaseObject
	constructor: (options) ->
		super(options)
		@solid = true

class Snake extends Enemy

	constructor: (options) ->
		super(options)
		@sprite = createSprite('static/img/snake.png')
		@draw()
