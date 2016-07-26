class Enemy extends BaseObject

class Snake extends Enemy

	constructor: (options) ->
		super(options)
		@sprite = createSprite('static/img/snake.png')
