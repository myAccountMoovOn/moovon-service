import React, { useState } from 'react';
import './Services.css';
import { ServicesNavbar } from './components/ServicesNavbar';
import { HeroServices } from './components/HeroServices';
import { CoreModules } from './components/CoreModules';
import { ConnectedBusinessFlow } from './components/ConnectedBusinessFlow';
import { BusinessIntelligence } from './components/BusinessIntelligence';
import { ServicesCTA } from './components/ServicesCTA';
import { ModuleDetailModal } from './components/ModuleDetailModal';
import type { ModuleData } from './data/servicesPageData';

const Services: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<ModuleData | null>(null);

  return (
    <div className="services-page-wrapper" id="top">
      {/* Floating Glass Navbar */}
      <ServicesNavbar />

      {/* SECTION 01: Hero / Business Ecosystem */}
      <HeroServices onSelectModule={(mod) => setSelectedModule(mod)} />

      {/* SECTION 02: Core Modules */}
      <CoreModules onSelectModule={(mod) => setSelectedModule(mod)} />

      {/* SECTION 03: Connected Business Flow */}
      <ConnectedBusinessFlow />

      {/* SECTION 04: Business Intelligence (SaaS Dashboard Mockup) */}
      <BusinessIntelligence />

      {/* SECTION 05: Final Dark CTA */}
      <ServicesCTA />

      {/* Reusable Glass Detail Modal */}
      <ModuleDetailModal
        module={selectedModule}
        onClose={() => setSelectedModule(null)}
      />
    </div>
  );
};

export default Services;
