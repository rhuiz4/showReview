# Show U Review

## Overview

Everyone seeks entertainment from time to time. You have probably seen and loved many movies, TV series, or performances (i.e. Broadway shows), and want to talk about and share your experiences watching them. Maybe you want a way to keep track of all the shows you've watched and remember what you thought about them. Or perhaps you are deciding on what to watch next, and want to see what other people are saying about a show. 

Show U Review is a web app that lets users write and share their own thoughts and experiences about a show. Users can register and login, can search for shows, and can look at other peoples' reviews for the show. Users can also write their own comments and reviews for a show, mark which shows they have watched, and can add new shows to talk about. 

## Data Model

The application will store Users, Shows, and Reviews

* users can have multiple shows watched/saved (referencing)
* users can have multiple notes for shows (embedding)
* users can have public reviews for shows (referencing)
* shows can have multiple reviews from different users (referencing)


An Example User:

```javascript
{
  username: "some guy",
  hash: // a password hash,
  shows: // array of references to Shows
  notes: [
    { show: "The Batman", watched: True, comment: "This is better than I thought!"},
    { show: "Hamilton", watched: True, comment: "I don't usually watch musicals, but the songs are so catchy!"}
  ]
  reviews: // array of references to Reviews
}
```

An Example Movie:

```javascript
{
  name: "The Batman",
  year: 2022,
  reviews: // array of references to comments
}
```

An Example Review:

```javascript
{
  user: "some guy",
  show: "The Batman",
  created: // timestamp,
  rating: 8,
  comment: "This is a decent reboot. Will recommend if you are a fan of the franchise."
}
```


## [Link to Commented First Draft Schema](db.js) 

(__TODO__: create a first draft of your Schemas in db.js and link to it_)

## Wireframes

(__TODO__: wireframes for all of the pages on your site; they can be as simple as photos of drawings or you can use a tool like Balsamiq, Omnigraffle, etc._)

/login - page to log in
![login](documentation/login.png)

/register - page to create account
![register](documentation/register.png)

/shows - page to show all saved shows and notes
![shows](documentation/shows.png)

/shows/search - page to look up shows
![lookup](documentation/lookup.png)

/shows/details - page with information regarding a show
![details](documentaion/details.png)

## Site map

(__TODO__: draw out a site map that shows how pages are related to each other_)

Here's a [complex example from wikipedia](https://upload.wikimedia.org/wikipedia/commons/2/20/Sitemap_google.jpg), but you can create one without the screenshots, drop shadows, etc. ... just names of pages and where they flow to.

## User Stories or Use Cases

(__TODO__: write out how your application will be used through [user stories](http://en.wikipedia.org/wiki/User_story#Format) and / or [use cases](https://www.mongodb.com/download-center?jmp=docs&_ga=1.47552679.1838903181.1489282706#previous)_)

1. as non-registered user, I can register a new account with the site
2. as a user, I can log in to the site
3. as a user, I can search for shows
4. as a user, I can save a show to my list
5. as a user, I can add personal notes to a show
6. as a user, I can write a review for a show

## Research Topics

(__TODO__: the research topics that you're planning on working on along with their point values... and the total points of research topics listed_)

* (5 points) Integrate user authentication
    * I'm going to be using passport for user authentication
    * And account has been made for testing; I'll email you the password
    * see <code>cs.nyu.edu/~jversoza/ait-final/register</code> for register page
    * see <code>cs.nyu.edu/~jversoza/ait-final/login</code> for login page
* (4 points) Perform client side form validation using a JavaScript library
    * see <code>cs.nyu.edu/~jversoza/ait-final/my-form</code>
    * if you put in a number that's greater than 5, an error message will appear in the dom
* (5 points) vue.js
    * used vue.js as the frontend framework; it's a challenging library to learn, so I've assigned it 5 points

10 points total out of 8 required points (___TODO__: addtional points will __not__ count for extra credit_)


## [Link to Initial Main Project File](app.js) 

(__TODO__: create a skeleton Express application with a package.json, app.js, views folder, etc. ... and link to your initial app.js_)

## Annotations / References Used

(__TODO__: list any tutorials/references/etc. that you've based your code off of_)

1. [passport.js authentication docs](http://passportjs.org/docs) - (add link to source code that was based on this)
2. [tutorial on vue.js](https://vuejs.org/v2/guide/) - (add link to source code that was based on this)

