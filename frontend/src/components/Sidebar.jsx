import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, BookOpen, ClipboardList, BarChart2, Settings
} from 'lucide-react';

const navItems = [
  { to: '/',              label: 'Dashboard',     icon: LayoutDashboard },
  { to: '/students',      label: 'Students',       icon: Users },
  { to: '/courses',       label: 'Courses',        icon: BookOpen },
  { to: '/registrations', label: 'Registrations',  icon: ClipboardList },
  { to: '/reports',       label: 'Reports',        icon: BarChart2 },
  { to: '/settings',      label: 'Settings',       icon: Settings },
];

function NavItem({ to, label, icon: Icon }) {
  const { pathname } = useLocation();
  const active = pathname === to;

  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '11px',
        padding: '9px 14px', borderRadius: '10px', marginBottom: '3px',
        backgroundColor: active ? '#ffffff' : 'transparent',
        color: active ? '#1a2464' : '#ffffff',
        fontWeight: active ? '600' : '400',
        fontSize: '13.5px',
        transition: 'all 0.15s',
        cursor: 'pointer',
      }}
        onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; }}
        onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = 'transparent'; }}
      >
        <Icon size={17} color={active ? '#f97316' : 'rgba(255,255,255,0.65)'} strokeWidth={active ? 2.2 : 1.8} />
        {label}
      </div>
    </Link>
  );
}

export default function Sidebar() {
  return (
    <aside style={{
      position: 'fixed', top: 0, left: 0, height: '100%', width: '240px',
      backgroundColor: '#1a2464', zIndex: 50,
      display: 'flex', flexDirection: 'column',
    }}>

      {/* ── Logo ── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 16px 8px' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
          <img
            src="/mit-logo.png"
            alt="MIT Mysore Logo"
            style={{
              width: '112%', height: '112%',
              marginLeft: '0.2%', marginTop: '-5.5%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>
        {/* College name */}
        <div style={{ textAlign: 'center', marginTop: '10px', lineHeight: '1.45' }}>
          <div style={{ color: '#ffffff', fontWeight: '700', fontSize: '11.5px', letterSpacing: '0.5px' }}>MAHARAJA</div>
          <div style={{ color: '#ffffff', fontWeight: '700', fontSize: '11.5px', letterSpacing: '0.5px' }}>INSTITUTE OF</div>
          <div style={{ color: '#ffffff', fontWeight: '700', fontSize: '11.5px', letterSpacing: '0.5px' }}>TECHNOLOGY</div>
          <div style={{ color: '#f97316', fontWeight: '700', fontSize: '11.5px', letterSpacing: '1.5px', marginTop: '3px' }}>MYSORE</div>
        </div>
      </div>

      {/* ── Nav ── */}
      <nav style={{ padding: '4px 12px' }}>
        {navItems.map(item => <NavItem key={item.to} {...item} />)}
      </nav>

      {/* ── College building image + tagline ── */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: '220px' }}>
        <img
          src="/mit-college.jpg"
          alt="MIT Mysore Campus"
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: '50% 10%',
            display: 'block',
          }}
        />
        {/* Top fade — strong, blends into sidebar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '55%',
          background: 'linear-gradient(to bottom, #1a2464 0%, #1a2464 20%, rgba(26,36,100,0.6) 70%, transparent 100%)',
        }} />
        {/* Bottom fade + tagline */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '40px 14px 14px',
          background: 'linear-gradient(to top, #1a2464 0%, #1a2464 30%, rgba(26,36,100,0.7) 65%, transparent 100%)',
        }}>
          <p style={{ color: 'rgba(255,255,255,0.95)', fontSize: '12px', fontWeight: '700', letterSpacing: '0.3px', lineHeight: '1.9' }}>
            EMPOWERING <span style={{ color: '#f97316' }}>INNOVATION.</span><br/>
            TRANSFORMING <span style={{ color: '#f97316' }}>LIVES.</span>
          </p>
        </div>
      </div>
    </aside>
  );
}
