import React, {useEffect, useState} from 'react';
import Axios from 'axios';

const MemberBanner = (props) => {
  const [ipAddress, setIpAddress] = useState()
  const [ipAddressRange, setIpAddressRange] = useState()
  useEffect(() => {
    getIp()
  }, [])
  //NOTE:TODO: this function should be to the App.js component; 
  //as the ip address only needs to be found once during the users visit
  //if it remain here; it will unnecessarily call this function whenever this component loads.
  const getIp = () => {
    Axios("https://api.ipify.org?format=json").then((d) => {
    setIpAddress(d.data.ip)
    setIpAddressRange(d.data.ip.split(".")[0] + "." + d.data.ip.split(".")[1] + "." + d.data.ip.split(".")[2])
    })

  }
  const ipRangeLogoMap = {
    "144.126.4": {
      "name": "Loyola Notre Dame Library",
      "logoUrl": "https://www.lndl.org/_resources/images/lndllogo.svg",
      "linkUrl": "https://www.lndl.org"
    },
    "192.124.249": {
      "name": "Loyola Notre Dame Library",
      "logoUrl": "https://www.lndl.org/_resources/images/lndllogo.svg",
      "linkUrl": "https://www.lndl.org"
    }
  }

  // "34.196.56": {
  //   "name": "Universidad de los Andes",
  //   "logoUrl": "https://uniandes.edu.co/caribe/sites/default/files/logo_negro_0.png",
  //   "linkUrl": "https://uniandes.edu.co"
  // }

  const getMemberInfo = () => {
    if (ipRangeLogoMap[ipAddressRange]){
      return ipRangeLogoMap[ipAddressRange]
    }
    else{
      const indexValue = Math.floor(Math.random()*Object.keys(ipRangeLogoMap).length);
      const keyValue = Object.keys(ipRangeLogoMap)[indexValue]
      return ipRangeLogoMap[keyValue]
    }
  }
  const memberInfo = getMemberInfo()
  return(
    ipAddress ?
    <div className="nav-link">
      <span><a style={{"color": "rgba(0, 0, 0, 0.5)"}} href="https://community.scta.info/members" target="_blank" rel="noopener noreferrer" title="find out more about membership">Member Supported</a> by: </span>
      <a href={memberInfo.linkUrl} target="_blank" rel="noopener noreferrer" title={"You are viewing content generously supported by " + memberInfo.name}>
        <img alt="member logo" height="25px" src={memberInfo.logoUrl}/>
        </a>
    </div>
    
    :
    null
  )
}

export default MemberBanner;