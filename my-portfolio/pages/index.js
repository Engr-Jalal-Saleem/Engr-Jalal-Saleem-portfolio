import Head from 'next/head'
import Header from '../components/Header'
import Hero from '../components/Hero'
import About from '../components/About'
import Education from '../components/Education'
import Skills from '../components/Skills'
import Projects from '../components/Projects'
import Experience from '../components/Experience'
import Organization from '../components/Organization'
import Certificates from '../components/Certificates'
import Interests from '../components/Interests'
import Contact from '../components/Contact'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Engr. Jalal Saleem Portfolio</title>
        <meta name="description" content="Engr. Jalal Saleem's professional portfolio." />
      </Head>
      <Header />
      <Hero />
      <About />
      <Education />
      <Skills />
      <Projects />
      <Experience />
      <Organization />
      <Certificates />
      <Interests />
      <Contact />
    </div>
  )
}
