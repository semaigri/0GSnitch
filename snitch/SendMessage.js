import AsyncStorage from '@react-native-async-storage/async-storage'
import {sha256} from 'ethereum-cryptography/sha256'
import {createPrivateKeySync} from 'ethereum-cryptography/secp256k1-compat'
import * as secp from '@noble/secp256k1';
//import crypto, { randomBytes } from 'crypto'
import {encrypt,decrypt} from "ethereum-cryptography/aes"
import { bytesToHex, bytesToUtf8, hexToBytes, utf8ToBytes} from "ethereum-cryptography/utils"
import {updateMessages} from "./App.js"
var publicKey 
var privateKey 
(async()=>{
  privateKey = await AsyncStorage.getItem("key")
})()
export async function SendMessage(rawText, nodeIp, serverIp, receiverId, ReceiverPublicKey, msgType, base64Img){
console.log("preparing to send the msg...", rawText, "type:", msgType)
const plainText = rawText
if(msgType == "sent"){
  // ensure it's a string
  console.log("preparing to encrypt string")
  rawText = String(rawText);
  rawText = utf8ToBytes(rawText);
}
else if(msgType === "image"){
console.log("preparing to encrypt image::",rawText)
}
else if(msgType === "video"){
  console.log("preparing to encrypt video::",rawText)
  }

const ptr = new XMLHttpRequest()
ptr.open("POST", `http://${nodeIp}:4000/sendMessage`)
ptr.setRequestHeader("Content-Type", "application/json");

//encryption logic
let receiver = ReceiverPublicKey
if (receiver.startsWith("0x")) {
  receiver = receiver.slice(2);
}
const point = secp.Point.fromHex(receiver);
receiver=point.toHex(false)
//console.log("ReceiverPublicKey",receiver)
  const shared1 = secp.getSharedSecret(privateKey, receiver)
  //console.log(shared1)
  
  const iv = crypto.getRandomValues(new Uint8Array(16));
  const key = shared1.slice(1)

  //console.log('key,', key.length)
  console.log("filesArr[i].msg:", rawText,"key",bytesToHex(key), "filesArr[i].iv",bytesToHex(iv))
  const encrypted = encrypt((rawText),
  (key),
  (iv),
  "aes-256-cbc"
)
console.log('encrypted',encrypted)

const ivHex = bytesToHex(iv)
//sign
const msgHash = bytesToHex(sha256((rawText)))
 publicKey = bytesToHex(secp.getPublicKey(hexToBytes(privateKey)))
 console.log("privateKey",privateKey)
const signature1 =await secp.signAsync(msgHash, hexToBytes(privateKey))
const isSigned = secp.verify(signature1, msgHash, publicKey);

console.log("Msg hash:",msgHash, "public key: ", publicKey, signature1, "isSigned:", isSigned)

ptr.send(JSON.stringify({message: JSON.stringify(Array.from(encrypted)),iv: ivHex, signature:JSON.stringify(signature1.toCompactHex()), hash: msgHash, receiverKey: ReceiverPublicKey, senderKey:publicKey, msgType:msgType}));

ptr.onreadystatechange = function(){
  if(this.readyState==4 && ptr.status==200){
    alert(ptr.responseText)
    return 10
  }
}
//save msg locally
const prev = JSON.parse(await AsyncStorage.getItem(`msgs${receiverId}`))
const message = {
  date: Date.now(),
  text: plainText,
  iv: iv,
  msgType: msgType,
  base64Img:JSON.stringify(base64Img),
}
let newMessagesArr  = prev || []
newMessagesArr.push(message)
await AsyncStorage.setItem(`msgs${receiverId}`, JSON.stringify(newMessagesArr))
console.log(newMessagesArr)
}


