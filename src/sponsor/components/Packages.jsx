import { useState } from 'react';
import { CheckIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import PackageInterestModal from './PackageInterestModal';
import { useSite } from '../store/SiteContext';

const TIER_ORDER = ['Bronze', 'Silver', 'Gold', 'Platinum'];

function sortPackages(packages) {
  return [...packages].sort((a, b) => {
    const ai = TIER_ORDER.indexOf(a.badge);
    const bi = TIER_ORDER.indexOf(b.badge);
    if (ai === -1 && bi === -1) return 0;
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

export default function Packages() {
  const { data } = useSite();
  const packages = sortPackages(data.packages ?? []);
  const [interestPkg, setInterestPkg] = useState(null);

  return (
    <section id="packages" style={{ background: 'var(--off)', padding: 'clamp(48px,6vw,72px) clamp(18px,4vw,48px)', position: 'relative' }}>
      <PackageInterestModal
        pkg={interestPkg}
        open={Boolean(interestPkg)}
        onClose={() => setInterestPkg(null)}
      />
      <div style={{ maxWidth: '1480px', margin: '0 auto', width: '80%' }}>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px 48px', marginBottom: '32px', alignItems: 'end', justifyContent: 'space-between' }}>
          <div className="reveal-l" style={{ minWidth: 'min(100%, 320px)' }}>
            <div style={{ fontSize: '9.5px', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '22px', height: '1.5px', background: 'var(--gold)', flexShrink: 0, display: 'inline-block' }}></span>
              Sponsorship Packs & Benefits
            </div>
            <h2 style={{ fontSize: 'clamp(24px,3.2vw,40px)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-1px', color: 'var(--lt)', margin: 0 }}>
              Choose your <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>tier</em>
            </h2>
          </div>
          <p className="reveal-r" style={{ color: 'var(--lt)', fontSize: '13.5px', lineHeight: 1.65, fontWeight: 500, maxWidth: '36em', margin: 0 }}>
            Bronze, Silver, Gold, and Platinum — benefits scaled for visibility, media, speaking, and on-site presence at DTW2026.
          </p>
        </div>

        <div className="stagger grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
          {packages.map((pkg) => {
            const slotsLeft = Number(pkg.slots) || 0;
            const featured = Boolean(pkg.featured);
            return (
              <div
                key={pkg.id}
                className={`pkg-card${featured ? ' feat' : ''}`}
                style={{
                  background: featured ? 'var(--dark)' : 'var(--white)',
                  border: `1px solid ${featured ? 'rgba(255,255,255,0.10)' : 'var(--lb)'}`,
                  padding: '20px 22px',
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: 0,
                }}
              >
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '12px 20px',
                  marginBottom: '14px',
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: 0 }}>
                    <div style={{
                      display: 'inline-flex',
                      alignSelf: 'flex-start',
                      fontSize: '9.5px',
                      fontWeight: 800,
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      padding: '5px 10px',
                      background: featured ? 'rgba(212,160,23,0.12)' : 'rgba(242, 233, 211, 0.38)',
                      color: featured ? 'var(--gold)' : 'var(--lt)',
                      border: `1px solid ${featured ? 'var(--gold)' : 'rgba(61, 57, 47, 0.2)'}`,
                      borderRadius: '2px',
                    }}>
                      {pkg.badge}
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: 'var(--gold)',
                    }}>
                      <UserGroupIcon style={{ width: 16, height: 16, flexShrink: 0 }} strokeWidth={2} aria-hidden />
                      <span style={{ fontSize: '11.5px', fontWeight: 600 }}>
                        {slotsLeft} {slotsLeft === 1 ? 'slot' : 'slots'} available
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: '9px',
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: featured ? 'rgba(240,238,234,0.55)' : 'var(--lt3)',
                      marginBottom: '2px',
                    }}>
                      Investment
                    </div>
                    <div style={{
                      fontSize: 'clamp(20px,2vw,26px)',
                      fontWeight: 900,
                      color: featured ? 'var(--dt)' : 'var(--lt)',
                      letterSpacing: '-0.4px',
                      lineHeight: 1.1,
                    }}>
                      {pkg.price}
                      <span style={{
                        marginLeft: '6px',
                        fontSize: '12px',
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        color: featured ? 'var(--gold)' : 'var(--lt)',
                        opacity: featured ? 1 : 0.85,
                      }}>
                        {pkg.currency}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ height: '1px', background: featured ? 'rgba(255,255,255,0.09)' : 'var(--lb)', marginBottom: '12px' }} />

                <ul style={{
                  listStyle: 'none',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  columnGap: '16px',
                  rowGap: '7px',
                  margin: 0,
                  padding: 0,
                  flex: 1,
                }}>
                  {pkg.benefits.map((b, i) => (
                    <li key={i} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '7px',
                      fontSize: '11.5px',
                      fontWeight: 500,
                      color: featured ? 'rgba(240,238,234,0.92)' : 'var(--lt)',
                      lineHeight: 1.4,
                    }}>
                      <CheckIcon style={{ width: 14, height: 14, flexShrink: 0, marginTop: 2, color: 'var(--gold)' }} aria-hidden strokeWidth={2.5} />
                      {b}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  disabled={slotsLeft <= 0}
                  onClick={() => setInterestPkg(pkg)}
                  style={{
                    marginTop: '16px',
                    width: '100%',
                    maxWidth: '280px',
                    alignSelf: 'center',
                    padding: '10px 14px',
                    background: slotsLeft <= 0 ? 'color-mix(in srgb, var(--gold) 45%, transparent)' : 'var(--gold)',
                    border: '1px solid var(--gold)',
                    color: '#0a0a0a',
                    fontFamily: "'Montserrat',sans-serif",
                    fontSize: '9.5px',
                    fontWeight: 700,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    transition: '.3s',
                    textAlign: 'center',
                    display: 'block',
                    cursor: slotsLeft <= 0 ? 'not-allowed' : 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    if (slotsLeft <= 0) return;
                    e.currentTarget.style.background = 'var(--gold2)';
                    e.currentTarget.style.borderColor = 'var(--gold2)';
                  }}
                  onMouseLeave={(e) => {
                    if (slotsLeft <= 0) return;
                    e.currentTarget.style.background = 'var(--gold)';
                    e.currentTarget.style.borderColor = 'var(--gold)';
                  }}
                >
                  {slotsLeft > 0 ? pkg.ctaText : 'Sold Out'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
