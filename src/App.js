import axios from "axios";
import { useEffect, useState } from "react";
import util from "util";
import "./App.css";
import "./assets/scss/main.scss";
import ScoreBoard from "./pages/ScoreBoard";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { io } from "socket.io-client";
import store from "./redux/store";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';

var sample_match_key;
// var sockets;


function App({ props }) {
  const socket = useSelector((state) => state.SocketModel.socket);
  const [sockets, setSockets] = useState();
  const [accessToken, setAccessToken] = useState();
  const { dispatch } = store;

  sample_match_key = props.match.params.match_id;

  const encryptionPassword = 'it_is_satradar_env_password';
  const iv = 'it_is_satradar_env_iv'; // This should be a random and unique value, not hard-coded in the code

  useEffect(() => {
    setTimeout(() => {
      connectSocket();
    }, 1000);
  }, []);

  useEffect(() => {
    async function abcd() {
      if(socket.connected){
        console.log('socket', socket)
        // Add a connect listener
        socket?.on('connect', function (socket) {
          console.log('Connected!')
        })
  
        const token = await getAccessToken();
        setAccessToken(token.token);
        // console.log('getAccessToken()', token);
  
        // prepare required data to access the match data
        var data = {}
        data.token = token.token // token
        data.match_key = props.match.params.match_id // match key
        // emit signal to connect to the room
        socket?.emit('connect_to_match', data)
        // server emits 'on_match_joined'
        socket?.on('on_match_joined', function (data) {
          console.log('Cricket match joined!', data)
        })
        // the subscribed match content are emitted with 'on_match_update' event
        // since it's gzipped data, parse it to unzip it
        socket?.on('on_match_update', function (res) {
          console.log('data received')
          console.log(JSON.parse(res))
          dispatch.MatchModel.getMatchDetail({ data: JSON.parse(res.data), from: 'socket' });
        })
        // emits 'on_error' on,
        //match not subscribed
        socket?.on('on_error', function (data) {
          console.log('not_subscribed', JSON.parse(data))
        })
      }
    }
    setTimeout(()=>{
      abcd();
    },[1500])
  }, [socket])

  // useEffect(() => {
  //   socket.onopen = () => {
  //     console.log("WebSocket Client Connected");
  //     const data = {};
  //     // data.token = access_token;
  //     data.action = 'setMatch';
  //     data.matchId = sample_match_key;
  //     socket.send(JSON.stringify(data));
  //   };
  //   socket.onmessage = (message) => {
  //     const responseData = JSON.parse(message.data);
  //     // console.log('responseData', responseData)
  //     if (responseData.messageType === "score") {
  //       dispatch.MatchModel.getMatchDetail({ data: JSON.parse(responseData.data).score, from: 'socket' });
  //     }
  //     // console.log(message);
  //   };
  // }, [socket]);

  // useEffect(() => {
  //   subscribeSocket();
  // }, [accessToken])

  // Decrypt data
  const decryptData = (encryptedData) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionPassword, { iv });
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      return decryptedData;
    } catch (error) {
      // Handle decryption error
      console.error('Decryption error:', error.message);
      return null;
    }
  };

  // configuration
  let cricketHost = decryptData("U2FsdGVkX18lbfzTpaqhQeejd7PunLBUSJDeXMrFf+kXao6RwfM6QjMhyA0T33WE");
  let cricketProjectKey = decryptData("U2FsdGVkX19f6u/j+SqKuPiMWb5Bspa4BUlmniArhmYoanQlCjn4guySiDbH5zAh");
  let cricketApiKey = decryptData("U2FsdGVkX1+8dbd+ot2XIe+V3bKEMs0LURlrIL15LmbWe5nUrK7IFDWkpB2aYsybtvSGynLqWLHVigovR+fbZQ==");

  function getAccessToken() {
    return new Promise(resolve => {
      var options = {
        method: 'POST',
        url: cricketHost + '/v5/core/' + cricketProjectKey + '/auth/',
        // headers: this.headers,
        body: JSON.stringify({
          api_key: `${cricketApiKey}`
        })
      }

      axios.post(options.url, options.body, {
        headers: { 'Content-Type': 'application/json' }
      })
        .then(response => {
          if (response.data.http_status_code == 200) {
            resolve({
              token: response.data.data.token
            })
          }
        })
        .catch(error => {
          console.log("An error occurred while getting access token: ", error);
          resolve(false);
        });
    });
  }

  const subscribeSocket = () => {
    var project_key = cricketProjectKey
    var token = accessToken
    var match_key = props.match.params.match_id
    var options = {
      method: 'POST',
      url: `https://api.sports.roanuz.com/v5/cricket/${project_key}/match/${match_key}/subscribe/`,
      headers: {
        'rs-token': `${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        method: "web_socket"
      })
    }
    axios.post(options.url, options.body, {
      headers: {
        'rs-token': `${token}`,
        'Content-Type': 'application/json'
      },
    }).then((res) => {
      console.log('res', res);
    })
  }

  function connectSocket() {

    var sock = io.connect('http://socket.sports.roanuz.com/cricket', { path: '/v5/websocket' })
    dispatch.SocketModel.setSocketData(sock);
  }

  return <ScoreBoard matchId={props.match.params.match_id} />;
}

export default App;
