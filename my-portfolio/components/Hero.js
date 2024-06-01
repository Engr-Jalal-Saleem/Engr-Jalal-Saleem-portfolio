import Link from 'next/link';
import Image from 'next/image';

const Hero = () => {
    return (
      <section id="home" className="text-center py-24 bg-white text-black">
        <div className="max-w-4xl mx-auto">
          <Image src="/IMG_3045.jpg" alt="Jalal Saleem" className="rounded-full w-32 h-32 mx-auto" width={128} height={128} />
          <h1 className="text-4xl font-bold mt-4">Engr. Jalal Saleem</h1>
          <p className="mt-2">Electrical Engineer | Data Analyst | Social Media Marketer</p>
          <div className="flex justify-center mt-4 space-x-4 text-blue-600">
            <Link href="https://www.linkedin.com/in/engr-jalal-saleem">LinkedIn</Link>
            <Link href="https://www.instagram.com/jalalbinsaleem/">Instagram</Link>
            <Link href="https://www.facebook.com/jalalsaleem786">Facebook</Link>
            <Link href="https://github.com/Engr-Jalal-Saleem">GitHub</Link>
            <Link href="https://www.npmjs.com/~engr_jalal_saleem">NPM</Link>
            <Link href="https://twitter.com/JSaleem786">Twitter</Link>
          </div>
        </div>
      </section>
    );
};

export default Hero;