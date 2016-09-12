class Enemy extends BaseObject
	constructor: (options) ->
		super(options)
		@solid = true
		@room = options.room

	set_stats: () ->
		@stats = {}

		for key, val of @stat_config
			@stats[key] = round_pos(ROT.RNG.getNormal(val.mean, val.stddev))

		@movement_bar = @stats.speed

	#return how many turns they get to take
	check_movement: () ->
		turns = 0

		if (@movement_bar <= 0)
			extra = 0 - @movement_bar
			turns += 1
			@movement_bar = @stats.speed - extra
			turns += @check_movement()

		return turns

	move_to_cell: (x, y) ->
		curr_cell = gamestate.map()[@x][@y]
		next_cell = gamestate.map()[x][y]

		curr_cell.things.remove(@)
		if curr_cell.room == null
			@room.monsters.remove(@)
			@room = next_cell.room
			@room.monsters.push(@)

		next_cell.things.push(@)
		[@x, @y] = [x, y]
		@draw()
	
	normal_move: (player) ->
		to = {x:player.x, y:player.y}

		@movement_bar -= player.stats.speed
		turns = @check_movement()
		console.log turns

		if turns > 0
			path = new ROT.Path.Dijkstra(to.x, to.y, gamestate.cell_is_passable)

			count = 0
			path._fromX = @x
			path._fromY = @y
			path.compute(@x, @y, (x, y) =>
				if count in [1..turns] and not (x == to.x and y == to.y)
					@move_to_cell(x, y)
				count += 1
			)

class Snake extends Enemy

	stat_config: {
		speed: {mean: 50, stddev: 5}
		health: {mean: 10, stddev: 2}
		attack: {mean: 3, stddev: 2}
		defense: {mean: 5, stddev: 2}
		armor: {mean: 0, stddev: 0}
	}

	constructor: (options) ->
		super(options)
		@set_stats()
		console.log @stats
		@sprite = createSprite('static/img/snake.png')
		@draw()

	move: (player) ->
		@normal_move(player)
