# Yellow Pages app with AdonisJS

#### Simple app to make use of the NodeJS web framework AdonisJS

### Insert businesses & hot-edit their information
![First GIF](yellowpages1.gif)

### Homepage with most searched businesses & search functionality
![Second GIF](yellowpages2.gif)

### New business as the most searched one & businesses listing
![Third GIF](yellowpages3.gif)

## Steps

`git clone https://github.com/RicardoPBarbosa/pawb_yellowpages.git`

`cd pawb_yellowpages`

`cp .env.example .env`

`adonis key:generate`

Install dependencies locally

`npm install`

`unzip postgres_data.zip`

`docker-compose up --build`

Now you can open the web app on `http://0.0.0.0:3333`

There's a default user created on the database files for the app authentication with the following info:

```
  email: user@email.com
  password: secret
```
