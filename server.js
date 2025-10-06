import * as secp from '@noble/secp256k1';
import  express from 'express'
const app = express()
import mysql from "mysql"
import {exec} from 'child_process'
import { stderr } from 'process'
import https from 'https';
import fs, { cpSync } from "fs"
import crypto, { randomBytes, sign } from "crypto"
import cors from 'cors'
import { secp256k1 } from 'ethereum-cryptography/secp256k1';
import { bytesToHex, hexToBytes, utf8ToBytes} from "ethereum-cryptography/utils"
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { Indexer, ZgFile,getFlowContract } from '@0glabs/0g-ts-sdk';
import { ethers } from 'ethers';
import { exit } from 'process';
const mysqlDb =  mysql.createConnection({
  host: "127.0.0.1",
  password: "",
  user: "root",
  database: "snitch"
})
app.use(express.json({limit: '50mb'}))
const SECRET = randomBytes(32)
const YOUR_KEY="" //SET YOUR KEY
let verifiedUsers = []
let usersArray = []
app.use(express.json()); 
app.use(cors());

async function updateUsers(){
  mysqlDb.query("SELECT * FROM users;", (err,res)=>{
    usersArray = res
    console.log(res)
  })
}
updateUsers()
app.get("/getListOfUsers", (req,res)=>{
   res.end(JSON.stringify(usersArray))
   console.log((JSON.stringify(usersArray))
  )
})

app.post("/sendMessage", (req,res)=>{
 console.log(req.body.iv)
 let hash = req.body.hash
 let senderKey = req.body.senderKey
 let signature = req.body.signature
 let receiverKey = req.body.receiverKey
 let message = JSON.parse(req.body.message)
 let msgType = req.body.msgType
 const messageArray = JSON.parse(req.body.message);
 console.log("Msg hash:",hash, "public key: ", senderKey, receiverKey, "msgcontent:", message)
 console.log("msgType:",msgType)
 //verify signature and procceed
 const isSigned = secp256k1.verify(hexToBytes(JSON.parse((signature))), hash, senderKey);
 console.log("isSigned:",isSigned)
 if(isSigned){
  let randomFileName = "Filenum"+(Math.floor((Math.random() * 1000000) + 1))
  fs.writeFile(`${randomFileName}`, Buffer.from(messageArray), (err)=>{
   if(!err){
     console.log(randomFileName)
     let rootId, i=0
     async function uploadFile(){
     while(!rootId && i<=5){
      console.log("executing1")
      rootId=await new Promise((resolve)=>{
        console.log("executing2")
       // randomFileName = "downloadFilenum712639"
        exec(`./0g-storage-client upload --url https://evmrpc-testnet.0g.ai  --key ${YOUR_KEY} --indexer https://indexer-storage-testnet-turbo.0g.ai  --file ${randomFileName}  --fee 0.01`,(err,stdout, stderr)=>{
            console.log("FINISHED")
            if (err) {
              console.error(`Exec error: ${err.message}`)
              //call second time
              resolve();
            }
            if (stderr) {
              console.error(` warning: ${stderr}`);
            }
            const marker = "file uploaded, root = ";
            const idx = stderr.indexOf(marker);
            rootId = idx !== -1 ? stderr.substring(idx + marker.length) : null;
            if(rootId)rootId = rootId.replace("\n", "")
         //   if(!rootId)console.log("couldn't upload")
            console.log("root:",rootId)
         if(!rootId){console.log("uploading failed",i, err.message);return}
         mysqlDb.query(`INSERT INTO messages VALUES("${rootId}", "${senderKey}", "${req.body.iv}", "${ new Date().toISOString().slice(0, 19).replace('T', ' ')  
         }", "${receiverKey}", "${msgType}");`, (err,result)=>{
           if(!err && result.affectedRows>0){
             console.log("Pasted")
             fs.rename(`${randomFileName}`, `${rootId}`, (err)=>{if(err){console.log(err)}else{console.log("renamed")}})
           }
           else{
             console.log(err)
           }
         })
         res.set('Content-Type', 'text/plain; charset=utf-8');
         res.end(rootId)
    
         resolve (rootId)
        })
      })
      }
     }
     uploadFile()
     
   }
   else{console.log("failed to write file")}
  });
 }
})

 
app.get("/getKey/:anyId", (req, res)=>{
  console.log(req.params.anyId)
  mysqlDb.query(`SELECT * FROM users WHERE itsId=${req.params.anyId};`, (err,result)=>{
 
    if(!err && result[0]){
      console.log("yes:",result[0]?.itsPublicKey)
      res.end(result[0].itsPublicKey)
    }
    else{
      res.end("404")

    }
  })
})


