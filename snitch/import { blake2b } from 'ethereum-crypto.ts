import { blake2b } from 'ethereum-cryptography/blake2b';
import { setStatusBarBackgroundColor, StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Pressable,TouchableOpacity, Button, TextInput,ScrollView, Platform } from 'react-native';
import { useFonts } from 'expo-font';
const { hexToBytes, bytesToHex } = require('ethereum-cryptography/utils')
import * as FileSystem from 'expo-file-system';
const { secp256k1 } = require('ethereum-cryptography/secp256k1')
import * as secp from '@noble/secp256k1';
import { encryptMessage2 }  from './EncryptMessage';
import{SendMessage, getMessages} from "./SendMessage"
import {fistVisit, getServerIp, setUserSettings, getPrivateKey, getNodeIp, getNickName, LoadChats, SaveChats} from './firstVisit.js'
encryptMessage2("m", "s")
import {loadMessages} from "./load"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as FilePicker from "expo-image-picker"

var view = []
var myChatsArr = []
let array = []

let switchScreen
let serverIp 
let key
let publicKeyMe,publicKeyMeHex
var ReceiverPublicKey
let nodeIp
let myNickname
let bio
let fileUrl
(async()=>{
  serverIp=await getServerIp()
  console.log("server Ip =", serverIp)
  nodeIp=await getNodeIp()
  key = await getPrivateKey()
  myChatsArr=await LoadChats()
  console.log("RecoveredRecoveredRecovered+"+myChatsArr)
  //myNickname=await getNickName()
  const privateKeyBytes = hexToBytes(key); // if key is a hex string
  const publicKeyMe = secp.getPublicKey(key);
  publicKeyMeHex = bytesToHex(publicKeyMe)
  console.log("publicKeyMe,",publicKeyMe)
})()
let chosenUser, chosenUserName, chosenUserNickTag
let arrayUsers = []
//get public key(simon)
let privateKey = key
 //0x2AB4D779714F7C378B55E6C07C0348F190C112DC
 export  function updateMessages(setMessage){
  AsyncStorage.getItem(`msgs${chosenUser}`).then((value) => {
    let x = JSON.parse(value) || 0
    console.log("asked for chat history", x )
     console.log(x)
    for(let i=0; i<x.length; i++){
      if(x[i].type == "received"){
        array.push(
          <Text style={{
            fontSize: 17,
            backgroundColor: '#3b3b3b', // soft blue
            color: "white",
            marginTop: 6,
            paddingVertical: 16,
            paddingHorizontal: 10,
            alignSelf: 'flex-start',
            marginLeft:"45%",
            borderRadius: 8,
            maxWidth: '75%'
          }}>
            {x[i]?.text}
          </Text>
        )          
      }
      else{
        array.push(
          <Text style={{
            fontSize: 17,
            backgroundColor: '#1e90ff', // soft blue
            color: "white",
            marginTop: 6,
            paddingVertical: 16,
            paddingHorizontal: 10,
            alignSelf: 'flex-start',
            marginLeft:"55%",
            borderRadius: 8,
            maxWidth: '75%'
          }}>
            {x[i]?.text}
          </Text>
        )
 }
      //color of text
    }
    setMessage(array);
    });
}

