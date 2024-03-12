import { useState } from 'react';
import './index.css'

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];





export default function App(){

    const [showAddFriend,setShowAddFriend] = useState(false);
    const [friend,setFriend] = useState(initialFriends);
    const [selectedFriend,setSelectedFriend] = useState(null)

    function handleShowAddFriend(){
      return setShowAddFriend(showAddFriend => !showAddFriend)
    }

    function handleAddFriend(friend){
      
      setFriend((friends)=> [...friends,friend])
      setShowAddFriend(false);
    }

    function handleSelection(friend){
      setSelectedFriend((cur)=> cur?.id === friend.id?null:friend)
       setShowAddFriend(false)

    }

      function handleSplitBill(value){
          setFriend((friends)=>
          friends.map((friend) =>
          friend.id === selectedFriend.id ?
          {...friend, balance: friend.balance + value}
          : friend)
          
          
          )

      }

  return(
    <div className='app'>
    <div className='sidebar'>
      <FriendsList
       friends={friend} 
       onSelection={handleSelection}
       selectedFriend={selectedFriend}
       />
      {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
      <Button onClick={handleShowAddFriend}>{showAddFriend===false ? 'Add Friend': 'cancel'}</Button>
    </div>
    {selectedFriend&&<FormSplitBill selectedFriend={selectedFriend} onSplitBill={handleSplitBill}/>}
    </div>

  )
}



function FriendsList({friends,onSelection,selectedFriend}){
//  const friends = initialFriends;
  
  return(
    <ul>
    {friends.map((friend)=> <Friend friends={friend} key={friend.id} onSelection={onSelection} selectedFriend={selectedFriend}/>)}
   
    </ul>
  )
}



function Friend ({friends,onSelection,selectedFriend}){

    const isSelected = selectedFriend?.id===friends.id;

     console.log(isSelected)

    return(

    <li className={isSelected ? 'selected':''}>
      <img src={friends.image} alt='dp'/> 
      <h3>{friends.name}</h3>
     

     {friends.balance<0&&<p className='red'>You owe {friends.name} {Math.abs(friends.balance)}$</p>}
     {friends.balance >0&&<p className='green'>{friends.name} owes you {friends.balance}</p>}
     {friends.balance===0&&<p>{friends.name} are even</p>}
     <Button onClick={()=>onSelection(friends)}>{isSelected?'Close':'Select'}</Button>
    </li>
   

  )
}


function FormAddFriend({onAddFriend}){
const [name, setName] = useState('')
const [image,setImage] = useState('https://i.pravatar.cc/48');



function handleSubmit(e){
e.preventDefault();

if(!name||!image) return;

const id = crypto.randomUUID
const newFriend= {
  id,
  name, 
  image: `${image}?=${id}`,
  balance: 0,
}

onAddFriend(newFriend)
setImage('https://i.pravatar.cc/48')
setName('')

}
  return(
   <form className='form-add-friend' onSubmit={handleSubmit}>
      <label>Friend Name</label>
      <input type='text' value={name} onChange={e=>setName(e.target.value)}/>

      <label>🖼 Image Url</label>
        <input type='text' value={image} onChange={e=>setImage(e.target.value)}/>
        <Button>Add</Button>
   </form>
  )
}


function Button({children,onClick}){
  return <button className='button' onClick={onClick}>{children}</button>
}



function FormSplitBill({selectedFriend,onSplitBill}){
    const [bill,setBill] = useState('')
    const [paidByUser, setpaidByUser] = useState('')
    const paidByFriend = bill?bill - paidByUser:''
    const [whoIsPaying, setWhoIsPaying] = useState('user')

    function handleSubmit(e){
      e.preventDefault();

      if(!bill || !paidByUser) return;

        onSplitBill(whoIsPaying==='user' ? paidByFriend:-paidByUser);
    }


    
  return(
    <form className='form-split-bill' onSubmit={handleSubmit}> 
      <h2>Split the bill with {selectedFriend.name}</h2>
      
      <label>Bill Value</label>
      <input type='number' value={bill} onChange={(e)=>setBill(Number(e.target.value))}/>

      <label>Your Expense</label>
      <input type='number' value={paidByUser} onChange={(e)=>setpaidByUser(Number(e.target.value) >bill ? paidByUser : Number(e.target.value))}    />

      <label>Expense of {selectedFriend.name}</label>
      <input type='text' value={paidByFriend}disabled />


      <label>🤑 Who is paying the bill</label>

      <select value={whoIsPaying} onChange={(e)=>setWhoIsPaying(e.target.value)}>
        <option value='user'>You</option>
        <option value='friend'>{selectedFriend.name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  )
}













