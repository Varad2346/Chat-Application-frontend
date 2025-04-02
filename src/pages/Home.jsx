import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { connectSocket } from "../services/socket";
import { useNavigate } from 'react-router-dom'; // for navigation
import { useAuth } from "../store/auth.jsx"; // Import useAuth for authentication

import {
  faCog,
  faArrowUp,
  faSearch,
  faBars,
  faPlus,
  faStar,
  faEnvelope,
  faSignOut,
  faUserPlus,
  faEllipsisV,
} from "@fortawesome/free-solid-svg-icons";

import "./Home.css";
import Addform from "./Addform.jsx";
const Home = () => {
  // const { userId } = useAuth(); // Get authentication state

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [rooms, setrooms] = useState([]);
  const [roomDetails, setroomDetails] = useState([]);
  const [userData, setuserData] = useState(null);
  const [selected, setselected] = useState(false);
  const socketRef = useRef(null); // Using ref to store the socket instance
  const msgBoxRef = useRef(null); // Ref for the messages container
  const [senderId, setsenderId] = useState(null);
  const [typingUser, settypingUser] = useState([]);
  const [createRoomToggle, setcreateRoomToggle] = useState(false)
  const [RoomName, setRoomName] = useState(null)
  const [addParticipants, setaddParticipants] = useState(false);
  const [cnt, setcnt] = useState(0);
  const navigate = useNavigate();

  // Fetch rooms
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("https://chat-application-dvs1.onrender.com/api/rooms/get", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setrooms(data.rooms);
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };


  useEffect(() => {
    const socket = connectSocket();
    socketRef.current = socket;
    const decodeToken = (token) => {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload;
      } catch (error) {
        console.error("Error decoding token", error);
        return null;
      }
    };
    const token = localStorage.getItem("token");
    let userData = decodeToken(token);
    if (userData) setuserData(userData);
    socket.on("receiveMessage", (newMsg) => {
      if (true) {
        setMessages((prev) => [
          ...prev,
          {
            ...newMsg,
            type: "received",
          },
        ]);
      }
    });
   
    socket.on("previousMessages", (messages) => {
      // Update the state to display previous messages in the chat window
      setMessages(
        messages.map((msg) => ({
          senderName: msg.senderName,
          content: msg.content,
          timestamp: msg.timestamp,
          sender: msg.sender,
          type: "received",
          sendTime: msg.sendTime,
        }))
      );
    });

    // Handle the "userJoined" event
    socket.on("userJoined", (data) => {
      console.log("SOMEONE",data);
      setcnt(prevCnt => prevCnt + 1); 
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    const decodeToken = (token) => {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload;
      } catch (error) {
        console.error("Error decoding token", error);
        return null;
      }
    };
    const token = localStorage.getItem("token");
    let userData = decodeToken(token);
    if (userData) setuserData(userData);
   
    fetchData();
  }, []);

  const handleRoomSelect = (room) => {
    const socket = socketRef.current;
    setroomDetails(room);
    setselected(true);

    if (socket) {
      socket.emit("joinRoom", room.id, userData.username);
    }
  };

  useEffect(() => {
    if (msgBoxRef.current) {
      msgBoxRef.current.scrollTop = msgBoxRef.current.scrollHeight;
    }
  }, [messages]); // Run this effect whenever the `messages` state changes

  const sendMessage = () => {
    try {
      if (!message.trim()) return;

      const socket = socketRef.current;
      const newMessage = {
        content: message,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: "sent",
      };

      if (socket) {
        socket.emit("sendMessage", {
          roomId: roomDetails.id,
          content: message,
          timestamp: newMessage.timestamp,
          username: userData.username,
        });
        // setMessages((prev) => [...prev, newMessage]);
        setsenderId(userData.id);
        setMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addParticipant=()=>{
    setaddParticipants((prev)=>!prev);
  }
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const handleChange=(e)=>{
    console.log(e.target.value);
    const socket = socketRef.current;
    socket.emit("typing", roomDetails.id, userData.username);
    socket.on("typing-user",(roomId,username)=>{
      settypingUser({roomId,username});
    })
    setMessage(e.target.value);
  }

  const handleLogout=()=>{
    localStorage.removeItem("token")
      navigate("/")
  }

  const handleCreateRoom=()=>{
    console.log("clicked");
   setcreateRoomToggle((prev)=>!prev);
  }

  // Room create api
  const roomCreate=async()=>{
    try {
      const token = localStorage.getItem("token"); 
      if (!token) {
        throw new Error("No authentication token found");
      }
      if(RoomName.length<=0){
        return new Error("Room name must be given!");
      }
      const response = await fetch("https://chat-application-dvs1.onrender.com/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token in headers
        },
        body:JSON.stringify({name:RoomName}),
      });
      console.log(response);
      if (response.ok) {
        const data=response.json();
        console.log("room created",data);
        fetchData();  // Calling fetchData to get the updated list of rooms

      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  }








  return (
    <div className="main-container">
      <div className="sidebar">
        <div className="sidebar-left">
          <FontAwesomeIcon
            icon={faBars}
            style={{
              backgroundColor: "inherit",
              margin: "14px 15px 0px 20px",
            }}
            size="2x"
            color="white"
          />
          <div className="sidebar-left-icons">
            <FontAwesomeIcon icon={faPlus}  onClick={handleCreateRoom} size="2x" color="green" />
            <FontAwesomeIcon icon={faStar} size="2x" color="gold" />
            <FontAwesomeIcon icon={faEnvelope} size="2x" color="blue" />
            <FontAwesomeIcon icon={faCog} size="2x" color="gray" />
          </div>
          <div className="sidebar-logout-button" onClick={handleLogout}>

          <FontAwesomeIcon
            icon={faSignOut}
            style={{
              backgroundColor: "inherit",
              margin: "0px 15px 30px 20px",
            }}
            size="2x"
            color="white"
            />
            </div>
        </div>

        <div className="sidebar-right">

           


          <div className="search-element">
            <FontAwesomeIcon
              icon={faSearch}
              style={{
                backgroundColor: "inherit",
                margin: "0px 15px 0px 20px",
              }}
              size="1x"
              color="white"
            />
            <input
              className="search-element-input"
              type="text"
              placeholder="Search"
            />
          </div>
        
          <div className="list-section">
                {/* Room creation Form */}
                {
                  createRoomToggle && <div className="room-creation-form ">
                  <input type="text"  className="room-create-input" onChange={(e)=>setRoomName(e.target.value)} />
                  <button className="room-create-button" onClick={roomCreate}>Create Room</button>
                </div>
                }
             
              {/*  */}
            {rooms
              .filter((room) => room.participants.includes(userData.id))
              .map((room, index) => (
                <div
                  className="room"
                  key={index}
                  onClick={() => handleRoomSelect(room)}
                >
                  <div className="room-icon-area">
                    <img src="user.png" className="room-icon" alt="" />
                  </div>
                  <div className="room-section">
                    <div className="room-name">{room.name} </div>
                    <div className="room-about">
                      Group for chat and other discussions
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
   
      
      {!selected && (
        <div className="feedback-content-container"  style={{color:"white"}}>

           <div className="feedback-content">
                  <h1 className="feedback-content-heading">Chatify.</h1>
                  <p className="feedback-content-para1">We'd like to know your thoughts about this app</p>
                  <p className="feedback-content-para2">Please provide feedback by using the button located at the bottom left</p>
           </div>
         
        </div>
      )}

      
      {selected && (
        <div className="main-content">
           {
               addParticipants && <Addform roomDetails={roomDetails}/>
              }
          <div className="chat-container">
            <div className="room-info">
              <img className="room-info-icon" src="user.png" alt="" />
              <div className="room-info-name">{roomDetails.name}</div>
              <div style={{color:"white"}} className="active-members">{`${cnt} members active`}</div>
              {console.log(cnt)}
              <div className="room-info-options">
                <FontAwesomeIcon
                  icon={faUserPlus}
                  onClick={addParticipant}
                  style={{
                    backgroundColor: "inherit",
                    margin: "0px 5px 0px 30px",
                  }}
                  size="1x"
                  color="gray"
                />
                <FontAwesomeIcon
                  icon={faEllipsisV}
                  style={{
                    backgroundColor: "inherit",
                    margin: "0px 15px 0px 20px",
                  }}
                  size="1x"
                  color="gray"
                />
              </div>
            </div>
            <div className="msg-box">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message ${
                    message.type === "received" && message.sender != userData.id
                      ? "received"
                      : "sent"
                  }`}
                >
              
                  <p className="message-sender-name">
                    {message.sender != userData.id
                      ? `${"~"}${message?.senderName}`
                      : ""}
                  </p>
                  <p className="message-content ">{message?.content}</p>
                  <p
                    className={`message-timestamp ${
                      message.type === "received" &&
                      message.sender != userData.id
                        ? "received"
                        : "sent"
                    }`}
                    style={{ color: "grey" }}
                  >
                    {message?.sendTime}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="msg-input">
            <input
              type="text"
              placeholder="Enter your message"
              className="msg-input-ele"
              value={message}
              onKeyPress={handleKeyPress}
              onChange={(e) => handleChange(e)}
            />
            <button
              type="submit"
              className="submit-button"
              onClick={sendMessage}
            >
              <FontAwesomeIcon
                icon={faArrowUp}
                style={{
                  backgroundColor: "inherit",
                }}
                size="2x"
                color="white"
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
