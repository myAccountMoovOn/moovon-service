import React, { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { SERVICE_OPTIONS } from '../data/contactData';

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: 'billing',
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

    // Simulate async submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  return (
    <div className="glass-panel" style={{ padding: '36px 32px', width: '100%', maxWidth: '440px' }}>
      <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '24px' }}>
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
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {errorMessage && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
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
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--navy-primary)',
                marginBottom: '6px',
              }}
            >
              Name <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              style={{
                width: '100%',
                height: '42px',
                padding: '0 14px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.65)',
                border: '1px solid rgba(180, 200, 240, 0.5)',
                fontSize: '14px',
                color: 'var(--navy-primary)',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--navy-primary)',
                marginBottom: '6px',
              }}
            >
              Email <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              style={{
                width: '100%',
                height: '42px',
                padding: '0 14px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.65)',
                border: '1px solid rgba(180, 200, 240, 0.5)',
                fontSize: '14px',
                color: 'var(--navy-primary)',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--navy-primary)',
                marginBottom: '6px',
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
                height: '42px',
                padding: '0 14px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.65)',
                border: '1px solid rgba(180, 200, 240, 0.5)',
                fontSize: '14px',
                color: 'var(--navy-primary)',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--navy-primary)',
                marginBottom: '6px',
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
                height: '42px',
                padding: '0 14px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.65)',
                border: '1px solid rgba(180, 200, 240, 0.5)',
                fontSize: '14px',
                color: 'var(--navy-primary)',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {SERVICE_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--navy-primary)',
                marginBottom: '6px',
              }}
            >
              Message <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <textarea
              name="message"
              rows={3}
              placeholder="Tell us a little about your project..."
              value={formData.message}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.65)',
                border: '1px solid rgba(180, 200, 240, 0.5)',
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
            style={{ width: '100%', height: '46px', marginTop: '6px', fontSize: '15px' }}
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
