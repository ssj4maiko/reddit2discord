#!/usr/bin/env node
require('dotenv').config();

console.log('Subreddit', process.env.SUBREDDIT);
if(!process.env.SUBREDDIT){
	throw new Error('You must fill in the SUBREDDIT .env file');
}
if(!process.env.WEBHOOK_POST && !process.env.WEBHOOK_COMMENT){
	throw new Error('You must fill in at least one Webhook in the .env file');
}
process.env.WATCH_POST = process.env.WATCH_POST == 'true' || process.env.WATCH_POST == '1';
process.env.WATCH_COMMENT = process.env.WATCH_COMMENT == 'true' || process.env.WATCH_COMMENT == '1';
process.env.SHOW_COMMENTS = process.env.SHOW_COMMENTS == 'true' || process.env.SHOW_COMMENTS == '1';

var Snooper = require('reddit-snooper')
	snooper = new Snooper(
		{
			// credential information is not needed for snooper.watcher
			//user_agent: 'Raspberry Pi',

			automatic_retries: true, // automatically handles condition when reddit says 'you are doing this too much'
			api_requests_per_minute: 1 // api requests will be spread out in order to play nicely with Reddit
		});

Discord = require('./discord.js');
discord = new Discord(process.env.WEBHOOK_POST, process.env.WEBHOOK_COMMENT);

/**
 * https://reddit.com/r/<<process.env.SUBREDDIT>>/comments.json
 */
if(process.env.WATCH_COMMENT == 'true'){
	snooper.watcher.getCommentWatcher(process.env.SUBREDDIT)
		.on('comment', function(comment) {
			// comment is a object containing all comment data
			//console.log(comment);
			console.log("new comment");
			discord.trigger(discord.COMMENT, comment.data);
		})
		.on('error', console.error);
}

/**
 * https://reddit.com/r/<<process.env.SUBREDDIT>>/new.json
 */
if (process.env.WATCH_POST == "true") {
	snooper.watcher.getPostWatcher(process.env.SUBREDDIT)
		.on("post", function (post) {
			// post is a object containing all post data
			//console.log(post)
			console.log("new post");
			discord.trigger(discord.POST, post.data);
		})
		.on("error", console.error);
}