export default function App() {
  const [fontsLoaded] = useFonts({
    'CourierPrime': require('./assets/fonts/CourierPrime-Regular.ttf'),
  });
  let [text, setText] = useState('')
  let [screen, setScreen] = useState('main')
  let [userId, setUserId] = useState(null)
  let [showKey, setShowKey] = useState(null)
  let [message, setMessage] = useState(null)

  switchScreen=setScreen
  const inputRef = useRef(null)
  const ViewProfileFunc = function(){
    return (
      <View style={{ flex: 1, backgroundColor: '#0b0b0b', padding: 20 }}>
        {/* Title */}
        <Text style={{
          fontSize: 36,
          fontFamily: 'CourierPrime',
          color: 'rgb(255, 174, 0)',
          textAlign: 'center',
          marginBottom: 30,
          textShadowColor: '#00ff99',
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 8,
        }}>PROFILE</Text>
    
        {/* Nickname */}
        <View style={{
          marginBottom: 20,
          borderWidth: 1,
          borderColor: '#00ff99',
          borderRadius: 8,
          padding: 12,
          backgroundColor: '#111',
        }}>
          <Text style={{
            color: '#00ff99',
            fontFamily: 'CourierPrime',
            fontSize: 18,
            marginBottom: 6,
          }}>Nickname</Text>
          <TextInput
            value={myNickname}
            //onChangeText={setUserNickTag}
            style={{
              color: '#00ff99',
              fontFamily: 'CourierPrime',
              fontSize: 16,
              borderBottomWidth: 1,
              borderBottomColor: '#00ff99',
              paddingVertical: 4,
            }}
            placeholder={myNickname}
            placeholderTextColor="#555"
            editable={false}
          />
        </View>
    
        {/* Bio */}
        <View style={{
          marginBottom: 20,
          borderWidth: 1,
          borderColor: '#00ff99',
          borderRadius: 8,
          padding: 12,
          backgroundColor: '#111',
        }}>
          <Text style={{
            color: '#00ff99',
            fontFamily: 'CourierPrime',
            fontSize: 18,
            marginBottom: 6,
          }}>Bio</Text>
          <TextInput
           // value={userBio}
           // onChangeText={setUserBio}
            multiline
            style={{
              color: '#00ff99',
              fontFamily: 'CourierPrime',
              fontSize: 16,
              minHeight: 80,
              textAlignVertical: 'top',
              borderBottomWidth: 1,
              borderBottomColor: '#00ff99',
              paddingVertical: 4,
            }}
            placeholder="Enter bio"
            placeholderTextColor="#555"
          />
        </View>
    
        {/* User Key */}
        <View style={{
          marginBottom: 30,
          borderWidth: 1,
          borderColor: '#00ff99',
          borderRadius: 8,
          padding: 12,
          backgroundColor: '#111',
        }}>
          <Text style={{
            color: '#00ff99',
            fontFamily: 'CourierPrime',
            fontSize: 18,
            marginBottom: 6,
          }}>Public Key</Text>
          <Text style={{
            color: '#00ff99',
            fontFamily: 'CourierPrime',
            fontSize: 16,
            paddingVertical: 4,
          }}>
            {publicKeyMeHex}
            </Text>
        </View>
        <View style={{
  marginBottom: 30,
  borderWidth: 1,
  borderColor: '#00ff99',
  borderRadius: 8,
  padding: 12,
  backgroundColor: '#111',
}}>
  <Text style={{
    color: '#00ff99',
    fontFamily: 'CourierPrime',
    fontSize: 18,
    marginBottom: 6,
  }}>Private Key</Text>

  <Text
    style={{
      color: '#00ff99',
      fontFamily: 'CourierPrime',
      fontSize: 16,
      paddingVertical: 4,
      flexWrap: "wrap",
      width: "100%",      // ✅ force wrapping inside the box
    }}
  >
    {showKey ? key : "••••••••••••••••"}
  </Text>

  <Text 
    onPress={() => setShowKey(!showKey)}
    style={{
      color: '#00ff99',
      fontFamily: 'CourierPrime',
      fontSize: 14,
      marginTop: 8,
      textDecorationLine: "underline",
      alignSelf: "flex-end"
    }}
  >
    {showKey ? "Hide" : "Show"}
  </Text>
</View>
        {/* Save Button */}
        <TouchableOpacity
          onPress={() =>{

            setScreen("main")
          } 
            }
          style={{
            backgroundColor: '#111',
            borderColor: '#00ff99',
            borderWidth: 1,
            borderRadius: 8,
            paddingVertical: 12,
            alignItems: 'center',
            marginTop: 10,
          }}
        >
          <Text style={{
            color: 'rgb(255, 174, 0)',
            fontFamily: 'CourierPrime',
            fontSize: 18,
            fontWeight: 'bold',
            textShadowColor: '#00ff99',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 8,
          }}>SAVE</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>{
            async function exportMessages() {
              const keys = await AsyncStorage.getAllKeys();
              const msgsKeys = keys.filter(k => k.startsWith('msgs'));
              const stores = await AsyncStorage.multiGet(msgsKeys);
            
              let data = {};
              stores.forEach(([key, value]) => {
                if (value) data[key] = JSON.parse(value);
              });
            
              const json = JSON.stringify(data, null, 2);
            
              if (typeof document !== "undefined") {
                // WEB: create download link
                const blob = new Blob([json], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "messages_backup.json";
                a.click();
                URL.revokeObjectURL(url);
              } else {
                // MOBILE: use FileSystem
                const { writeAsStringAsync, documentDirectory } = require("expo-file-system");
                const path = documentDirectory + "messages_backup.json";
                await writeAsStringAsync(path, json);
                return path;
              }
            }
            exportMessages()
            setScreen("main")
          } 
            }
          style={{
            backgroundColor: 'rgb(1,1,1)',
            borderColor: 'rgb(17, 178, 22)',
            borderWidth: 1,
            borderRadius: 8,
            paddingVertical: 12,
            alignItems: 'center',
            bottom: 10,
            width:"40%",
            position:"absolute"
          }}
        >
          <Text style={{
            color: 'rgb(255, 174, 0)',
            fontFamily: 'CourierPrime',
            fontSize: 18,
            fontWeight: 'bold',
            textShadowColor: '#00ff99',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 8,
          }}>EXPORT CHATS</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>{
            async function importMessagesWeb() {
              return new Promise((resolve, reject) => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "application/json";
            
                input.onchange = async (event) => {
                  const file = event.target.files[0];
                  if (!file) return reject("No file selected");
            
                  const reader = new FileReader();
                  reader.onload = async (e) => {
                    try {
                      const data = JSON.parse(e.target.result);
                      const entries = Object.entries(data).map(([k, v]) => [k, JSON.stringify(v)]);
                      await AsyncStorage.multiSet(entries);
                      console.log("Messages recovered!");
                      setScreen("main")
                      alert("recovered")
                      resolve(true);
                    } catch (err) {
                      console.log("Import error:", err);
                      reject(err);
                    }
                  };
                  reader.readAsText(file);
                };
            
                input.click();
              });
            }
            
            importMessagesWeb()
          } 
            }
          style={{
            backgroundColor: 'rgb(1,1,1)',
            borderColor: 'rgb(17, 178, 22)',
            borderWidth: 1,
            borderRadius: 8,
            paddingVertical: 12,
            alignItems: 'center',
            bottom: 10,
            right:20,
            width:"40%",
            position:"absolute"
          }}
        >
          <Text style={{
            color: 'rgb(255, 174, 0)',
            fontFamily: 'CourierPrime',
            fontSize: 18,
            fontWeight: 'bold',
            textShadowColor: '#00ff99',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 8,
          }}>IMPORT CHATS</Text>
        </TouchableOpacity>
      </View>
    );
    
   }
  useEffect(()=>{
   (async()=>{
    let fistVisitV = await fistVisit() 
    console.log('fistVisitV', fistVisitV)
    if(fistVisitV==1){
      //alert("11")
      AsyncStorage.setItem('firstVisit', "true")
      setScreen("firstTime")
    }

    //restore from memory
   })()
   
//list of users user list
    const request = new XMLHttpRequest
    //192.168.9.87  10.242.168.231
    console.log("2:::",serverIp)
    request.open("GET", `http://${serverIp}:4000/getListOfUsers`)
    request.onreadystatechange = function func(){
      if(request.status == 200 && this.readyState==4){
         arrayUsers = JSON.parse(request.responseText)
        console.log(arrayUsers)
       
        for(let i=0; i<arrayUsers.length; i++){
          if(arrayUsers[i].itsPublicKey == publicKeyMeHex){
            myNickname=arrayUsers[i].itsUserName
            continue
          }
          else{
  view.push(
    <Pressable 
      key={i+1}
    onPress={() => {
      chosenUser = i+1
      chosenUserName = arrayUsers[i].itsName
      chosenUserNickTag = arrayUsers[i].itsUserName
      alert(i+1)
      setScreen('SendMessage')
      setUserId(i+1)
      updateMessages(setMessage)
    }}
    style={({ pressed }) => ({
      transform: [{ scale: pressed ? 0.97 : 1 }],
      opacity: pressed ? 0.9 : 1
    })}
  >
    
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#1e1e1e',
      padding: 15,
      marginBottom: 12,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 4
    }}>
      
      {/* Avatar */}
      <View style={{
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#444',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15
      }}>
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>
          {arrayUsers[i]?.itsName?.[0] || '?'}
        </Text>
      </View>

      {/* Name + Bio */}
      <View style={{ flex: 1, height:"100%", borderColor:"rgb(66, 65, 65)", borderWidth:1, borderStyle:"solid", borderRadius:4, flexDirection:"row"}}>
        <Text style={[{
          fontSize: 20,
          fontWeight: 'bold',
          color: '#fff',
          marginBottom: 4,
          width:170,
          marginTop:11,
          marginLeft:10
        }, styles.textStyle]}>
          {arrayUsers[i]?.itsName}
        </Text>
        <Text style={[{
          fontSize: 12,
          color: '#aaa',
          fontStyle: 'italic',
          marginTop:6,
          marginLeft:10
        }, styles.textStyle]}>
          {arrayUsers[i]?.itsBio}
        </Text>
      </View>

    </View>
  </Pressable>
)
}
        }

view.push(
  <View style={{
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#0a0a0a",
  //  borderTopWidth: 1,
   // borderTopColor: "#00ff99",
    shadowColor: "#00ff99",
    shadowOpacity: 0.6,
    shadowRadius: 8,
   // shadowOffset: { width: 0, height: -2 },
  }}>
    <Pressable style={{
      paddingVertical: 8,
      paddingHorizontal: 18,
      borderWidth: 1,
      borderColor: "#00ff99",
      borderRadius: 6,
      backgroundColor: "#111",
    }}>
      <Text style={{
        color: "#00ff99",
        fontSize: 16,
        fontWeight: "bold",
        textShadowColor: "#00ff99",
        textShadowRadius: 12,
      }}>USERS</Text>
    </Pressable>
  
    <Pressable onPress={function(){
      setScreen("viewMyChats")
    }}  style={{
      paddingVertical: 8,
      paddingHorizontal: 18,
      borderWidth: 1,
      borderColor: "#00ff99",
      borderRadius: 6,
      backgroundColor: "#111",
    }}>
      <Text style={{
        color: "#00ff99",
        fontSize: 16,
        fontWeight: "bold",
        textShadowColor: "#00ff99",
        textShadowRadius: 12,
      }}>MY CHATS</Text>
    </Pressable>
  
    <Pressable style={{
      paddingVertical: 8,
      paddingHorizontal: 18,
      borderWidth: 1,
      borderColor: "#00ff99",
      borderRadius: 6,
      backgroundColor: "#111",
    }}>
      <Text onPress={()=>{
         setScreen("viewProfile")
      }} style={{
        color: "#00ff99",
        fontSize: 16,
        fontWeight: "bold",
        textShadowColor: "#00ff99",
        textShadowRadius: 12,
      }}>PROFILE</Text>
    </Pressable>
  </View>)
        setText(view)
      }
    
    }
    request.send()
  }, [])
     
 
 /*     useEffect(() => {
   
    updateMessages()
    
  }, []);
  */

  //VIEW msgs
  const ViewMyChats = function(){
    console.log("sssssssssssssssssssss  ")
    let vsArr = []
    console.log("myChatsArr",myChatsArr)
    for(let i=0; i<myChatsArr.length; i++){
      vsArr.push(
        <Text style={{color:"white"}}>
          {myChatsArr[i]?.nickTag}
        </Text>
      )
    }
    return(
      <View>
          <Text style={{color:"white"}}>{vsArr}</Text>
      </View>
    )
  }
  const SendMessageCall =function(receiver){
    console.log("SendMessageCall")
    let elements = []

   async function setScreenFunc(){
     //get public key of the receiver 
      ReceiverPublicKey = await AsyncStorage.getItem(`ReceiverPublicKey${chosenUser}`)
       if(ReceiverPublicKey){
         console.log("Key recovered",ReceiverPublicKey)
        // SaveChats(chosenUser, chosenUserName)

       }
       else{
         console.log("Key not found")
         const ptr2 = new XMLHttpRequest()
         ptr2.open("GET", `http://${serverIp}:4000/getKey/${chosenUser}`)
         ptr2.send()
         ptr2.onreadystatechange = function(){
           if(this.readyState==4 && ptr2.status==200){
             alert(`Received key, make sure it's the actual one!${ptr2.responseText}`)
             AsyncStorage.setItem(`ReceiverPublicKey${chosenUser}`, ptr2.responseText)
             ReceiverPublicKey=ptr2.responseText
             ptr2.onreadystatechange = null; 
             if(!SaveChatsWritten){
              SaveChats(chosenUser, chosenUserName)
              SaveChatsWritten=true
             }
           }
         }
       }     
    }
    setScreenFunc()

    elements.push([
      <Text style={{
        fontSize: 28,
        textAlign: 'center',
        color: 'rgb(96,241,11)',
        fontFamily: 'CourierPrime',
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 8,
        textShadowColor: 'rgba(96,241,11,0.45)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 6,
      }}>
        {(chosenUserName || '').toUpperCase()}
      </Text>,
    
      // Оверлей управления + инпут (осталась та же <View>, только стили)
      <View style={{
        position: 'absolute',
        left: 0, right: 0, top: 0, bottom: 0, // растягиваем, чтобы топ-кнопки реально были сверху
        zIndex: 10,
      }}>
        {/* Back — слева сверху */}
        <View style={{
          position: 'fixed',
          top: 10, left: 10,
          width: 100, height: 38,
          borderRadius: 10,
          overflow: 'hidden',
          borderWidth: 0.1,
          borderColor: 'rgba(96,241,11,0.8)',
          backgroundColor: 'rgba(96,241,11,0.08)',
          justifyContent: 'center'
        }}>
          <Button title='Back' onPress={() => { setScreen("main") }} color='rgb(96,241,11)' />
        </View>
    
        {/* Update — справа сверху */}
        <View style={{
          position: 'fixed',
          top: 20, right: 10,
          width: 110, height: 38,
          borderRadius: 10,
          overflow: 'hidden',
          borderWidth: 0.1,
          borderColor: 'rgba(96,241,11,0.8)',
          backgroundColor: 'rgba(96,241,11,0.08)',
          justifyContent: 'center'
        }}>
          <Button title='Update' onPress={() => {
            getMessages(serverIp, nodeIp, publicKeyMeHex, ReceiverPublicKey, chosenUser, setMessage)
          }} color='rgb(96,241,11)' />
        </View>
    
      </View>
    ]);    
    console.log("called")
    setMessage(array);
    console.log('message type:', typeof message, 'isArray:', Array.isArray(message));
    console.log('message keys:', message && typeof message === 'object' ? Object.keys(message) : null);
    console.log('message full:', message);    
    return (
  <View style={{ flex: 1, backgroundColor: '#0b0b0b', marginTop: 40,  height:"90%" }}>
  
    {/* Fixed header / sender name */}
    <View>
      {elements} {/* this will stay visible */}
    </View>

    {/* Scrollable messages */}
    <ScrollView
      style={{ flex: 1, paddingHorizontal: 10 }}
      contentContainerStyle={{ paddingBottom: 90 }} 
    >
      {message}
    </ScrollView>
    <View style={{
  position: 'absolute',    // если нужно фиксировать внизу экрана
  left: '5%',
  right: '5%',
  bottom: 12,
  flexDirection: 'row',
  alignItems: 'center',
}}>
  <Pressable onPress={function handlePress(){
    //attach media send video image file
    async function fileUriToBase64(uri) {
      fileUrl= await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.UTF8
      });
      console.log("fileUrl:",fileUrl)
    }

    if (Platform.OS === 'web') {
      // web fallback: open native file picker
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*,video/*,audio/*';
      input.onchange = (e) => {
        const file = e.target.files[0];
        fileUrl = URL.createObjectURL(file); // use this as src
        console.log('web file URL', fileUrl);
        fileUriToBase64(fileUrl)
      };
      input.click();
      return;
    }
  
    // native (Android / iOS)
    launchImageLibrary({ mediaType: 'mixed' }, (response) => {
      if (response.didCancel || response.errorCode) return;
      const asset = response.assets[0];
      console.log('native uri', asset.uri);
      fileUrl=asset.uri
      fileUriToBase64(fileUrl)
      // feed asset.uri to your player (react-native-video, react-native-sound, etc.)
    });
  }}
  style={{ color: 'white', fontSize: 24, marginRight: 10 }}>+</Pressable>

  <TextInput
    ref={inputRef}
    onChangeText={text => inputValue = text}
    placeholder="Type message…"
    placeholderTextColor="rgba(255,255,255,0.35)"
    style={{
      flex: 0.8,
      height: 46,
      paddingHorizontal: 12,
      borderWidth: 1.5,
      borderColor: 'rgba(96,241,11,0.85)',
      borderRadius: 12,
      backgroundColor: '#0e0e0e',
      color: 'white',
      fontFamily: 'CourierPrime',
      fontSize: 16,
    }}
  />

  {/* опционально: кнопка Send справа */}
  
</View>

    
        {/* Send — снизу справа (обернул только кнопку в Вью для позиционирования) */}
        <View style={{
          position: 'absolute',
          right: '1%',
          bottom: 12,
          width: 70,
          height: 46,
          borderRadius: 12,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: 'rgba(96,241,11,0.8)',
          backgroundColor: 'rgba(96,241,11,0.08)',
          justifyContent: 'center'
        
        }}>
       <Pressable 
      onPress={()=>{
        if(SendMessage(inputValue, nodeIp, serverIp, chosenUser, ReceiverPublicKey)){
          setTimeout(()=>{updateMessages(setMessage)}, 180)
        }
        inputRef.current.clear()
      }} 
      style={{
        backgroundColor: '#00ff88',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#00ff88',
        shadowOpacity: 0.6,
        shadowRadius: 8,
        elevation: 5
      }}
    >
      <Text style={{color: '#000', fontSize: 18, fontFamily: 'Courier Prime', fontWeight: 'bold'}}>
        SEND
      </Text>
    </Pressable>
     </View>
  </View>
);

        
  }

  const MainScreen =  () => {
    
    return(
      <View style={[styles.container, { flex: 1, padding: 11 }]}>             
        {/*<Text ...>USERS</Text>*/}
        <StatusBar style="auto" />
    
        <ScrollView contentContainerStyle={{ paddingBottom: 90 }}>             
          <View style={[styles.userListFlex, styles.textStyle]}>
            <View style={[styles.textStyle,{ flex:1 }]}>
              { Array.isArray(text) ? text.slice(0, -1) : text }              
            </View>
          </View>
        </ScrollView>
    
        {/* render the last pushed element (your bottom bar) OUTSIDE the ScrollView so it's pinned */}
        { Array.isArray(text) ? text[text.length - 1] : null }               
      </View>
    )}
    
   


 const FirstTime = () =>{
  let [userServerIp, setUserServerIp] = useState('')
  let [userNodeIp, setUserNodeIp] = useState('')
  let [userKey, setUserPrivateKey] = useState('')
  let [userName, setUserName] = useState('')
  let [userNickTag, setUserNickTag] = useState('')
  var key
  useEffect(() => {
    (async () => {
      /*
       serverIp = await AsyncStorage.getItem("serverIp") || ""
       nodeIp = await AsyncStorage.getItem("nodeIp")|| ""
       key = await AsyncStorage.getItem("key")|| ""
       */
       console.log("loaded:", serverIp,nodeIp,key)
       setUserServerIp()
       setUserNodeIp()
       setUserPrivateKey()
    })();
  }, [])

  return (
    <View style={{ flex: 1, backgroundColor: '#000', padding: 20}}>
      <View style={{ width: '100%', maxWidth: 700, alignSelf: 'center'}}>
  
        {/* WELCOME — три слоя для простого глитча (все стили внутри return) */}
        <View style={{ height: 60, justifyContent: 'center', marginBottom: 18,marginTop: "4%" }}>
          <Text style={{
            position: 'absolute',
            fontSize: 44,
            fontFamily: 'monospace',
            color: 'rgb(235, 173, 28)',
            left: Math.random() > 0.85 ? -3 : 0,
            top: Math.random() > 0.9 ? -3 : 0,
            opacity:1,
            textShadowColor: '#ff00ff',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 18,
          }}>0GM</Text>
  

        </View>
  
        {/* Inputs — неоновая рамка, моноширинный вид */}
        <TextInput
          value={userName}
          onChangeText={setUserName}
          placeholder='Your name'
          placeholderTextColor='rgba(255,255,255,0.45)'
          style={{
            borderWidth: 1,
            borderColor: '#ff00ff',
            color: '#fff',
            padding: 12,
            borderRadius: 8,
            marginBottom: 10,
            backgroundColor: 'rgba(255,255,255,0.02)',
            fontFamily: 'monospace'
          }}
        />
  
        <TextInput
          value={userNickTag}
          onChangeText={setUserNickTag}
          placeholder='Your nickname'
          placeholderTextColor='rgba(255,255,255,0.45)'
          style={{
            borderWidth: 1,
            borderColor: '#ff00ff',
            color: '#fff',
            padding: 12,
            borderRadius: 8,
            marginBottom: 10,
            backgroundColor: 'rgba(255,255,255,0.02)',
            fontFamily: 'monospace'
          }}
        />
  
        <TextInput
          value={userServerIp}
          onChangeText={setUserServerIp}
          placeholder='Server Ip'
          placeholderTextColor='rgba(255,255,255,0.45)'
          style={{
            borderWidth: 1,
            borderColor: '#ff00ff',
            color: '#fff',
            padding: 12,
            borderRadius: 8,
            marginBottom: 10,
            backgroundColor: 'rgba(255,255,255,0.02)',
            fontFamily: 'monospace'
          }}
        />
  
        <TextInput
          value={userNodeIp}
          onChangeText={setUserNodeIp}
          placeholder='Storage node server ip'
          placeholderTextColor='rgba(255,255,255,0.45)'
          style={{
            borderWidth: 1,
            borderColor: '#ff00ff',
            color: '#fff',
            padding: 12,
            borderRadius: 8,
            marginBottom: 10,
            backgroundColor: 'rgba(255,255,255,0.02)',
            fontFamily: 'monospace'
          }}
        />
  
        <TextInput
          value={userKey}
          onChangeText={setUserPrivateKey}
          placeholder='Enter your 0x private key'
          placeholderTextColor='rgba(255,255,255,0.45)'
          style={{
            borderWidth: 1,
            borderColor: '#ff00ff',
            color: '#fff',
            padding: 12,
            borderRadius: 8,
            marginBottom: 10,
            backgroundColor: 'rgba(255,255,255,0.02)',
            fontFamily: 'monospace'
          }}
        />
  
        {/* Кнопки — обёртки для неоновой рамки, без дополнительных компонентов */}
        <TouchableOpacity
  style={{
    marginTop: 30,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0ff',
    overflow: 'hidden',
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'transparent',
  }}
  onPress={() => {
    key = secp.utils.randomPrivateKey()
    setUserPrivateKey(bytesToHex(key))
  }}
>
  <Text style={{
    color: 'white',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    textTransform: 'uppercase',  // React Native игнорирует, но оставим для совместимости
    letterSpacing: 1,
    fontSize: 16,
  }}>
    GENERATE 0X KEY
  </Text>
</TouchableOpacity>

<TouchableOpacity
  style={{
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0ff',
    overflow: 'hidden',
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'transparent',
  }}
  onPress={() => {
    setUserServerIp(serverIp)
    setUserNodeIp(serverIp)
  }}
>
  <Text style={{
    color: 'white',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    letterSpacing: 1,
    fontSize: 16,
  }}>
    SET DEFAULT SETTINGS
  </Text>
</TouchableOpacity>

  
      </View>
  
      {/* Save — фикс внизу */}
      <View style={{
        position:"absolute",
        marginTop:110,
        alignSelf: 'center',
        bottom: 18,
        borderRadius: 10,
        borderWidth: 1,
        width:"20%",
        height:"5%",
        borderColor: 'rgba(40, 131, 196, 0.91)',
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.91)'
      }}>
     <TouchableOpacity 
     onPress={()=>{
      setUserSettings(userServerIp, userNodeIp, userKey, userName,userNickTag, publicKeyMeHex)
     // alert("saved")
      setScreen("main")
     }}
      style={{
        bottom: 3,
        borderRadius: 10,
        borderWidth: 1,
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center', // centers text vertically
        borderColor: 'rgba(40, 131, 196, 0.91)',
        overflow: 'hidden',
        backgroundColor: 'rgba(0, 255, 140, 0.91)',
        height: 40 // match old button height
      }}
>
  <Text style={{ color: 'rgb(32, 66, 56)', fontWeight: 'bold', fontFamily:"monospace" }}>CONTINUE</Text>
  </TouchableOpacity>
      </View>
    </View>
  )
    
 }
      
  return (
    //send GET request and fill users
    <View style={{flex:1, backgroundColor:"black"}}>
    {screen === 'main' && <MainScreen />}
    {screen === 'SendMessage' && <SendMessageCall/>}
    {screen === 'firstTime' && <FirstTime/>}
    {screen === 'viewProfile' && <ViewProfileFunc/>}
    {screen === 'viewMyChats' && <ViewMyChats/>}

    
  </View>
  );



 
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  userListFlex:{
    width:'100%',
    flexDirection:'row',
    borderColor:'white',
    borderRadius: 14,
    borderWidth: 0,
    height:70,
    paddingTop:10,
    marginBottom:13,
    borderStyle:"solid",
    backgroundColor: 'rgba(43, 42, 42, 0.8)',
  },
  FirstTime:{

  },
  textStyle:{
    color : 'white',
    fontFamily: "CourierPrime",
  }
});
