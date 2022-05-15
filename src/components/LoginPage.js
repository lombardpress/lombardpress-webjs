import React, {useState, useEffect} from 'react';
import { propTypes } from 'react-bootstrap/esm/Image';
import { firebase, googleAuthProvider } from '../firebase/firebase';

function LoginPage(props) {
  const [userDisplayName, setUserDisplayName] = useState(props.user && props.user.displayName);
  const [user, setUser] = useState(props.user);
  const [userPicture, setPicture] = useState(props.user && props.user.photoURL);
  const startLogin = () => {
    return firebase.auth().signInWithPopup(googleAuthProvider).then((d) => {
      setUserDisplayName(d.additionalUserInfo.profile.name)
      setPicture(d.additionalUserInfo.profile.picture)
    })
  }
  const startLogout = () => {
    setUserDisplayName()
      setPicture()
    return firebase.auth().signOut()
  }
  useEffect(() => {
    setUserDisplayName(props.user && props.user.displayName)
    setUser(props.user)
    setPicture(props.user && props.user.photoURL)
  }, [props.user])
  return (
    <div>
    {userDisplayName ? <div><button onClick={startLogout}>Logout</button> <span>{userDisplayName}</span> <img src={userPicture} height="25px"></img></div> : <button onClick={startLogin}>Login</button>}
    </div>
  );
}

export default LoginPage;