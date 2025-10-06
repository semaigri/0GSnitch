import AsyncStorage from "@react-native-async-storage/async-storage"

export async function loadMessages(id){
  return await JSON.parse(AsyncStorage.getItem("1"))
} 

