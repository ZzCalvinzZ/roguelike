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
	size = 50
	center = size // 2

	map = create_map(size)

	store_size = 5

	i=3
	while i<23
		draw_box(map, store_size, i, 3, Wall)

		i += 7

	return map
