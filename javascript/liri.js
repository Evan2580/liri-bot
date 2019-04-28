  require("dotenv").config();
  let keys = require("./keys.js");
  let inquirer = require("inquirer");
  let Spotify = require('node-spotify-api');
  let spotify = new Spotify(keys.spotify);
  let axios = require("axios");
  let moment = require('moment');
  let fs = require('fs');

  inquirer
    .prompt ([
      {
        type: 'list',
        name: 'choicelist',
        message: 'What do you want to do?',
        choices: ['Would you like to see a Concert?', 'Would you like to search for a song?', 'How about find out some info about a movie?', 'Would you like to load something from a file?']
      }

    ]).then(function(response){

      debugger;
      switch (response.choicelist) {
        case 'Would you like to see a Concert?':
         concertApi();
         break;
        case 'Would you like to search for a song?':
         spotifyApi();
         break;
        case 'How about find out some info about a movie?':
         omdbApi();
         break;
         case 'Would you like to load something from a file?':
         liriFile();
         break;
      }

    });
function  handleConcertPrompt(response){
  var searchTerm = response.userInput;

  axios.get("https://rest.bandsintown.com/artists/" + searchTerm + "/events?app_id=codingbootcamp").then(
  function(response) {

    for(let i = 0; i < response.data.length; i++){


    var time = response.data[i].datetime;
    console.log(moment(time).format("MM/DD/YYYY"));
    console.log(response.data[i].url);
    console.log(response.data[i].venue.name);
    console.log(response.data[i].venue.city);
  }

})
}
function concertApi () {
  inquirer
  .prompt ([
    {
      type: 'input',
      name: 'userInput',
      message: 'What band do you want to search?',
      default: 'Ariana Grande'
    }
  ]).then(handleConcertPrompt)
    .catch(function(err) {
      console.log(err);
    });


  }

  function handleSpotifyPrompt(response){
    let searchTerm = response.userInput;
    spotify
    .search({ type: 'track', query: searchTerm,  limit: 1 }) //calls spotify for search of 'track'
    .then(function(response) {

      for (let i = 0; i < response.tracks.items.length; i++) {
      console.log("The artists name: " + response.tracks.items[i].artists[i].name);

      console.log("The URL of the song is: " + response.tracks.items[i].href);

      console.log("The name of the album is: " + response.tracks.items[i].album.name);
      }
  })
  }
function spotifyApi (dataArray) {
  inquirer
  .prompt ([ //  Uses inquirer in NPM to prompt user of 2nd question
    {
      type: 'input',
      name: 'userInput',
      message: 'What song do you want to search?',
      default: 'The Sign ace of base'
    }
  ]).then(handleSpotifyPrompt)
    .catch(function(err) {
      console.log(err);
    });


  };
  function handleOmdbPrompt(response){
    var searchTerm = response.userInput;

    axios.get("http://www.omdbapi.com/?t=" + searchTerm + "&y=&plot=short&apikey=trilogy").then(
    function(response) {
     var data = [`The Title of the movie is: ${response.data.Title}`,`Year the movie came out: ${response.data.Year}`, `The movie's rating is:${response.data.imdbRating}`, `Rotten Tomatoes Rating of the movie: ${JSON.stringify(response.data.Ratings[1].Value)}`, `Country were movie was produced: ${response.data.Country}`, `Language of the movie:${response.data.Language}` , `Plot of the movie:${response.data.Plot}` , `Actors of the movie: ${response.data.Actors}`]
      for (let i = 0; i < data.length; i++){
        fs.appendFile("log.txt", data[i] , function(err){
          if(err) console.log(err)
        })
        }
        console.log("The Title of the movie is: " + response.data.Title);
        console.log("Year the movie came out: " + response.data.Year);
        console.log("The movie's rating is: " + response.data.imdbRating);
        console.log("Rotten Tomatoes Rating of the movie: " + JSON.stringify(response.data.Ratings[1].Value));
        console.log("Country were movie was produced: " + response.data.Country);
        console.log("Language of the movie: " + response.data.Language);
        console.log("Plot of the movie: " + response.data.Plot);
        console.log("Actors of the movie: " + response.data.Actors);


      })
  }
function omdbApi () {
  inquirer
  .prompt ([
    {
      type: 'input',
      name: 'userInput',
      message: 'What movie do you want to search?',
      default: "Mr Nobody"
    }
  ]).then(handleOmdbPrompt)
    .catch(function(err) {
      console.log(err);
    });
    }

function liriFile() { // read from a random file function
  fs.readFile('random.txt', 'utf8', function(error,data){
    if(error) {  //console logs an error / catch statement
      return console.log(error);
    }
    console.log(data);

    var dataArray = data.split(',');  //delimits the array if there is a , and splits it in separate arrays

    console.log(dataArray)
    var action = dataArray[0];
    switch (action) {  //switch statement to choose which function to call when file is read
      case 'concert-this':
      handleConcertPrompt({
        userInput: dataArray[1]
      })
       break;
      case 'spotify-this-song':
        handleSpotifyPrompt({
          userInput: dataArray[1]
        })
       break;
      case 'movie-this':
      handleOmdbPrompt({
        userInput: dataArray[1]
      })

       break;
       case 'do-what-it-says':
       handleDoWhatItSays({
         userInput: dataArray[1]
      })

       break;
    }  //end of switch
  } ); //end of anon function
}  // end of liri function
