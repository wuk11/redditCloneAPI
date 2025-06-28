const express = require("express");
const sequelize = require("./sequelize.js");

const authRoutes = require("./routes/auth");
const communityRoutes = require("./routes/community");
const userRoutes = require("./routes/user");
const commentRoutes = require("./routes/comment");

const Community = require("./models/community.js");
const Article = require("./models/article.js");
const User = require("./models/user.js");
const Karma_history = require("./models/karma_history.js");
const Comment = require("./models/comment.js");

Community.belongsTo(User); // community created by user
Community.hasMany(Article); //community has many posts
Article.belongsTo(User); //posted by user
User.hasMany(Karma_history);
Article.hasMany(Karma_history);
Comment.hasMany(Karma_history);
Karma_history.belongsTo(User);
Karma_history.belongsTo(Article);
Karma_history.belongsTo(Comment);
Comment.belongsTo(User);
Comment.belongsTo(Article);
Comment.belongsTo(Comment, { as: "Parent", foreignKey: "replyToCommentId" });
Comment.hasMany(Comment, { as: "Replies", foreignKey: "replyToCommentId" });

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);

app.use("/community", communityRoutes);

app.use("/user", userRoutes);

app.use("/comment", commentRoutes);

try {
  sequelize.sync({});
  console.log("Database synced");
} catch (err) {
  console.log(err);
}

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
