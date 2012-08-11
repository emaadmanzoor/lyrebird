import os
from flask import Flask, render_template, request, session, abort, redirect, url_for

app = Flask(__name__)
app.config.from_pyfile('lyrebird-config.py')

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=app.config['DEBUG'])
