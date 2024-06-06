import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import emailjs from "emailjs-com";

const Contact = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: "-50px 0px",
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSending(true);
    setError("");

    emailjs
      .send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        formData,
        process.env.NEXT_PUBLIC_EMAILJS_USER_ID
      )
      .then(
        (response) => {
          console.log("SUCCESS!", response.status, response.text);
          setIsSending(false);
          setIsSent(true);
          setFormData({ name: "", email: "", message: "" });
        },
        (error) => {
          console.log("FAILED...", error);
          setIsSending(false);
          setError(
            "An error occurred while sending the email. Please try again."
          );
        }
      );
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <motion.section
      id="contact"
      ref={ref}
      variants={sectionVariants}
      initial="hidden"
      animate={controls}
      className="py-24 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100"
    >
      <div className="container mx-auto px-6">
        <motion.h2
          variants={titleVariants}
          className="text-4xl font-bold mb-8 text-center"
        >
          Contact
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block mb-2 font-medium">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block mb-2 font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700"
                  required
                ></textarea>
              </div>
              {error && <p className="text-red-500 mb-4">{error}</p>}
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-300"
                disabled={isSending}
              >
                {isSending ? "Sending..." : "Send Message"}
              </button>
              {isSent && (
                <p className="text-green-500 mt-4">
                  Message sent successfully!
                </p>
              )}
            </form>
          </div>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <FaEnvelope className="text-2xl" />
              <span>jalalsaleem786@gmail.com</span>
            </div>
            <div className="flex items-center space-x-4">
              <FaPhone className="text-2xl" />
              <span>+92 (308) 4948400</span>
            </div>
            <div className="flex items-center space-x-4">
              <FaMapMarkerAlt className="text-2xl" />
              <span>Lahore, Pakistan</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} Jalal Saleem. All rights reserved.
      </div>
    </motion.section>
  );
};

export default Contact;
