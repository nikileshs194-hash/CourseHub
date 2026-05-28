import { useState, useEffect } from 'react';
import { Save, User, Building2, Pencil, X, Info, GraduationCap, Globe, Mail, BookOpen, Users, ClipboardList } from 'lucide-react';
import { getSettings, updateSettings, getDashboardStats } from '../services/api';

const inputStyle = {
  border: '1px solid #e5e7eb', borderRadius: '8px', padding: '10px 14px',
  fontSize: '13.5px', color: '#111827', outline: 'none', width: '100%',
  fontFamily: 'inherit', backgroundColor: '#fff',
};
const focusStyle = { borderColor: '#1e3a8a', boxShadow: '0 0 0 3px rgba(30,58,138,0.08)' };

function Section({ icon: Icon, title, editing, onEdit, onCancel, children }) {
  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '14px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid #f3f4f6', backgroundColor: '#fafafa' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={17} color="#1e3a8a" />
          </div>
          <h3 style={{ fontWeight: '700', fontSize: '15px', color: '#111827' }}>{title}</h3>
        </div>
        {editing
          ? <button onClick={onCancel} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '6px 12px', fontSize: '12.5px', fontWeight: '600', color: '#6b7280', cursor: 'pointer' }}>
              <X size={13} /> Cancel
            </button>
          : <button onClick={onEdit} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '6px 12px', fontSize: '12.5px', fontWeight: '600', color: '#1e3a8a', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#eff6ff'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
              <Pencil size={13} /> Edit
            </button>
        }
      </div>
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>{children}</div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>{label}</label>
      {children}
      {hint && <p style={{ fontSize: '11.5px', color: '#9ca3af', marginTop: '2px' }}>{hint}</p>}
    </div>
  );
}

function ReadOnly({ value }) {
  return (
    <div style={{ border: '1px solid #f3f4f6', borderRadius: '8px', padding: '10px 14px', fontSize: '13.5px', color: '#111827', backgroundColor: '#f9fafb' }}>
      {value || '—'}
    </div>
  );
}

