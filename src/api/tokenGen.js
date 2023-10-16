import io from "socket.io-client";
import util from "util";
import https from "https";

var APP_ID = "veronica",
  ACCESS_KEY = "972591632f5f08e7d9d5298425b22f58",
  SECRET_KEY = "58d5b04c4829c50a0cb6306f2beaba16",
  DEVICE_ID = "TEST_SERVER_1";

var API_HOST = "rest.cricketapi.com",
  API_PORT = 443,
  API_PREFIX = "/rest/v2/";

var sample_match_key = "icc_wc_2015_p19";

var push_servers = [],
  access_token = null;

export function auth(onAuth) {
  var data = util.format(
    "access_key=%s&secret_key=%s&app_id=%s&device_id=%s",
    ACCESS_KEY,
    SECRET_KEY,
    APP_ID,
    DEVICE_ID
  );

  var post = {
    host: API_HOST,
    port: API_PORT,
    path: API_PREFIX + "auth/",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": data.length,
    },
  };

  var req = https.request(post, function (res) {
    res.setEncoding("utf8");
    res.on("data", function (result) {
      onAuth.call(undefined, JSON.parse(result));
    });
  });

  req.write(data);
  req.end();
}

// export function connectSocket() {
//   var server = push_servers[0];
//   var host = "http://" + server.host + ":" + server.port;
//   console.log("Connecting", host);

//   var socket = ''

//   socket?.on("auth_failed", function () {
//     console.log(
//       "Auth Failed, consider using new access token. And make sure you have access to the connecting match."
//     );
//   });

//   socket?.on("match_update", function (card) {
//     console.log("Got a match update for", card.key);
//   });

//   socket?.on("event", function () {
//     console.log("event");
//   });

//   socket?.on("error", function () {
//     console.log("error");
//   });

//   socket?.on("connect", function () {
//     console.log("Stream Connected");
//     socket.emit("auth_match", {
//       match: sample_match_key,
//       access_token: access_token,
//     });
//   });
// }

// auth(function (result) {
//   if (result.auth.push_servers) {
//     push_servers = result.auth.push_servers;
//     access_token = result.auth.access_token;
//     connectSocket();
//   } else if (!result.auth) {
//     console.log("Auth failed.");
//   } else {
//     console.log("Push notification is not enabled for your app.");
//   }
// });
