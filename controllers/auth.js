const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();
const User = require("../models/user");

exports.postSignup = (req, res, next) => {
  const { username, password, email } = req.body;

  // hash the password and then create the user in the database
  bcrypt
    .hash(password, 10)
    .then((hashedPw) => {
      return User.create({ email, username, password: hashedPw });
    })
    .then((result) => {
      res.json({ message: "User created successfully." });
    })
    .catch((err) => console.log(err));
};

exports.postLogin = async (req, res, next) => {
  const { username, password } = req.body;

  //find the user by username then check password with hashed password

  try {
    const user = await User.findOne({ where: { username: username } });
    if (!user) {
      throw new Error("No user found!");
    }

    const isHashedPw = await bcrypt.compare(password, user.password);
    if (!isHashedPw) {
      throw new Error("Wrong username or password!");
    }

    const token = jwt.sign({ user: user }, process.env.SECRET, {
      expiresIn: "1h",
    });

    res.json({ token: token, expiresIn: "3600" });
  } catch (err) {
    res.status(401).json({ error: "Login failed" });
  }
};
