map = []

create_map = (map_size) ->
	map = for x in [0...map_size]
		for y in [0...map_size]
			[]

draw_box = (map, size, x_left, y_top, sprite) ->
	x_right = x_left + size - 1
	y_bottom = y_top + size - 1

	for x in [x_left..x_right]
		map[x][y_top].push(new sprite({x:x,y:y_top}))
		map[x][y_bottom].push(new sprite({x:x,y:y_bottom}))

	for y in [y_top..y_bottom]
		map[x_left][y].push(new sprite({x:x_left,y:y}))
		map[x_right][y].push(new sprite({x:x_right,y:y}))
	return

create_town_map = () ->
	size = 39
	center = size // 2

	map = create_map(size)

	draw_box(map, size, 0, 0, Wall)

	#create stores
	store_size = 5
	y=5
	i=3

	while i<37
		draw_box(map, store_size, i, y, Wall)
		door_x = i + store_size // 2
		door_y = y + store_size - 1
		destroy_sprite(map[door_x][door_y].pop().sprite)
		map[door_x][door_y] = [new Door({x:door_x,y:door_y})]

		i += 7
	
	map[15][20].push(new Stairs({x:15,y:20}))

	return map
