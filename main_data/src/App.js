import { useState, useEffect } from 'react';



const App=()=> {
    const [value, setValue] = useState(null)
    const [message, setMessage] = useState(null)
    const [previousChats, setPreviousChats] = useState([])
    const [currentTitle, setCurrentTitle] = useState(null)


  const createNewChat =()=>
  {
    setMessage(null)
    setValue("")
    setCurrentTitle(null)
  }

  const handleClick = (uniqueTitle)=>
  {
    setCurrentTitle(uniqueTitle)
    setMessage(null)
    setValue("")
  }


  const getMessages = async ()=>{
    const options={
      method:"POST",
      body:JSON.stringify({
        message:value,
    }),
      headers:{
          "Content-Type":"application/json"
      },
  }
    try{
      const response = await fetch('http://localhost:8000/completions',options)
      const data= await response.json();
      setMessage(data.choices[0].message);
    }
    catch(error)
    {
      console.error(error);
    }
  
  }

  useEffect(()=>{
    console.log(currentTitle,value,message)
    if(!currentTitle && value && message)
    {
      setCurrentTitle(value)
    } 
    if(currentTitle && value && message)
    {
      setPreviousChats(prevChats => (
        [...prevChats,
            {
              title:currentTitle,
              role:"user",
              content:value
            },
          {
              title:currentTitle,
              role:message.role,
              content:message.content
          }]
      )
        )
    } 

  }, [message, currentTitle])


  console.log(previousChats);

  const currentChat = previousChats.filter(previousChat=> previousChat.title === currentTitle)
  const uniqueTitles = Array.from(new Set(previousChats.map(previousChat=>previousChat.title)))
  console.log(uniqueTitles)

  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={createNewChat}>+ New chat</button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitle,index)=><li key={index} onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
        </ul>
        <nav>
          <p>Developed by Utkarsh</p>
        </nav>
      </section>
      <section className="main">
        {!currentTitle && <h1>TurboTalk</h1>}
        <ul className="feed">
  {currentChat?.map((chatMessage, index) => (
    <li key={index} className="chat-item">
      <img
        src={chatMessage.role === 'user' 
          ? 'https://i.pinimg.com/originals/e2/7c/87/e27c8735da98ec6ccdcf12e258b26475.png' 
          : 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg'}
        alt="Role Icon"
        className="role-icon"
      />
      <p className='data'>{chatMessage.content}</p>
    </li>
  ))}
</ul>

        <div className="botttom-section">
          <div className="input-container">
            <input value={value} onChange={(e)=>setValue(e.target.value)}/>
            <div id="submit" onClick={getMessages}>➤</div>
          </div>
          <p className="info">
          Free Research Preview. ChatGPT may produce inaccurate information about people, places, or facts.
          </p>
        </div>
      </section>
    </div>
  )
}

export default App;
