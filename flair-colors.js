// https://gist.github.com/thomasbnt/b6f455e2c7d743b796917fa3c205f812#gistcomment-3656937 for colors

exports.COLORS = {
  DEFAULT: 0, // 	#000000
  AQUA: 1752220, // 	#1ABC9C
  DARK_AQUA: 1146986, // 	#11806A
  GREEN: 3066993, // 	#2ECC71
  DARK_GREEN: 2067276, // 	#1F8B4C
  BLUE: 3447003, // 	#3498DB
  DARK_BLUE: 2123412, // 	#206694
  PURPLE: 10181046, // 	#9B59B6
  DARK_PURPLE: 7419530, // 	#71368A
  LUMINOUS_VIVID_PINK: 15277667, // 	#E91E63
  DARK_VIVID_PINK: 11342935, // 	#AD1457
  GOLD: 15844367, // 	#F1C40F
  DARK_GOLD: 12745742, // 	#C27C0E
  ORANGE: 15105570, // 	#E67E22
  DARK_ORANGE: 11027200, // 	#A84300
  RED: 15158332, // 	#E74C3C
  DARK_RED: 10038562, // 	#992D22
  GREY: 9807270, // 	#95A5A6
  DARK_GREY: 9936031, // 	#979C9F
  DARKER_GREY: 8359053, // 	#7F8C8D
  LIGHT_GREY: 12370112, // 	#BCC0C0
  NAVY: 3426654, // 	#34495E
  DARK_NAVY: 2899536, // 	#2C3E50
  YELLOW: 16776960, // 	#FFFF00
  WHITE: 16777215, // 	#FFFFFF
  BLURPLE: 7506394, // 	#7289DA
  GREYPLE: 10070709, //	#99AAB5
  DARK_BUT_NOT_BLACK: 2895667, // 	#2C2F33
  NOT_QUITE_BLACK: 2303786, //	#23272A
};

// Set CSS rules for the flairs

exports.FLAIRS = {
  "post-flair-translated": exports.COLORS.BLUE,
  "post-flair-untranslated": exports.COLORS.RED,
  "post-flair-manga": exports.COLORS.WHITE,
  "post-flair-fanart": exports.COLORS.AQUA,
  "post-flair-illustration": exports.COLORS.GREEN,
  "post-flair-meme": exports.COLORS.GREY,
  "post-flair-meta": exports.COLORS.GOLD,
  "post-flair-announcement": exports.COLORS.PURPLE,
  "user-flair-raw": exports.COLORS.RED,
  "user-flair-wn": exports.COLORS.BLUE,
  "user-flair-manga": exports.COLORS.LIGHT_GREY,
  "user-flair-ln": exports.COLORS.DARK_PURPLE,
};