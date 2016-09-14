class BaseObject

	constructor: (options) ->
		@sprite = null
		@solid = false
		@visible = false
		@distant = false

		@x = options.x
		@y = options.y
		@visible = options.visible or false

	draw: () ->
		@sprite.x = @x * CELL_SIZE
		@sprite.y = @y * CELL_SIZE
		if @visible
			gamestate.level.stage.addChild(@sprite)
		return

	save: () ->
		return JSON.stringify(this)

class Openable extends BaseObject
	constructor: (options) ->
		super(options)
		@openable = true

class Wall extends BaseObject

	constructor: (options) ->
		super(options)
		@solid = true
		@sprite = createSprite('static/img/wall20.png')
		@draw()

class Door extends Openable

	constructor: (options) ->
		super(options)
		@door = true
		@open_texture = PIXI.Texture.fromImage('static/img/door_open.png')
		@closed_texture = PIXI.Texture.fromImage('static/img/door_closed.png')
		@rooms = []
		@is_open = options.is_open or false

		@sprite = createSprite('static/img/door_closed.png')

		if @is_open then @open() else @close()

		@rooms = options.rooms or []

	open: () ->
		@sprite.texture = @open_texture
		@solid = false
		@is_open = true
		for room in @rooms
			if not room.visible
				room.show()
		@draw()

	close: () ->
		@sprite.texture = @closed_texture 
		@solid = true
		@is_open = false
		@draw()

class Stairs extends BaseObject

	constructor: (options) ->
		super(options)
		@stairs = true
		if options.up
			@sprite = createSprite('static/img/stairs_up.png')
			@up = true
		else
			@sprite = createSprite('static/img/stairs_down.png')
			@down = true
		@draw(@x, @y)

	use: () ->
		if @up
			gamestate.go_up_a_level()
		if @down
			gamestate.go_down_a_level()
