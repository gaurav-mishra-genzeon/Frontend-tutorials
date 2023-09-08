//entry point

import express from "express";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
const port = process.env.PORT || 3001;
const app = express();
app.use(express.json());
const SECRET_KEY = process.env.SECRET_KEY;

const users = [
  {
    id: 1,
    name: "john",
    password: "abcdef",
    isAdmin: true,
  },
  {
    id: 2,
    name: "jack",
    password: "abcdee",
    isAdmin: false,
  },
];

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, SECRET_KEY, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, SECRET_KEY);
};

app.post("/api/login", (req, res) => {
  const { name, password } = req.body;
  const user = users.find((el) => el.name === name && el.password === password);

  if (user) {
    //Generate an access token
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    refreshTokens.push(refreshToken);

    res.json({
      user: user.name,
      isAdmin: user.isAdmin,
      accessToken,
      refreshToken,
    });
  } else {
    res.status(400).json("Username or password is incorrect!");
  }
});

//Verification
const verify = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, SECRET_KEY, (err, payload) => {
      if (err) {
        return res.status(401).json("Token is not valid");
      }
      req.user = payload;
      // res.json(payload);
      next();
    });
  } else {
    res.status(401).json("You are not authenticated!");
  }
};

app.get("/check", verify, (req, res) => res.send(req.user));

let refreshTokens = [];

app.post("/api/refresh", (req, res) => {
  //take the regresh token from user
  const refreshToken = req.body.token;

  //error if there is no token or its invalid
  if (!refreshToken) {
    return res.status(401).json("You are not authenticated!");
  }

  if (!refreshTokens.includes(refreshToken)) {
    return res.status(401).json("Refresh token is not valid");
  }

  jwt.verify(refreshToken, SECRET_KEY, (err, user) => {
    err && console.log(err);
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

     refreshTokens.push(newRefreshToken);
    res.status(200).json({
      accessToken: newAccessToken,
      refreshTokens: newRefreshToken,
    });
    //if everything is ok,create new access token, refresh token and send to user
  });
});

app.delete("/api/users/:userId", verify, (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    res.status(200).json("User has been deleted");
  } else {
    res.status(403).json("You are not allowed to delete this user");
  }
});

app.get("/", (req, res) => res.send("Server is ready and running"));

app.listen(port, () => console.log(`server started on port ${port}`));
