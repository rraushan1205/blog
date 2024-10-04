import React from "react";
import "./index.css";
import { useState, useEffect } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [author, setAuthor] = useState("");

  const [items, setItems] = useState([]); // State to hold fetched items

  const fetchItems = () => {
    fetch("http://localhost:3000/")
      .then((response) => response.json())
      .then((data) => {
        console.log("Items fetched from server:", data);
        setItems(data);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  };

  useEffect(() => {
    fetchItems(); // Fetch items when the component mounts

    const interval = setInterval(() => {
      fetchItems(); // Fetch items every 5 seconds
    }, 5000); // Adjust the interval as needed

    // Clean up the interval on unmount
    return () => clearInterval(interval);
  }, []);

  const handleclick = () => {
    if(author==""){
      setAuthor("Anonymous");
    }
    fetch("http://localhost:3000/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, author }), // Send both message and author as JSON
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Parse the JSON response
      })
      .then((data) => {
        console.log("Response from server:", data); // Log the server response
        setMessage(""); // Clear message input
        setAuthor(""); // Clear author input
        fetchItems();
      })
      .catch((error) => {
        console.error("Error fetching message:", error);
      });
  };
  const handleDelete = (id) => {
    fetch(`http://localhost:3000/items/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Item deleted:', data);
        fetchItems();
      })
      .catch(error => {
        console.error('Error deleting item:', error);
      });
  };
  

  return (
    <>
      <header className="w-full h-12 mb-10 bg-blue-500"></header>

      <div className="border-[1px] border-black mx-52 flex flex-col justify-center items-center gap-5 py-2">
        <div>
          {items && items.map((item, index) => (
            <div
              key={index}
              className="feed py-1 px-2 border-[2px] bg-yellow-100 border-blue-900 my-2 flex justify-between w-[450px]"
            >
              <span className="break-words max-w-[390px] flex flex-col">
                <span className="text-[20px]">{item.message}</span> <span className="font-bold">~{item.author}</span> 
              </span>
              <button className=""onClick={() => handleDelete(item._id)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6 hover:skew-x-6 active:-skew-y-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="border-0 border-black my-10 mx-52 flex items-center">
        <textarea
          name="message"
          id="msg"
          className="my-5 mx-5 border-[1px] border-black outline-none px-1 placeholder:text-wrap w-[400px] resize-none"
          rows="4"
          cols="50"
          placeholder="Your feed goes here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Your name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)} // Update author state
        />
        <button
          type="submit"
          onClick={handleclick}
          className="py-1 px-2 text-white font-bold text-[20px] rounded bg-blue-700 h-fit"
        >
          Post
        </button>
      </div>
    </>
  );
}

export default App;
