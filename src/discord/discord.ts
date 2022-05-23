import { decode as htmlEntities_decode } from 'html-entities';
import axios from 'axios';
import { REDDIT_FLAIRS, DEFAULT_POST_COLOR, DEFAULT_COMMENT_COLOR} from '../flair-colors';
import { comment, post } from '../interfaces';

export default class Discord {
	private postFlairs = REDDIT_FLAIRS;
	private webhook = {
		post : null,
		comment : null
	};
	constructor(WEBHOOK_POST,WEBHOOK_COMMENT) {
		this.webhook.post = WEBHOOK_POST;
		this.webhook.comment = WEBHOOK_COMMENT;
	}
	public POST = 1;
	public COMMENT = 2;
	public trigger(type, data: post|comment) {
		let postData = null;
		switch(type){
			case this.POST:
				postData = this.post.send(data as post);
				break;
			case this.COMMENT:
				postData = this.comment.send(data as comment);
				break;
			default:
				break;
		}
	}
	
	private post = {
		// Method to send new posts from Reddit to Discord
		send : (data: post) => {
			let postData = this.post.prepare(data);
			this.send(postData, this.webhook.post);
		},
		prepare : (data:post) => {
			let postData = null;

			if(data.is_gallery) 	data.post_hint = 'image';
			else if(data.poll_data) data.post_hint = 'poll';

			switch(data.post_hint){
				case 'image':
					postData = this.post.type.image(data);
					break;
				case 'link':
				case 'hosted:video':
					postData = this.post.type.link(data);
					break;
				case 'poll':
					postData = this.post.type.poll(data);
					break;
				default:
					postData = this.post.type.post(data);
			}
			return postData;
		},
		type : {
			/**
			 * https://leovoel.github.io/embed-visualizer/
			 */
			base : (data:post) => {
				return {
					"content": "",
					"embeds": [{
						"title" : htmlEntities_decode((data.link_flair_text ? '['+data.link_flair_text+'] ' : '')+(data.title)),
						"url": htmlEntities_decode('https://www.reddit.com'+data.permalink),// data.url || data.link_url),
						"color": this.postFlairs[data.link_flair_css_class] || DEFAULT_POST_COLOR,
						"author": {
							"name": htmlEntities_decode(data.author_flair_text ? '['+data.author_flair_text+'] ' : '')+"/u/"+data.author,
							//"icon_url": "https://cdn.discordapp.com/embed/avatars/0.png"
						},
						"image":null,
						"description":null
					}]
				};
			},
			post: (data: post) => {
				if (data.url_overridden_by_dest) {
					return this.post.type.link(data);
				}
				let postData = this.post.type.base(data);
				postData.content = "A new Post has been made";
				postData.embeds[0].description = (data.over_18 ? "NSFW\n\n" : '');

				if(!data.spoiler){
					postData.embeds[0].description+= htmlEntities_decode(data.selftext);
				}
				else{
					postData.embeds[0].description+= "SPOILER";
				}
				return postData;
			},
			image: (data: post) => {
				let postData = this.post.type.base(data);

				// Gets and object with the links for every image
				let images = [];
				if(!data.is_gallery){
					postData.content = "A new Image has been posted";
					images = data.preview.images.map((item) => {
						let image_url;
						switch(true){
							case !!item.variants.gif:
								image_url = item.variants.gif.source.url;
								break;
							case !!item.variants.mp4:
								image_url = item.variants.mp4.source.url;
								break;
							default:
								image_url = item.source.url;
						}
						return {
							image: htmlEntities_decode(image_url)
						};
					});
				} else {
					postData.content = "A new Gallery has been posted";
					images = data.gallery_data.items.map((item) => {
						let img = data.media_metadata[item.media_id];
						return {
							image: htmlEntities_decode(img.p[img.p.length-1].u || img.s.u),
							caption: item.caption,
							url: item.outbound_url
						}
					});
				}

				// Selects the front image. Aware of spoiler/NFSW content
				let front = null;
				if(data.spoiler || data.over_18){
					if(data.media_metadata){
						// Appears in Galleries
						front = htmlEntities_decode(data.media_metadata[data.gallery_data.items[0].media_id].p[0].u);
					} else {
						// Apepars in single image uploads
						front = htmlEntities_decode(data.preview.images[0].variants.obfuscated.resolutions[ data.preview.images[0].variants.obfuscated.resolutions.length - 1].url);
					}
				} else {
					front = images[0].image;
				}

				postData.embeds[0].image = { "url" : front }
				postData.embeds[0].description = (data.over_18 ? "NSFW"+(images.length > 1 ? "\n\n" : '') : '');

				if(images.length > 1){
					postData.embeds[0].description+= images.map((item) => {
						let tmp = [];
						if(item.caption)
							tmp.push('['+item.caption+']('+item.image+')');
						else 
							tmp.push(item.image);

						if(item.url) tmp.push(item.url);
						return tmp.join(' - ');
					}).join("\n");
				}
				return postData;
			},
			link : (data:post) => {
				let postData = this.post.type.base(data);
				if(data.is_video){
					postData.content = "A new Video has been posted by **"+htmlEntities_decode((data.author_flair_text ? '['+data.author_flair_text+'] ' : '')+"/u/"+data.author)+"**";
					postData.content+= (data.over_18 ? "\nNSFW" : '');
					postData.content+= "\n\n**"+(data.link_flair_text ? '['+data.link_flair_text+'] ' : '')
									+ htmlEntities_decode(data.title) + "**\n" + htmlEntities_decode(data.url);
					delete postData.embeds;
				}
				else {
					postData.content = "A new Link has been posted";
					postData.embeds[0].description = (data.over_18 ? "\nNSFW" : '');
					postData.embeds[0].description += "\n\n" + htmlEntities_decode(data.url);
					//postData.embeds[0].thumbnail = { 
					//	"url": data.thumbnail
					//};
				}
				return postData;
			},
			poll : (data) => {
				let postData = this.post.type.base(data);
				postData.content = "A new Poll has been posted";
				postData.embeds[0].description = (data.over_18 ? "NSFW\n\n" : '');

				if(!data.spoiler){
					postData.embeds[0].description+= htmlEntities_decode(data.selftext+"\n\n"+
													data.poll_data.options.map((item,idx) => {
														return 'Option '+(idx+1)+': '+item.text;
													}).join('\n'));
				}
				else{
					postData.embeds[0].description+= "SPOILER";
				}
				return postData;
			}

		}
	}
	private comment = {
		// Method to send new comments from Reddit to Discord
		send : (data:comment) => {
			let postData = this.comment.prepare(data);
			this.send(postData, this.webhook.comment);
		},
		prepare : (data:comment) => {
			let base = {
				"content": "A new comment was made.",
				"embeds": [{
					"title" : '- '+( !!data.link_title ? htmlEntities_decode(data.link_title) : ''),
					"url" : htmlEntities_decode(data.link_permalink+data.id),
					"color": this.postFlairs[data.author_flair_css_class] || DEFAULT_COMMENT_COLOR,
					"author": {
						"name": "/u/"+data.author+' '+htmlEntities_decode(!!data.author_flair_text ? '['+data.author_flair_text+'] ' : ''),
						//"icon_url": "https://cdn.discordapp.com/embed/avatars/0.png"
					},
					"description" : null
				}]
			};
			if(base.embeds[0].title.length > 256){
				base.embeds[0].title = base.embeds[0].title.substr(0,253)+'...';
			}
			if(process.env.SHOW_COMMENTS == 'true'){
				base.embeds[0].description = htmlEntities_decode(data.body);
			}
			return base;
		}
	}
	private queue:[{postData:object, url:string}?] = [];
	private running:boolean = false;
	// Methods for posts on Reddit
	private send = async (postData:object, url) => {
		this.queue.push({
			postData, url
		});
		if(!this.running){
			this.postDiscord();
		}
	}
	private errorTimer:number = 0;
	private postDiscord = async () => {
		this.running = true;
		if(this.queue.length > 0){
			let postData = this.queue[0].postData,
				url = this.queue[0].url,
				clientServerOptions = {
					headers: {
						'Content-Type': 'application/json'
					}
				}
			axios.post(url, postData, clientServerOptions)
				.then((goodResponse) => {
					this.queue.shift();
					this.errorTimer = 0;
					console.log('Posted, ',this.queue.length,'remaining');
					setTimeout(() => {
						this.postDiscord();
					}, 3000);
				})
				.catch((badResponse) => {
					if (badResponse.response){
						console.error(badResponse.code, badResponse.response.status, badResponse.response.statusText);
					} else if (badResponse.request) {
						console.log('Error Response', badResponse.request);
					} else {
						console.log('Error Generic', badResponse.message);
					}
					console.log('retrying in ' + (5 + this.errorTimer / 1000) + ' sec on Discord');
					if (this.errorTimer > 3000) {
						this.queue.shift();
						this.errorTimer = 0;
						this.sendDebug('> DISCORD', 'This post could not be sent for some reason:', postData);
					}
					setTimeout(() => {
						this.errorTimer += 1000;
						console.log('retrying');
						this.postDiscord();
					}, 5000 + this.errorTimer);
				});
		} else {
			this.running = false;
			console.log('Queue ended');
		}
	}
	public sendDebug = async (type:string, message:string, json?:object) =>{
		if (process.env.WEBHOOK_DEBUG) {
			this.send({
				"content": type + ' - ' +message+ (json? '\n```js\n'+JSON.stringify(json)+'```' : '')
			}, process.env.WEBHOOK_DEBUG);
		}

	}
}

function postData(postData: any) {
	throw new Error('Function not implemented.');
}
