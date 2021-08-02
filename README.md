# Reddit2Discord

A simple NodeJS automation to check on an specific subreddit, and notify a discord Webhook through a post. Since it needs to constantly be running, it was made with the intent of running it on a Raspberry Pi 3 I have always on.

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

And it should be all. You can test it with `npm run dev` or `npm run start`, or just `sh start.sh`

Since you likely want to run it on the background, without an "always on terminal", I have added a `service.example` file.

```
cp reddit2discord.service.example reddit2discord.service
sudo chmod +x index.js
```

Now on the new `reddit2discord.service`, we fill in the necessary data.

Replace `<BIN_NODE_PATH>` with the absolute path of your node. You can find it with `which node`.

Replace `<ABSOLUTE_PATH_TO_FOLDER>` with the absolute path of this project. You can find it with `pwd` when inside the project's folder.

Now, you can do this: `systemctl enable ~/reddit2discord/reddit2discord.service`. This will create a symlink on `/etc/systemd/system`.

Now you can run it with `systemctl start reddit2discord`, and check its status with `systemctl status reddit2discord`.

If however it mentions a problem with the unit file, then you likely wrote something wrong on the `.service` file: Do not use ~ in any path. Confirm that you didn't paste something by mistake. Once modifications are made, you have to reload everything with `systemctl daemon-reload`.

## Customizing

Colors and messages are all in code, so if you want to change something, right now, you will have to change the code. If you don't mind the way messages are made, just changing the colors is easy.

In `discord.js`, there is an array of "CSS" flairs, so you can use those to select your colors.

The array of colors is at the bottom of the files, you can add more there if you know the values.

To make such `CSS` classes, make sure to fill them in with whatever you want when you make the subreddit's User and Post Flairs. Post Flairs are used in posts, User Flairs are used in comments.

If the class is not found, it will do White for Posts, and Orange for comments, but you can change that in the code too.