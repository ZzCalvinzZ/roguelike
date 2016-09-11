class Enemy extends BaseObject
	constructor: (options) ->
		super(options)
		@solid = true
	
	normal_move: (to) ->
		path = new ROT.Path.Dijkstra(to.x, to.y, gamestate.cell_is_passable)

		count = 0
		path._fromX = @x
		path._fromY = @y
		path.compute(@x, @y, (x, y) =>
			if count <= 1 and not (x == to.x and y == to.y)
				gamestate.map()[@x][@y].things.remove(@)
				gamestate.map()[x][y].things.push(@)
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
