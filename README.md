    _   _  _____   _   _                     ____             _      ______           _
    | \ | |/ ____| | \ | |                   |  _ \           | |    |  ____|         | |
    |  \| | |      |  \| | _____      _____  | |_) | __ _  ___| | __ | |__   _ __   __| |
    | . ` | |      | . ` |/ _ \ \ /\ / / __| |  _ < / _` |/ __| |/ / |  __| | '_ \ / _` |
    | |\  | |____  | |\  |  __/\ V  V /\__ \ | |_) | (_| | (__|   <  | |____| | | | (_| |
    |_| \_|\_____| |_| \_|\___| \_/\_/ |___/ |____/ \__,_|\___|_|\_\ |______|_| |_|\__,_|

# NC-News Backend

NC-News Backend is a RESTful Api, serving up comments, articles and user data from a SQL database, for use by a social news aggregate in the style of Reddit or Metafilter.

The back end is hosted live at: https://conways-nc-news.herokuapp.com/

## The Front End

If you're interested in viewing the front end of this project, please feel free to checkout the github repo of it [over here](https://github.com/conwayhub/front-end-nc-news) or the live hosted version [here](https://newsfromthenorth.netlify.com/)

## The Endpoints

The following endpoints are available for a range of requests on this server

&emsp;🌎&emsp; /api

&emsp;🌎&emsp; /api/topics

&emsp;👨‍👩‍👧&emsp;/api/users

&emsp;🧑&emsp;/api/users/:username

&emsp;🗞️&emsp;/api/articles

&emsp;📰&emsp;/api/articles/:article_id

&emsp;🖊️&emsp;/api/articles/:article_id/comments

&emsp;🖊️&emsp;/api/comments/:comment_id

For more details on methods for interacting with these endpoints, please check out the full api [here](https://conways-nc-news.herokuapp.com/api).

## The Tech Stack

&emsp;✔️ &emsp; Javascript

&emsp;✔️ &emsp; Express

&emsp;✔️ &emsp; Knex

&emsp;✔️ &emsp; PostgreSQL

&emsp;✔️ &emsp; Cors

## Tested with

To run a test of the endpoints, run script `npm test`
To test util components, run script `npm run test-utils`

&emsp;✔️ &emsp; Mocha & Chai

&emsp;✔️ &emsp; Supertest

&emsp;✔️ &emsp; sams-chai-sorted &emsp;👏👏👏 &emsp;

## Take her for a spin!

Please feel free to fork and clone this repository, if you'd like to run it yourself, or just take a closer peek at the code!

### Requirements

&emsp;❗&emsp;To run this repository, you must be using Node JS version 13.01.0 or higher. Check your current version with the command `node -v`.

### Steps for running this project locally

&emsp;✔️&emsp;Fork and clone the project

&emsp;✔️&emsp; Install necessary dependencies by running the script `npm install` in the project's terminal

&emsp;✔️&emsp; Ender the knexfile in the root directory, and update the customConfig with your own details, as shown below

&emsp;❗&emsp; If you are running this project from a macintosh system, no user details will be required, if running on linux, you'll need to enter your psql details below.

```

const customConfig = {
  development: {
    connection: {
      database: "nc_news",
//      user: ,
//      password:
    }
  },
  test: {
    connection: {
      database: "nc_news_test",
//      user: ,
//      password:
    }
  },
};

```

&emsp;✔️&emsp; Setup and seed your database using the scripts `npm run setup-dbs` followed by `npm run seed`

&emsp;✔️&emsp; Start serving with the script `npm start`

&emsp;✔️&emsp; Open a browser window, or using https://insomnia.rest/ enter the url http://localhost:9090/api to start hitting those endpoints, and rummaging through your local api :)
