import EventEmitter from 'events';
import axios from 'axios';
import { comments } from '../interfaces/comments';
import { posts } from '../interfaces/posts';

/**
 * Watcher used by the REDDIT object below
 * 
 * @param type : 1=POST, 2=COMMENT
 * @param subreddit : /r/SUBREDDIT_NAME
 */
export default class Watcher {
	constructor(
		private type:number,
		private subreddit:string
	) {
		switch(type){
			case 1:
				this.typeName = 'POST';
				this.URL = 'https://www.reddit.com/r/'+subreddit+'/new.json';
				break;
			case 2:
				this.typeName = 'COMMENT';
				this.URL = 'https://www.reddit.com/r/' + subreddit +'/comments.json';
				break;
			default:
				throw new Error('TYPE does not exist');
		}
		this.eventEmitter = new EventEmitter();
		this.lastCreated = 0;
	}
	private typeName: string;
	private URL: string;
	
	private lastCreated: number;
	private async check() {
		console.log('checking again for ' + this.typeName +'s');
		let response = await axios.get(this.URL, {
			headers: this.headers
		}),
			lastIndex:number = 9;
		if (response.status < 200 || response.status >= 300) {
			this.eventEmitter.emit('error', `HTTP Error Response: ${response.status} ${response.statusText}`)
		} else {
			let json = response.data as posts|comments;
			//console.log('CHECKING for new stuff',this.type);

			let data = json as posts
			if (data.data.children) {
				lastIndex = data.data.children.length-1;
				for (let i = 0; i < data.data.children.length; ++i) {
					//console.log(' - Testing comment lastID '+i+': ' + this.lastCreated + ' - ', data.data.children[i].data.created)
					if (this.lastCreated >= data.data.children[i].data.created) {
						lastIndex = i;
						break;
					}
				}
				this.lastCreated = data.data.children[0].data.created;
				if (this.type === 1) {
					for (let i = (lastIndex - 1); i >= 0; --i) {
						this.eventEmitter.emit('post', data.data.children[i].data);
					}
				} else {
					for (let i = (lastIndex - 1); i >= 0; --i) {
						this.eventEmitter.emit('comment', data.data.children[i].data);
					}
				}
			}
		}
		setTimeout(() => {
			console.log('Timeout, check reddit again for '+(this.type));
			this.check();
		}, this.time);
	};
	private started: boolean = false;
	private async start() {
		console.log('STARTING WATCHER '+ this.typeName);
		if (!this.started){
			let response = await axios.get(this.URL, {
				headers: this.headers
			});
			let data = response.data as posts|comments;
			this.lastCreated = data.data.children[0].data.created;
			
			//console.log('LAST CREATED', (this.type === 1 ? 'POST' : 'COMMENT'), ' = ' + this.lastCreated)
			this.started = true;

			setTimeout(() => {
				console.log('TIMEOUT CHECK AGAIN ' + (this.type));
				this.check();
			}, this.time);
		}
	}
	// 
	private eventEmitter: EventEmitter;
	public getEmitter(): EventEmitter {
		this.start();
		return this.eventEmitter;
	}
	private headers: Record<string, string> | undefined;
	public setHeaders(headers:object) {
		this.headers = headers as Record<string, string>;
	}
	private time: number = 60;
	public setTime(seg:number){
		this.time = seg*1000;
	}
}