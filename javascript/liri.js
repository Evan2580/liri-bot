  require("dotenv").config();
  let keys = require("./keys.js");
  let inquirer = require("inquirer");
  let Spotify = require('node-spotify-api');
  let spotify = new Spotify(keys.spotify);
  let axios = require("axios");
  let moment = require('moment');

  inquirer
    .prompt ([
      {
        type: 'list',
        name: 'choicelist',
        message: 'What do you want to do?',
        choices: ['Would you like to see a Concert?', 'Would you like to search for a song?', 'How about find out some info about a movie?']
      }

      // {
      //   type: 'editor',
      //   name:
      // }
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
      }

    });

function concertApi () {
  inquirer
  .prompt ([
    {
      type: 'input',
      name: 'userInput',
      message: 'What band do you want to search?'
    }
  ]).then(function(response){
    var searchTerm = response.userInput;
   // if (searchTerm === null)

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

  });


  }
function spotifyApi () {
  inquirer
  .prompt ([ //  Uses inquirer in NPM to prompt user of 2nd question
    {
      type: 'input',
      name: 'userInput',
      message: 'What song do you want to search?'
    }
  ]).then(function(response){
    let searchTerm = '';
    if (response.userInput !== null){
       searchTerm = response.userInput;
    } else {
      searchTerm = 'The Sign';
    }

    spotify
    .search({ type: 'track', query: searchTerm, limit: 1 }) //calls spotify for search of 'track'
    .then(function(response) {

      for (let i = 0; i < response.tracks.items.length; i++) {


      console.log("The artists name: " + response.tracks.items[i].artists[i].name);

      console.log("The URL of the song is: " + response.tracks.items[i].href);

      console.log("The name of the album is: " + response.tracks.items[i].album.name);
      }
  })
    .catch(function(err) {
      console.log(err);
    });


  });


}
function omdbApi () {
  inquirer
  .prompt ([
    {
      type: 'input',
      name: 'userInput',
      message: 'What movie do you want to search?'
    }
  ]).then(function(response){
    var searchTerm = response.userInput;
    debugger;
  axios.get("http://www.omdbapi.com/?t=" + searchTerm + "&y=&plot=short&apikey=trilogy").then(
  function(response) {
    //for(let i = 0; i < response.data.length; i++){
    console.log("The Title of the movie is: " + response.data.Title);
    console.log("Year the movie came out: " + response.data.Year);
    console.log("The movie's rating is: " + response.data.imdbRating);
    console.log("Rotten Tomatoes Rating of the movie: " + JSON.stringify(response.data.Ratings[1].Value));
    console.log("Country were movie was produced: " + response.data.Country);
    console.log("Language of the movie: " + response.data.Language);
    console.log("Plot of the movie: " + response.data.Plot);
    console.log("Actors of the movie: " + response.data.Actors);
    //}
  })

  });

}
