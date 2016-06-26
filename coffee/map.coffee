map_utils = {
	create_map: (x_size, y_size) ->
		map = for x in [0...x_size]
			for y in [0...y_size]
				[]

	draw_box: (map, x_size, y_size, x_left, y_top, sprite) ->
		x_right = x_left + x_size - 1
		y_bottom = y_top + y_size - 1

		for x in [x_left..x_right]
			map[x][y_top].push(new sprite({x:x,y:y_top}))
			map[x][y_bottom].push(new sprite({x:x,y:y_bottom}))

		for y in [y_top..y_bottom]
			map[x_left][y].push(new sprite({x:x_left,y:y}))
			map[x_right][y].push(new sprite({x:x_right,y:y}))
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
			destroy_sprite(map[door_x][door_y].pop().sprite)
			map[door_x][door_y] = [new Door({x:door_x,y:door_y})]

			i += 7
		
		start = {
			x: 15
			y: 20
		}

		map[15][20].push(new Stairs({x:start.x, y:start.y}))

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

		@generate_map(map, start)


		return [map, start]

	create_starting_room: (map, start) ->

		map[start.x][start.y].push(new Stairs({x:start.x, y:start.y, up:true}))

		x = randomNum(MIN_ROOM_SIZE, 20)
		y = randomNum(MIN_ROOM_SIZE, 20)

		x_left = start.x - randomNum(1, x-1)
		y_top = start.y - randomNum(1, y-1)

		if x_left < 0
			x_left = 0
		else if x_left + x > map.length - 1
			x_left = map.length - x

		if y_top < 0
			y_top = 0
		else if y_top + y > map[0].length - 1
			y_top = map[0].length - y

		@draw_box(map, x, y, x_left, y_top, Wall)

	generate_map: (map, start) ->
		@create_starting_room(map, start)
		#@create_room(map, )
		#@create_hall(map)

}
