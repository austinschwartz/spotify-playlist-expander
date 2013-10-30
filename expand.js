var sp = require('../lib/libspotify');
var cred = require('../spotify_key/passwd');
var fs = require('fs');
var async = require('async');

var singleTrackToString = function(track) {
    var str ="";
    str += track.artist.name;
    str += ' - ' + track.title;
    str += ' - ' + track.album.name;
    return str;
};

var readableTracks = function(tracks) {
    var all = [];
    for (var i = 0; i < tracks.length; i++) {
        all[i] = singleTrackToString(tracks[i]);
    };
    return all.join("\n");
};

var readableAlbumTracks = function(albumTracks) {
    var all = [];
    for (var i = 0; i < albumTracks.length; i++) {
        var album = albumTracks[i];
        for (var j = 0; j < album.length; j++) {
            var track = album[j];
            all.push(singleTrackToString(track));
        }
    }
    return all.join("\n");
};

var getAlbums = function(tracks) {
    var albums = [];
    for (var i = 0; i < tracks.length; i++) {
        albums[i] = tracks[i].album;
    }
    return albums;
};

var searchForTracks = function(query, cb) {
    var search = new sp.Search(query);
    search.execute();       
    search.once('ready', function() {
        if (search.tracks === undefined || !search.tracks.length) {
            console.log("no tracks found");
            cb([]);
        } else {
            cb(search.tracks);
        }
    });
}

var getAlbumTracks = function(albums, cb) {
    albumTracks = [];
    async.forEach(albums, function(album, callback) {
        var query = 'album:"' + album.name + '" artist:"' + album.artist.name + '"';
        searchForTracks(query, function(tracks) {
            albumTracks.push(tracks);
            callback();
        });
    }, function(err) {
        console.log('done');
        cb(albumTracks);
    });
};

session = new sp.Session({
    applicationKey: __dirname + '/../spotify_key/spotify_appkey.key'
});
session.login(cred.login, cred.password);
session.once('login', function(err) {
    if(err) this.emit('error', err);
    
    var play = sp.Playlist.getFromUrl('spotify:user:1212612797:playlist:4jWRw5pcXMZPCYF7gNrMzl');
    console.log(play.name);
    console.log(play.getNumTracks());
    play.getTracks(function(tracks, err) {
    	if (err) this.emit('error', err);
        console.log(readableTracks(tracks));
        var albums = getAlbums(tracks);
        getAlbumTracks(albums, function(albumTracks, err) {
            console.log(readableAlbumTracks(albumTracks)); 
        });
    });
});

