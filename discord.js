var htmlEntities = require('html-entities');
var request = require('request');
var FlairColors = require('./flair-colors.js');

module.exports = class Discord {
	postFlairs = FlairColors.FLAIRS;
	webhook = {
		post : null,
		comment : null
	};
	constructor(WEBHOOK_POST,WEBHOOK_COMMENT) {
		this.webhook.post = WEBHOOK_POST;
		this.webhook.comment = WEBHOOK_COMMENT;
	}
	POST = 1;
	COMMENT = 2;
	trigger (type, data) {
		let postData = null;
		switch(type){
			case this.POST:
				postData = this.post.send(data);
				break;
			case this.COMMENT:
				postData = this.comment.send(data);
				break;
			default:
				break;
		}
	}
	post = {
		// Method to send new posts from Reddit to Discord
		send : (data) => {
			let postData = this.post.prepare(data);
			this.send(postData, this.webhook.post);
		},
		prepare : (data) => {
			let postData = null;

			if(data.is_gallery) 	data.post_hint = 'image';
			else if(data.poll_data) data.post_hint = 'poll';

			switch(data.post_hint){
				case 'image':
					postData = this.post.type.image(data);
					break;
				case 'link':
				case 'rich:video':
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
			base : (data) => {
				return {
					"embeds": [{
						"title" : htmlEntities.decode((data.link_flair_text ? '['+data.link_flair_text+'] ' : '')+(data.title || data.link_title)),
						"url" : htmlEntities.decode(data.url || data.link_url),
						"color"	: this.postFlairs[data.link_flair_css_class] || FlairColors.COLORS.WHITE,
						"author": {
							"name": htmlEntities.decode(data.author_flair_text ? '['+data.author_flair_text+'] ' : '')+"/u/"+data.author,
							//"icon_url": "https://cdn.discordapp.com/embed/avatars/0.png"
						},
					}]
				};
			},
			post : (data) => {
				let postData = this.post.type.base(data);
				postData.content = "A new Post has been made";
				postData.embeds[0].description = (data.over_18 ? "NSFW\n\n" : '');

				if(!data.spoiler){
					postData.embeds[0].description+= htmlEntities.decode(data.selftext);
				}
				else{
					postData.embeds[0].description+= "SPOILER";
				}
				return postData;
			},
			image : (data) => {
				let postData = this.post.type.base(data);

				// Gets and object with the links for every image
				let images = [];
				if(!data.is_gallery){
					postData.content = "A new Image has been posted";
					images = data.preview.images.map((item) => {
						return {
							image: htmlEntities.decode(item.source.url)
						};
					});
				} else {
					postData.content = "A new Gallery has been posted";
					images = data.gallery_data.items.map((item) => {
						let img = data.media_metadata[item.media_id];
						return {
							image: htmlEntities.decode(img.p[img.p.length-1].u || img.s.u),
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
						front = htmlEntities.decode(data.media_metadata[data.gallery_data.items[0].media_id].o[0].u);
					} else {
						// Apepars in single image uploads
						front = htmlEntities.decode(data.preview.images[0].variants.obfuscated.resolutions[ data.preview.images[0].variants.obfuscated.resolutions.length - 1].url);
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
			link : (data) => {
				let postData = this.post.type.base(data);
				if(data.post_hint == 'rich:video'){
					postData.content = "A new Video has been posted by **"+htmlEntities.decode((data.author_flair_text ? '['+data.author_flair_text+'] ' : '')+"/u/"+data.author)+"**";
					postData.content+= (data.over_18 ? "\nNSFW" : '');
					postData.content+= "\n**"+(data.link_flair_text ? '['+data.link_flair_text+'] ' : '')
											 +htmlEntities.decode(data.title || data.link_title)+"** - "+htmlEntities.decode(data.url || data.link_url),
					postData.content+= "\n"+htmlEntities.decode(data.url);
					delete postData.embeds;
				} else {
					postData.content = "A new Link has been posted";
					postData.embeds[0].description = (data.over_18 ? "\nNSFW" : '');
					postData.embeds[0].description+= "\n\n"+htmlEntities.decode(data.url);
					postData.embeds[0].thumbnail = { 
						"url": data.thumbnail
					};
				}
				return postData;
			},
			poll : (data) => {
				let postData = this.post.type.base(data);
				postData.content = "A new Poll has been posted";
				postData.embeds[0].description = (data.over_18 ? "NSFW\n\n" : '');

				if(!data.spoiler){
					postData.embeds[0].description+= htmlEntities.decode(data.selftext+"\n\n"+
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
	comment = {
		// Method to send new comments from Reddit to Discord
		send : (data) => {
			let postData = this.comment.prepare(data);
			this.send(postData, this.webhook.comment);
		},
		prepare : (data) => {
			let base = {
				"content": "A new comment was made.",
				"embeds": [{
					"title" : '- '+(data.link_flair_text ? '['+htmlEntities.decode(data.link_flair_text)+'] ' : '')
								+htmlEntities.decode(data.link_title),
					"url" : htmlEntities.decode(data.link_permalink+data.id),
					"color"	: this.postFlairs[data.author_flair_css_class] || FlairColors.COLORS.ORANGE,
					"author": {
						"name": "/u/"+data.author+' '+htmlEntities.decode(data.author_flair_text ? '['+data.author_flair_text+'] ' : ''),
						//"icon_url": "https://cdn.discordapp.com/embed/avatars/0.png"
					},
				}]
			};
			if(process.env.SHOW_COMMENTS == 'true'){
				base.embeds[0].description = htmlEntities.decode(data.body);
			}
			return base;
		}
	}
	// Methods for posts on Reddit
	send (postData, url) {
		let clientServerOptions = {
			uri: url,
			body: JSON.stringify(postData),
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		}
		let self = this;
		request(clientServerOptions, function (error, response) {
			console.log('Webhook response: statusCode', response.statusCode, 'body', response.body);
			if(response.statusCode == 400){
				console.log('retrying in 60 sec');
				setTimeout(() => {
					console.log('retrying');
					self.send(postData, url);
				}, 60000);
			}
		});
	}
}