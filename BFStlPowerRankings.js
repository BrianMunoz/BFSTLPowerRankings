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

function getUserName(userId)
{
	T.get('users/lookup', {user_id:userid}, function(err, data, response){
		return data[0].name;
	});

}

var followerIds = {};

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
		var name = getUserName(ids[i]);
		console.log(name);
		followerIds[name] = {id:ids[i]};
	};
}

function processFollowerIds()
{
	for(var name in followerIds) {
		var followerId = followerIds[name];
		T.get('search/tweets', {q:'From:' + name + " To:BestFansStLouis", count:100}, function(err, data, response){
			return data.statuses.length;
		});
	}

}

}

GetBfstlId();
