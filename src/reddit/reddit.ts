import EventEmitter from 'events';
import Watcher from './watcher';

export default class Reddit {
	private automatic_retries:boolean;
	private api_requests_per_minute:number;
	private user_agent:string;

	constructor(params:{
		automatic_retries?:boolean,
		api_requests_per_minute?:number,
		user_agent?: string
	} = {}) {
		this.automatic_retries = params.automatic_retries || true;
		this.api_requests_per_minute = params.api_requests_per_minute || 1;
		this.user_agent = params.user_agent || 'NodeJS';
	}
	private getHeaders = () => {
		return {
			"User-Agent": this.user_agent,
			"Content-Type": "application/json",
			'Cache-Control': 'no-cache',
			'Pragma': 'no-cache',
			'Expires': '0',
		}
	}

	private comments: { [key: string]: Watcher | null } = {};
	public getCommentWatcher = (subreddit:string):EventEmitter => {
		if(!this.comments[subreddit]){
			this.comments[subreddit] = new Watcher(2,subreddit);
			this.comments[subreddit].setHeaders(this.getHeaders());
			this.comments[subreddit].setTime(60 / this.api_requests_per_minute);
		}
		return this.comments[subreddit].getEmitter();
	};
	private posts: { [key: string]: Watcher | null } = {};
	public getPostWatcher = (subreddit: string):EventEmitter => {
		if (!this.posts[subreddit]) {
			this.posts[subreddit] = new Watcher(1, subreddit);
			this.posts[subreddit].setHeaders(this.getHeaders());
			this.posts[subreddit].setTime(60 / this.api_requests_per_minute);
		}
		return this.posts[subreddit].getEmitter();

	}
}