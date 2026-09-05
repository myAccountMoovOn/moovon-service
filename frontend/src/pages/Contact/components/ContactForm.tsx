import React, { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { SERVICE_OPTIONS } from '../data/contactData';

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  return (
    <div
      className="glass-panel"
      style={{
        padding: '38px 34px',
        width: '100%',
        maxWidth: '460px',
        background: 'rgba(255, 255, 255, 0.62)',
        borderRadius: '28px',
      }}
    >
      <h3
        style={{
          fontSize: '23px',
          fontWeight: 700,
          color: 'var(--navy-primary)',
          marginBottom: '26px',
          letterSpacing: '-0.02em',
        }}
      >
        Start a Conversation
      </h3>

      {isSubmitted ? (
        <div style={{ textAlign: 'center', padding: '40px 10px' }}>
          <CheckCircle2 size={54} color="var(--blue-electric)" style={{ margin: '0 auto 16px' }} />
          <h4 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '8px' }}>
            Message Sent!
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.5 }}>
            Thank you for reaching out. A representative from MoovOn will get back to you shortly.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="btn-gradient"
            style={{ marginTop: '24px', width: '100%' }}
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {errorMessage && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#EF4444',
                fontSize: '13px',
                fontWeight: 500,
              }}
            >
              {errorMessage}
            </div>
          )}

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '13.5px',
                fontWeight: 600,
                color: 'var(--navy-primary)',
                marginBottom: '7px',
              }}
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              style={{
                width: '100%',
                height: '44px',
                padding: '0 16px',
                borderRadius: '12px',
                background: 'rgba(244, 247, 254, 0.75)',
                border: '1px solid rgba(215, 226, 248, 0.85)',
                fontSize: '14px',
                color: 'var(--navy-primary)',
                outline: 'none',
                transition: 'all 0.2s ease',
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '13.5px',
                fontWeight: 600,
                color: 'var(--navy-primary)',
                marginBottom: '7px',
              }}
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              style={{
                width: '100%',
                height: '44px',
                padding: '0 16px',
                borderRadius: '12px',
                background: 'rgba(244, 247, 254, 0.75)',
                border: '1px solid rgba(215, 226, 248, 0.85)',
                fontSize: '14px',
                color: 'var(--navy-primary)',
                outline: 'none',
                transition: 'all 0.2s ease',
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '13.5px',
                fontWeight: 600,
                color: 'var(--navy-primary)',
                marginBottom: '7px',
              }}
            >
              Company
            </label>
            <input
              type="text"
              name="company"
              placeholder="Your company"
              value={formData.company}
              onChange={handleChange}
              style={{
                width: '100%',
                height: '44px',
                padding: '0 16px',
                borderRadius: '12px',
                background: 'rgba(244, 247, 254, 0.75)',
                border: '1px solid rgba(215, 226, 248, 0.85)',
                fontSize: '14px',
                color: 'var(--navy-primary)',
                outline: 'none',
                transition: 'all 0.2s ease',
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '13.5px',
                fontWeight: 600,
                color: 'var(--navy-primary)',
                marginBottom: '7px',
              }}
            >
              What can we help with?
            </label>
            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              style={{
                width: '100%',
                height: '44px',
                padding: '0 16px',
                borderRadius: '12px',
                background: 'rgba(244, 247, 254, 0.75)',
                border: '1px solid rgba(215, 226, 248, 0.85)',
                fontSize: '14px',
                color: formData.service ? 'var(--navy-primary)' : 'rgba(100, 116, 139, 0.75)',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="" disabled>
                Select a service
              </option>
              {SERVICE_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id} style={{ color: 'var(--navy-primary)' }}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '13.5px',
                fontWeight: 600,
                color: 'var(--navy-primary)',
                marginBottom: '7px',
              }}
            >
              Message
            </label>
            <textarea
              name="message"
              rows={3}
              placeholder="Tell us a little about your project..."
              value={formData.message}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                background: 'rgba(244, 247, 254, 0.75)',
                border: '1px solid rgba(215, 226, 248, 0.85)',
                fontSize: '14px',
                color: 'var(--navy-primary)',
                outline: 'none',
                resize: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-gradient"
            style={{ width: '100%', height: '48px', marginTop: '6px', fontSize: '15px' }}
          >
            {isSubmitting ? (
              <span>Sending...</span>
            ) : (
              <>
                <span>Send Message</span>
                <ArrowRight className="arrow-icon" size={18} />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
