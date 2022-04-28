export { ThreadInterface as post } from './reddit-interface'
import { post } from '.'
export interface posts {
	kind: string,
	data: {
		after: string,
		dist: number,
		modhash: string,
		geo_filter: string,
		children: [
			{
				kind: string,
				data: post
			}
		],
		before?: string
	}
}
/*
export interface post {
	author_flair_background_color: string,
	approved_at_utc: number,
	subreddit: string,
	selftext: string,
	author_fullname: string,
	saved: boolean,
	mod_reason_title?: string,
	gilded: number,
	clicked: boolean,
	title: string,
	link_flair_richtext: [
		{
			e: string,
			t: string
		}
	],
	subreddit_name_prefixed: string,
	hidden: boolean,
	pwls?: string,
	link_flair_css_class: string,
	downs: number,
	thumbnail_height: number,
	top_awarded_type?: string,
	hide_score: boolean,
	name: string,
	quarantine: boolean,
	link_flair_text_color: string,
	upvote_ratio: number,
	ignore_reports: boolean,
	ups: number,
	domain: string,
	media_embed: {},
	thumbnail_width: number,
	author_flair_template_id: string,
	is_original_content: boolean,
	user_reports: [],
	secure_media?: string,
	is_reddit_media_domain: boolean,
	is_meta: boolean,
	category?: string,
	secure_media_embed: {},
	link_flair_text: string,
	can_mod_post: boolean,
	score: number,
	approved_by: string,
	is_created_from_ads_ui: boolean,
	author_premium: boolean,
	thumbnail: string,
	edited: boolean,
	author_flair_css_class: string,
	author_flair_richtext: [
		{
			e: string,
			t: string
		},
		{
			a: string,
			e: string,
			u: string
		}
	],
	gildings: {},
	post_hint: string,
	content_categories?: string,
	is_self: boolean,
	subreddit_type: string,
	created: number,
	link_flair_type: string,
	wls?: string,
	removed_by_category?: string,
	banned_by?: string,
	author_flair_type: string,
	total_awards_received: number,
	allow_live_comments: boolean,
	selftext_html?: string,
	likes?: string,
	suggested_sort?: string,
	banned_at_utc?: string,
	url_overridden_by_dest: string,
	view_count?: string,
	archived: boolean,
	no_follow: boolean,
	spam: boolean,
	is_crosspostable: boolean,
	pinned: boolean,
	over_18: boolean,
	preview: {
		images: [
			{
				source: {
					url: string,
					width: number,
					height: number
				},
				resolutions: [
					{
						url: string,
						width: number,
						height: number
					}
				],
				variants: {
					obfuscated: {
						source: {
							url: string,
							width: number,
							height: number
						},
						resolutions: [
							{
								url: string,
								width: number,
								height: number
							}
						]
					},
					nsfw?: {
						source: {
							url: string,
							width: number,
							height: number
						},
						resolutions: [
							{
								url: string,
								width: number,
								height: number
							}
						]
					},
					gif?: {
						source: {
							url: string,
							width: number,
							height: number
						},
						resolutions: [
							{
								url: string,
								width: number,
								height: number
							}
						]
					},
					mp4?: {
						source: {
							url: string,
							width: number,
							height: number
						},
						resolutions: [
							{
								url: string,
								width: number,
								height: number
							}
						]
					}
				},
				id: string
			}
		],
		enabled: boolean
	},
	all_awardings: [],
	awarders: [],
	media_only: boolean,
	link_flair_template_id: string,
	can_gild: boolean,
	removed: boolean,
	spoiler: boolean,
	locked: boolean,
	author_flair_text: string,
	treatment_tags: [],
	visited: boolean,
	removed_by?: string,
	mod_note?: string,
	distinguished?: string,
	subreddit_id: string,
	author_is_blocked: boolean,
	mod_reason_by?: string,
	num_reports: number,
	removal_reason?: string,
	link_flair_background_color: string,
	id: string,
	is_robot_indexable: boolean,
	report_reasons: [],
	author: string,
	discussion_type?: string,
	num_comments: number,
	send_replies: boolean,
	whitelist_status?: string,
	contest_mode: boolean,
	mod_reports: [],
	author_patreon_flair: boolean,
	approved: boolean,
	author_flair_text_color: string,
	permalink: string,
	parent_whitelist_status?: string,
	stickied: boolean,
	url: string,
	subreddit_subscribers: number,
	created_utc: number,
	num_crossposts: number,
	media?: string,
	is_video: boolean,
	is_gallery?: boolean,
	poll_data?: {
		prediction_status?: string,
		total_stake_amount?: string,
		voting_end_timestamp: number,
		options: [
			{
				text: string,
				vote_count: number,
				id: string
			}
		],
		vote_updates_remained?: string,
		is_prediction: boolean,
		resolved_option_id?: string,
		user_won_amount?: string,
		user_selection?: string,
		total_vote_count: number,
		tournament_id?: string
	},
	gallery_data?: {
		items: [
			{
				media_id: string,
				id: number
			}
		]
	},
	media_metadata?: {
		[key:string]: {
			status: string,
			e: string,
			m: string,
			p: [
				{
					y: number,
					x: number,
					u: string
				},
			],
			s: {
				y: number,
				x: number,
				u: string
			},
			id: string
		}
	}
}
*/