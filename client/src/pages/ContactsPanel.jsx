import React from 'react'
import {mockContacts} from '../assets/dummydata'

// const mockContacts = [
//   {
//     uid: "firebase_user_uid_002",
//     name: "Alice Smith",
//     email: "alice@fuzzie.app",
//     status: "online",
//     customStatus: "Coding away... 🚀"
//   },
//   {
//     uid: "firebase_user_uid_003",
//     name: "Charlie Brown",
//     email: "charlie@fuzzie.app",
//     status: "offline",
//     customStatus: "Out for lunch"
//   },
//   {
//     uid: "firebase_user_uid_004",
//     name: "Dana Scully",
//     email: "dana@fuzzie.app",
//     status: "online",
//     customStatus: "The truth is out there"
//   }
// ];
const ContactsPanel = () => {

  return (
    <div>
      {mockContacts.map((contact)=>(
        <div key={contact.uid} className='text-white'>
          <span className='text-2xl'>{contact.name}</span>
          <p className='text-xs'>{contact.email}</p>
          <p className='text-xs'>{contact.status}</p>
          <p className='text-xs'>{contact.customStatus}</p>
        </div>
      ))}
    </div>
  )
}

export default ContactsPanel