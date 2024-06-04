import { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaLaptopCode, FaLightbulb, FaProjectDiagram, FaBrain } from 'react-icons/fa';

const InterestCard = ({ icon: Icon, title, description, index }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, rootMargin: '-50px 0px' });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6, 
        ease: 'easeOut', 
        delay: index * 0.2 
      } 
    }
  };

  return (
    <motion.div 
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={controls}
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105 duration-300 ease-in-out"
    >
      <div className="flex items-center justify-center mb-4">
        <Icon className="text-purple-500 text-4xl" />
      </div>
      <h3 className="text-2xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

const Interests = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const titleControls = useAnimation();
  const [titleRef, titleInView] = useInView({ triggerOnce: true, rootMargin: '-100px 0px' });

  useEffect(() => {
    if (titleInView) {
      titleControls.start('visible');
    }
  }, [titleControls, titleInView]);

  const titleVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
  };

  const interestsData = [
    { icon: FaLaptopCode, title: 'Technology', description: 'Exploring new technologies and working on innovative projects.', index: 0 },
    { icon: FaLightbulb, title: 'Innovation', description: 'Tackling complex problems and coming up with efficient solutions.', index: 1 },
    { icon: FaProjectDiagram, title: 'Project Management', description: 'Leading projects and ensuring they are completed successfully.', index: 2 },
    { icon: FaBrain, title: 'Continuous Learning', description: 'Always expanding my knowledge and skills.', index: 3 }
  ];

  return (
    <section id="interests" className="py-24 text-center bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full">
        <svg className="w-full h-full text-gray-200 opacity-70 transform -scale-x-100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="currentColor" fillOpacity="1" d="M0,224L80,186.7C160,149,320,75,480,80C640,85,800,171,960,192C1120,213,1280,171,1360,149.3L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
        </svg>
      </div>
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.h2 
          ref={titleRef}
          variants={titleVariants}
          initial="hidden"
          animate={titleControls}
          className="text-4xl font-extrabold mb-8 text-gray-900 inline-block relative"
        >
          Interests
          <span className="absolute -bottom-2 left-0 w-full h-1 bg-purple-500 transform origin-left" style={{
            scaleX: isLoaded ? 1 : 0,
            transition: 'transform 1s ease-out 0.5s'
          }}></span>
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {interestsData.map((interest, index) => (
            <InterestCard key={interest.title} {...interest} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Interests;
