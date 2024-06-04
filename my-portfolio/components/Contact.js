import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Contact = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, rootMargin: '-50px 0px' });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
  };

  return (
    <motion.section 
      id="contact" 
      className="py-24 text-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white relative overflow-hidden"
      ref={ref}
      variants={sectionVariants}
      initial="hidden"
      animate={controls}
    >
      <div className="absolute top-0 left-0 w-full h-full">
        <svg className="w-full h-full text-purple-300 opacity-70 transform -scale-x-100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="currentColor" fillOpacity="1" d="M0,224L80,186.7C160,149,320,75,480,80C640,85,800,171,960,192C1120,213,1280,171,1360,149.3L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
        </svg>
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <motion.h2 
          variants={titleVariants}
          initial="hidden"
          animate={controls}
          className="text-4xl font-extrabold mb-8"
        >
          Contact
        </motion.h2>
        <form action="https://formspree.io/f/mnqyglvg" method="POST" className="space-y-6">
          <motion.div 
            variants={sectionVariants}
            initial="hidden"
            animate={controls}
          >
            <label htmlFor="name" className="block text-left font-medium text-lg">Name</label>
            <input type="text" id="name" name="name" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600" required />
          </motion.div>
          <motion.div 
            variants={sectionVariants}
            initial="hidden"
            animate={controls}
          >
            <label htmlFor="email" className="block text-left font-medium text-lg">Email</label>
            <input type="email" id="email" name="_replyto" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600" required />
          </motion.div>
          <motion.div 
            variants={sectionVariants}
            initial="hidden"
            animate={controls}
          >
            <label htmlFor="message" className="block text-left font-medium text-lg">Message</label>
            <textarea id="message" name="message" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600" rows="6" required></textarea>
          </motion.div>
          <motion.button 
            type="submit"
            className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-transform transform hover:scale-105"
            variants={sectionVariants}
            initial="hidden"
            animate={controls}
          >
            Send Message
          </motion.button>
        </form>
      </div>
    </motion.section>
  );
};

export default Contact;
