import { useEffect, useState } from 'react';
import { Menu, Calendar, UserCircle2 } from 'lucide-react';
import { getSettings } from '../services/api';

export default function Navbar() {
  const [adminName, setAdminName] = useState('Administrator');

  useEffect(() => {
    getSettings().then(r => { if (r.data?.admin_name) setAdminName(r.data.admin_name); }).catch(() => {});
  }, []);

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

        {/* Admin display — no dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 10px', borderRadius: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserCircle2 size={22} color="white" />
          </div>
          <div style={{ textAlign: 'left' }}>
            <p style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', lineHeight: 1 }}>{adminName}</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '3px' }}>Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
