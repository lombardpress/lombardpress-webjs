import React, {useState, useEffect} from 'react';
import { firebase, googleAuthProvider } from '../firebase/firebase';
import Button from 'react-bootstrap/Button';

function LoginPage(props) {
  const [userDisplayName, setUserDisplayName] = useState(props.user && props.user.displayName);
  //const [user, setUser] = useState(props.user);
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
    //setUser(props.user)
    setPicture(props.user && props.user.photoURL)
  }, [props.user])
  return (
    <div>
    {userDisplayName ? <span><span>{userDisplayName}</span> <img src={userPicture} alt="usrImage" height="25px"></img> <Button  size="sm" onClick={startLogout}>Logout</Button> </span> : <Button size="sm" onClick={startLogin}>Login</Button>}
    </div>
  );
}

export default LoginPage;