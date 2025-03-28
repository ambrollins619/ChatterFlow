import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, doc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore";
import { toast } from "react-toastify";
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
  projectId: "YOUR_FIREBASE_PROJECT_ID",
  storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
  appId: "YOUR_FIREBASE_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username, email, password) => {
  try{
    const res= await createUserWithEmailAndPassword(auth, email, password);
    const user= res.user;
    await setDoc(doc(db,"users",user.uid),{
      id: user.uid,
      username: username.toLowerCase(),
      email,
      name:"",
      avatar:"",
      bio:"Hey, There I am using chat app",
      lastSeen: Date.now()
    });
    await setDoc(doc(db,"chats",user.uid),{
      chatsData:[]
    })
  } catch(error){
      console.error(error);
      toast.error(error.code.split('/')[1].split('-').join(' '));
  }
}

const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch(error) {
    console.error(error);
    toast.error(error.code.split('/')[1].split('-').join(' '));
  }
}

const logout = async () => {
  try {
    await signOut(auth);
    
  } catch (error) {
    console.error(error);
    toast.error(error.code.split('/')[1].split('-').join(' '));
  }
}

const resetPass = async(email) => {
  if(!email){
    toast.error("Enter you email");
    return null;
  }
  try {
    const userRef = collection(db,"users");
    const q = query(userRef, where("email","==",email));
    const querySnap = await getDocs(q);
    if(!querySnap.empty) {
      await sendPasswordResetEmail(auth,email);
      toast.success("Reset email Sent");
    } else {
      toast.error("Email doesn't exist");
    }
  } catch (error) {
    console.error(error);
    toast.error(error.message);
  }
}

export {signup, login, logout, resetPass, auth, db};