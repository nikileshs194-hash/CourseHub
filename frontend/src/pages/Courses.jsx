import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search, X, Users, BookOpen, Award, Info } from 'lucide-react';
import { getCourses, createCourse, updateCourse, deleteCourse, getCourseEnrollments } from '../services/api';

const SEMESTERS = [1,2,3,4,5,6,7,8];
const DEPARTMENTS = ['Common','CSE','ISE','ECE','AIML','Mechanical','Civil'];
const EMPTY = { course_code: '', title: '', semester: 1, credits: 3, department: 'Common' };

const CREDIT_STYLE = {
  1: { bg: '#f3f4f6', color: '#6b7280' },
  2: { bg: '#eff6ff', color: '#1d4ed8' },
  3: { bg: '#f0fdf4', color: '#15803d' },
  4: { bg: '#faf5ff', color: '#7e22ce' },
};

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
      <div style={{ backgroundColor: '#fff', borderRadius: '16px', width: '100%', maxWidth: '460px', margin: '0 16px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #f3f4f6' }}>
          <h3 style={{ fontWeight: '700', fontSize: '16px', color: '#111827' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#9ca3af', lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: '24px' }}>{children}</div>
      </div>
    </div>
  );
}

const DEPT_COLORS = {
  CSE: { bg: '#eff6ff', color: '#1d4ed8' },
  ISE: { bg: '#f0fdf4', color: '#15803d' },
  ECE: { bg: '#fff7ed', color: '#c2410c' },
  AIML: { bg: '#faf5ff', color: '#7e22ce' },
  Mechanical: { bg: '#fef9c3', color: '#92400e' },
  Civil: { bg: '#f0f9ff', color: '#0369a1' },
};

