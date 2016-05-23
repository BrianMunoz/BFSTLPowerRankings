var MongoClient = require('MongoDB').MongoClient;
var url = 'mongodb://localhost:27017/BFSTLWeeklyTweets'
var database = {};
var UserTweetCount = {};

MongoClient.connect(url, function(err,db){
  if (err !== null){
    console.log('Error connecting to database');
  }else
  {
    database = db;
    SortTweets();
  }

});

function SortTweets()
{
  var collection  = database.collection('BFSTLWeeklyTweets');

  var tweetCursor = collection.find({});

  tweetCursor.each(function(err,doc){
    if(doc!=null){
      var screenName = doc.user.screen_name;
      if (!(screenName in UserTweetCount))
      {
        UserTweetCount[doc.user.screen_name] = 1;

      }
      else{
        UserTweetCount[doc.user.screen_name]++;
      }
      var
      /*
      console.log('****************** OBJECT ******************');
      console.log(doc.user.screen_name);
      console.log('********************************************');*/
    }
  });
}
