# 0GSnitch
1. Create db then 2 tables

CREATE TABLE users(
 itsId INT(40) PRIMARY KEY AUTO_INCREMENT,
 itsName VARCHAR(40),
 itsUserName VARCHAR(40),  
 itsWalletAddress VARCHAR(50),
 itsPublicKey VARCHAR(130),
 itsBio VARCHAR(140)
);

CREATE TABLE messages(
  itsRootId VARCHAR(122),
  itsSender  VARCHAR(122),
  itsRandomNum VARCHAR(65),
  itsTime TIMESTAMP,
  itsReceiver  VARCHAR(122)); 



install dependencies, run server.js then npx expo start

Documentation will be updated to a normal one asap
