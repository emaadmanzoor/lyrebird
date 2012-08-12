$(document).ready(function() {

    refreshtweet();
    $('#refreshtweet').click(refreshtweet);
    
    $('#changehashtag').click(function() {
        var newhashtag = prompt("New hashtag?", "#openhackindia");
        $('#hashtag').text(newhashtag);
        refreshtweet();
    });
    
    $('#changelocation').click(function() {
        var newlocation = prompt("New location?", "Sheraton, Bangalore");
        $.get('location/' + newlocation, function(data) {
           newhashtags = JSON.parse(data);
           for (var hashtag in newhashtags) {
           }
           // Display hashtags in a list
           // When clicked on an item in the list,
           // set that as the new hashtag and call
           // refreshtweet
        });
    });

    $('#tweetnow').click(function() {
        var tweet = $('#tweettext').text();
        $.get('tweet/' + escape(tweet), function(data) {
            console.log("Tweeted: " + escape(tweet));
        });
    });

    function refreshtweet() {
        var hashtag = $('#hashtag').text();
        hashtag = hashtag.substr(1, hashtag.length);
        $.get('generate/' + hashtag, function(data) {
            $('#tweettext').text(data);
        });
    }
});
