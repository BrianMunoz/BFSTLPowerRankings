var Twitter = require('Twit');
var MongoClient = require('MongoDB').MongoClient;
var fs = require('fs');

var tokens = fs.parseJson('TwitTokens.json')

var url = 'mongodb://localhost:27017/BFSTLWeeklyTweets'

var T = new Twitter();

var bfstlId = 0;
var database = {};

MongoClient.connect(url, function(err,db){
  if (err !== null){
    console.log('Error connecting to database');
  }else
  {
    database = db;
    GetLastWeekTweets();
  }

})

function GetLastWeekTweets(){
  T.get('search/tweets', {q:'@BestFansStLouis OR to:BestFansStLouis', count:100}, function(err, data, response){
    if (err === null || err === undefined)
    {
      SaveData(data);
    }else{
      console.log('Error getting Tweets: ' + err);
      //save since id
      database.close();
    }

  } );
}

function GetLastWeekTweetsAgain(id)
{
  T.get('search/tweets', {q:'@BestFansStLouis OR to:BestFansStLouis', count:100, max_id:id}, function(err, data, response){
    if (err === null || err === undefined)
    {
      SaveData(data);
    }
    else
    {
      console.log('Error getting Tweets: ' + err);
      database.close()
    }

  });
}

function SaveData(data)
{
  InsertData(data);
  if(data.search_metadata.max_id > 0)
  {
    GetLastWeekTweetsAgain(data.search_metadata.max_id)
  }
  else
  {
    database.close();
    console.log('closed db');
  }

}

function InsertData(data){
  var collection = database.collection('BFSTLWeeklyTweets');
  collection.insertMany(data.statuses);
  console.log(collection.find({}));
  console.log('Batch Inserted');
}
