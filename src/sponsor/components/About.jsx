import { DEFAULT_SITE_IMAGE } from '../constants/mediaDefaults';
import { useSite } from '../store/SiteContext';

export default function About() {
  const { data } = useSite();
  const { about } = data;
  const visualSrc = about.visualImage?.trim() || DEFAULT_SITE_IMAGE;

  return (
    <section id="about" style={{ background: 'var(--white)', padding: 'clamp(52px,7vw,88px) clamp(22px,6vw,80px)', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg,transparent,var(--lb) 40%,transparent)' }}></div>
      <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 'clamp(36px,5vw,68px)', alignItems: 'center' }}>

          {/* Visual */}
          <div className="reveal-l" style={{ position: 'relative', minHeight: '400px', height: 'clamp(320px, 42vw, 440px)' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '4px', border: '1px solid var(--lb)', overflow: 'hidden', background: 'var(--off)' }}>
              <img
                src={visualSrc}
                alt={about.venue ? `${about.venue}, ${about.location}` : 'Digital Transformation Week venue'}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                loading="lazy"
                decoding="async"
              />
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(180deg, rgba(15,15,15,0.12) 0%, transparent 35%, transparent 65%, rgba(244,242,236,0.25) 100%)' }} aria-hidden />
            </div>
            <div className="about-float" style={{ position: 'absolute', bottom: '14px', left: '14px', background: 'var(--white)', border: '1px solid var(--lb)', padding: '11px 14px', borderRadius: '2px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '14px', fontWeight: 900, color: 'var(--lt)', lineHeight: 1 }}>{about.eventDate}</div>
              <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--lt3)' }}>Event Date</div>
            </div>
            <div className="about-float" style={{ position: 'absolute', top: '20px', right: '14px', background: 'var(--white)', border: '1px solid var(--lb)', padding: '11px 14px', borderRadius: '2px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '14px', fontWeight: 900, color: 'var(--lt)', lineHeight: 1 }}>{about.location}</div>
              <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--lt3)' }}>{about.venue}</div>
            </div>
          </div>

          {/* Content */}
          <div className="reveal-r">
            <div style={{ fontSize: '9.5px', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '22px', height: '1.5px', background: 'var(--gold)', flexShrink: 0, display: 'inline-block' }}></span>
              About the Event
            </div>
            <h2 style={{ fontSize: 'clamp(24px,3.4vw,44px)', fontWeight: 900, lineHeight: 1.07, letterSpacing: '-1px', marginBottom: '14px', color: 'var(--lt)' }}>
              Digital Transformation<br /><em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Week 2026</em>
            </h2>
            <div style={{ width: '36px', height: '1.5px', background: 'var(--gold)', marginBottom: '18px' }}></div>
            <p style={{ color: 'var(--lt2)', fontSize: '13px', lineHeight: 1.78, marginBottom: '14px' }}>{about.paragraph1}</p>
            <p style={{ color: 'var(--lt2)', fontSize: '13px', lineHeight: 1.78, marginBottom: '14px' }}>{about.paragraph2}</p>
            <ul style={{ listStyle: 'none', marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '9px' }}>
              {about.bullets.map((b, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '9px', fontSize: '12.5px', color: 'var(--lt2)', fontWeight: 500 }}>
                  <span style={{ color: 'var(--gold)', flexShrink: 0, fontSize: '11px', marginTop: '2px' }}>—</span>
                  <b style={{ fontWeight: 600 }}>{b}</b>

                </li>
              ))}
            </ul>
            {/* <div style={{ marginTop: '28px', background: 'var(--gold-bg)', borderLeft: '2px solid var(--gold)', padding: '13px 18px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              {about.dates.map((d, i) => (
                <div key={i}>
                  <strong style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: 'var(--lt)' }}>{d.value}</strong>
                  <span style={{ fontSize: '8.5px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--lt3)', fontWeight: 600 }}>{d.label}</span>
                </div>
              ))}
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}
