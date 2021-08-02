require('dotenv').config();

var Snooper = require('reddit-snooper')
    snooper = new Snooper(
        {
            // credential information is not needed for snooper.watcher
            //user_agent: 'Raspberry Pi',

            automatic_retries: true, // automatically handles condition when reddit says 'you are doing this too much'
            api_requests_per_minute: 10 // api requests will be spread out in order to play nicely with Reddit
        });

Discord = require('./discord.js');
discord = new Discord(process.env.WEBHOOK_POST, process.env.WEBHOOK_COMMENT);

/**
 * https://reddit.com/r/<<process.env.SUBREDDIT>>/comments.json
 */
snooper.watcher.getCommentWatcher(process.env.SUBREDDIT)
    .on('comment', function(comment) {
        // comment is a object containing all comment data
        //console.log(comment);
		discord.trigger(discord.COMMENT, comment.data);
    })
    .on('error', console.error);

/**
 * https://reddit.com/r/<<process.env.SUBREDDIT>>/new.json
 */
snooper.watcher.getPostWatcher(process.env.SUBREDDIT)
    .on('post', function(post) {
        // post is a object containing all post data
        //console.log(post)
		discord.trigger(discord.POST, post.data);
    })
    .on('error', console.error);

/*
	{
		"embeds": [{
			"title" : data.link_title,
			"url" : data.link_url,
			"description" : data.body,
			"thumbnail": { 
			"url": "{{ImageURL}}"
			},
			"footer": { 
			"icon_url": "https://www.redditstatic.com/desktop2x/img/favicon/favicon-32x32.png", 
			"text": "/u/"+data.author 
			} 
		}]
	}
*/