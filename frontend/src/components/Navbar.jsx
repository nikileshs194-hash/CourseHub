import { useState } from 'react';
import { Menu, Calendar, ChevronDown, UserCircle2 } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const weekday = today.toLocaleDateString('en-GB', { weekday: 'long' });

  return (
    <header style={{
      position: 'fixed', top: 0, left: '240px', right: 0, height: '64px',
      backgroundColor: '#1a2464', zIndex: 40,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 28px',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
    }}>

      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'rgba(255,255,255,0.6)', padding: '6px', borderRadius: '8px',
          display: 'flex', alignItems: 'center',
        }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 style={{ color: '#ffffff', fontWeight: '700', fontSize: '15px', letterSpacing: '-0.2px', lineHeight: 1 }}>
            Maharaja Institute of Technology, Mysore
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '11.5px', marginTop: '3px' }}>
            Course Registration Management System
          </p>
        </div>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', color: '#ffffff', fontSize: '13px' }}>
          <Calendar size={14} color="#ffffff" />
          <span>{dateStr}, {weekday}</span>
        </div>

        {/* Admin */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setOpen(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '6px 10px', borderRadius: '10px',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              backgroundColor: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <UserCircle2 size={22} color="white" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', lineHeight: 1 }}>Admin</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '3px' }}>Administrator</p>
            </div>
            <ChevronDown size={14} color="rgba(255,255,255,0.4)" />
          </button>

          {open && (
            <div style={{
              position: 'absolute', right: 0, top: '52px',
              width: '140px', backgroundColor: '#fff',
              borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              border: '1px solid #e5e7eb', padding: '4px', zIndex: 100,
            }}>
              {['Profile', 'Logout'].map(label => (
                <button key={label} style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '8px 12px', fontSize: '13px', color: '#374151',
                  background: 'none', border: 'none', cursor: 'pointer',
                  borderRadius: '8px',
                }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f9fafb'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
