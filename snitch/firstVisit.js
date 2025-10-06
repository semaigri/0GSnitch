import AsyncStorage from "@react-native-async-storage/async-storage"
import * as secp from "@noble/secp256k1"
import { bytesToHex, hexToBytes } from "ethereum-cryptography/utils"
import { sha256 } from '@noble/hashes/sha2';
export var myChats = []
export async function verify(serverIp, nodeIp, key) {
  const privateKeyBytes = hexToBytes(key);
  const publicKey = bytesToHex(secp.getPublicKey(privateKeyBytes));

  await AsyncStorage.setItem("key", key);
  await AsyncStorage.setItem("nodeIp", nodeIp);

  const ptr = new XMLHttpRequest();
  ptr.open("GET", `http://${nodeIp}:4000/challenge`);
  ptr.setRequestHeader("publickey", publicKey);
  ptr.send();
  console.log("key:",key)
  ptr.onreadystatechange = async function () {
    if (ptr.readyState === 4 && ptr.status === 200) {
     
const challengeHex = JSON.parse(ptr.responseText).challenge;
const msgHash = sha256(hexToBytes(challengeHex));

// Подпись (возвращает Uint8Array, 64 байта)
const signatureBytes = await secp.sign(msgHash, privateKeyBytes); 
const signatureHex = bytesToHex(signatureBytes);

     
      const ptr2 = new XMLHttpRequest();
      ptr2.open("GET", `http://${nodeIp}:4000/verify`);
      ptr2.setRequestHeader("publickey", publicKey);
      ptr2.setRequestHeader("signature", signatureHex);
      ptr2.send();

      ptr2.onreadystatechange = function () {
        if (ptr2.readyState === 4 && ptr2.status === 200) {
          const token = JSON.parse(ptr2.responseText).token;
          console.log("received token:", token);
          AsyncStorage.setItem("authToken", token);
        } else if (ptr2.readyState === 4) {
          console.error("verification failed:", ptr2.responseText);
        }
      };
    }
  };
}

export async function fistVisit(){
  if(await AsyncStorage.getItem('firstVisit')!="true"){
    console.log("firsttime")
    return 1
  }
  else{
    console.log("notfirsttime")
    return 0
  }
  
}

export async function getServerIp(){
  const r =  localStorage.getItem("serverIp1") || "10.133.177.231"
  return r
}

export async function getPrivateKey(){
  const r =  localStorage.getItem("key")
  return r
}

export async function getNodeIp(){
  const r =  localStorage.getItem("nodeIp1") || "10.133.177.231"
  return r
}

export async function signUp(server, nodeIp, key) {

}

export async function getNickName() {
  
  const r =  localStorage.getItem("nickName")
  return r
}

export async function setUserSettings(serverIp, nodeIp, key,userName,userNickTag,publicKeyMe){
//verify(serverIp, nodeIp, key,userName,userNickTag,publicKeyMe)

 await AsyncStorage.setItem("serverIp", serverIp);
 await  AsyncStorage.setItem("nodeIp", nodeIp);
 await AsyncStorage.setItem("key", key);
 const publicKey =  secp.getPublicKey(key)
 console.log("use preferences been updated", serverIp, nodeIp,key,"publicKey",publicKey)
 
 const ptr = new XMLHttpRequest()
 ptr.open("GET",`http://${nodeIp}:4000/signUp` )
 ptr.setRequestHeader("username",userName )
 ptr.setRequestHeader("usernicktag",userNickTag)
 ptr.setRequestHeader("publickey", (bytesToHex(publicKey)))
 ptr.send()
}

export  async function LoadChats(){
  myChats = await AsyncStorage.getItem("myChats")
  myChats = myChats ? JSON.parse(myChats) : [] 
  return myChats
}

export  async function SaveChats(keyId, nickTag){
  console.log("SaveChats,",myChats)
  if(Array.isArray(myChats)){
    myChats.push({keyId: keyId, nickTag:nickTag})
  }
  else{
    myChats = [] 
    myChats[0] = {keyId: keyId, nickTag:nickTag}
  }
  AsyncStorage.setItem("myChats", JSON.stringify(myChats))
}