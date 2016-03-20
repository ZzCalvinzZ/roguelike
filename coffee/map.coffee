createMap = (map_size) ->
	map = for x in [0...map_size]
		for y in [0...map_size]
			new BaseObject(x, y)
