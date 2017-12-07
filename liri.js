// Load the fs package to read and write
var fs = require("fs");

// Include the request/twitter npm package
var request = require("request");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');

// pulls in the twitter keys object from the keys.js file
var twitterKeys = require("./keys.js");
// console.log(twitterKeys);
// console.log(twitterKeys.twitterKeys.consumer_key);
var spotifyKeys = require("./keys.js");


// This will show your last 20 tweets and when they were created at in your terminal/bash window.
if (process.argv[2]==`my-tweets`){

  var client = new Twitter({
    consumer_key: twitterKeys.twitterKeys.consumer_key,
    consumer_secret: twitterKeys.twitterKeys.consumer_secret,
    access_token_key: twitterKeys.twitterKeys.access_token_key,
    access_token_secret: twitterKeys.twitterKeys.access_token_secret
  });

  var params = {screen_name: 'testdevacct2000'};

  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      console.log("\nThese are the last 20 (max) tweets by: "+params.screen_name+"\n");
      for (i=0;i<tweets.length;i++){
        console.log(tweets[i].created_at+" "+params.screen_name+" Tweeted: "+tweets[i].text);
      }
    };
  })
}

// This will show the  information about the requested song from spotify in your terminal/bash window
else if (process.argv[2]==`spotify-this-song`) {
  var spotin =  process.argv[2];
  // console.log(spotin);

  var spotify = new Spotify({
    id: spotifyKeys.spotifyKeys.id,
    secret: spotifyKeys.spotifyKeys.secret
  });

  fs.readFile("random.txt", "utf8", function(error, data){
  // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error);
    }
    var dataArr = data.split(",");
    var thisSong = dataArr[1];

    console.log("\nYou're searching for: "+thisSong);


    spotify.search({ type: 'track', query: thisSong}, function(err, data) {
     if (err) {
       // return console.log('Error occurred: ' + err);
       var defaultSong = "The Sign";
       // * If no song is provided then your program will default to "The Sign" by Ace of Base.
       spotify.search({ type: 'track', query: defaultSong}, function(err, data) {
         console.log("\nCouldn't find the song you requested...searching for better song instead."); 
         for (i=0;i<data.tracks.items.length;i++){
           if (data.tracks.items[i].name==defaultSong){
           // console.log(data.tracks.items[7]);           
           console.log("\nHere are your results!\n----------------------\nArtist name: "+data.tracks.items[i].artists[0].name);
           console.log("Song name: "+data.tracks.items[i].name);
           console.log("Preview link: "+data.tracks.items[i].preview_url);
           console.log("Album name: "+data.tracks.items[i].album.name+"\n----------------------\n");
           }; 
         }       
      })
     }
     else {
     console.log("\nHere are your results!\n----------------------\nArtist name: "+data.tracks.items[0].artists[0].name);
     console.log("Song name: "+data.tracks.items[0].name);
     console.log("Preview link: "+data.tracks.items[0].preview_url);
     console.log("Album name: "+data.tracks.items[0].album.name+"\n----------------------\n");
     }
    }); 
  })
}

//  This will output movie information to your terminal/bash window:
else if (process.argv[2]==`movie-this`) {
  var movin =  process.argv[2];
  //default movie title
  movieName = "Mr. Nobody";  
  
  // if title is input after movie-this...
  if (process.argv[3]!=undefined){
    movieName=process.argv[3];
  }

  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

  //hits the API and returns info from the JSON
  request(queryUrl, function(error, response, body) {
    console.log("\nWe are checking our sources for your information.\n----------------------")
    // If the request is successful
    if (!error && response.statusCode === 200) {
      console.log("Movie Title: " + JSON.parse(body).Title);
      console.log("Release Year: " + JSON.parse(body).Year);
      console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
      console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[2].Value);
      console.log("Production Locations: " + JSON.parse(body).Country);
      console.log("Languages: " + JSON.parse(body).Language);
      console.log("Movie Plot: " + JSON.parse(body).Plot);
      console.log("Actors: " + JSON.parse(body).Actors);
      console.log("----------------------\n");
    }
    // some other cases
    else {
      console.log("Whoops, we had a boo boo. Contact the webmaster.");
    }
  });
}


else if (process.argv[2]==`do-what-it-says`) {
  var doin =  process.argv[2];
  // console.log(doin);

}
 // * Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
 //     * It should run `spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.    
 //     * Feel free to change the text in that document to test out the feature for other commands.



// ### BONUS
// * In addition to logging the data to your terminal/bash window, output the data to a .txt file called `log.txt`.
// * Make sure you append each command you run to the `log.txt` file. 
// * Do not overwrite your file each time you run a command.