class BaseObject

	constructor: (options) ->
		@sprite = null
		@solid = false
		@visible = false
		@distant = false

		@x = options.x
		@y = options.y
		@visible = options.visible or false

	remove_sprite: () ->
		gamestate.level.stage.addChild(@sprite)

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
				camera.x += CELL_SIZE

		if direction is 'right' and none_are_solid(targets)
			@x += 1
			@sprite.x += CELL_SIZE

			if @player and @sprite.x > 2 * SCREEN_WIDTH / 3 - camera.x
				camera.x -= CELL_SIZE

		if direction is 'up' and none_are_solid(targets)
			@y -= 1
			@sprite.y -= CELL_SIZE

			if @player and @sprite.y < SCREEN_HEIGHT / 3 - camera.y
				camera.y += CELL_SIZE

		if direction is 'down' and none_are_solid(targets)
			@y += 1
			@sprite.y += CELL_SIZE

			if @player and @sprite.y > 2 * SCREEN_HEIGHT / 3 - camera.y
				camera.y -= CELL_SIZE
		#console.log("x: " + @x)
		#console.log("y: " + @y)
		#console.log(gamestate.level.map_data[@x][@y])

class Player extends MovableObject
	#sprite: new PIXI.Text('@', {'fill': 'white', 'font': '17px Arial'})

	constructor: (options) ->
		super(options)
		@player = true
		@opening = false
		@sprite = createSprite('static/img/player_female.png')

	open: (direction) ->
		targets = get_targets(direction, @x, @y)

		for target in targets
			if target.openable
				if target.is_open then target.close() else target.open()

	use_stairs: () ->
		targets = get_targets('here', @x, @y)

		for target in targets
			if target.stairs
				target.use()

	move_enemies: () ->
		cell = gamestate.map()[@x][@y]
		if cell.room
			monsters = cell.room.monsters

			for monster in monsters
				monster.move({@x, @y})


class Wall extends BaseObject

	constructor: (options) ->
		super(options)
		@solid = true
		@sprite = createSprite('static/img/wall20.png')
		@draw()

class Door extends Openable

	constructor: (options) ->
		super(options)
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
