import os
import urllib2, json
from twokenize import *
from nltk.model import *
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/generate/<hashtag>')
def generate(hashtag):
    url = "http://query.yahooapis.com/v1/public/yql?q=select%20text%20from%20twitter.search%20where%20q%3D'%23" + hashtag + "'%3B&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback="

    #f = open('static/data/tweets', 'r')
    #tweets = f.read().splitlines()

    fullHashTag = '#' + hashtag.lower()

    response = urllib2.urlopen( url ).read()
    jsonDict = json.loads( response )
    tweets = jsonDict[ 'query' ][ 'results' ][ 'results' ]
    tweets = [tweet['text'] for tweet in tweets]
    words = [tokenize(tweet) for tweet in tweets]
    words = [word for sublist in words for word in sublist]
    words = [word for word in words if word.lower() != fullHashTag] 

    lm = NgramModel(2, words)
    generatedTweet = ' '.join(lm.generate(30))
    generatedTweet = generatedTweet + ' ' + fullHashTag

    return generatedTweet

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
