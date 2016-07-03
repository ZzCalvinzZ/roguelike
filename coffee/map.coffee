map_utils = {
	create_map: (x_size, y_size) ->
		map = for x in [0...x_size]
			for y in [0...y_size]
				{things: [], room: null}

	draw_box: (map, x_size, y_size, x_left, y_top, sprite) ->
		x_right = x_left + x_size - 1
		y_bottom = y_top + y_size - 1

		for x in [x_left..x_right]
			if map[x][y_top].things.length < 1
				map[x][y_top].things.push(new sprite({x:x,y:y_top}))
			if map[x][y_bottom].things.length < 1
				map[x][y_bottom].things.push(new sprite({x:x,y:y_bottom}))

		for y in [y_top..y_bottom]
			if map[x_left][y].things.length < 1
				map[x_left][y].things.push(new sprite({x:x_left,y:y}))
			if map[x_right][y].things.length < 1
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

	create_ajoining_room: (map, room) ->
		#recursively create ajoining rooms until none can be made
		
		DIRECTIONS = ['left', 'right', 'top', 'bottom']
		directions = []
		for i in [0...DIRECTIONS.length]
			direction = random_choice(DIRECTIONS)
			DIRECTIONS.remove(direction)
			directions.push(direction)

		#console.log direction
		#console.log room.left
		#console.log room.right
		#console.log room.top
		#console.log room.bottom

		for direction in directions
			if direction in ['left', 'right']
				door_cell = {
					x: room[direction]
					y: randomNum(room.top + 1, room.bottom - 1)
				}

			else if direction in ['top', 'bottom']
				door_cell = {
					x: randomNum(room.left + 1, room.right - 1)
					y: room[direction]
				}

			#console.log door_cell
			
			new_room = new Room({map: map, level: room.level, door_cell: door_cell, direction: direction})
			if new_room.created
				@create_ajoining_room(map, new_room)
			else
				new_room = null

	generate_map: (map, start, level) ->
		#a list of doors that still need stuff attached to them
		doors_to_attach = []
		starting_room = @create_starting_room(map, start, level)

		@create_ajoining_room(map, starting_room)

}

class Room
	origin: {
		x: null
		y: null
	}

	left: null
	right: null
	top: null
	bottom: null

	x_len: null
	y_len: null

	created: true
	out_of_bounds: false

	map: null
	level: null
	stairs: []
	doors: []

	constructor: (options) ->
		@map = options.map
		@level = gamestate.level
		@level.rooms.push(@)

		@x_len = randomNum(MIN_ROOM_SIZE, MAX_ROOM_SIZE)
		@y_len = randomNum(MIN_ROOM_SIZE, MAX_ROOM_SIZE)

		#set the origin (top leftmost point)
		if options.start?
			@stairs.push(options.stairs)

			@origin = {
				x: options.start.x - randomNum(1, @x_len-1)
				y: options.start.y - randomNum(1, @y_len-1)
			}

		else
			if options.direction is 'left'
				@origin = {
					x: options.door_cell.x - @x_len + 1
					y: options.door_cell.y - randomNum(1, @y_len - 1)
				}

			else if options.direction is 'right'
				@origin = {
					x: options.door_cell.x
					y: options.door_cell.y - randomNum(1, @y_len - 1)
				}

			else if options.direction is 'top'
				@origin = {
					x: options.door_cell.x - randomNum(1, @x_len - 1)
					y: options.door_cell.y - @y_len + 1
				}

			else if options.direction is 'bottom'
				@origin = {
					x: options.door_cell.x - randomNum(1, @x_len - 1)
					y: options.door_cell.y
				}

		@out_of_bounds = @check_out_of_bounds()
		@set_bounds()

		if options.start?
			@move_room_in_bounds()
			@set_bounds()

		@created = @can_create()

		if @created or options.start?
			@put_room_on_map()
			map_utils.draw_box(@map, @x_len, @y_len, @origin.x, @origin.y, Wall)

			if options.door_cell?
				destroy_all_things_in_cell(@map[options.door_cell.x][options.door_cell.y])
				@add_door(options.door_cell.x, options.door_cell.y)

	add_door: (x, y) ->
		door = new Door({x:x, y:y})
		@doors.push(door)
		@map[x][y].things.push(door)

	can_create:() ->
		if typeof(@out_of_bounds) == 'string'
			return false

		for x in [@left..@right]
			for y in [@top..@bottom]
				if @map[x][y].room?
					return false

		return true

	set_bounds: () ->
		@left = @origin.x
		@top = @origin.y
		@right = @origin.x + @x_len - 1
		@bottom = @origin.y + @y_len - 1

	check_out_of_bounds: () ->
		if @origin.x < 0
			return 'left'
		else if @origin.x + @x_len > @map.length - 1
			return 'right'
		else if @origin.y < 0
			return 'top'
		else if @origin.y + @y_len > @map[0].length - 1
			return 'bottom'

		else
			return false

	put_room_on_map: () ->
		#add room object to each cell INSIDE the walls
		for x in [@origin.x + 1...@origin.x + @x_len - 1]
			for y in [@origin.y + 1...@origin.y + @y_len - 1]
				@map[x][y].room = @
		return

	move_room_in_bounds: () ->
		if @out_of_bounds == 'left'
			@origin.x = 0
		else if @out_of_bounds == 'right'
			@origin.x = @map.length - @x_len

		if @out_of_bounds == 'top'
			@origin.y = 0
		else if @out_of_bounds == 'bottom'
			@origin.y = @map[0].length - @y_len