function CourseDetailModal({ course, onClose }) {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getCourseEnrollments(course.course_id)
      .then(r => setEnrollments(r.data))
      .catch(() => setEnrollments([]))
      .finally(() => setLoading(false));
  }, [course.course_id]);

  const cc = CREDIT_STYLE[course.credits] || { bg: '#f3f4f6', color: '#6b7280' };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}>
      <div style={{ backgroundColor: '#fff', borderRadius: '16px', width: '100%', maxWidth: '580px', margin: '0 16px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', overflow: 'hidden', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6', background: 'linear-gradient(135deg, #1a2464 0%, #2d4fa0 100%)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: '700', color: 'rgba(255,255,255,0.7)', backgroundColor: 'rgba(255,255,255,0.15)', padding: '3px 8px', borderRadius: '6px' }}>{course.course_code}</span>
            <h3 style={{ fontWeight: '800', fontSize: '18px', color: '#ffffff', marginTop: '8px', letterSpacing: '-0.3px' }}>{course.title}</h3>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', color: '#fff', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <X size={16} />
          </button>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #f3f4f6' }}>
          {[
            { icon: <BookOpen size={15} color="#1a2464" />, label: 'Semester', value: `Semester ${course.semester}` },
            { icon: <Award size={15} color="#16a34a" />, label: 'Credits', value: `${course.credits} Credits` },
            { icon: <Users size={15} color="#7c3aed" />, label: 'Enrolled', value: loading ? '...' : `${enrollments.length} Students` },
          ].map((s, i) => (
            <div key={i} style={{ backgroundColor: '#fff', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              {s.icon}
              <p style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '500' }}>{s.label}</p>
              <p style={{ fontSize: '15px', fontWeight: '700', color: '#111827' }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div style={{ overflowY: 'auto', flex: 1 }}>
          {/* Description */}
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f9fafb' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '10px' }}>
              <Info size={14} color="#1a2464" />
              <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#111827' }}>Course Description</h4>
            </div>
            <p style={{ fontSize: '13.5px', color: '#4b5563', lineHeight: '1.7' }}>
              {course.description || 'No description available for this course.'}
            </p>
          </div>

          {/* Enrolled Students */}
          <div style={{ padding: '20px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <Users size={14} color="#1a2464" />
                <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#111827' }}>
                  Enrolled Students {!loading && <span style={{ color: '#9ca3af', fontWeight: '400' }}>({enrollments.length})</span>}
                </h4>
              </div>
            </div>

            {/* Search */}
            {!loading && enrollments.length > 0 && (
              <div style={{ position: 'relative', marginBottom: '12px' }}>
                <Search size={13} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by name or USN…"
                  style={{ width: '100%', paddingLeft: '32px', padding: '8px 12px 8px 32px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12.5px', color: '#111827', outline: 'none', fontFamily: 'inherit' }}
                  onFocus={e => { e.target.style.borderColor = '#1a2464'; e.target.style.boxShadow = '0 0 0 3px rgba(26,36,100,0.08)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            )}

            {loading ? (
              <div style={{ textAlign: 'center', padding: '24px', color: '#9ca3af', fontSize: '13px' }}>Loading students…</div>
            ) : enrollments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px', color: '#9ca3af', fontSize: '13px' }}>No students enrolled yet</div>
            ) : (() => {
              const filtered = enrollments.filter(e => {
                const q = search.toLowerCase();
                return !q || e.students?.name?.toLowerCase().includes(q) || e.students?.usn?.toLowerCase().includes(q);
              });
              return filtered.length === 0
                ? <div style={{ textAlign: 'center', padding: '24px', color: '#9ca3af', fontSize: '13px' }}>No students match "{search}"</div>
                : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {filtered.map((e, i) => {
                      const dc = DEPT_COLORS[e.students?.department] || { bg: '#f3f4f6', color: '#374151' };
                      return (
                        <div key={e.registration_id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', backgroundColor: '#f9fafb', borderRadius: '10px' }}>
                          <span style={{ fontSize: '12px', color: '#9ca3af', width: '20px', flexShrink: 0 }}>{i + 1}</span>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>{e.students?.name}</p>
                            <p style={{ fontSize: '11px', fontFamily: 'monospace', color: '#6b7280', marginTop: '2px' }}>{e.students?.usn}</p>
                          </div>
                          <span style={{ fontSize: '11px', fontWeight: '600', padding: '3px 9px', borderRadius: '20px', backgroundColor: dc.bg, color: dc.color }}>{e.students?.department}</span>
                        </div>
                      );
                    })}
                  </div>
                );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Courses() {
  const [courses,  setCourses] = useState([]);
  const [loading,  setLoading] = useState(true);
  const [error,    setError]   = useState('');
  const [search,   setSearch]  = useState('');
  const [semFilter,setSem]     = useState('');
  const [deptFilter,setDept]   = useState('');
  const [modal,    setModal]   = useState(false);
  const [editItem, setEdit]    = useState(null);
  const [detailCourse, setDetail] = useState(null);
  const [form,     setForm]    = useState(EMPTY);
  const [formErr,  setFormErr] = useState('');
  const [saving,   setSaving]  = useState(false);

  const load = async () => {
    setLoading(true);
    try { const r = await getCourses(); setCourses(r.data); setError(''); }
    catch { setError('Cannot reach Supabase. Check your internet connection or Supabase project status.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd  = () => { setEdit(null); setForm(EMPTY); setFormErr(''); setModal(true); };
  const openEdit = c  => { setEdit(c); setForm({ course_code: c.course_code, title: c.title, semester: c.semester, credits: c.credits, department: c.department || 'Common' }); setFormErr(''); setModal(true); };

  const save = async () => {
    if (!form.course_code.trim() || !form.title.trim()) { setFormErr('Course code and title are required.'); return; }
    setSaving(true);
    try {
      editItem ? await updateCourse(editItem.course_id, form) : await createCourse(form);
      setModal(false); load();
    } catch (e) { setFormErr(e.response?.data?.error || 'Failed to save.'); }
    finally { setSaving(false); }
  };

  const remove = async id => {
    if (!confirm('Delete this course and all its registrations?')) return;
    try { await deleteCourse(id); load(); }
    catch (e) { alert(e.response?.data?.error || 'Failed to delete.'); }
  };

  const list = courses.filter(c => {
    const q = search.toLowerCase();
    return (!q || c.title.toLowerCase().includes(q) || c.course_code.toLowerCase().includes(q)) &&
           (!semFilter || String(c.semester) === semFilter) &&
           (!deptFilter || c.department === deptFilter);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', letterSpacing: '-0.3px' }}>Courses</h2>
          <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '4px' }}>Manage all courses by semester</p>
        </div>
        <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: '7px', backgroundColor: '#1e3a8a', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 18px', fontSize: '13.5px', fontWeight: '600', cursor: 'pointer' }}>
          <Plus size={16} /> Add Course
        </button>
      </div>

      {error && (
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px 16px', color: '#dc2626', fontSize: '13px' }}>⚠ {error}</div>
      )}

      {/* Filters */}
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', padding: '14px 20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by title or course code…" style={{ ...inputStyle, paddingLeft: '36px' }}
            onFocus={e => Object.assign(e.target.style, focusStyle)} onBlur={e => { e.target.style.borderColor='#e5e7eb'; e.target.style.boxShadow='none'; }} />
        </div>
        <select value={semFilter} onChange={e => setSem(e.target.value)} style={{ ...sel, width: '145px', flexShrink: 0 }}>
          <option value="">All Semesters</option>
          {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
        </select>
        <select value={deptFilter} onChange={e => setDept(e.target.value)} style={{ ...sel, width: '145px', flexShrink: 0 }}>
          <option value="">All Departments</option>
          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <span style={{ fontSize: '12.5px', color: '#9ca3af', whiteSpace: 'nowrap' }}>{list.length} course{list.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #f3f4f6' }}>
              {['#','Course Code','Course Title','Department','Semester','Credits','Actions'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '14px 20px', fontSize: '12px', fontWeight: '700', color: '#6b7280', letterSpacing: '0.3px', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
                <div style={{ display: 'inline-block', width: '24px', height: '24px', border: '3px solid #e5e7eb', borderTopColor: '#1e3a8a', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <p style={{ marginTop: '10px' }}>Loading courses…</p>
              </td></tr>
            ) : list.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
                {error ? 'Connection error — check backend' : 'No courses found'}
              </td></tr>
            ) : list.map((c, i) => {
              const cc = CREDIT_STYLE[c.credits] || { bg: '#f3f4f6', color: '#6b7280' };
              return (
                <tr key={c.course_id} style={{ borderBottom: '1px solid #f9fafb', transition: 'background 0.12s', cursor: 'pointer' }}
                  onClick={() => setDetail(c)}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fafbff'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td style={{ padding: '14px 20px', fontSize: '13px', color: '#9ca3af' }}>{i+1}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ fontSize: '12px', fontFamily: 'monospace', fontWeight: '700', color: '#374151', backgroundColor: '#f3f4f6', padding: '3px 8px', borderRadius: '6px' }}>{c.course_code}</span>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: '13.5px', fontWeight: '600', color: '#111827' }}>{c.title}</td>
                  <td style={{ padding: '14px 20px' }}>
                    {(() => { const dc = DEPT_COLORS[c.department] || { bg: '#f3f4f6', color: '#6b7280' }; return (
                      <span style={{ fontSize: '12px', fontWeight: '600', padding: '4px 10px', borderRadius: '20px', backgroundColor: dc.bg, color: dc.color }}>{c.department || 'Common'}</span>
                    ); })()}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', padding: '4px 10px', borderRadius: '20px', backgroundColor: '#eff6ff', color: '#1d4ed8' }}>Semester {c.semester}</span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', padding: '4px 10px', borderRadius: '20px', backgroundColor: cc.bg, color: cc.color }}>{c.credits} Credit{c.credits > 1 ? 's' : ''}</span>
                  </td>
                  <td style={{ padding: '14px 20px' }} onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => openEdit(c)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', color: '#2563eb' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#eff6ff'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}>
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => remove(c.course_id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', color: '#ef4444' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fef2f2'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={editItem ? 'Edit Course' : 'Add New Course'} onClose={() => setModal(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {formErr && <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', fontSize: '13px', borderRadius: '8px', padding: '10px 14px', border: '1px solid #fecaca' }}>{formErr}</div>}
            <Field label="Course Code *">
              <input value={form.course_code} onChange={e => setForm({...form, course_code: e.target.value})} placeholder="e.g. CS301" style={inputStyle}
                onFocus={e => Object.assign(e.target.style, focusStyle)} onBlur={e => { e.target.style.borderColor='#e5e7eb'; e.target.style.boxShadow='none'; }} />
            </Field>
            <Field label="Course Title *">
              <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Database Management Systems" style={inputStyle}
                onFocus={e => Object.assign(e.target.style, focusStyle)} onBlur={e => { e.target.style.borderColor='#e5e7eb'; e.target.style.boxShadow='none'; }} />
            </Field>
            <Field label="Department">
              <select value={form.department || 'Common'} onChange={e => setForm({...form, department: e.target.value})} style={sel}>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <Field label="Semester">
                <select value={form.semester} onChange={e => setForm({...form, semester: +e.target.value})} style={sel}>
                  {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
                </select>
              </Field>
              <Field label="Credits">
                <select value={form.credits} onChange={e => setForm({...form, credits: +e.target.value})} style={sel}>
                  {[1,2,3,4].map(n => <option key={n} value={n}>{n} Credit{n>1?'s':''}</option>)}
                </select>
              </Field>
            </div>
            <div style={{ display: 'flex', gap: '10px', paddingTop: '6px' }}>
              <button onClick={() => setModal(false)} style={{ flex: 1, padding: '10px', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '13.5px', fontWeight: '600', color: '#374151', background: '#fff', cursor: 'pointer' }}>Cancel</button>
              <button onClick={save} disabled={saving} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '10px', fontSize: '13.5px', fontWeight: '600', color: '#fff', backgroundColor: saving ? '#93c5fd' : '#1e3a8a', cursor: saving ? 'not-allowed' : 'pointer' }}>
                {saving ? 'Saving…' : editItem ? 'Update Course' : 'Add Course'}
              </button>
            </div>
          </div>
        </Modal>
      )}



      {detailCourse && <CourseDetailModal course={detailCourse} onClose={() => setDetail(null)} />}
    </div>
  );
}

