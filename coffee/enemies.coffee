class Enemy extends BaseObject
	constructor: (options) ->
		super(options)
		@solid = true
		@room = options.room
	
	normal_move: (to) ->
		path = new ROT.Path.Dijkstra(to.x, to.y, gamestate.cell_is_passable)

		count = 0
		path._fromX = @x
		path._fromY = @y
		path.compute(@x, @y, (x, y) =>
			if count == 1 and not (x == to.x and y == to.y)
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
			count += 1
		)

class Snake extends Enemy

	constructor: (options) ->
		super(options)
		@sprite = createSprite('static/img/snake.png')
		@draw()

	move: (to) ->
		@normal_move(to)
