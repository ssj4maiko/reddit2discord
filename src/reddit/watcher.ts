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
		//console.log('checking again for ' + this.typeName +'S');
		let response = await axios.get(this.URL, {
			headers: this.headers
		}).catch((error) => {
			if (error.response) {
				// The request was made and the server responded with a status code
				// that falls out of the range of 2xx
				return error.response;
			} else if (error.request) {
				this.eventEmitter.emit('> WATCHER ' + this.typeName, 'Error Request', error.request);
				// The request was made but no response was received
				// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
				// http.ClientRequest in node.js
				return error.request;
			} else {
				// Something happened in setting up the request that triggered an Error
				this.eventEmitter.emit('error', 'Response error', response);
				console.log('['+this.typeName+'] Error', error.message);
			}
			//console.log(error.config);
		}),
			lastIndex:number = 9;
		if (response.status < 200 || response.status >= 300) {
			this.eventEmitter.emit('error', `HTTP Error Response: ${response.status} ${response.statusText}`)
		} else {
			if(response.data){
				let json = response.data as posts|comments;
				try {
					if (json.data){
						if (json.data.children) {
							lastIndex = json.data.children.length-1;
							let broken: boolean = false;
							for (let i = 0; i < json.data.children.length; ++i) {
								//console.log(' - Testing comment lastID '+i+': ' + this.lastCreated + ' - ', json.data.children[i].data.created)
								if (this.lastCreated >= json.data.children[i].data.created) {
									lastIndex = i;
									broken = true;
									break;
								}
							}
							if(!broken) {
								console.log(`[`+this.typeName+`] Weird result that could be setting last date as null: `);
								console.log(`[`+this.typeName+`] Last Created Date`, this.lastCreated);
								console.log(`[`+this.typeName+`] Children:`, json.data.children);
							}
							if(json.data.children[0] && json.data.children[0].data && json.data.children[0].data.created){
								this.lastCreated = json.data.children[0].data.created;
							}
							if ( lastIndex == json.data.children.length-1) {
								console.log(`[`+this.typeName+`] Last Created Updated`);
							} else {
								for (let i = (lastIndex - 1); i >= 0; --i) {
									this.eventEmitter.emit(this.typeName.toLocaleLowerCase(), json.data.children[i].data);
								}
							}
						}
					}
				} catch (er) {
					this.eventEmitter.emit('error', 'Watcher check: '+er.message);
					console.error('['+this.typeName+'] RESPONSE JSON.DATA', response);
				}
			} else {
				// Acutally Request
				//console.log(response.error);
				this.eventEmitter.emit('error', 'Strange no response error: ' + response.errno + ' - ' + response.code);
			}
		}
		setTimeout(() => {
			this.check();
		}, this.time);
	};
	private started: boolean = false;
	private async start() {
		console.log('['+this.typeName+'] STARTING WATCHER');
		if (!this.started){
			let response = await axios.get(this.URL, {
				headers: this.headers
			});
			let data = response.data as posts|comments;
			this.lastCreated = data.data.children[0].data.created;
			
			//console.log('LAST CREATED', (this.type === 1 ? 'POST' : 'COMMENT'), ' = ' + this.lastCreated)
			this.started = true;

			setTimeout(() => {
				//console.log('TIMEOUT CHECK AGAIN ' + (this.type));
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
		this.time = Math.ceil(seg*1000);
	}
}