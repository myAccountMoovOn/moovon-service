import React from 'react';
import './Contact.css';
import { ContactNavbar } from './components/ContactNavbar';
import { HeroContact } from './components/HeroContact';
import { EcosystemSection } from './components/EcosystemSection';
import { DirectContact } from './components/DirectContact';
import { NextMoveCTA } from './components/NextMoveCTA';

const Contact: React.FC = () => {
  return (
    <div className="contact-page-wrapper" id="top">
      {/* Floating Glass Navbar */}
      <ContactNavbar />

      {/* SECTION 01: Hero + Contact Form */}
      <HeroContact />

      {/* SECTION 02: How Can We Help? (MoovOn Ecosystem) */}
      <EcosystemSection />

      {/* SECTION 03: Direct Contact */}
      <DirectContact />

      {/* SECTION 04: The Next Move (Dark Climax CTA) */}
      <NextMoveCTA />
    </div>
  );
};

export default Contact;
