import React, {useState, useEffect} from 'react';
import { propTypes } from 'react-bootstrap/esm/Image';
import { firebase, googleAuthProvider } from '../firebase/firebase';

function LoginPage(props) {
  const [userDisplayName, setUserDisplayName] = useState();
  const [user, setUser] = useState();
  const [userPicture, setPicture] = useState();
  const startLogin = () => {
    return firebase.auth().signInWithPopup(googleAuthProvider).then((d) => {
      setUserDisplayName(d.additionalUserInfo.profile.name)
      setPicture(d.additionalUserInfo.profile.picture)
      props.handleUserIdUpdate(d.user.uid)
    })
  }
  const startLogout = () => {
    setUserDisplayName()
      setPicture()
      props.handleUserIdUpdate("jeff")
    return firebase.auth().signOut()
  }
  return (
    <div>
    {userDisplayName ? <div><button onClick={startLogout}>Logout</button> <span>{userDisplayName}</span> <img src={userPicture} height="25px"></img></div> : <button onClick={startLogin}>Login</button>}
    </div>
  );
}

export default LoginPage;