import { useState } from 'react';
import Games from './Games';
import Login from './Login';
import { googleLogout } from '@react-oauth/google';
import { useEffect } from 'react';
import axios from 'axios';
import './App.css'

const initialUserData = {
  spelling: {
      score: 0,
      level: 3,
      correctWords: [],
      wrongWords: []
  },
  definitions: {
      score: 0,
      level: 3,
      correctWords: [],
      wrongWords: []
  },
  compare: {
    score: 0,
    level: 3,
    correctWords: [],
    wrongWords: []
}
}

function App() {
  const [ user, setUser ] = useState(null);
  const [ key, setKey ] = useState(null);
  const [ profile, setProfile ] = useState({});
  const [userData, setUserData] = useState(initialUserData);

  useEffect(
    () => {
        if (user) {
          if (user === "Guest") {
            setProfile({name: "Guest", email: "None", sub: "guest"});
            let config = {method: 'get', headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}}
            axios.get('https://beeyondwords.vercel.app/users/guest', config).then(response => {
                      setUserData(response.data.gameData)
                      setKey("Basic "+btoa(response.data.username+":"+response.data.password))
                    }).catch(err => console.log(err))
            return;
          }
          
            axios
                .get(`https://www.googleapis.com/oauth2/v3/userinfo`, {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`,
                        Accept: 'application/json'
                    }
                })
                .then((res) => {
                    setProfile(res.data);
                    let config = {method: 'get', headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}}
                    axios.get('https://beeyondwords.vercel.app/users/'+res.data.sub, config).then(response => {
                      setUserData(response.data.gameData)
                      setKey("Basic "+btoa(response.data.username+":"+response.data.password))
                    }).catch(err => console.log(err))
                })
                .catch((err) => console.log(err));
        }
    },
    [ user ]
);

  const logOut = () => {
    googleLogout();
    setProfile(null);
    setUser(null);
    setUserData(initialUserData);
    console.log("logged out")
  };  

  return (
    <>
      {user
        ? <Games logOut={logOut} profile={profile} userData={userData} setUserData={setUserData} key={key}/>
        : <Login setUser={setUser} />}
    </>
  )
}

export default App
