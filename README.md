# Status Quo (Vadis)

### Usage

- Prerequisites:

`./input/snakes-utf8.tsv` should be utf8 encoded text file 

- Install NODEJS https://nodejs.org/en/

### Install

1/ `npm install` (from root of this folder)

2/ Get a Google Cloud Account and create a Translate App
(App needs a GOOGLE CLOUD KEY use this in the next step)
- Create a translate APP  https://cloud.google.com/translate/docs/basic/setup-basic
- Once the app is setup create a key in Credentials

3/ create a file called `.env` and put in the root of this folder and add this
env var (you could add the env var to your system environment variables instead):
 ```angular2
#env.js / environment variable
GOOGLE_CLOUD_KEY={ENTER_YOUR_GOOGLE_CLOUD_KEY}
```

### Run
```angular2
npm start
```

should run and create a json file containing all translations
json file can be used to populate the next step
