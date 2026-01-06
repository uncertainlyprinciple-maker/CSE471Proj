import { useState } from "react";
import React from "react";
import ReactDOM from "react-dom/client";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [faq, setFaq] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, faq }),
      });

      const data = await response.json();
      setMessage(data.message || "Submitted successfully!");

      setName("");
      setEmail("");
      setFaq("");
    } catch (error) {
      console.error("Error:", error);
      setMessage("Failed to submit FAQ");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto" }}>
      <h2>Submit FAQ</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <textarea
          placeholder="Enter your FAQ"
          value={faq}
          onChange={(e) => setFaq(e.target.value)}
          required
          rows="5"
          style={{ width: "100%", marginBottom: "10px" }}
        ></textarea>

        <button type="submit">Submit</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default App;

