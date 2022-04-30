import { config } from 'dotenv';
config();
import Reddit from './reddit/reddit';
import Discord from './discord/discord';
import { comment, post } from './interfaces';

console.log('Subreddit', process.env.SUBREDDIT);

if(!process.env.SUBREDDIT){
	throw new Error('You must fill in the SUBREDDIT .env file');
}
if(!process.env.WEBHOOK_POST && !process.env.WEBHOOK_COMMENT){
	throw new Error('You must fill in at least one Webhook in the .env file');
}
let start = async () => {
	
	const reddit = new Reddit({
		// credential information is not needed for snooper.watcher
		//user_agent: 'Raspberry Pi',

		//automatic_retries: true
		api_requests_per_minute: process.env.REQUESTS_PER_MINUTE ? parseInt(process.env.REQUESTS_PER_MINUTE) : 1
	});

	let discord = new Discord(process.env.WEBHOOK_POST, process.env.WEBHOOK_COMMENT);

	/**
	 * https://reddit.com/r/<<process.env.SUBREDDIT>>/comments.json
	 */
	if(process.env.WATCH_COMMENT == 'true'){
		reddit.getCommentWatcher(process.env.SUBREDDIT)
				.on('comment', function(comment:comment) {
					// comment is a object containing all comment data
					console.log("new comment");
					discord.trigger(discord.COMMENT, comment);
				})
				.on('error', function(er:string, error?:object) {
					discord.sendDebug("COMMENT",er,error);
					//process.exit()
				});
	}

	/**
	 * https://reddit.com/r/<<process.env.SUBREDDIT>>/new.json
	 */
	if (process.env.WATCH_POST == "true") {
		reddit.getPostWatcher(process.env.SUBREDDIT)
				.on("post", function (post:post) {
					// post is a object containing all post data
					console.log("new post");
					discord.trigger(discord.POST, post);
				})
				.on('error', function (er: string, error?: object) {
					discord.sendDebug("POST", er, error);
					//process.exit()
				});
	}
	discord.sendDebug("> BOOT", "Reddit2Discord BOT is starting");
	while(true){
		await sleep(10000000);
	}
};
start();
function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}