DEMO https://x.com/lighnero/status/1945827807801524639

# 📖 Project Setup Guide — *0GSnitch*

## 1️⃣ Create the MySQL Database

1. Log into MySQL:

   ```bash
   mysql -u root -p
   ```
2. Create a new database named **`snitch`**:

   ```sql
   CREATE DATABASE snitch;
   USE snitch;
   ```

---

## 2️⃣ Create Tables

Run the following SQL commands inside the `snitch` database:

```sql
-- Users Table
CREATE TABLE users (
  itsId INT(40) PRIMARY KEY AUTO_INCREMENT,
  itsName VARCHAR(40),
  itsUserName VARCHAR(40),
  itsWalletAddress VARCHAR(50),
  itsPublicKey VARCHAR(130),
  itsBio VARCHAR(140)
);

-- Messages Table
CREATE TABLE messages (
  itsRootId VARCHAR(122),
  itsSender VARCHAR(122),
  itsRandomNum VARCHAR(65),
  itsTime TIMESTAMP,
  itsReceiver VARCHAR(122)
);
```

---

## 3️⃣ Install Dependencies

In the project root, install required Node.js packages:

```bash
npm install
```

---

## 4️⃣ Start the Backend Server
Change the  key for tx-fee in server.js 
Run the Node.js server:

```bash
node server.js
```

---

## 5️⃣ Launch the Mobile App

Navigate to the **`snitch/`** folder and start Expo:

```bash
cd snitch
npx expo start
```

This will launch the development server for the React Native app.
Use the Expo app (on Android/iOS) to scan the QR code and run the app.

---

✅ Your project is now up and running!


Documentation will be updated to a normal one asap
