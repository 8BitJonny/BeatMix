const express = require('express');
const consola = require('consola');
const axios = require('axios');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const { Nuxt, Builder } = require('nuxt');
const app = express();

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js');
config.dev = process.env.NODE_ENV !== 'production';

let redirect_uri = null;
const client_id = '9af8e00f395c488b9e39f573e06c22ae';
const client_secret = process.env.CLIENT_SECRET;

const headers = {
  'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')),
  'Content-Type': 'application/x-www-form-urlencoded'
};

const stateKey = 'spotify_auth_state';
const tokenKey = 'spotify_auth_token';
const refreshKey = 'spotify_auth_refresh';

async function start () {
  const nuxt = new Nuxt(config);
  const { host, port } = nuxt.options.server;

  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build()
  } else {
    await nuxt.ready()
  }
  app.use(cookieParser());

  app.get("/login", login);
  app.get("/logout", logout);
  app.get("/refreshToken", refreshToken);
  app.get("/auth/callback", authCallback);

  app.use(nuxt.render);

  app.listen(port, host);
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start();

function login(req, res) {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);
  redirect_uri = req.query.redirect_uri;

  const scope = 'user-read-private user-read-email playlist-modify-public';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri,
      state: state
    }));
}

function logout(req, res) {
  res.clearCookie(tokenKey);
  res.clearCookie(refreshKey);
  res.redirect("/");
}

function refreshToken(req, res) {
  const params = querystring.stringify({
    grant_type: 'refresh_token',
    refresh_token: req.cookies[refreshKey]
  });

  axios.post('https://accounts.spotify.com/api/token', params, { headers })
    .then(result => {
      res.cookie(tokenKey, result.data.access_token);
      res.redirect("/")
    }).catch(err => {
      console.error(err);
      res.send()
    });
}

function authCallback(req, res) {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    // Proper Error Handling
  } else {
    res.clearCookie(stateKey);
    console.log("R", redirect_uri);
    const params = querystring.stringify({
      code: code,
      redirect_uri,
      grant_type: 'authorization_code'
    });

    axios.post('https://accounts.spotify.com/api/token', params, { headers })
      .then(result => {
        res.cookie(tokenKey, result.data.access_token);
        res.cookie(refreshKey, result.data.refresh_token);
        res.redirect("/")
      }).catch(err => {
        console.error(err);
        res.send()
      });
  }
}

function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
