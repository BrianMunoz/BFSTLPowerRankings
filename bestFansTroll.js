var Twit = require('twit');

var T = new Twit({
	consumer_key: "dhFqk9Drau74raonudgOLIjfK",
	consumer_secret: "LL8pXdLnEUbkr3ZwDHbuNre4E5MvwVJ1rNgIHQFGJJ0FXYbWjl",
	access_token: "4377853697-DyTtmWqjkHKseXvzWvptH9IYEh9pIHbQS90NeKr",
	access_token_secret: "moEB9jap6HEOq97vmanUEerm9AA37RIHTrsNhOLfYlCLr"
});


var bfstlId = 0;

function GetBfstlId(){
	T.get('users/lookup', {screen_name: 'BestFansStLouis'}, function(err, data, response){
		var ids = data;
		bfstlId = data[0].id;
		GetUsersFollowingBfstl();
	});

}

var followerIds = [];

function GetUsersFollowingBfstl()
{

	T.get('followers/ids', {user_id:bfstlId, stringify_ids:true}, function(err, data, response){
		var ids = data.ids;

		addIds(ids);

		if(data.next_cursor > 0){
			GetNextUserBatch(data.next_cursor);
		}
	});
}

function GetNextUserBatch(nextCursor){
	console.log(nextCursor);
	T.get('followers/ids', {user_id:bfstlId, stringify_ids:true, Cursor:nextCursor}, function(err, data, response){
		var ids = data.ids;
		addIds(ids);
		if (data.next_cursor > 0){
			console.log(data.next_cursor);
			GetNextUserBatch(data.next_cursor);
		}else{
			console.log(followerIds.length);
		}
	});
}

function addIds(ids){
	for (var i = 0; i < ids.length; i++) {
		followerIds.push(ids[i]);
	};
}

function processFollowerIds()
{
	for(var i = 0; i < followerIds.lenght; i++){
		var followerId = followerIds[i];
		//TODO get tweets to BFSTL
		
	}

}

GetBfstlId();
//function(){}
/*
var users = [];

T.get('users/lookup', {q: '#MerryChristmas', count:100}, function(err, data, response){
	var status = data;
	for (var i = 0; i < status.statuses.length; i++) {

		var stat = status.statuses[i];
		var tweet = new Tweet(stat.id_str, stat.user.screen_name);
		//console.log(tweet);
		users.push(tweet);
		//console.log(stat.user);
	};
	for(var i = 0; i < users.length; i++){
		var user = users[i];
		//console.log(user);
		T.post('statuses/update', {in_reply_to_status_id:user.nameId, status:'.@'+ user.name + ' Happy Holidays! '}, function(err, data,response){
			if(err){
				console.log(err);
			} else {
				console.log(response);
			}

		});	
	}
});

function Tweet(nameId, name){
	this.nameId = nameId;
	this.name = name;
}*/