export async function getMessages(serverIp, nodeIp,sender, receiver, receiverId, setMessage) {
  const ptr = new XMLHttpRequest()
  ptr.open("GET", `http://${nodeIp}:4000/scanMessages`)
    ptr.setRequestHeader("sender", (sender))
    ptr.setRequestHeader("receiver",receiver)
  
  ptr.send()
  console.log("sender", sender)
  console.log("receiver", receiver)

  ptr.onreadystatechange = async function(){
    if(ptr.status==200 && this.readyState==4){
      let respond = (ptr.responseText)
     // console.log(respond) 
      if(ptr.getResponseHeader("found") == "yes"){
        alert("found msgs")
      }
      //decrypt
      let decryptedArr
     // const prev = JSON.parse(await AsyncStorage.getItem(`msgs${receiverId}`))
      let newMessagesArr  =  []
      let filesArr = JSON.parse(ptr.responseText);
      console.log("receiver:",receiver, "l:", receiver.length)
      if (receiver.startsWith("0x")) {
        receiver = receiver.slice(2);
      }
      const point = secp.Point.fromHex(receiver);
      receiver=point.toHex(false)
      console.log(privateKey, "an", receiver)

      const shared1 = secp.getSharedSecret(privateKey, receiver)
      console.log(shared1)
      const key = shared1.slice(1)
      console.log("key:",key, "length:", key.length)
      for(let i=0; i<filesArr.length; i++){
      try{
        console.log("filesArr[i].msg:", (filesArr[i].msg),"key",bytesToHex(key), "filesArr[i].iv",(filesArr[i].iv ))
        
        filesArr[i].msg = new Uint8Array(filesArr[i].msg.data);
        console.log("Ciphertext length:", filesArr[i].msg.length);

        filesArr[i].iv  = hexToBytes(filesArr[i].iv); 
        const decrypted = decrypt(filesArr[i].msg, key, (filesArr[i].iv), "aes-256-cbc" )
        console.log("decrypted,",bytesToUtf8(decrypted))
        let output
        if(filesArr[i].msgType =="image" ||filesArr[i].msgType =="video"){
          //convert img o uint
          console.log("packing into uint")
          function toNums(raw){
            if(raw instanceof Uint8Array) return raw;
            if(raw instanceof ArrayBuffer) return new Uint8Array(raw);
            if(typeof Buffer!=='undefined' && Buffer.isBuffer(raw)) return Uint8Array.from(raw);
            if(Array.isArray(raw)) return Uint8Array.from(raw);
            if(typeof raw === 'string'){
              const s = raw.trim();
              if(s[0] === '[') try{ const p = JSON.parse(s); if(Array.isArray(p)) return Uint8Array.from(p); }catch(e){}
              const u = new Uint8Array(raw.length);
              for(let i=0;i<raw.length;i++) u[i] = raw.charCodeAt(i) & 0xff;
              return u;
            }
            if(raw && typeof raw === 'object'){
              const vals = Object.values(raw);
              return Uint8Array.from(vals.map(v => typeof v === 'number' ? v : (parseInt(v)||0)));
            }
            return new Uint8Array(0);
          }
          async function saveVideo(data, filename = 'video.mp4') {
            const blob = new Blob([data], { type: 'video/mp4' });
            const url = URL.createObjectURL(blob);
            console.log('Web video URL:', url);
            return url; // use as src in <video>
          }
          const x = await toNums(decrypted)
          output= await saveVideo(x, `video_${Date.now()}.mp4`)
          console.log("output:",output)
        }
        else{output=bytesToUtf8(decrypted)}
        const message = {
          date: filesArr[i].time,
          text: output,
          iv: filesArr[i].iv,
          msgType: filesArr[i].msgType,
          rootId:filesArr[i].rootId,
        }
        console.log("messagetype,",message?.type, "msgType:",message.msgType)
        newMessagesArr.push(message)
      }
      catch(err){console.log("coulnt", err)}
      }
      newMessagesArr.sort((a,b) => a.date-b.date)
      await AsyncStorage.setItem(`msgs${receiverId}`, JSON.stringify(newMessagesArr))
      updateMessages(setMessage)
    }
  }
}