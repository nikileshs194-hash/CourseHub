import { useEffect, useState } from 'react';
import { Plus, Trash2, Search } from 'lucide-react';
import { getRegistrations, createRegistration, deleteRegistration, getStudents, getCoursesBySemester } from '../services/api';

const SEMESTERS = [1,2,3,4,5,6,7,8];
const DEPARTMENTS = ['CSE','ISE','ECE','AIML','Mechanical','Civil'];
const inputStyle = { border: '1px solid #e5e7eb', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', color: '#111827', outline: 'none', width: '100%', fontFamily: 'inherit' };
const focusStyle = { borderColor: '#1e3a8a', boxShadow: '0 0 0 3px rgba(30,58,138,0.08)' };
const sel = { ...inputStyle, background: '#fff', cursor: 'pointer' };

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>{label}</label>
      {children}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}>
      <div style={{ backgroundColor: '#fff', borderRadius: '16px', width: '100%', maxWidth: '480px', margin: '0 16px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #f3f4f6' }}>
          <h3 style={{ fontWeight: '700', fontSize: '16px', color: '#111827' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#9ca3af', lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: '24px' }}>{children}</div>
      </div>
    </div>
  );
}

export default function Registrations() {
  const [regs,     setRegs]    = useState([]);
  const [students, setStudents]= useState([]);
  const [courses,  setCourses] = useState([]);
  const [loading,  setLoading] = useState(true);
  const [error,    setError]   = useState('');
  const [search,   setSearch]  = useState('');
  const [semFilter,setSem]     = useState('');
  const [deptFilter,setDept]   = useState('');
  const [modal,    setModal]   = useState(false);
  const [form,     setForm]    = useState({ student_id: '', course_id: '' });
  const [selStudent, setSelStu]= useState(null);
  const [formErr,  setFormErr] = useState('');
  const [saving,   setSaving]  = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [r, s] = await Promise.all([getRegistrations(), getStudents()]);
      setRegs(r.data); setStudents(s.data); setError('');
    } catch { setError('Cannot reach Supabase. Check your internet connection or Supabase project status.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleStudentChange = async (id) => {
    setForm({ student_id: id, course_id: '' });
    const stu = students.find(s => s.student_id === id);
    setSelStu(stu);
    if (stu) {
      try { const r = await getCoursesBySemester(stu.semester, stu.department); setCourses(r.data); }
      catch { setCourses([]); }
    } else { setCourses([]); }
  };

  const save = async () => {
    if (!form.student_id || !form.course_id) { setFormErr('Please select both student and course.'); return; }
    setSaving(true);
    try {
      await createRegistration(form);
      setModal(false); setForm({ student_id: '', course_id: '' }); setSelStu(null); setCourses([]);
      load();
    } catch (e) { setFormErr(e.response?.data?.error || 'Failed to register. Student may already be registered.'); }
    finally { setSaving(false); }
  };

  const remove = async id => {
    if (!confirm('Remove this registration?')) return;
    try { await deleteRegistration(id); load(); }
    catch { alert('Failed to delete.'); }
  };

  const openModal = () => { setModal(true); setFormErr(''); setForm({ student_id: '', course_id: '' }); setSelStu(null); setCourses([]); };

  const list = regs.filter(r => {
    const q = search.toLowerCase();
    return (!q || r.student_name?.toLowerCase().includes(q) || r.usn?.toLowerCase().includes(q) || r.course_title?.toLowerCase().includes(q)) &&
           (!semFilter || String(r.semester) === semFilter) &&
           (!deptFilter || r.department === deptFilter);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', letterSpacing: '-0.3px' }}>Registrations</h2>
          <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '4px' }}>Register students into semester-matched courses</p>
        </div>
        <button onClick={openModal} style={{ display: 'flex', alignItems: 'center', gap: '7px', backgroundColor: '#1e3a8a', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 18px', fontSize: '13.5px', fontWeight: '600', cursor: 'pointer' }}>
          <Plus size={16} /> Register Student
        </button>
      </div>

      {error && <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px 16px', color: '#dc2626', fontSize: '13px' }}>⚠ {error}</div>}

      {/* Filters */}
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', padding: '14px 20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by student, USN or course…" style={{ ...inputStyle, paddingLeft: '36px' }}
            onFocus={e => Object.assign(e.target.style, focusStyle)} onBlur={e => { e.target.style.borderColor='#e5e7eb'; e.target.style.boxShadow='none'; }} />
        </div>
        <select value={semFilter} onChange={e => setSem(e.target.value)} style={{ ...sel, width: '145px', flexShrink: 0 }}>
          <option value="">All Semesters</option>
          {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
        </select>
        <select value={deptFilter} onChange={e => setDept(e.target.value)} style={{ ...sel, width: '155px', flexShrink: 0 }}>
          <option value="">All Departments</option>
          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <span style={{ fontSize: '12.5px', color: '#9ca3af', whiteSpace: 'nowrap' }}>{list.length} registration{list.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #f3f4f6' }}>
              {['#','Student Name','USN','Course','Semester','Date','Action'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '14px 20px', fontSize: '12px', fontWeight: '700', color: '#6b7280', letterSpacing: '0.3px', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
                <div style={{ display: 'inline-block', width: '24px', height: '24px', border: '3px solid #e5e7eb', borderTopColor: '#1e3a8a', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <p style={{ marginTop: '10px' }}>Loading registrations…</p>
              </td></tr>
            ) : list.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
                {error ? 'Connection error — check backend' : 'No registrations found'}
              </td></tr>
            ) : list.map((r, i) => (
              <tr key={r.registration_id} style={{ borderBottom: '1px solid #f9fafb', transition: 'background 0.12s' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fafbff'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                <td style={{ padding: '14px 20px', fontSize: '13px', color: '#9ca3af' }}>{i+1}</td>
                <td style={{ padding: '14px 20px', fontSize: '13.5px', fontWeight: '600', color: '#111827' }}>{r.student_name}</td>
                <td style={{ padding: '14px 20px', fontSize: '12px', fontFamily: 'monospace', color: '#6b7280' }}>{r.usn}</td>
                <td style={{ padding: '14px 20px', fontSize: '13px', color: '#374151' }}>{r.course_title}</td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', padding: '4px 10px', borderRadius: '20px', backgroundColor: '#eff6ff', color: '#1d4ed8' }}>Semester {r.semester}</span>
                </td>
                <td style={{ padding: '14px 20px', fontSize: '12px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                  {new Date(r.registration_date).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <button onClick={() => remove(r.registration_id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', color: '#ef4444' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fef2f2'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}>
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title="Register Student into Course" onClose={() => setModal(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {formErr && <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', fontSize: '13px', borderRadius: '8px', padding: '10px 14px', border: '1px solid #fecaca' }}>{formErr}</div>}
            <Field label="Select Student *">
              <select value={form.student_id} onChange={e => handleStudentChange(e.target.value)} style={sel}>
                <option value="">— Select a student —</option>
                {students.map(s => <option key={s.student_id} value={s.student_id}>{s.name} ({s.usn}) — Sem {s.semester}</option>)}
              </select>
            </Field>
            {selStudent && (
              <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '10px 14px', fontSize: '12.5px', color: '#1d4ed8' }}>
                Showing <strong>Semester {selStudent.semester}</strong> courses for <strong>{selStudent.department}</strong>
              </div>
            )}
            <Field label="Select Course *">
              <select value={form.course_id} onChange={e => setForm({...form, course_id: e.target.value})} disabled={!selStudent} style={{ ...sel, opacity: selStudent ? 1 : 0.6, cursor: selStudent ? 'pointer' : 'not-allowed' }}>
                <option value="">— Select a course —</option>
                {courses.map(c => <option key={c.course_id} value={c.course_id}>{c.title} ({c.course_code}) — {c.credits} cr</option>)}
              </select>
              {selStudent && courses.length === 0 && <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>No courses found for this semester.</p>}
            </Field>
            <div style={{ display: 'flex', gap: '10px', paddingTop: '6px' }}>
              <button onClick={() => setModal(false)} style={{ flex: 1, padding: '10px', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '13.5px', fontWeight: '600', color: '#374151', background: '#fff', cursor: 'pointer' }}>Cancel</button>
              <button onClick={save} disabled={saving} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '10px', fontSize: '13.5px', fontWeight: '600', color: '#fff', backgroundColor: saving ? '#93c5fd' : '#1e3a8a', cursor: saving ? 'not-allowed' : 'pointer' }}>
                {saving ? 'Registering…' : 'Register'}
              </button>
            </div>
          </div>
        </Modal>
      )}


    </div>
  );
}

