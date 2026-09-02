import React from 'react';
import { FileText, Code2, Megaphone, PenTool } from 'lucide-react';
import type { ServiceOption } from '../data/contactData';

interface EcosystemNodeProps {
  service: ServiceOption;
  positionClass: 'node-top' | 'node-bottom' | 'node-left' | 'node-right';
}

export const EcosystemNode: React.FC<EcosystemNodeProps> = ({ service, positionClass }) => {
  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'document':
        return <FileText size={22} />;
      case 'code':
        return <Code2 size={22} />;
      case 'megaphone':
        return <Megaphone size={22} />;
      case 'pen':
        return <PenTool size={22} />;
      default:
        return <FileText size={22} />;
    }
  };

  return (
    <div className={`ecosystem-node-card ${positionClass}`}>
      <div className="node-icon-circle">{getIcon(service.icon)}</div>
      <div className="node-title">{service.label}</div>
      <div className="node-desc">{service.description}</div>
    </div>
  );
};
