const express = require("express");
const sequelize = require("./sequelize.js");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const communityRoutes = require("./routes/community");
const userRoutes = require("./routes/user");
const commentRoutes = require("./routes/comment");
const reportsRoutes = require("./routes/reports");

const Community = require("./models/community.js");
const Article = require("./models/article.js");
const User = require("./models/user.js");
const Karma_history = require("./models/karma_history.js");
const Comment = require("./models/comment.js");
const CommunityRoles = require("./models/communityRoles.js");
const Reports = require("./models/reports.js");

Community.belongsTo(User);
Community.hasMany(Article, { onDelete: "CASCADE" });
Community.hasMany(CommunityRoles, { onDelete: "CASCADE" });
Article.belongsTo(User);
Article.belongsTo(Community);
Article.hasMany(Comment, { onDelete: "CASCADE" });
Article.hasMany(Karma_history, { onDelete: "CASCADE" });
Article.hasMany(Reports, { onDelete: "CASCADE" });
User.hasMany(Karma_history);
Karma_history.belongsTo(User);
Karma_history.belongsTo(Article);
Karma_history.belongsTo(Comment);
Comment.belongsTo(User);
Comment.belongsTo(Article);
Comment.belongsTo(Comment, { as: "Parent", foreignKey: "replyToCommentId" });
Comment.hasMany(Karma_history);
Comment.hasMany(Comment, { as: "Replies", foreignKey: "replyToCommentId" });
CommunityRoles.belongsTo(User, { foreignKey: "UserId" });
CommunityRoles.belongsTo(Community, { foreignKey: "CommunityId" });
Reports.belongsTo(User, { foreignKey: "UserId" });
Reports.belongsTo(Article, { foreignKey: "ArticleId" });
Reports.belongsTo(Comment, { foreignKey: "CommentId" });

const app = express();
app.use(express.json());

app.use(cors());

app.use("/auth", authRoutes);

app.use("/community", communityRoutes);

app.use("/user", userRoutes);

app.use("/comment", commentRoutes);

app.use("/reports", reportsRoutes);

try {
  sequelize.sync({});
  console.log("Database synced");
} catch (err) {
  console.log(err);
}

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
