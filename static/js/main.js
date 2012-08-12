$(document).ready(function() {

    refreshtweet();
    $('#refreshtweet').click(refreshtweet);

    $('#changehashtag').click(function() {
        var newhashtag = prompt("New hashtag?", "#openhackindia");
        $('#hashtag').text(newhashtag);
        refreshtweet();
    });
    
    $('#tweetnow').click(function() {
        $('#tweetnow').text('Tweeting...');
        var tweet = $('#tweettext').text();
        $.get('tweet/' + escape(tweet), function(data) {
            $('#tweetnow').text('Tweet');
        });
    });

    function refreshtweet() {
        $('#tweettext').text('Loading...');
        var hashtag = $('#hashtag').text();
        hashtag = hashtag.substr(1, hashtag.length);
        $.get('generate/' + hashtag, function(data) {
            $('#tweettext').text(data);
        });
    }
});
