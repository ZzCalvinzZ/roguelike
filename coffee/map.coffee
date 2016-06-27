map_utils = {
	create_map: (x_size, y_size) ->
		map = for x in [0...x_size]
			for y in [0...y_size]
				{things: []}

	draw_box: (map, x_size, y_size, x_left, y_top, sprite) ->
		x_right = x_left + x_size - 1
		y_bottom = y_top + y_size - 1

		for x in [x_left..x_right]
			map[x][y_top].things.push(new sprite({x:x,y:y_top}))
			map[x][y_bottom].things.push(new sprite({x:x,y:y_bottom}))

		for y in [y_top..y_bottom]
			map[x_left][y].things.push(new sprite({x:x_left,y:y}))
			map[x_right][y].things.push(new sprite({x:x_right,y:y}))
		return

	create_town_map: () ->
		size = 39
		center = size // 2

		map = @create_map(size, size)

		@draw_box(map, size, size, 0, 0, Wall)

		#create stores
		store_size = 5
		y=5
		i=3

		while i<37
			@draw_box(map, store_size, store_size, i, y, Wall)
			door_x = i + store_size // 2
			door_y = y + store_size - 1
			destroy_sprite(map[door_x][door_y].things.pop().sprite)
			map[door_x][door_y].things = [new Door({x:door_x,y:door_y})]

			i += 7
		
		start = {
			x: 15
			y: 20
		}

		map[15][20].things.push(new Stairs({x:start.x, y:start.y}))

		return [map, start]

	create_map_from_data: (level) ->
		min = level *10 + 100
		max = level *10 + 200

		x_size = randomNum(min, max)
		y_size = randomNum(min, max)

		map = @create_map(x_size, y_size)
		start = {
			x: randomNum(1, map.length - 1)
			y: randomNum(1, map[0].length - 1)
		}

		@generate_map(map, start, level)


		return [map, start]

	create_starting_room: (map, start, level) ->

		stairs = new Stairs({x:start.x, y:start.y, up:true})
		map[start.x][start.y].things.push(stairs)

		new Room({map:map, start: start, stairs:stairs, level:level})

	generate_map: (map, start, level) ->
		#a list of doors that still need stuff attached to them
		doors_to_attach = []
		@create_starting_room(map, start, level)
		#@create_room(map, )
		#@create_hall(map)

}

class Room
	origin: {
		x: null
		y: null
	}

	x_len: null
	y_len: null

	map: null
	level: null
	stairs: []

	constructor: (options) ->
		@map = options.map
		@level = gamestate.level
		@level.rooms.push(@)

		@x_len = randomNum(MIN_ROOM_SIZE, MAX_ROOM_SIZE)
		@y_len = randomNum(MIN_ROOM_SIZE, MAX_ROOM_SIZE)

		if options.start?
			@stairs.push(options.stairs)

			@origin = {
				x: options.start.x - randomNum(1, @x_len-1)
				y: options.start.y - randomNum(1, @y_len-1)
			}

			@move_room_in_bounds()

		@put_room_on_map()
		map_utils.draw_box(@map, @x_len, @y_len, @origin.x, @origin.y, Wall)

	put_room_on_map: () ->
		for x in [@origin.x...@origin.x + @x_len]
			for y in [@origin.y...@origin.y + @y_len]
				@map[x][y].room = @

	move_room_in_bounds: () ->
		if @origin.x < 0
			@origin.x = 0
		else if @origin.x + @x_len > @map.length - 1
			@origin.x = @map.length - @x_len

		if @origin.y < 0
			@origin.y = 0
		else if @origin.y + @y_len > @map[0].length - 1
			@origin.y = @map[0].length - @y_len
