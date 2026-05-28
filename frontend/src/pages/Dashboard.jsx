import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { getDashboardStats, getRecentRegistrations, getMostRegisteredCourses } from '../services/api';

const SEM_COLORS = ['#1e3a8a','#2563eb','#16a34a','#d97706','#ea580c','#dc2626','#7c3aed','#eab308'];
const BAR_COLORS = ['#1e3a8a','#2563eb','#16a34a','#ca8a04','#dc2626'];
const COURSE_ICONS = ['📘','🖥️','🌐','⚙️','🗂️'];

/* ─── Stat Card ─────────────────────────────────────────── */
function StatCard({ iconSvg, bgColor, borderColor, title, value, linkText, to }) {
  const navigate = useNavigate();
  return (
    <div style={{
      backgroundColor: '#fff', borderRadius: '14px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.07)', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      transition: 'box-shadow 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.07)'}
    >
      <div style={{ padding: '20px 20px 0' }}>
        {/* Icon */}
        <div style={{
          width: '48px', height: '48px', borderRadius: '50%',
          backgroundColor: bgColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '12px',
        }}>
          {iconSvg}
        </div>
        {/* Title */}
        <p style={{ color: '#6b7280', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>{title}</p>
        {/* Number */}
        <p style={{ color: '#111827', fontSize: '32px', fontWeight: '800', lineHeight: 1, letterSpacing: '-1px' }}>
          {value != null ? value.toLocaleString() : '—'}
        </p>
      </div>
      {/* Footer link */}
      <div style={{ marginTop: 'auto', padding: '14px 20px 16px', borderTop: `3px solid ${borderColor}` }}>
        <button
          onClick={() => navigate(to)}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: borderColor, fontSize: '13px', fontWeight: '500', padding: 0,
          }}
        >
          {linkText} <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

/* ─── Custom Bar Tooltip ─────────────────────────────────── */
function BarTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <p style={{ fontWeight: '600', color: '#374151', fontSize: '12px' }}>Semester {label}</p>
      <p style={{ color: '#1e3a8a', fontSize: '12px' }}>{payload[0].value} Courses</p>
    </div>
  );
}

/* ─── Donut inner label ──────────────────────────────────── */
function DonutLabel({ cx, cy, midAngle, innerRadius, outerRadius, value }) {
  if (value < 30) return null;
  const R = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  return (
    <text
      x={cx + r * Math.cos(-midAngle * R)}
      y={cy + r * Math.sin(-midAngle * R)}
      fill="white" textAnchor="middle" dominantBaseline="central"
      fontSize={10} fontWeight="700"
    >{value}</text>
  );
}

/* ─── Section Header ─────────────────────────────────────── */
function SectionHeader({ icon, title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
      <span style={{ color: '#1e3a8a', display: 'flex' }}>{icon}</span>
      <h3 style={{ fontWeight: '700', color: '#111827', fontSize: '14px' }}>{title}</h3>
    </div>
  );
}

/* ─── Icons ──────────────────────────────────────────────── */
const StudentsIcon = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#2563eb" strokeWidth="1.8">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const CoursesIcon = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#16a34a" strokeWidth="1.8">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);
const RegsIcon = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#7c3aed" strokeWidth="1.8">
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
    <rect x="9" y="3" width="6" height="4" rx="1"/><path d="m9 12 2 2 4-4"/>
  </svg>
);
const DeptIcon = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#ea580c" strokeWidth="1.8">
    <rect x="2" y="7" width="20" height="14" rx="1"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);
const BarIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
  </svg>
);
const PieIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>
  </svg>
);
const ListIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
    <rect x="9" y="3" width="6" height="4" rx="1"/>
    <line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/>
  </svg>
);
const BookIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);

