// Load the fs package to read and write
var fs = require("fs");

// Include the request/twitter npm package
var request = require("request");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');

// pulls in the twitter/spotify keys object from the keys.js file
var twitterKeys = require("./keys.js");
var spotifyKeys = require("./keys.js");

// This will show your last 20 tweets and when they were created at in your terminal/bash window.
if (process.argv[2]==`my-tweets`){
  if (process.argv[3]!=undefined){
    twitterThis(process.argv[3]);
  }
  else {
    twitterThis("testdevacct2000");
  }
}

// This will show the  information about the requested song from spotify in your terminal/bash window
else if (process.argv[2]==`spotify-this-song`) {
  if (process.argv[3]!=undefined) {
    spotifyThis(process.argv[3]);
  }
  else {
    logIt("\n!!!!!!!!!!!!!\nYou didn't enter a song...so we're gonna present the greatest of all time.\n!!!!!!!!!!!!!");
    spotifyThis("The Sign");
  }
}

//  This will output movie information to your terminal/bash window:
else if (process.argv[2]==`movie-this`) {
  if (process.argv[3]!=undefined){
    omdbThis(process.argv[3]);
  }
  else {
    logIt("\n!!!!!!!!!!!!!\nYou didn't enter a movie...so we're gonna present the greatest of all time.\n!!!!!!!!!!!!!");
    omdbThis("Mr. Nobody");
  }
}

//whoops...did for spotify what this was supposed to do.
else if (process.argv[2]==`do-what-it-says`) {
  fs.readFile("random.txt", "utf8", function(error, data){
  // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error);
    }

    var dataArr = data.split(",");
    var thisCommand = dataArr[0];
    var thisValue = dataArr[1];

    if (dataArr[0]=="my-tweets") {
      twitterThis("testdevacct2000");
    }

    if (dataArr[0]=="spotify-this-song") {
      spotifyThis(dataArr[1]);
    }
    if (dataArr[0]=="movie-this") {
      omdbThis(dataArr[1]);
    }    
  })
}

function spotifyThis(thisSong){
  var spotify = new Spotify({
    id: spotifyKeys.spotifyKeys.id,
    secret: spotifyKeys.spotifyKeys.secret
  });

  logIt("\n################\nYou're searching for: "+thisSong);

  spotify.search({ type: 'track', query: thisSong}, function(err, data) {
   if (err) {
     var defaultSong = "The Sign";
     // * If no song is provided then your program will default to "The Sign" by Ace of Base.
     spotify.search({ type: 'track', query: defaultSong}, function(err, data) {
       logIt("\nCouldn't find the song you requested...searching for better song instead."); 
       for (i=0;i<data.tracks.items.length;i++){
         if (data.tracks.items[i].name==defaultSong){
         // console.log(data.tracks.items[7]);           
         logIt("\nHere is the best result!\nArtist name: "+data.tracks.items[i].artists[0].name);
         logIt("Song name: "+data.tracks.items[i].name);
         logIt("Preview link: "+data.tracks.items[i].preview_url);
         logIt("Album name: "+data.tracks.items[i].album.name+"\n################");
         }; 
       }       
    })
   } 
   else {
     logIt("Here is the first (not necessarily the best) result...");
     logIt("Artist name: "+data.tracks.items[0].artists[0].name);
     logIt("Song name: "+data.tracks.items[0].name);
      if (data.tracks.items[0].preview_url!=null){
        logIt("Preview link: "+data.tracks.items[0].preview_url);
      }
      else {
        logIt("Preview link: Not Available");
      }
     logIt("Album name: "+data.tracks.items[0].album.name);
     logIt("\n################\n");
   }
  }) 
}

function twitterThis(params){
  var client = new Twitter({
    consumer_key: twitterKeys.twitterKeys.consumer_key,
    consumer_secret: twitterKeys.twitterKeys.consumer_secret,
    access_token_key: twitterKeys.twitterKeys.access_token_key,
    access_token_secret: twitterKeys.twitterKeys.access_token_secret
  });

  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      logIt("\n----------------------\n");
      logIt("These are the (up to) 20 most recent tweets by: "+params+"\n");
      for (i=0;i<tweets.length;i++){
        logIt(tweets[i].created_at+" "+params+" Tweeted: "+tweets[i].text);
      }
    }
    else {
      logIt("\n----------------------\n");
      logIt("Your request errored out. Sorry.");
    }
    logIt("\n----------------------\n");
  });
  
}

//output sometimes has errors if movie title returns crappy info
function omdbThis(movieTitle){

  var queryUrl = "http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&apikey=trilogy";
  //hits the API and returns info from the JSON
  request(queryUrl, function(error, response, body) {
    logIt("\n/////////////////////////\n");
    logIt("We are checking our sources for information on "+movieTitle+".\n")
    if (!error && response.statusCode === 200) {      
      if (JSON.parse(body).Response!="False"){
        logIt("Movie Title: " + JSON.parse(body).Title);
        logIt("Release Year: " + JSON.parse(body).Year);
        logIt("IMDB Rating: " + JSON.parse(body).imdbRating);
          if (JSON.parse(body).Ratings[2]){
            logIt("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[2].Value);
          }
          else {
            logIt("Rotten Tomatoes Rating: Unavailable");
          }
        logIt("Production Locations: " + JSON.parse(body).Country);
        logIt("Languages: " + JSON.parse(body).Language);
        logIt("Movie Plot: " + JSON.parse(body).Plot);
        logIt("Actors: " + JSON.parse(body).Actors);
      }
      else {
        logIt("You're searching for a movie that never was made. Try again, dummy.");
      }
    }
    // some other cases
    else {
      logIt("Whoops, we had a boo boo. Contact the webmaster.");
    }
  logIt("\n/////////////////////////\n");
  });
}

// ### BONUS
// * In addition to logging the data to your terminal/bash window, output the data to a .txt file called `log.txt`.
// * Make sure you append each command you run to the `log.txt` file. 
// * Do not overwrite your file each time you run a command.

function logIt(info) {

  // We will add the value to the bank file.
  fs.appendFile("log.txt",info+", ", function(err) {
    if (err) {
      return console.log("We made a digital boo boo somewhere...sorry."+err);
    }
    console.log(info);
  });
}