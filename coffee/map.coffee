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

		#@draw_box(map, x_size, y_size, 0, 0, Wall)

		return [map, start]

	create_stairs: (map, start) ->

		map[start.x][start.y].push(new Stairs({x:start.x, y:start.y, up:true}))

	generate_map: (map, start) ->
		@create_stairs(map, start)
		#@create_room(map)

}
