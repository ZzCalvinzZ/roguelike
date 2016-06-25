CELL_SIZE = 20
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 400
DEFAULT_MAP_SIZE = 50

stage = new(PIXI.Container)
camera = new(PIXI.Container)

player = new Player({x:25,y:25})

map_data = {
	level_0: null
	level_1: null
	level_2: null
	level_3: null
	level_4: null
	level_5: null
	level_6: null
	level_7: null
	level_8: null
	level_9: null
	level_10: null
	level_11: null
	level_12: null
	level_13: null
	level_14: null
	level_15: null
}

gamestate = {
	level: 0
	map: []
	ready: false

	go_up_a_level: () ->
		@level += 1
		@map = create_map_from_data('level_' + @level)

	go_down_a_level: () ->
		@level -= 1
		@map = create_map_from_data('level_' + @level)
		
}
