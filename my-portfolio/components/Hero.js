import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const SocialLink = ({ href, children, delay }) => (
  <Link
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-600 hover:text-blue-800 transition-colors"
    style={{
      opacity: 0,
      transform: 'translateY(4px)',
      animationName: 'fadeSlideUp',
      animationDuration: '1s',
      animationFillMode: 'forwards',
      animationDelay: `${delay}s`,
      animationTimingFunction: 'ease-out'
    }}
  >
    {children}
  </Link>
);

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section
      id="home"
      className="pt-32 pb-24 bg-gradient-to-br from-blue-50 to-blue-100 text-center min-h-screen flex flex-col justify-center items-center"
    >
      <style jsx>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes floatImage {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
      <div className="max-w-4xl mx-auto px-6">
        <div 
          className="relative w-48 h-48 mx-auto mb-8"
          style={{ 
            opacity: 0,
            animationName: isLoaded ? 'fadeSlideUp, floatImage' : 'none',
            animationDuration: '1s, 3s',
            animationDelay: '0.2s, 1.2s',
            animationFillMode: 'forwards, none',
            animationTimingFunction: 'ease-out, ease-in-out',
            animationIterationCount: '1, infinite'
          }}
        >
          <Image 
            src="/IMG_3045.jpg" 
            alt="Jalal Saleem" 
            layout="fill"
            objectFit="cover"
            className="rounded-full shadow-lg"
          />
        </div>
        <h1 
          className="text-5xl font-bold mb-4 text-blue-900"
          style={{ 
            opacity: 0,
            transform: 'translateY(4px)',
            animationName: 'fadeSlideUp',
            animationDuration: '1s',
            animationDelay: '0.4s',
            animationFillMode: 'forwards',
            animationTimingFunction: 'ease-out'
          }}
        >
          Engr. Jalal Saleem
        </h1>
        <p 
          className="text-xl mb-6 text-blue-800"
          style={{ 
            opacity: 0,
            transform: 'translateY(4px)',
            animationName: 'fadeSlideUp',
            animationDuration: '1s',
            animationDelay: '0.6s',
            animationFillMode: 'forwards',
            animationTimingFunction: 'ease-out'
          }}
        >
          Electrical Engineer | Data Analyst | Social Media Marketer
        </p>
        <div className="flex justify-center space-x-6 mb-12">
          {[
            { href: "https://www.linkedin.com/in/engr-jalal-saleem", text: "LinkedIn", delay: 0.8 },
            { href: "https://www.instagram.com/jalalbinsaleem/", text: "Instagram", delay: 1 },
            { href: "https://www.facebook.com/jalalsaleem786", text: "Facebook", delay: 1.2 },
            { href: "https://github.com/Engr-Jalal-Saleem", text: "GitHub", delay: 1.4 },
            { href: "https://www.npmjs.com/~engr_jalal_saleem", text: "NPM", delay: 1.6 },
            { href: "https://twitter.com/JSaleem786", text: "Twitter", delay: 1.8 }
          ].map(({ href, text, delay }) => (
            <SocialLink key={text} href={href} delay={delay}>{text}</SocialLink>
          ))}
        </div>
        <Link
          href="#contact"
          className="inline-block px-8 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-colors transform hover:scale-105 hover:shadow-lg"
          style={{
            opacity: 0,
            transform: 'translateY(4px)',
            animationName: 'fadeSlideUp',
            animationDuration: '1s',
            animationDelay: '2s',
            animationFillMode: 'forwards',
            animationTimingFunction: 'ease-out'
          }}
        >
          Let's Connect
        </Link>
      </div>
    </section>
  );
};

export default Hero;