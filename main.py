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
]

env.register(
    'game',
	Bundle(
		'utils.coffee',
		'objects.coffee',
		'controls.coffee',
		'globals.coffee',
		'map.coffee',
		'game.coffee',
		filters='coffeescript',
        output='js/game.js',
    )
)

@app.route('/')
def main():
	return render_template('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0')
