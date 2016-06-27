import os
from flask import Flask
from flask import render_template
from flask_assets import Environment, Bundle

app = Flask(__name__)

app.config.from_object('settings.default')
app.config.from_object('settings.local')

env = Environment(app)

env.load_path = [
    os.path.join(os.path.dirname(__file__), 'coffee'),
    os.path.join(os.path.dirname(__file__), 'static', 'js', 'lib'),
]

env.register('utils', Bundle('utils.coffee', filters='coffeescript', output='c/js/utils.js'))
env.register('objects', Bundle('objects.coffee', filters='coffeescript', output='c/js/objects.js'))
env.register('controls', Bundle('controls.coffee', filters='coffeescript', output='c/js/controls.js'))
env.register('globals', Bundle('globals.coffee', filters='coffeescript', output='c/js/globals.js'))
env.register('map', Bundle('map.coffee', filters='coffeescript', output='c/js/map.js'))
env.register('game', Bundle('game.coffee', filters='coffeescript', output='c/js/game.js'))

# env.register(
    # 'libs',
	# Bundle(
		# 'pixi.js',
		# 'jquery.min.js',
		# 'howler.min.js',
        # output='c/js/libs.js',
    # )
# )

@app.route('/')
def main():
	return render_template('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0')
