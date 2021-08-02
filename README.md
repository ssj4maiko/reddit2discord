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

Since you likely want to run it on the background, without an always on terminal.
```
nohup ./start.sh >> app.log 2>&1 &
```
Check if it's running with `ps -ef | grep "start.sh" | grep -v grep`. If it has been terminated or exitted, then something wrong is not right.

If you want to kill the process to start it again, get the pid with the above command (It's the same number that appeared when you used `nohup`), and do a `kill <PID#>`. You can use the above command to ensure it has been terminated.

A new `app.log` will be created with everything that would usually be onscreen, so you can check there in case something happens.