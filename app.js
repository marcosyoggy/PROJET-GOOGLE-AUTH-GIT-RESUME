import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDeIVAV3rbBNzW-nK0hRfFI_y4G81CVui0",
  authDomain: "projeto--autentication.firebaseapp.com",
  projectId: "projeto--autentication",
  storageBucket: "projeto--autentication.appspot.com",
  messagingSenderId: "414058497769",
  appId: "1:414058497769:web:4b5be16b369a6d91fdd278",
  measurementId: "G-F1C3PWC4Y4"
};

const app_Firebase = initializeApp(firebaseConfig);
const provider = new  GoogleAuthProvider()
const auth = getAuth(app_Firebase);
const db = getFirestore(app_Firebase)
const collection_Ref = collection(db, 'frases-de-filmes')


const ul_NavBar = document.querySelector('[data-js="nav-ul"]')
const link_Login = document.querySelector('[data-js="logged-out"]')
const link_Add_Phrase = document.querySelector('[data-target="modal-add-phrase"]')
const modal_Form = document.getElementById('modal-add-phrase')
const add_Central_Phrase = document.querySelector('[data-js="container-phrase"]')
const button_To_Google = document.querySelector('[data-js="button-to-google"]')
const account_Details = document.querySelector('[data-js="account-details"]')
const modal_Login = document.getElementById('modal-login')
const form = document.querySelector('[data-js="add-content"]')
const ul_Phrases = document.querySelector('[data-js="phrases-list"]')
const logout = document.querySelector('[data-js="logout"]')

const h6 = document.createElement('h6')


const show_Phrase_In_Logout = () => {

  h6.classList.add('center-align')
  h6.textContent = "Faça login para ver as frases"
  add_Central_Phrase.insertAdjacentElement('afterbegin', h6)
}
show_Phrase_In_Logout()

const array_Links = [...ul_NavBar.children]

const modals_Init = () => {
const modals = document.querySelectorAll('[data-js="modal"]')
M.Modal.init(modals)
}

const handler_Modals = () => {
    modal_Form.classList.toggle('hide')
}

link_Login.addEventListener('click', () => {
  h6.classList.add('hide')
  modals_Init()
})

link_Add_Phrase.addEventListener('click', () => {
  modal_Form.classList.remove('hide')
})

const set_Accordions = () => {
  const lis = document.querySelectorAll('.collapsible')
  M.Collapsible.init(lis)
}

const hide_Modal_Login = () => {
  modal_Login.classList.add('hide')
}

const add_Count = (name, email) => account_Details.textContent = `${name} | ${email}`

const confirm_Auth_And_Add_Count = async () => {
  try {
    const result = await signInWithPopup(auth, provider)
    add_Count(result.user.displayName, result.user.email)
 
  } catch (error) {
    console.log(error.message)
  }
}

const show_Others_Links = () => {
  array_Links.forEach( link => {
    link.dataset.js === 'logged-out' 
      ? link.classList.add('hide')  
      : link.classList.remove('hide')
  })
}

const input_Phrases = (title, phrase) => {
  const li = document.createElement('li')
  const divBody = document.createElement('div')
  const divHeader = document.createElement('div')

  li.setAttribute('data-js', 'collpased-text')

  divHeader.classList.add('collapsible-header', 'white-text', 'black')
  divBody.classList.add('collapsible-body', 'black-text', 'white')

  divHeader.textContent = title
  divBody.textContent = phrase

  li.append( divHeader, divBody)
  ul_Phrases.append(li)
}

const storeDataFilms = async (title, phrase) => {
  try{
    console.log('DISPARO....ADD_DOC!!!')
    const result = await addDoc(collection_Ref, {
      title: `${title}`,
      phrase: `${phrase}`
    })
  } catch (error) {
    alert(error.message)
  }
}

const update_DB = () => {
  onSnapshot( collection_Ref, querySnapshot => {
    
      if( ! querySnapshot.metadata.hasPendingWrites){
         querySnapshot.docs.forEach((doc) => {
          
           const {title, phrase} = doc.data()
           input_Phrases(title, phrase)

         })
      }
    })
  }
 
button_To_Google.addEventListener('click', () => {
  confirm_Auth_And_Add_Count()
  show_Others_Links()
  hide_Modal_Login()
  update_DB()
})
                                          
const handler_Data = event => {
  event.preventDefault()

  const title = event.target.title.value
  const phrase = event.target.phrase.value

  input_Phrases(title, phrase)
  storeDataFilms(title, phrase)
  handler_Modals()

  form.reset()
}

set_Accordions()

form.addEventListener('submit', handler_Data)
logout.addEventListener('click', () => {
  location.reload('localhost')
})
