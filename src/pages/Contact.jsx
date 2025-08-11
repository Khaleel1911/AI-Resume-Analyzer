import React, { useState } from "react";
import "../styles/Contact.css";
import toast from "react-hot-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields.");
      return;
    }
    console.log("Feedback submitted:", formData);
    toast.success("Thanks for your feedback! 💬");

    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section className="contact">
      <div className="contact-container">
        <h1>We’d Love to Hear From You! 💌</h1>
        <p>
          Have suggestions, questions, or feedback about our AI Resume Analyzer?
          Drop us a message below.
        </p>

        <form onSubmit={handleSubmit} className="contact-form">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
          />

          <textarea
            name="message"
            placeholder="Your Feedback"
            value={formData.message}
            onChange={handleChange}
          ></textarea>

          <button type="submit">Send Feedback</button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