/* ─── Dashboard ──────────────────────────────────────────── */
export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats]       = useState(null);
  const [recent, setRecent]     = useState([]);
  const [topCourses, setTop]    = useState([]);
  const [semFilter, setFilter]  = useState('All Semesters');
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([getDashboardStats(), getRecentRegistrations(), getMostRegisteredCourses()])
      .then(([s, r, t]) => { setStats(s.data); setRecent(r.data); setTop(t.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const coursesBySem = stats?.coursesBySemester ?? [];
  const regsBySem    = stats?.registrationsBySemester ?? [];
  const totalRegs    = regsBySem.reduce((a, b) => a + b.count, 0);
  const maxCount     = topCourses[0]?.count || 1;

  const barData = semFilter === 'All Semesters'
    ? coursesBySem
    : coursesBySem.filter(d => d.semester === +semFilter);

  const pieData = regsBySem.map((d, i) => ({
    name: `Semester ${d.semester}`, value: d.count, color: SEM_COLORS[i] ?? '#94a3b8',
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Welcome */}
      <div>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', letterSpacing: '-0.3px' }}>
          Welcome back, Admin!
        </h2>
        <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '4px' }}>
          Here's the overview of course registration system.
        </p>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px' }}>
        <StatCard iconSvg={<StudentsIcon/>} bgColor="#eff6ff" borderColor="#2563eb"
          title="Total Students"       value={stats?.totalStudents}      linkText="View all students"      to="/students" />
        <StatCard iconSvg={<CoursesIcon/>}  bgColor="#f0fdf4" borderColor="#16a34a"
          title="Total Courses"        value={stats?.totalCourses}       linkText="View all courses"       to="/courses" />
        <StatCard iconSvg={<RegsIcon/>}     bgColor="#faf5ff" borderColor="#7c3aed"
          title="Total Registrations"  value={stats?.totalRegistrations} linkText="View all registrations" to="/registrations" />
        <StatCard iconSvg={<DeptIcon/>}     bgColor="#fff7ed" borderColor="#ea580c"
          title="Departments"          value={stats?.totalDepartments}   linkText="View all departments"   to="/students" />
      </div>

      {/* ── Charts ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

        {/* Bar Chart */}
        <div style={{ backgroundColor: '#fff', borderRadius: '14px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e3a8a' }}>
              <BarIcon /><h3 style={{ fontWeight: '700', color: '#111827', fontSize: '14px' }}>Courses by Semester</h3>
            </div>
            <select value={semFilter} onChange={e => setFilter(e.target.value)}
              style={{ fontSize: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '5px 10px', color: '#374151', outline: 'none', cursor: 'pointer' }}>
              <option>All Semesters</option>
              {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
            </select>
          </div>
          {loading
            ? <div style={{ height: '230px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d1d5db', fontSize: '13px' }}>Loading…</div>
            : barData.length === 0
              ? <div style={{ height: '230px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d1d5db', fontSize: '13px' }}>No data — run schema.sql in Supabase</div>
              : <ResponsiveContainer width="100%" height={230}>
                  <BarChart data={barData} margin={{ top: 18, right: 8, left: -22, bottom: 16 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="semester" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                      label={{ value: 'Semester', position: 'insideBottom', offset: -6, fontSize: 11, fill: '#9ca3af' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                      label={{ value: 'Number of Courses', angle: -90, position: 'insideLeft', offset: 26, fontSize: 10, fill: '#9ca3af' }} />
                    <Tooltip content={<BarTip />} />
                    <Bar dataKey="count" fill="#1e3a8a" radius={[4,4,0,0]}
                      label={{ position: 'top', fontSize: 10, fill: '#6b7280', fontWeight: '600' }} />
                  </BarChart>
                </ResponsiveContainer>
          }
        </div>

        {/* Donut Chart */}
        <div style={{ backgroundColor: '#fff', borderRadius: '14px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px', color: '#1e3a8a' }}>
            <PieIcon /><h3 style={{ fontWeight: '700', color: '#111827', fontSize: '14px' }}>Registrations by Semester</h3>
          </div>
          {loading
            ? <div style={{ height: '230px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d1d5db', fontSize: '13px' }}>Loading…</div>
            : pieData.length === 0
              ? <div style={{ height: '230px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d1d5db', fontSize: '13px' }}>No data — run schema.sql in Supabase</div>
              : <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* Donut */}
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <PieChart width={200} height={200}>
                      <Pie data={pieData} cx={96} cy={96} innerRadius={58} outerRadius={95}
                        dataKey="value" labelLine={false} label={<DonutLabel />}>
                        {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                    </PieChart>
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      pointerEvents: 'none',
                    }}>
                      <span style={{ fontSize: '22px', fontWeight: '800', color: '#111827', letterSpacing: '-0.5px' }}>
                        {totalRegs.toLocaleString()}
                      </span>
                      <span style={{ fontSize: '10px', color: '#9ca3af' }}>Total</span>
                    </div>
                  </div>
                  {/* Legend */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {pieData.map((e, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: e.color, flexShrink: 0 }} />
                          <span style={{ fontSize: '11px', color: '#4b5563' }}>{e.name}</span>
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: '600', color: '#111827', marginLeft: '8px' }}>
                          {e.value} ({totalRegs ? ((e.value/totalRegs)*100).toFixed(1) : 0}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
          }
        </div>
      </div>

      {/* ── Bottom Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

        {/* Recent Registrations */}
        <div style={{ backgroundColor: '#fff', borderRadius: '14px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e3a8a' }}>
              <ListIcon /><h3 style={{ fontWeight: '700', color: '#111827', fontSize: '14px' }}>Recent Registrations</h3>
            </div>
            <button onClick={() => navigate('/registrations')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1e3a8a', fontSize: '12px', fontWeight: '600' }}>
              View All
            </button>
          </div>

          {recent.length === 0
            ? <div style={{ padding: '32px 0', textAlign: 'center', color: '#d1d5db', fontSize: '13px' }}>
                {loading ? 'Loading…' : 'No data — run seed.sql in Supabase'}
              </div>
            : <>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                      {['#','Student Name','USN','Course','Sem','Date',''].map((h, i) => (
                        <th key={i} style={{ textAlign: 'left', paddingBottom: '10px', fontSize: '11.5px', fontWeight: '600', color: '#9ca3af' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((r, i) => (
                      <tr key={r.registration_id} style={{ borderBottom: '1px solid #f9fafb' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f9fafb'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <td style={{ padding: '9px 0', fontSize: '12px', color: '#9ca3af' }}>{i+1}</td>
                        <td style={{ padding: '9px 8px 9px 0', fontSize: '12px', fontWeight: '600', color: '#111827', whiteSpace: 'nowrap' }}>{r.student_name}</td>
                        <td style={{ padding: '9px 8px 9px 0', fontSize: '11px', fontFamily: 'monospace', color: '#6b7280' }}>{r.usn}</td>
                        <td style={{ padding: '9px 8px 9px 0', fontSize: '12px', color: '#374151' }}>{r.course_title}</td>
                        <td style={{ padding: '9px 8px 9px 0', fontSize: '12px', color: '#6b7280' }}>{r.semester}</td>
                        <td style={{ padding: '9px 0', fontSize: '11px', color: '#9ca3af', whiteSpace: 'nowrap' }}>
                          {new Date(r.registration_date).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}
                        </td>
                        <td style={{ padding: '9px 0' }}><ChevronRight size={13} color="#d1d5db"/></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ textAlign: 'center', marginTop: '14px' }}>
                  <button onClick={() => navigate('/registrations')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1e3a8a', fontSize: '12px', fontWeight: '600' }}>
                    View all registrations
                  </button>
                </div>
              </>
          }
        </div>

        {/* Most Registered Courses */}
        <div style={{ backgroundColor: '#fff', borderRadius: '14px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e3a8a' }}>
              <BookIcon /><h3 style={{ fontWeight: '700', color: '#111827', fontSize: '14px' }}>Most Registered Courses</h3>
            </div>
            <button onClick={() => navigate('/courses')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1e3a8a', fontSize: '12px', fontWeight: '600' }}>
              View All
            </button>
          </div>

          {topCourses.length === 0
            ? <div style={{ padding: '32px 0', textAlign: 'center', color: '#d1d5db', fontSize: '13px' }}>
                {loading ? 'Loading…' : 'No data — run seed.sql in Supabase'}
              </div>
            : <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {topCourses.map((c, i) => (
                  <div key={c.course_id}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '16px' }}>{COURSE_ICONS[i]}</span>
                        <span style={{ fontSize: '12.5px', fontWeight: '600', color: '#111827' }}>{c.title}</span>
                      </div>
                      <span style={{ fontSize: '12.5px', fontWeight: '700', color: '#374151' }}>{c.count}</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', backgroundColor: '#f3f4f6', borderRadius: '99px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: '99px',
                        width: `${Math.round((c.count/maxCount)*100)}%`,
                        backgroundColor: BAR_COLORS[i] ?? '#94a3b8',
                        transition: 'width 0.8s ease',
                      }} />
                    </div>
                  </div>
                ))}
              </div>
          }
        </div>
      </div>
    </div>
  );
}