//respond with message content
app.get("/scanMessages", (req,res)=>{
  let senderKey = req.headers["sender"]
  let receiverKey = req.headers["receiver"]
  console.log("senderKey:",senderKey, "receiver:", receiverKey)
mysqlDb.query(
  `SELECT * FROM messages 
   WHERE (itsSender="${senderKey}" AND itsReceiver="${receiverKey}") OR (itsSender="${receiverKey}" AND itsReceiver="${senderKey}") ORDER BY itsTime ASC;`,
  (err, result) => {    if(err)console.log(err)
    else if(result[0]){
      console.log("found")
      let filesArr = []
      async function downloadFiles(){
        console.log("Total messages:", result.length)
        for(let i=0; i<result.length; i++){
          console.log(result[i])
          let rootId = result[i].itsRootId
          let randomFileName = rootId
          if(fs.existsSync(`${randomFileName}`)){
            console.log("file in the dir")
          }
          else{
            await new Promise((resolve)=>{
              randomFileName = "Filenum"+(Math.floor((Math.random() * 1000000) + 1))
              result[i].itsRootId = "downloadFilenum712639"
             exec(`./0g-storage-client download --indexer https://indexer-storage-testnet-turbo.0g.ai --root ${result[i].itsRootId} --file ${randomFileName}
       `, (err,stdout, stderr)=>{
         if(err)console.log(err)
         if(stdout)console.log(stdout)
         if(stderr)console.log(stderr)
           fs.rename(`${randomFileName}`, `${rootId}`, (err)=>{if(err){console.log(err)}else{console.log("renamed");randomFileName=rootId}})
           resolve(randomFileName)
         })
         })  
         //end of await 
          }//end of if
          
        await new Promise((resolve)=>{
          fs.readFile(`${randomFileName}`, (err,data)=>{
            if(data){
              let type
              
              if(result[i].itsType=="image"){console.log("img");type="image"}
              else if(result[i].itsType=="video"){console.log("img");type="video"}
              else if(result[i].itsSender == senderKey){console.log("HAPPENED");type="sent"}
              else {console.log("HAPPENED2");type="received"}
            filesArr[i] = {
              msg: data,
              iv: result[i].itsRandomNum,
              time: result[i].itsTime,
              rootId:result[i].itsRootId,
              msgType: type,
            }//.toString('utf8');
            console.log("filesArr,", filesArr[i])
              if(result.length == i+1){
                console.log("ended")
                res.set("Access-Control-Expose-Headers", "found");
                res.set("found", "yes")
                res.json(filesArr)
                resolve(randomFileName)
              }
              else{
                res.set("Access-Control-Expose-Headers", "found");
                res.set("found", "no")
                resolve(randomFileName)
              }
  
            }
            else{
              resolve("")
            }
        })

        })
        

        }
       
      }
      downloadFiles()
    }
    else{
      console.log("err || nf")
    }
  })
 // res.end()
})

app.get("/challenge", (req, res) => {
  const publicKey = req.headers["publickey"];
  const challenge = crypto.randomBytes(32).toString("hex");
  verifiedUsers.push({ publicKey, challenge });
  res.send({ challenge });
});



app.get("/verify", (req, res)=>{
  const publicKey = req.headers['publickey'];
  const signatureHex = req.headers['signature'];
  const found = verifiedUsers.find(u => u.publicKey === publicKey);
  if (!found) return res.status(400).send("no challenge for this key");

  // Convert hex to Uint8Array
  const challengeBytes = hexToBytes(found.challenge);
  const signatureBytes = hexToBytes(signatureHex);
  const publicKeyBytes = hexToBytes(publicKey);

  // Verify using noble
  const isValid = secp.verify(signatureBytes, challengeBytes, publicKeyBytes);

  if (isValid) {
    const token = jwt.sign({ publicKey }, SECRET, { expiresIn: "1h" });
    res.send({ token });
  } else {
    res.status(401).send("invalid signature");
  }
})

app.get("/signUp", (req,res)=>{
  const userName=req.headers['username']
  const userNickTag=req.headers['usernicktag']
  const publicKey=req.headers['publickey']

  console.log("publicKey", publicKey)
  console.log(userName,userNickTag,publicKey)
  mysqlDb.query(`INSERT INTO users VALUES(0, "${userName}", "${userNickTag}", "NULL", "${publicKey}", "--");`, (err,result)=>{
    if(!err && result.affectedRows>0){
      console.log("User signed up", publicKey)
      updateUsers()
    }
    else{
      console.log(err)
    }
  })
})
/*
const options = {
  key: fs.readFileSync('/root/private.key'),
  cert: fs.readFileSync('/root/certificate.crt')
};

https.createServer(options, app).listen(4000, () => {
  console.log('HTTPS API running on 4000');
});*/
app.listen(4000,"0.0.0.0",()=>{
console.log("ye")
})

async function testUPload(){
  //calculate root hash
const file = await ZgFile.fromFilePath("test.txt");
var [tree, err] = await file.merkleTree();
if (err === null) {
  console.log("File Root Hash: ", tree.rootHash());
} else {
  return
}

  const evmRpc = 'https://evmrpc-testnet.0g.ai';
  const privateKey = YOUR_KEY; // with balance to pay for gas
  const indRpc = 'https://indexer-storage-testnet-turbo.0g.ai'; // indexer rpc
  
  const provider = new ethers.JsonRpcProvider(evmRpc);
  const signer = new ethers.Wallet(privateKey, provider);
  
  const indexer = new Indexer(indRpc);
  // need to pay fees to store data in storage nodes
  var [tx, err] = await indexer.upload(file, evmRpc, signer);
  if (err === null) {
    console.log("File uploaded successfully, tx: ", tx);
  } else {
    console.log("Error uploading file: ", err);
  }
  file.close()
}
//testUPload()  