import React from 'react';
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import type { ContactInfoCard } from '../data/contactData';

interface ContactCardProps {
  card: ContactInfoCard;
}

export const ContactCard: React.FC<ContactCardProps> = ({ card }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'mail':
        return <Mail size={24} />;
      case 'phone':
        return <Phone size={24} />;
      case 'map-pin':
        return <MapPin size={24} />;
      default:
        return <Mail size={24} />;
    }
  };

  return (
    <a
      href={card.link}
      target={card.type === 'location' ? '_blank' : '_self'}
      rel="noreferrer"
      className="glass-panel contact-card-item"
      style={{ textDecoration: 'none' }}
    >
      <div className="card-icon-wrapper">{getIcon(card.icon)}</div>
      <div className="card-label">{card.title}</div>
      <div className="card-value">{card.value}</div>
      <div className="card-arrow-link">
        <ArrowUpRight size={18} />
      </div>
    </a>
  );
};
