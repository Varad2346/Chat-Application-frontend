import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "./Addform.css";

const Addform = ({ roomDetails }) => {
  const [usersData, setUsersData] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle checkbox changes
  const handleCheckboxChange = (userId, isChecked) => {
    if (isChecked) {
      setSelectedUsers((prevSelectedUsers) => [...prevSelectedUsers, userId]);
    } else {
      setSelectedUsers((prevSelectedUsers) =>
        prevSelectedUsers.filter((id) => id !== userId)
      );
    }
  };

  // Handle search input
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  async function fetchData() {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch("https://chat-application-dvs1.onrender.com/api/auth/getusers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsersData(data.users);
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  }
  // Fetch users data
  useEffect(() => {
    
    fetchData();
  }, []);

  // Handle adding selected users to room
  const handleUserAdd = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      if (selectedUsers.length <= 0) {
        alert("Select User(s)");
        return;
      }
      {console.log(selectedUsers)}
      const response = await fetch(`https://chat-application-dvs1.onrender.com/api/rooms/${roomDetails.id}/participants`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({userIds:selectedUsers}),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        fetchData();

        console.log("Users added:", data);
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    setSelectedUsers([]); // Reset selected users
  };

  // Filter users based on search query
  const filteredUsers = usersData.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );
{console.log(roomDetails)}
  return (
    <div className="add-form-container">
      <div className="form-search-element">
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
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className="form-users-list">
        {filteredUsers.filter((user)=>!roomDetails.participants.includes(user._id)).map((user) => (
          <div key={user._id} className="form-user-row">
            <div>{user.username}</div>
            <div>
              <input
                type="checkbox"
                onChange={(e) => handleCheckboxChange(user._id, e.target.checked)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="form-submit-buttons">
        <button onClick={handleUserAdd}>Add Users</button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default Addform;
