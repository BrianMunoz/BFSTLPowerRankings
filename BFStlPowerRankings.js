var Twitter = require('twitter');
var Promise  = require('bluebird').Promise;

var T = new Twitter();




function getUserName(userId)
{
	T.get('users/lookup', {user_id:userid}, function(err, data, response){
		return data[0].name;
	});

}

var followerIds = {};

function GetUsersFollowingBfstl()
{

	T.get('followers/ids', {user_id:bfstlId, stringify_ids:false}, function(err, data, response){
		var ids = data.ids
		console.log('DATA: ' + ids);
		console.log();
		console.log('ERROR: ' + err);
		console.log();
		console.log('RESPONSE: ' + response);
		//if(ids !== undefined)	addIds(ids);
		console.log(data.next_cursor);
		if(data.next_cursor > 0){
			console.log(data.next_cursor);
			GetNextUserBatch(data.next_cursor);
		}
	});
}

function GetNextUserBatch(nextCursor){
	T.get('followers/ids', {user_id:bfstlId, stringify_ids:true, cursor:nextCursor}, function(err, data, response){
		var ids = data.ids;
		if (nextCursor == data.next_cursor){
			console.log('Cursor is not moving');
			return;
		}
		if (ids.length > 0){
		//	addIds(ids);
		}
		console.log(data.next_cursor);
		if (data.next_cursor > 0 && data.next_cursor !== nextCursor){
			GetNextUserBatch(data.next_cursor);
		}else{
			console.log(followerIds.length);
		}
	});
}

function addIds(ids){

	for (var i = 0; i < ids.length; i++) {

		//console.log(ids[i]);
		var namePromise = new Promise( function(resolve, reject){var name = getUserName(ids[i])});

		namePromise.then(function(name){
			console.log(name);
			followerIds[name] = {id:ids[i]};
	});

	}
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


GetBfstlId();
