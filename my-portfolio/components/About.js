import { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const About = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: '-100px 0px',
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const titleVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', delay: 0.3 } },
  };

  const skillsRef = useRef(null);

  useEffect(() => {
    const skills = [
      'Electrical Engineering',
      'Machine Learning',
      'Data Analysis',
      'Programming',
      'Graphic Design',
      'Social Media Marketing',
    ];

    const container = skillsRef.current;
    let delay = 0.6;

    skills.forEach((skill) => {
      const span = document.createElement('span');
      span.textContent = skill;
      span.className = 'inline-block px-3 py-1 m-1 bg-blue-600 text-white rounded-full text-sm font-semibold opacity-0';
      span.style.animation = `fadeIn 0.5s ease-out ${delay}s forwards`;
      container.appendChild(span);
      delay += 0.1;
    });
  }, []);

  return (
    <section id="about" className="py-24 bg-gradient-to-br from-gray-100 to-blue-50 text-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full">
        <svg className="w-full h-full text-blue-100 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="currentColor" fillOpacity="1" d="M0,128L48,154.7C96,181,192,235,288,250.7C384,267,480,245,576,208C672,171,768,117,864,96C960,75,1056,85,1152,112C1248,139,1344,181,1392,202.7L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
        </svg>
      </div>
      <div className="max-w-4xl mx-auto px-6 relative z-10" ref={ref}>
        <motion.h2 
          className="text-4xl font-bold mb-6 text-blue-800"
          variants={titleVariants}
          initial="hidden"
          animate={controls}
        >
          About Me
        </motion.h2>
        <motion.p 
          className="text-lg mb-8 text-gray-700 leading-relaxed"
          variants={textVariants}
          initial="hidden"
          animate={controls}
        >
          I&apos;m Engr. Jalal Saleem, a passionate student with a diverse skill set. My journey in tech and design has equipped me with a unique blend of analytical and creative abilities. I excel in data-driven strategies, using insights to optimize campaigns and make informed decisions. As an Electrical Engineering student, I have a deep understanding of complex systems, which enhances my problem-solving skills. I&apos;m eager to collaborate and contribute to innovative and impactful projects. Let&apos;s innovate together!
        </motion.p>
        <h3 className="text-2xl font-semibold mb-4 text-blue-700">My Skills</h3>
        <div ref={skillsRef} className="flex flex-wrap justify-center"></div>
        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </section>
  );
};

export default About;