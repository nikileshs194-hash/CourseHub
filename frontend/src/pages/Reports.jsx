import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { getDashboardStats, getMostRegisteredCourses } from '../services/api';

const COLORS = ['#1e3a8a','#2563eb','#16a34a','#d97706','#ea580c','#dc2626','#7c3aed','#eab308'];

function Card({ children, style = {} }) {
  return (
    <div style={{
      backgroundColor: '#fff', borderRadius: '14px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      padding: '24px', ...style,
    }}>
      {children}
    </div>
  );
}

function ChartTitle({ title }) {
  return (
    <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
      {title}
    </h3>
  );
}

function BarTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }}>
      <p style={{ fontWeight: '600', color: '#374151' }}>{label}</p>
      <p style={{ color: '#2563eb' }}>{payload[0].value} students</p>
    </div>
  );
}

function EmptyState({ loading }) {
  return (
    <div style={{ height: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#d1d5db' }}>
      {loading
        ? <><div style={{ width: '28px', height: '28px', border: '3px solid #e5e7eb', borderTopColor: '#1e3a8a', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /><p style={{ marginTop: '10px', fontSize: '13px' }}>Loading…</p></>
        : <p style={{ fontSize: '13px' }}>No data — run seed.sql in Supabase</p>
      }
    </div>
  );
}

export default function Reports() {
  const [stats,      setStats]  = useState(null);
  const [topCourses, setTop]    = useState([]);
  const [loading,    setLoad]   = useState(true);
  const [error,      setError]  = useState('');

  useEffect(() => {
    Promise.all([getDashboardStats(), getMostRegisteredCourses()])
      .then(([s, t]) => { setStats(s.data); setTop(t.data); setError(''); })
      .catch(() => setError('Cannot reach Supabase. Check your internet connection or Supabase project status.'))
      .finally(() => setLoad(false));
  }, []);

  const coursesBySem = stats?.coursesBySemester     ?? [];
  const regsBySem    = stats?.registrationsBySemester ?? [];
  const deptData     = stats?.studentsByDepartment   ?? [];
  const totalRegs    = regsBySem.reduce((a, b) => a + b.count, 0);
  const hasData      = coursesBySem.length > 0;

  const summaryCards = [
    { label: 'Total Students',      value: stats?.totalStudents,       color: '#2563eb', bg: '#eff6ff' },
    { label: 'Total Courses',       value: stats?.totalCourses,        color: '#16a34a', bg: '#f0fdf4' },
    { label: 'Total Registrations', value: stats?.totalRegistrations,  color: '#7c3aed', bg: '#faf5ff' },
    { label: 'Departments',         value: stats?.totalDepartments,    color: '#ea580c', bg: '#fff7ed' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* ── Header ── */}
      <div>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', letterSpacing: '-0.3px' }}>Reports & Analytics</h2>
        <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '4px' }}>Comprehensive academic data insights</p>
      </div>

      {/* ── Error ── */}
      {error && (
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px 16px', color: '#dc2626', fontSize: '13px' }}>
          ⚠ {error}
        </div>
      )}

      {/* ── Summary Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {summaryCards.map(c => (
          <div key={c.label} style={{
            backgroundColor: '#fff', borderRadius: '12px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
            padding: '20px', borderLeft: `4px solid ${c.color}`,
          }}>
            <p style={{ fontSize: '12.5px', color: '#6b7280', fontWeight: '500', marginBottom: '8px' }}>{c.label}</p>
            <p style={{ fontSize: '28px', fontWeight: '800', color: c.color, letterSpacing: '-0.5px', lineHeight: 1 }}>
              {loading ? '—' : (c.value?.toLocaleString() ?? '—')}
            </p>
          </div>
        ))}
      </div>

      {/* ── Charts Row 1 ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

        {/* Courses per Semester */}
        <Card>
          <ChartTitle title="Courses per Semester" />
          {!hasData ? <EmptyState loading={loading} /> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={coursesBySem} margin={{ top: 16, right: 8, left: -22, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="semester" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                  tickFormatter={v => `Sem ${v}`} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => [v, 'Courses']} labelFormatter={l => `Semester ${l}`} />
                <Bar dataKey="count" fill="#1e3a8a" radius={[4,4,0,0]}
                  label={{ position: 'top', fontSize: 10, fill: '#6b7280', fontWeight: '600' }} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Registrations by Semester */}
        <Card>
          <ChartTitle title="Registrations by Semester" />
          {regsBySem.length === 0 ? <EmptyState loading={loading} /> : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <PieChart width={190} height={190}>
                  <Pie data={regsBySem} cx={92} cy={92} innerRadius={52} outerRadius={88}
                    dataKey="count" nameKey="semester" labelLine={false}>
                    {regsBySem.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v, n, p) => [v, `Semester ${p.payload.semester}`]} />
                </PieChart>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                  <span style={{ fontSize: '20px', fontWeight: '800', color: '#111827' }}>{totalRegs}</span>
                  <span style={{ fontSize: '10px', color: '#9ca3af' }}>Total</span>
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {regsBySem.map((d, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '9px', height: '9px', borderRadius: '2px', backgroundColor: COLORS[i % COLORS.length], flexShrink: 0 }} />
                      <span style={{ fontSize: '11.5px', color: '#4b5563' }}>Sem {d.semester}</span>
                    </div>
                    <span style={{ fontSize: '11.5px', fontWeight: '700', color: '#111827' }}>
                      {d.count} <span style={{ color: '#9ca3af', fontWeight: '400' }}>({totalRegs ? ((d.count/totalRegs)*100).toFixed(1) : 0}%)</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* ── Charts Row 2 ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

        {/* Most Registered Courses */}
        <Card>
          <ChartTitle title="Most Registered Courses" />
          {topCourses.length === 0 ? <EmptyState loading={loading} /> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topCourses} layout="vertical" margin={{ top: 0, right: 40, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="title" tick={{ fontSize: 10, fill: '#374151' }} width={145} axisLine={false} tickLine={false}
                  tickFormatter={v => v.length > 20 ? v.slice(0,20)+'…' : v} />
                <Tooltip formatter={(v) => [v, 'Registrations']} />
                <Bar dataKey="count" radius={[0,4,4,0]} label={{ position: 'right', fontSize: 11, fill: '#374151', fontWeight: '600' }}>
                  {topCourses.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Students by Department */}
        <Card>
          <ChartTitle title="Students by Department" />
          {deptData.length === 0 ? <EmptyState loading={loading} /> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={deptData} margin={{ top: 16, right: 8, left: -22, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="department" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip content={<BarTip />} />
                <Bar dataKey="count" radius={[4,4,0,0]} label={{ position: 'top', fontSize: 10, fill: '#6b7280', fontWeight: '600' }}>
                  {deptData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>
    </div>
  );
}

