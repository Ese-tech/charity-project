import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ImpactSections from '../components/ImpactSections';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <>
      <Header />
      <Hero />
      <main>
        <ImpactSections />
      </main>
      <Footer />
    </>
  );
};

export default Home;