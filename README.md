# >Reddit clone API "Klonnit"

  This is the backend API for a Reddit-like application. It handles user authentication, post and comment management, and community features. Built with Node.js, Express, Sequelize, and JSON Web Tokens for authorization.

# >Features:

  User registration & login (JWT authentication)
  
  Create, read, update, and delete posts
  
  Comment system
  
  Voting system (upvote/downvote)
  
  Community/subreddit creation & membership
  
  Authorization & role management

# >Tech Stack:

  Node.js
  
  Express.js
  
  Sequelize
  
  JWT
  
  MySQL

# >ENV contains:

  DB_USER
  
  DB_PASSWORD
  
  DB_NAME
  
  DB_HOST
  
  DB_PORT
  
  SECRET (for bcrypt)

# >Example endpoints:

  Community:
  
    get "communities/" - get communites
    
    delete "communities/:id" - delete community
    

  Article:
  
    post "communities/:id/article - post article to community
    
    get "communities/:id/articles - get articles from community
    
    get "communities/articles/:id - get article 

  Comment:
  
    get "comment/:id" - get comments from article
    
    post "comment/:id" - post comment
    
    delete "comment/:id" - delete comment
    
    post "comment/upvote/:id" - upvote comment
    
    post "comment/downvote/:id" - downvote comment
    
