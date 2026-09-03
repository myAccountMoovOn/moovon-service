import React, { useEffect, useRef, useState } from 'react';
import {
  Shield, Zap, Lightbulb, Heart,
  Target, Eye, CheckCircle, ArrowRight,
  Users, Award, Globe, TrendingUp, Star,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* ─────────────────────────────────────────────────────────────
   MOOVON About Page  ·  White & Blue Professional Theme
   Brand Blue : #0057e7   Light Blue bg : #f0f6ff   White: #fff
   Text Dark  : #0f172a   Text Mid : #475569   Border: #e2e8f0
───────────────────────────────────────────────────────────── */

/* Scroll reveal */
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const el = e.target as HTMLElement;
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          io.unobserve(el);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(32px)';
      el.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);
}

/* Animated counter */
function useCounter(target: number, active: boolean) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    let v = 0;
    const step = target / 60;
    const t = setInterval(() => {
      v += step;
      if (v >= target) { setN(target); clearInterval(t); }
      else setN(Math.floor(v));
    }, 22);
    return () => clearInterval(t);
  }, [active, target]);
  return n;
}

/* Stat item */
const Stat: React.FC<{ value: number; suffix: string; label: string; active: boolean }> = ({ value, suffix, label, active }) => {
  const n = useCounter(value, active);
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 'clamp(32px,4vw,48px)', fontWeight: 900, color: '#0057e7', letterSpacing: '-2px', lineHeight: 1 }}>
        {n.toLocaleString()}{suffix}
      </div>
      <div style={{ fontSize: 13, color: '#64748b', marginTop: 8, fontWeight: 500, letterSpacing: '0.04em' }}>{label}</div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════ */
