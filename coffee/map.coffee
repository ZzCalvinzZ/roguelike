map_utils = {
	create_map: (x_size, y_size) ->
		map = for x in [0...x_size]
			for y in [0...y_size]
				{things: [], room: null}

	draw_box: (map, x_size, y_size, x_left, y_top, sprite, visible=true) ->
		x_right = x_left + x_size - 1
		y_bottom = y_top + y_size - 1

		for x in [x_left..x_right]
			if map[x][y_top].things.length < 1
				map[x][y_top].things.push(new sprite({x:x,y:y_top,visible:visible}))
			if map[x][y_bottom].things.length < 1
				map[x][y_bottom].things.push(new sprite({x:x,y:y_bottom,visible:visible}))

		for y in [y_top..y_bottom]
			if map[x_left][y].things.length < 1
				map[x_left][y].things.push(new sprite({x:x_left,y:y,visible:visible}))
			if map[x_right][y].things.length < 1
				map[x_right][y].things.push(new sprite({x:x_right,y:y,visible:visible}))
		return

	create_town_map: () ->
		size = 39
		center = size // 2

		map = @create_map(size, size)

		@draw_box(map, size, size, 0, 0, Wall, visible=true)

		#create stores
		store_size = 5
		y=5
		i=3

		while i<37
			@draw_box(map, store_size, store_size, i, y, Wall, visible=true)
			door_x = i + store_size // 2
			door_y = y + store_size - 1
			destroy_sprite(map[door_x][door_y].things.pop().sprite)
			map[door_x][door_y].things = [new Door({x:door_x,y:door_y,visible:true})]

			i += 7
		
		start = {
			x: 15
			y: 20
		}

		map[15][20].things.push(new Stairs({x:start.x, y:start.y,visible:true}))

		return [map, start]

	create_map_from_data: (level) ->
		min = level *10 + 400 
		max = level *10 + 700

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

		stairs = new Stairs({x:start.x, y:start.y, up:true, visible: true})
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

			new_room = new Room({map: map, level: room.level, door_cell: door_cell, direction: direction, prev_room:room})
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
	#left/right is x where the wall is
	#top/bottom is y where the wall is
	
	constructor: (options) ->
		[@stairs, @doors] = [[], []]
		@map = options.map
		@monsters = []

		@x_len = randomNum(MIN_ROOM_SIZE, MAX_ROOM_SIZE)
		@y_len = randomNum(MIN_ROOM_SIZE, MAX_ROOM_SIZE)

		#set the origin (top leftmost point)
		if options.start?
			@stairs.push(options.stairs)

			@origin = {
				x: options.start.x - randomNum(1, @x_len)
				y: options.start.y - randomNum(1, @y_len)
			}

		else
			if options.direction is 'left'
				@origin = {
					x: options.door_cell.x - @x_len + 2
					y: options.door_cell.y - randomNum(1, @y_len)
				}

			else if options.direction is 'right'
				@origin = {
					x: options.door_cell.x
					y: options.door_cell.y - randomNum(1, @y_len)
				}

			else if options.direction is 'top'
				@origin = {
					x: options.door_cell.x - randomNum(1, @x_len)
					y: options.door_cell.y - @y_len + 2
				}

			else if options.direction is 'bottom'
				@origin = {
					x: options.door_cell.x - randomNum(1, @x_len)
					y: options.door_cell.y
				}

		@out_of_bounds = @check_out_of_bounds()
		@set_bounds()

		if options.start?
			@move_room_in_bounds()
			@set_bounds()


		@created = @can_create()

		@visible = if options.start? then true else false

		if @created or options.start?
			@level = gamestate.level
			@level.rooms.push(@)
			
			@level.cell_count += @area()
			@put_room_on_map()
			map_utils.draw_box(@map, @x_len + 1, @y_len + 1, @origin.x, @origin.y, Wall, visible=@visible)

			if options.door_cell?
				destroy_all_things_in_cell(@map[options.door_cell.x][options.door_cell.y])
				@add_door(options.door_cell.x, options.door_cell.y, options.prev_room)

			@add_monsters()

	add_door: (x, y, prev_room) ->
		visible_door = @visible or prev_room.visible
		door = new Door({x:x, y:y, visible: visible_door, rooms: [@, prev_room]})
		@doors.push(door)
		prev_room.doors.push(door)
		@map[x][y].things.push(door)

	show: () ->
		@visible = true
		for x in [@left..@right]
			for y in [@top..@bottom]
				for thing in @map[x][y].things
					thing.visible = true
					thing.draw()

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
		@right = @origin.x + @x_len
		@bottom = @origin.y + @y_len

	check_out_of_bounds: () ->
		if @origin.x < 0
			return 'left'
		else if @origin.x + @x_len + 3 > @map.length
			return 'right'
		else if @origin.y < 0
			return 'top'
		else if @origin.y + @y_len + 3 > @map[0].length
			return 'bottom'

		else
			return false

	put_room_on_map: () ->
		#add room object to each cell INSIDE the walls
		for x in [@origin.x + 1...@origin.x + @x_len]
			for y in [@origin.y + 1...@origin.y + @y_len]
				@map[x][y].room = @
		return

	move_room_in_bounds: () ->
		if @out_of_bounds == 'left'
			@origin.x = 0
		else if @out_of_bounds == 'right'
			@origin.x = @map.length - @x_len + 1

		if @out_of_bounds == 'top'
			@origin.y = 0
		else if @out_of_bounds == 'bottom'
			@origin.y = @map[0].length - @y_len + 1

	area:() ->
		(@x_len - 1) * (@y_len - 1)

	draw_on_random_cell: (sprite) ->
		x = randomNum(@left + 1, @right)
		y = randomNum(@top + 1, @bottom)
		if (@map[x][y].things.length is 0)
			sprite = new sprite ({x:x, y:y, visible: true})
			@map[x][y].things.push(sprite)
			@monsters.push(sprite)

	add_monsters: () ->
		monster_count = randomNum(0, @area() * MONSTER_DENSITY)

		for i in [0...monster_count]
			monster = ROT.RNG.getWeightedValue(@level.get_monsters())
			@draw_on_random_cell(window[monster])

