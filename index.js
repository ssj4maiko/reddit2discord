let SUBREDDIT = 'DeathMage'; //'DeathMage';
let DISCORD_WEBHOOK_POST = 'https://discord.com/api/webhooks/871543530449944636/ASN9TQw44-hAKTcCwn2Cxnp12s3mYZWHi6AB_MPJcErV-TBYz2Vf6m9N4aiwSVugJSaX';
							// 'https://discord.com/api/webhooks/869384089516539954/ccIrGCVXfnk8SIq2uATrYOvTGQhV-zKtBrrf7AKjOF8boFp8fkuJAYne9BMcLe5E-SNK';
let DISCORD_WEBHOOK_COMMENT = 'https://discord.com/api/webhooks/871543530449944636/ASN9TQw44-hAKTcCwn2Cxnp12s3mYZWHi6AB_MPJcErV-TBYz2Vf6m9N4aiwSVugJSaX';
							// 'https://discord.com/api/webhooks/869384089516539954/ccIrGCVXfnk8SIq2uATrYOvTGQhV-zKtBrrf7AKjOF8boFp8fkuJAYne9BMcLe5E-SNK';

var Snooper = require('reddit-snooper')
    snooper = new Snooper(
        {
            // credential information is not needed for snooper.watcher
            /*
			username: 'mba199',
            password: 'SSJ4gogeta',
            app_id: 'o1TCfaCEZlbz45TcMXREOw',
            api_secret: 'AF8vfqt6wXB2CZexOkYGtth1z4QuQg',
			*/
            //user_agent: 'Raspberry Pi',

            automatic_retries: true, // automatically handles condition when reddit says 'you are doing this too much'
            api_requests_per_minute: 10 // api requests will be spread out in order to play nicely with Reddit
        });

Discord = require('./discord.js');
discord = new Discord(DISCORD_WEBHOOK_POST, DISCORD_WEBHOOK_COMMENT);

/**
 * https://reddit.com/r/DeathMage/comments.json
 */
snooper.watcher.getCommentWatcher(SUBREDDIT) // blank argument or 'all' looks at the entire website
    .on('comment', function(comment) {
        // comment is a object containing all comment data
		discord.trigger(discord.COMMENT, comment.data);
        // or
        console.log(comment);
    })
    .on('error', console.error);

/**
 * https://reddit.com/r/DeathMage/new.json
 */
snooper.watcher.getPostWatcher(SUBREDDIT) // blank argument or 'all' looks at the entire website
    .on('post', function(post) {
        // comment is a object containing all comment data
		discord.trigger(discord.POST, post.data);
        //console.log(post)
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