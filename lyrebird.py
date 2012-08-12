import os
import urllib2, json
from twokenize import *
from nltk.model import *
from flask import Flask, render_template
import tweepy

CONSUMER_KEY = '5kIbQUgMTVbdn1RYWGOS5g'
CONSUMER_SECRET = 'yTTvwoxJXuhEaLziZVzFi6YSxQ8Os2GEtptRx43fsZw'
ACCESS_TOKEN = "752201425-DvLQph5wlDQh7WJtP7mhaZFeIDoDq5KAJDpyF5O2"
ACCESS_SECRET_TOKEN = "qAsZlnUw3OPT7RJbqSHnXlEWiCoRD8MSgeuDgcjh6Q"

app = Flask(__name__)

@app.route('/generate/<hashtag>')
def generate(hashtag):
    escapedhashtag = urllib2.quote(hashtag)
    url = "http://query.yahooapis.com/v1/public/yql?q=select%20text%20from%20twitter.search%20where%20q%3D'%23" + escapedhashtag + "'%3B&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback="

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
    generatedTweet = ' '.join(lm.generate(20))
    generatedTweet = generatedTweet + ' ' + fullHashTag

    return generatedTweet

@app.route('/tweet/<generatedTweet>')
def tweet(generatedTweet):
    auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
    auth.set_access_token( ACCESS_TOKEN, ACCESS_SECRET_TOKEN )
    api = tweepy.API(auth)
    api.update_status( generatedTweet )
    return "foo"

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