export default function Settings() {
  const [settings, setSettings] = useState(null);
  const [form, setForm]         = useState({});
  const [editProfile, setEditProfile]         = useState(false);
  const [editInstitution, setEditInstitution] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [toast, setToast]       = useState('');
  const [error, setError]       = useState('');
  const [stats, setStats]       = useState(null);

  useEffect(() => {
    getSettings()
      .then(r => { setSettings(r.data); setForm(r.data); })
      .catch(e => setError('Error: ' + (e?.message || String(e))));
    getDashboardStats()
      .then(r => setStats(r.data))
      .catch(() => {});
  }, []);

  const cancelProfile     = () => { setForm(settings); setEditProfile(false); };
  const cancelInstitution = () => { setForm(settings); setEditInstitution(false); };

  const save = async (section) => {
    setSaving(true);
    try {
      const updated = await updateSettings(settings?.id || null, {
        admin_name:       form.admin_name,
        email:            form.email,
        institution_name: form.institution_name,
        academic_year:    form.academic_year,
        website:          form.website,
      });
      setSettings(updated.data);
      setForm(updated.data);
      if (section === 'profile') setEditProfile(false);
      if (section === 'institution') setEditInstitution(false);
      setToast('Settings saved successfully');
      setTimeout(() => setToast(''), 2500);
    } catch (e) {
      setToast('Failed to save: ' + (e?.message || 'Unknown error'));
      setTimeout(() => setToast(''), 2500);
    } finally {
      setSaving(false);
    }
  };

  const f = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Header */}
      <div>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', letterSpacing: '-0.3px' }}>Settings</h2>
        <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '4px' }}>System configuration and preferences</p>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          borderRadius: '10px', padding: '12px 16px', fontSize: '13px', fontWeight: '500',
          backgroundColor: toast.includes('Failed') ? '#fef2f2' : '#f0fdf4',
          border: `1px solid ${toast.includes('Failed') ? '#fecaca' : '#bbf7d0'}`,
          color: toast.includes('Failed') ? '#dc2626' : '#15803d',
        }}>
          {toast.includes('Failed') ? '✗' : '✓'} {toast}
        </div>
      )}

      {error && (
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px 16px', color: '#dc2626', fontSize: '13px' }}>
          ⚠ {error}
        </div>
      )}

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>

        {/* Left — Settings sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Admin Profile */}
          <Section icon={User} title="Admin Profile"
            editing={editProfile}
            onEdit={() => setEditProfile(true)}
            onCancel={cancelProfile}>
            <Field label="Admin Name">
              {editProfile
                ? <input value={form.admin_name || ''} onChange={f('admin_name')} style={inputStyle}
                    onFocus={e => Object.assign(e.target.style, focusStyle)}
                    onBlur={e => { e.target.style.borderColor='#e5e7eb'; e.target.style.boxShadow='none'; }} />
                : <ReadOnly value={settings?.admin_name} />
              }
            </Field>
            <Field label="Email Address" hint="Used for system notifications">
              {editProfile
                ? <input value={form.email || ''} onChange={f('email')} type="email" style={inputStyle}
                    onFocus={e => Object.assign(e.target.style, focusStyle)}
                    onBlur={e => { e.target.style.borderColor='#e5e7eb'; e.target.style.boxShadow='none'; }} />
                : <ReadOnly value={settings?.email} />
              }
            </Field>
            {editProfile && (
              <div>
                <button onClick={() => save('profile')} disabled={saving} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  backgroundColor: saving ? '#93c5fd' : '#1e3a8a', color: '#fff',
                  border: 'none', borderRadius: '10px', padding: '10px 22px',
                  fontSize: '13.5px', fontWeight: '600', cursor: saving ? 'not-allowed' : 'pointer',
                }}>
                  <Save size={15} /> {saving ? 'Saving…' : 'Save Profile'}
                </button>
              </div>
            )}
          </Section>

          {/* Institution */}
          <Section icon={Building2} title="Institution Details"
            editing={editInstitution}
            onEdit={() => setEditInstitution(true)}
            onCancel={cancelInstitution}>
            <Field label="Institution Name">
              {editInstitution
                ? <input value={form.institution_name || ''} onChange={f('institution_name')} style={inputStyle}
                    onFocus={e => Object.assign(e.target.style, focusStyle)}
                    onBlur={e => { e.target.style.borderColor='#e5e7eb'; e.target.style.boxShadow='none'; }} />
                : <ReadOnly value={settings?.institution_name} />
              }
            </Field>
            <Field label="Academic Year">
              {editInstitution
                ? <select value={form.academic_year || '2024-25'} onChange={f('academic_year')} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option>2023-24</option>
                    <option>2024-25</option>
                    <option>2025-26</option>
                    <option>2026-27</option>
                  </select>
                : <ReadOnly value={settings?.academic_year} />
              }
            </Field>
            <Field label="Website" hint="Official college website">
              {editInstitution
                ? <input value={form.website || ''} onChange={f('website')} style={inputStyle}
                    onFocus={e => Object.assign(e.target.style, focusStyle)}
                    onBlur={e => { e.target.style.borderColor='#e5e7eb'; e.target.style.boxShadow='none'; }} />
                : <ReadOnly value={settings?.website} />
              }
            </Field>
            {editInstitution && (
              <div>
                <button onClick={() => save('institution')} disabled={saving} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  backgroundColor: saving ? '#93c5fd' : '#1e3a8a', color: '#fff',
                  border: 'none', borderRadius: '10px', padding: '10px 22px',
                  fontSize: '13.5px', fontWeight: '600', cursor: saving ? 'not-allowed' : 'pointer',
                }}>
                  <Save size={15} /> {saving ? 'Saving…' : 'Save Details'}
                </button>
              </div>
            )}
          </Section>
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Branding card */}
          <div style={{ borderRadius: '14px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
            {/* Building image with logo + name overlaid */}
            <div style={{ position: 'relative', height: '200px', backgroundColor: '#1a2464', overflow: 'hidden' }}>
              <img src="/mit-college.jpg" alt="MIT Campus" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 35%', display: 'block' }} />
              {/* Subtle top overlay for text readability */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '75px', background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)' }} />
              {/* Logo + name top-left */}
              <div style={{ position: 'absolute', top: '12px', left: '12px', right: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', border: '1.5px solid rgba(255,255,255,0.4)', flexShrink: 0 }}>
                  <img src="/mit-logo.png" alt="MIT Logo" style={{ width: '112%', height: '112%', marginLeft: '0.2%', marginTop: '-5.5%', objectFit: 'cover', display: 'block' }} />
                </div>
                <div>
                  <div style={{ color: '#fff', fontWeight: '700', fontSize: '12px', letterSpacing: '0.3px', lineHeight: 1.4, textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>MAHARAJA INSTITUTE OF TECHNOLOGY</div>
                  <div style={{ color: '#f97316', fontWeight: '700', fontSize: '12px', letterSpacing: '0.8px', textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>MYSORE</div>
                </div>
              </div>
            </div>
            <div style={{ backgroundColor: '#fff', padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px', fontSize: '12px' }}>
                <Mail size={13} color="#1e3a8a" />
                <a href={`mailto:${settings?.email || 'principal@mitmysore.in'}`}
                  style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#1e3a8a', textDecoration: 'underline', cursor: 'pointer' }}>
                  {settings?.email || 'principal@mitmysore.in'}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px', fontSize: '12px' }}>
                <Globe size={13} color="#1e3a8a" />
                <a href={settings?.website || 'https://mitmysore.in'} target="_blank" rel="noopener noreferrer"
                  style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#1e3a8a', textDecoration: 'underline', cursor: 'pointer' }}>
                  {settings?.website || 'https://mitmysore.in'}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px', fontSize: '12px', color: '#6b7280' }}>
                <GraduationCap size={13} color="#1e3a8a" />
                <span>Academic Year: {settings?.academic_year || '2024-25'}</span>
              </div>
            </div>
          </div>

          {/* System stats */}
          <div style={{ backgroundColor: '#fff', borderRadius: '14px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#fafafa' }}>
              <Info size={15} color="#1e3a8a" />
              <span style={{ fontWeight: '700', fontSize: '13.5px', color: '#111827' }}>System Overview</span>
            </div>
            <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { icon: Users,        label: 'Total Students',      value: stats?.totalStudents      ?? '—', color: '#eff6ff', iconColor: '#1d4ed8' },
                { icon: BookOpen,     label: 'Total Courses',       value: stats?.totalCourses       ?? '—', color: '#f0fdf4', iconColor: '#15803d' },
                { icon: ClipboardList,label: 'Registrations',       value: stats?.totalRegistrations ?? '—', color: '#fff7ed', iconColor: '#c2410c' },
                { icon: Building2,    label: 'Departments',         value: stats?.totalDepartments   ?? '—', color: '#faf5ff', iconColor: '#7e22ce' },
              ].map(({ icon: Icon, label, value, color, iconColor }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', backgroundColor: '#f9fafb', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '7px', backgroundColor: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={14} color={iconColor} />
                    </div>
                    <span style={{ fontSize: '12.5px', color: '#6b7280' }}>{label}</span>
                  </div>
                  <span style={{ fontSize: '15px', fontWeight: '700', color: '#111827' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* App info */}
          <div style={{ backgroundColor: '#fff', borderRadius: '14px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', padding: '16px 18px' }}>
            <div style={{ fontSize: '12px', color: '#9ca3af', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Application</span>
                <span style={{ color: '#374151', fontWeight: '600' }}>CourseHub</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Version</span>
                <span style={{ color: '#374151', fontWeight: '600' }}>1.0.0</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Database</span>
                <span style={{ color: '#374151', fontWeight: '600' }}>Supabase</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Status</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#15803d', fontWeight: '600' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} />
                  Online
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
