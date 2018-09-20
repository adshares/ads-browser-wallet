# ADS Beet

ADS Beet is Chrome extension which can be used to sign ADS blockchain transactions.

## Build

Download project
```
git clone https://github.com/adshares/ads-beet.git
cd ads-beet
```

Install Node.js and npm.
```
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Install dependencies
```
npm install
```

Install gulp
```
npm install -g gulp-cli
```

Build distribution files
```
gulp dist
```

## Pack extension using chrome

Open `chrome://extensions/` and click **Pack Extension** button.

Alternatively use command line
```
google-chrome --pack-extension=./dist/
```
As a result **dist.crx** file should be generated.

If You have pem key, You should use it while packing next version of extension.
Command line call takes key as `--pack-extension-key` parameter.