const About: React.FC = () => {
  useReveal();
  const navigate = useNavigate();
  const [statsOn, setStatsOn] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setStatsOn(true); io.disconnect(); }
    }, { threshold: 0.5 });
    if (statsRef.current) io.observe(statsRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <div style={{ fontFamily: "'Roboto', sans-serif", color: '#0f172a', background: '#fff', overflowX: 'hidden' }}>

      {/* ── 1. HERO ──────────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(160deg, #f8faff 0%, #eef4ff 40%, #fff 100%)', padding: '100px 24px 80px', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -120, right: -120, width: 500, height: 500, borderRadius: '50%', border: '1px solid rgba(0,87,231,0.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: -60, right: -60, width: 340, height: 340, borderRadius: '50%', border: '1px solid rgba(0,87,231,0.06)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 280, height: 280, borderRadius: '50%', background: 'rgba(0,87,231,0.04)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1180, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }} className="ab-two">
          {/* Left */}
          <div data-reveal>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#dbeafe', padding: '6px 14px', borderRadius: 40, marginBottom: 28 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#0057e7' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#0057e7', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>About MOOVON</span>
            </div>
            <h1 style={{ fontSize: 'clamp(36px,5.5vw,64px)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-2px', margin: '0 0 24px', color: '#0f172a' }}>
              Moving Forward,{' '}
              <span style={{ color: '#0057e7', position: 'relative', display: 'inline-block' }}>
                Together.
                {/* Blue underline */}
                <svg style={{ position: 'absolute', bottom: -8, left: 0, width: '100%' }} height="8" viewBox="0 0 200 8" preserveAspectRatio="none">
                  <path d="M0 6 Q50 0 100 4 Q150 8 200 3" stroke="#0057e7" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.5" />
                </svg>
              </span>
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.8, color: '#475569', margin: '0 0 40px', maxWidth: 500 }}>
              MOOVON is built around one simple idea — making every journey easier, smarter and more reliable. We combine technology, trusted service and a customer-first approach to help people move forward with confidence.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' as const, alignItems: 'center' }}>
              <button
                onClick={() => navigate('/login')}
                onMouseEnter={(e) => { const b = e.currentTarget; b.style.transform = 'translateY(-2px)'; b.style.boxShadow = '0 12px 32px rgba(0,87,231,0.3)'; }}
                onMouseLeave={(e) => { const b = e.currentTarget; b.style.transform = 'translateY(0)'; b.style.boxShadow = '0 4px 16px rgba(0,87,231,0.2)'; }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 32px', background: '#0057e7', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,87,231,0.2)', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
              >
                Get Started <ArrowRight size={16} />
              </button>
              <button
                onClick={() => document.getElementById('ab-who')?.scrollIntoView({ behavior: 'smooth' })}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', background: 'transparent', color: '#0057e7', border: '1.5px solid #bfdbfe', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: 'border-color 0.2s ease, background 0.2s ease' }}
                onMouseEnter={(e) => { const b = e.currentTarget; b.style.borderColor = '#0057e7'; b.style.background = '#f0f6ff'; }}
                onMouseLeave={(e) => { const b = e.currentTarget; b.style.borderColor = '#bfdbfe'; b.style.background = 'transparent'; }}
              >
                Learn More
              </button>
            </div>
            {/* Trust badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 40, paddingTop: 32, borderTop: '1px solid #e2e8f0' }}>
              {[
                { icon: <Star size={14} fill="#f59e0b" color="#f59e0b" />, text: '4.9/5 Customer Rating' },
                { icon: <Shield size={14} color="#0057e7" />, text: 'Enterprise Security' },
                { icon: <Globe size={14} color="#0057e7" />, text: '120+ Cities' },
              ].map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {b.icon}
                  <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500, whiteSpace: 'nowrap' as const }}>{b.text}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Right — photo */}
          <div data-reveal style={{ transitionDelay: '120ms', position: 'relative' }}>
            <div style={{ borderRadius: 24, overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,87,231,0.12), 0 4px 24px rgba(0,0,0,0.08)', border: '1px solid rgba(0,87,231,0.12)' }}>
              <img src="/about-hero.jpg" alt="MOOVON team" style={{ width: '100%', display: 'block', objectFit: 'cover', aspectRatio: '4/3' }} />
            </div>
            {/* Floating card */}
            <div style={{ position: 'absolute', bottom: -20, left: -20, background: '#fff', borderRadius: 16, padding: '16px 20px', boxShadow: '0 8px 32px rgba(0,87,231,0.15)', border: '1px solid #dbeafe', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0057e7' }}><TrendingUp size={20} /></div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>98%</div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 3, fontWeight: 500 }}>Satisfaction Rate</div>
              </div>
            </div>
            {/* Floating card 2 */}
            <div style={{ position: 'absolute', top: -16, right: -16, background: '#0057e7', borderRadius: 16, padding: '16px 20px', boxShadow: '0 8px 32px rgba(0,87,231,0.3)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><Users size={18} /></div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: '#fff', lineHeight: 1 }}>5M+</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 3, fontWeight: 500 }}>Trusted Users</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. STATS BAR ─────────────────────────────────────────── */}
      <section ref={statsRef} style={{ background: '#fff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '0 24px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }} className="ab-stats">
          {[
            { value: 50000, suffix: '+', label: 'Journeys Simplified' },
            { value: 98, suffix: '%', label: 'Customer Satisfaction' },
            { value: 120, suffix: '+', label: 'Cities Served' },
            { value: 7, suffix: '+', label: 'Years of Excellence' },
          ].map((s, i) => (
            <div key={i} style={{ padding: '40px 20px', borderRight: i < 3 ? '1px solid #e2e8f0' : 'none' }}>
              <Stat {...s} active={statsOn} />
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. WHO WE ARE ────────────────────────────────────────── */}
      <section id="ab-who" style={{ background: '#f8faff', padding: '100px 24px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }} className="ab-two">
          <div data-reveal style={{ transitionDelay: '80ms', position: 'relative' }}>
            <div style={{ borderRadius: 24, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
              <img src="/about-team.jpg" alt="MOOVON team collaborating" style={{ width: '100%', display: 'block', objectFit: 'cover', aspectRatio: '4/3' }} />
            </div>
            {/* Accent line */}
            <div style={{ position: 'absolute', bottom: 0, left: -12, top: 48, width: 4, background: 'linear-gradient(180deg, #0057e7, #93c5fd)', borderRadius: 4 }} />
          </div>
          <div data-reveal>
            <span style={{ display: 'inline-block', fontSize: 12, fontWeight: 700, color: '#0057e7', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 14 }}>Who We Are</span>
            <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.2, margin: '0 0 20px', color: '#0f172a' }}>Making Every Move Simpler</h2>
            <p style={{ fontSize: 16, lineHeight: 1.85, color: '#475569', margin: '0 0 36px' }}>
              At MOOVON, we focus on removing complexity from the journey. Our goal is to provide simple, dependable and thoughtfully designed solutions that save time, reduce stress and deliver a better experience from start to finish.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 14 }}>
              {[
                { icon: <CheckCircle size={18} />, title: 'Simple Experiences', desc: 'Friction-free from the very first interaction.' },
                { icon: <CheckCircle size={18} />, title: 'Reliable Solutions', desc: 'Dependability you can count on, every time.' },
                { icon: <CheckCircle size={18} />, title: 'Customer First', desc: 'Every decision starts with you in mind.' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, padding: '16px 18px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  <span style={{ color: '#0057e7', flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>{item.title}</div>
                    <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. MISSION & VISION ──────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '100px 24px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }} data-reveal>
            <span style={{ display: 'inline-block', fontSize: 12, fontWeight: 700, color: '#0057e7', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 14 }}>Our Purpose</span>
            <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: '-1.5px', margin: 0, color: '#0f172a' }}>Mission & Vision</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }} className="ab-two">
            {[
              { icon: <Target size={28} />, badge: 'Our Mission', heading: 'Drive Simplicity at Scale', body: 'To make every journey simpler and more dependable through smart, accessible and customer-focused solutions that genuinely improve everyday life.' },
              { icon: <Eye size={28} />, badge: 'Our Vision', heading: 'Lead the Future of Movement', body: 'To become the most trusted platform that empowers people to move forward with greater convenience, confidence and freedom — wherever they are.' },
            ].map((c, i) => (
              <div
                key={i}
                data-reveal
                style={{ transitionDelay: `${i * 120}ms`, background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 20, padding: '44px 40px', position: 'relative', overflow: 'hidden', cursor: 'default', transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.25s' }}
                onMouseEnter={(e) => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor = '#0057e7'; d.style.boxShadow = '0 12px 40px rgba(0,87,231,0.1)'; d.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={(e) => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor = '#e2e8f0'; d.style.boxShadow = 'none'; d.style.transform = 'translateY(0)'; }}
              >
                {/* Top stripe */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #0057e7, #60a5fa)' }} />
                {/* Background number */}
                <div style={{ position: 'absolute', right: 24, bottom: 16, fontSize: 120, fontWeight: 900, color: '#f0f6ff', lineHeight: 1, userSelect: 'none' as const, pointerEvents: 'none' }}>{i + 1}</div>
                <div style={{ width: 60, height: 60, borderRadius: 16, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0057e7', marginBottom: 24 }}>{c.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#0057e7', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 10 }}>{c.badge}</div>
                <h3 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px', margin: '0 0 14px', color: '#0f172a' }}>{c.heading}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.8, color: '#475569', margin: 0 }}>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. VALUES ────────────────────────────────────────────── */}
      <section style={{ background: '#f8faff', padding: '100px 24px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }} data-reveal>
            <span style={{ display: 'inline-block', fontSize: 12, fontWeight: 700, color: '#0057e7', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 14 }}>Our Values</span>
            <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: '-1.5px', margin: '0 0 16px', color: '#0f172a' }}>What Drives Us</h2>
            <p style={{ fontSize: 16, color: '#64748b', maxWidth: 480, margin: '0 auto' }}>The principles that shape every decision we make and every solution we build.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }} className="ab-vals">
            {[
              { icon: <Shield size={24} />, title: 'Trust', body: 'We build lasting relationships through honesty, transparency and dependable service.', color: '#0057e7' },
              { icon: <Zap size={24} />, title: 'Simplicity', body: 'We remove unnecessary complexity and make every interaction straightforward.', color: '#0284c7' },
              { icon: <Lightbulb size={24} />, title: 'Innovation', body: 'We continuously improve how people experience our services through smarter solutions.', color: '#0369a1' },
              { icon: <Heart size={24} />, title: 'Customer First', body: 'We listen, understand and design every experience around the people we serve.', color: '#1d4ed8' },
            ].map((v, i) => (
              <div
                key={i}
                data-reveal
                style={{ transitionDelay: `${i * 80}ms`, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '32px 28px', cursor: 'default', transition: 'transform 0.25s, box-shadow 0.25s, border-color 0.25s' }}
                onMouseEnter={(e) => { const d = e.currentTarget as HTMLDivElement; d.style.transform = 'translateY(-6px)'; d.style.boxShadow = '0 16px 40px rgba(0,87,231,0.1)'; d.style.borderColor = '#bfdbfe'; }}
                onMouseLeave={(e) => { const d = e.currentTarget as HTMLDivElement; d.style.transform = 'translateY(0)'; d.style.boxShadow = 'none'; d.style.borderColor = '#e2e8f0'; }}
              >
                <div style={{ width: 52, height: 52, borderRadius: 14, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: v.color, marginBottom: 20 }}>{v.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: '0 0 10px' }}>{v.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: '#64748b', margin: 0 }}>{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. STORY ─────────────────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '100px 24px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }} className="ab-two">
          <div data-reveal>
            <span style={{ display: 'inline-block', fontSize: 12, fontWeight: 700, color: '#0057e7', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 14 }}>Our Story</span>
            <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.2, margin: '0 0 20px', color: '#0f172a' }}>Built to Keep You Moving</h2>
            <p style={{ fontSize: 16, lineHeight: 1.85, color: '#475569', margin: '0 0 44px' }}>
              MOOVON began with a simple observation: everyday journeys and services shouldn't feel complicated. We saw an opportunity to create something simpler, smarter and more dependable. Today, that idea continues to guide how we build, improve and serve our customers.
            </p>
            {/* Timeline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                { year: '2018', text: 'MOOVON founded with a vision to simplify everyday journeys' },
                { year: '2020', text: 'Expanded to 50+ cities, serving hundreds of thousands of users' },
                { year: '2022', text: 'Celebrated 1 million satisfied customers milestone' },
                { year: '2024', text: 'Launched next-gen platform — smarter, faster, more reliable' },
              ].map((t, i, arr) => (
                <div key={i} style={{ display: 'flex', gap: 20 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 20, flexShrink: 0 }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#0057e7', border: '2px solid #bfdbfe', flexShrink: 0, marginTop: 4 }} />
                    {i < arr.length - 1 && <div style={{ width: 2, flex: 1, background: '#dbeafe', minHeight: 32 }} />}
                  </div>
                  <div style={{ paddingBottom: i < arr.length - 1 ? 28 : 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#0057e7', marginBottom: 4, letterSpacing: '0.05em' }}>{t.year}</div>
                    <div style={{ fontSize: 14, color: '#475569', lineHeight: 1.6 }}>{t.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div data-reveal style={{ transitionDelay: '140ms', position: 'relative' }}>
            <div style={{ borderRadius: 24, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,87,231,0.1), 0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
              <img src="/about-story.jpg" alt="MOOVON story" style={{ width: '100%', display: 'block', objectFit: 'cover' }} />
            </div>
            {/* Floating badge */}
            <div style={{ position: 'absolute', bottom: -16, right: -16, background: '#0057e7', borderRadius: 16, padding: '18px 24px', boxShadow: '0 12px 40px rgba(0,87,231,0.3)', textAlign: 'center' }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', lineHeight: 1 }}>120+</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 4, fontWeight: 600, letterSpacing: '0.04em' }}>Cities Worldwide</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. FEATURE STRIP ─────────────────────────────────────── */}
      <section style={{ background: '#f8faff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '0 24px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)' }} className="ab-strip">
          {[
            { icon: <Users size={22} />, title: 'World-Class Team', desc: 'A diverse group of thinkers, builders and problem-solvers united by one goal.' },
            { icon: <Award size={22} />, title: 'Award Winning', desc: 'Recognized globally for innovation, design excellence and customer impact.' },
            { icon: <Globe size={22} />, title: 'Global Reach', desc: 'Serving customers across 120+ cities with the same standard of excellence.' },
          ].map((f, i) => (
            <div key={i} data-reveal style={{ transitionDelay: `${i * 100}ms`, padding: '48px 36px', borderRight: i < 2 ? '1px solid #e2e8f0' : 'none', display: 'flex', gap: 18, alignItems: 'flex-start' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0057e7', flexShrink: 0 }}>{f.icon}</div>
              <div>
                <h3 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{f.title}</h3>
                <p style={{ margin: 0, fontSize: 13.5, color: '#64748b', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 8. CTA ───────────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, #0057e7 0%, #1e40af 100%)', padding: '100px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle pattern */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 40%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 640, margin: '0 auto' }} data-reveal>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 16px', borderRadius: 40, marginBottom: 28 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Ready to Start?</span>
          </div>
          <h2 style={{ fontSize: 'clamp(32px,5vw,56px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.1, margin: '0 0 20px', color: '#fff' }}>
            The Journey Starts Here.
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.75)', margin: '0 auto 44px', maxWidth: 440, lineHeight: 1.75 }}>
            We're building MOOVON for people who believe moving forward should be simple.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' as const }}>
            <button
              onClick={() => navigate('/login')}
              onMouseEnter={(e) => { const b = e.currentTarget; b.style.transform = 'translateY(-2px)'; b.style.boxShadow = '0 12px 40px rgba(0,0,0,0.25)'; }}
              onMouseLeave={(e) => { const b = e.currentTarget; b.style.transform = 'translateY(0)'; b.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)'; }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '15px 36px', background: '#fff', color: '#0057e7', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
            >
              Get Started <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate('/login')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '15px 32px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.3)', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s ease' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
            >
              Sign In
            </button>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 28 }}>No credit card required · Set up in minutes · Cancel anytime</p>
        </div>
      </section>

      {/* ── RESPONSIVE ───────────────────────────────────────────── */}
      <style>{`
        @media (max-width: 920px) {
          .ab-two { grid-template-columns: 1fr !important; gap: 44px !important; }
          .ab-mv { grid-template-columns: 1fr !important; }
          .ab-vals { grid-template-columns: 1fr 1fr !important; }
          .ab-strip { grid-template-columns: 1fr !important; }
          .ab-stats { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 560px) {
          .ab-vals { grid-template-columns: 1fr !important; }
          .ab-stats { grid-template-columns: 1fr 1fr !important; }
        }
        * { -webkit-font-smoothing: antialiased; }
      `}</style>
    </div>
  );
};

export default About;
