# Reddit2Discord

A simple NodeJS watcher to check on an specific subreddit, and notify a discord Webhook through a post. Since it needs to constantly be running, it was made with the intent of running it on a Raspberry Pi 3 I have always on.

Possibly because of *Reddit-Snooper* ( https://github.com/JuicyPasta/reddit-snooper ), it seems that Reddit still counts each access as a unique visitant to a subreddit (Even if same IP), so the subreddit that one I made all this for went from less than 100 visitants to ~2K, ironically, more than the number of subscribers. ¯\\\_(ツ)\_/¯

## Install

Ensure you have NodeJS installed, if not, refer to your distro, or install nvm: https://github.com/nvm-sh/nvm#install--update-script

With nvm:
```
nvm install node
```

Then

```
git clone https://github.com/ssj4maiko/reddit2discord
cd reddit2discord
npm install
cp .env.example .env
cp src/flair-colors.ts.example src/flair-colors.ts
```

Fill in the `.env` file with the required configurations.

```
SUBREDDIT=<subreddit's name, for example, "test" for /r/test>
WEBHOOK_POST=<The Webhook URL you made on the channel aimed to receive the new posts>
WEBHOOK_COMMENT=<The Webhook URL you made on the channel aimed to receive the new comments>
```

To create an Webhook, got to `Server Settings > Integrations > Webhooks > New Webhooks`.

Give it a name, select the channel, save it, copy the URL and paste it here. They can be the same URL if you don't mind mixing it up.

## Running

And it should be all. You can test it with `npm run dev` or `npm start`.

Since you likely want to run it on the background, without an "always on terminal", I have added a `service.example` file.

```
cp reddit2discord.service.example reddit2discord.service
```

Another point to be taken here is that we may want to `build` the project, this way, the raspberry will have it easier for itself.
```
npx tsc
sudo chmod +x build/index.js
```

Now on the new `reddit2discord.service`, we fill in the necessary data.

Replace `<BIN_NPM_PATH>` with the absolute path of your node. You can find it with `which npm`.

Replace `<ABSOLUTE_PATH_TO_FOLDER>` with the absolute path of this project. You can find it with `pwd` when inside the project's folder.

Now, you can do this: `systemctl enable ~/reddit2discord/reddit2discord.service`. This will create a symlink on `/etc/systemd/system`.

Now you can run it with `systemctl start reddit2discord`, and check its status with `systemctl status reddit2discord`.

If however it mentions a problem with the unit file, then you likely wrote something wrong on the `.service` file: Do not use ~ in any path. Confirm that you didn't paste something by mistake. Once modifications are made, you have to reload everything with `systemctl daemon-reload`.

## Customizing

Colors and messages are all in code, so if you want to change something, right now, you will have to change the code. If you don't mind the way messages are made, just changing the colors is easy.

In `src/flair-colors.ts`, there are 2 arrays, one of flairs, and another of colors. If you don't know programming, just keep in mind how it's done, and don't forget the commas <,>.

The array of colors is done with integer numbers instead of the usual Hexcode, or RGB values. I see no common sense in how that works right now, so to find new colors, well, good luck.

To make the `CSS` classes, when you are making new classes on the subreddit (You need to at least be a **mod**), fill the *CSS Class* input for both User and Post Flairs. Post Flairs are used in posts, User Flairs are used in comments.

If the class is not found, it will do White for Posts, and Orange for comments, but you can change that in the `src/flair-colors.ts` code too, just search for `DEFAULT_POST_COLOR` and `DEFAULT_COMMENT_COLOR`, and change for something else in the array of colors, or some random number.

## Support

In regards to what type of posts are supported:

* Text
* Single Image + Gallery
* URL (and URL with video)
* Poll

If the post has the spoiler tag, it won't show the post's body.
If the post has the NFSW tag, it currently just adds a line claiming it is NFSW.
In both cases, images are obfuscated, but a link to the all images is given as a shortcut.

Text merely shows the text, however, although I didn't test, in-text spoilers shouldn't work, as both Reddit and Discord's spoilers are different, and I have made no treatment about that due to "Embed" limitations. **TLDR: It doesn't work**;

Polls will work similar as text, but besides the link to View the Poll (Reddit auto adds it), it also shows the options available;

Single Image shows the image;

Gallery shows the first image, and adds a list of links, with Caption and Links, if available, for everything;

URL just shows the URL with a Thumbnail. (It's important to never hide any user-written URL for safety reasons)

If Reddit detects it's a video, like from Youtube, the post will be made in a more ordinary way, this is because as long as there is an embed, Discord won't "auto-load" the video, thus, for this case only, the post format is completely different and simplified.

Comments, by default, won't show the text in the post due to potential spoilers (There is no information if the new thread is or not spoiler/NFSW). So you can activate it if you think it's ok for you.