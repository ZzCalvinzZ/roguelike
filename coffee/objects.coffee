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

class CombatObject extends BaseObject
	constructor: (options) ->
		super(options)
		@damage = 0
		@room = options.room

	attack_object: (targets, type) ->
		for target in targets
			if target[type] == true
				target.defend(@)

	defend: (attacker) ->

		if @successful_hit()
			@damage += attacker.attack()

		if @hp() < 0
			@die()

	defense: () ->
		@stats.stats.def

	attack: () ->
		@stats.att

	hp: () ->
		@stats.hp - @damage

	die: () ->
		console.log("immplement this method")

	successful_hit: (attacker) ->
		return true

class MovableObject extends CombatObject
	move_to_cell: (x, y) ->
		curr_cell = gamestate.map()[@x][@y]
		next_cell = gamestate.map()[x][y]

		curr_cell.things.remove(@)

		if curr_cell.room == null and @player != true
			@room.monsters.remove(@)
			@room = next_cell.room
			@room.monsters.push(@)

		next_cell.things.push(@)
		[@x, @y] = [x, y]
		@draw()
	
	move: (direction) ->
		targets = get_targets(direction, @x, @y)

		none_are_solid = (targets) =>
			for target in targets
				if target.solid
					@attack_object(targets, 'bad')
					return false
			return true

		new_cell = {x:@x, y:@y}
		moved = false

		if direction is 'left' and none_are_solid(targets)
			new_cell.x -= 1
			@x -= 1
			@sprite.x -= CELL_SIZE

			if @player and @sprite.x < SCREEN_WIDTH / 3 - camera.x
				camera.x += CELL_SIZE

			moved = true

		else if direction is 'right' and none_are_solid(targets)
			new_cell.x += 1
			@x += 1
			@sprite.x += CELL_SIZE

			if @player and @sprite.x > 2 * SCREEN_WIDTH / 3 - camera.x
				camera.x -= CELL_SIZE

			moved = true

		else if direction is 'up' and none_are_solid(targets)
			new_cell.y -= 1
			@y -= 1
			@sprite.y -= CELL_SIZE

			if @player and @sprite.y < SCREEN_HEIGHT / 3 - camera.y
				camera.y += CELL_SIZE

			moved = true

		else if direction is 'down' and none_are_solid(targets)
			new_cell.y += 1
			@y += 1
			@sprite.y += CELL_SIZE

			if @player and @sprite.y > 2 * SCREEN_HEIGHT / 3 - camera.y
				camera.y -= CELL_SIZE
			
			moved = true

		if moved
			@move_to_cell(new_cell.x, new_cell.y)

		#debug stuff
		if DEBUG == true
			console.log("x: " + @x)
			console.log("y: " + @y)
			console.log(gamestate.level.map_data[@x][@y])

		return moved

class Player extends MovableObject
	#sprite: new PIXI.Text('@', {'fill': 'white', 'font': '17px Arial'})

	constructor: (options) ->
		super(options)
		@good = true
		@set_stats(options)
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

		#if standing in doorway get adjacent rooms
		door = _.findWhere(cell.things, {door: true})
		rooms = if door != undefined then door.rooms else []


		#get this room and adjacent rooms
		if rooms.length == 0
			this_room = cell.room

			if this_room
				for door in this_room.doors
					for room in door.rooms
						if room not in rooms
							rooms.push(room)

		#move monsters in rooms
		if rooms.length > 0
				
			monsters = []
			for room in rooms
				monsters.push(room.monsters...)

			for monster in monsters
				monster.move(@)

	set_stats: (options) ->
		@stats = {
			spd: options.speed || 50,
			hp: options.health || 50,
			att: options.attack || 10,
			dex: options.dexterity || 10,
			def: options.defense || 10,
			rm: options.defense || 10,
		}


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
