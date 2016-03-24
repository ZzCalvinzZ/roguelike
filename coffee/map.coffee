map = []

create_map = (map_size) ->
	map = for x in [0...map_size]
		for y in [0...map_size]
			[]

draw_box = (map, size, x_left, y_top, sprite) ->
	x_right = x_left + size - 1
	y_bottom = y_top + size - 1

	for x in [x_left..size - 1]
		map[x][y_top].push(new sprite({x:x,y:y_top}).draw())
		map[x][y_bottom].push(new sprite({x:x,y:y_bottom}).draw())

	for y in [y_top + 1..size - 2]
		map[x_left][y].push(new sprite({x:x_left,y:y}).draw())
		map[x_right][y].push(new sprite({x:x_right,y:y}).draw())
	return

create_town_map = () ->
	size = 10
	center = size // 2

	map = create_map(size)
	draw_box(map, size, 0, 0, Wall)

	return map
