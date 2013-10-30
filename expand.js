var sp = require('../lib/libspotify');
var cred = require('../spotify_key/passwd');
var fs = require('fs');

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
            all[i * j] = singleTrackToString(track);
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

var getAlbumTracks = function(albums) {
    var albumTracks = [];
   
    for (var i = 0; i < albums.length; i++) {
        console.log(albums[i].name + " - - " + albums[i].artist.name); 
        var search = new sp.Search('album:"' + albums[i].name + '" artist:"' + albums[i].artist.name + '"');
        search.execute();
        search.once('ready', function() {
            if (search.tracks === undefined || !search.tracks.length) {
                console.log("no tracks found");
            } else {
                for (var i = 0; i < search.tracks.length; i++) {
                    console.log(search.tracks[i].title);
                }
            }
        });
        console.log("---");
    }
         
    /*
    for (var i = 0; i < albums.length; i++) {
        var tracks = [];
        var searchStr2 = albums[i].name + " " + albums[i].artist.name;
        var searchStr = 'album:"Skylarking" artist:"XTC"';
        var search = new sp.Search(searchStr);
        search.execute();
        search.once('ready', function() {
            if (search.tracks === undefined || !search.tracks.length) {
                console.log('no tracks found');
            } else {
                for (var j = 0; j < search.tracks.length; j++) {
                    tracks[j] = search.tracks[i];
                }
            }
            albumTracks[i] = tracks;
        });
    }*/
    return albumTracks;
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
        var albumTracks = getAlbumTracks(albums);
    });
});

