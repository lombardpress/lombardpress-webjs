import React, {useState, useEffect} from 'react';
import { firebase, googleAuthProvider } from '../firebase/firebase';

function LoginPage() {
  const [userDisplayName, setUserDisplayName] = useState();
  const [user, setUser] = useState();
  const [userPicture, setPicture] = useState();
  const startLogin = () => {
    return firebase.auth().signInWithPopup(googleAuthProvider).then((d) => {
      console.log("d", d.additionalUserInfo.profile)
      setUserDisplayName(d.additionalUserInfo.profile.name)
      setPicture(d.additionalUserInfo.profile.picture)
    })
  }
  const startLogout = () => {
    setUserDisplayName()
      setPicture()
    return firebase.auth().signOut()
  }
  return (
    <div>
    {userDisplayName ? <div><button onClick={startLogout}>Logout</button> <span>{userDisplayName}</span> <img src={userPicture}></img></div> : <button onClick={startLogin}>Login</button>}
    </div>
  );
}

export default LoginPage;