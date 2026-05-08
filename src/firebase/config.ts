import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyCEKPNoiKsIgzimxBq3cHXjLUGir2tHidw",
    authDomain: "q-ruta-8b75c.firebaseapp.com",
    projectId: "q-ruta-8b75c",
    storageBucket: "q-ruta-8b75c.firebasestorage.app",
    messagingSenderId: "429754466135",
    appId: "1:429754466135:web:8952329667ef496e814812",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)