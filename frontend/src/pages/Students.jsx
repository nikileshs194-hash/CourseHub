import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search, BookOpen, UserCircle, GraduationCap } from 'lucide-react';
import { getStudents, createStudent, updateStudent, deleteStudent,
         getStudentRegistrations, getCoursesBySemester, createRegistration, deleteRegistration } from '../services/api';

const DEPARTMENTS = ['CSE', 'ISE', 'ECE', 'AIML', 'Mechanical', 'Civil'];
const SEMESTERS   = [1,2,3,4,5,6,7,8];
const EMPTY       = { usn: '', name: '', department: 'CSE', semester: 1 };

const DEPT_COLORS = {
  CSE:        { bg: '#eff6ff', color: '#1d4ed8' },
  ISE:        { bg: '#f0fdf4', color: '#15803d' },
  ECE:        { bg: '#fff7ed', color: '#c2410c' },
  AIML:       { bg: '#faf5ff', color: '#7e22ce' },
  Mechanical: { bg: '#fef9c3', color: '#92400e' },
  Civil:      { bg: '#f0f9ff', color: '#0369a1' },
  Common:     { bg: '#f3f4f6', color: '#374151' },
};

const inputStyle = {
  border: '1px solid #e5e7eb', borderRadius: '8px', padding: '9px 12px',
  fontSize: '13px', color: '#111827', outline: 'none', width: '100%',
  fontFamily: 'inherit',
};
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

function Modal({ title, onClose, children, maxWidth = '460px' }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}>
      <div style={{ backgroundColor: '#fff', borderRadius: '16px', width: '100%', maxWidth, margin: '0 16px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', overflow: 'hidden', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #f3f4f6', flexShrink: 0 }}>
          <h3 style={{ fontWeight: '700', fontSize: '16px', color: '#111827' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#9ca3af', lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: '0', overflowY: 'auto', flex: 1 }}>{children}</div>
      </div>
    </div>
  );
}

function StudentDetailModal({ student, onClose, onEnrolled }) {
  const [regs,      setRegs]     = useState([]);
  const [courses,   setCourses]  = useState([]);
  const [loading,   setLoading]  = useState(true);
  const [search,    setSearch]   = useState('');
  const [enrolling, setEnrolling]= useState(false);
  const [selCourse, setSelCourse]= useState('');
  const [enrollErr, setEnrollErr]= useState('');
  const [saving,    setSaving]   = useState(false);
  const [removing,  setRemoving] = useState(null);

  const dc = DEPT_COLORS[student.department] || { bg: '#f3f4f6', color: '#374151' };

  const loadRegs = async () => {
    setLoading(true);
    try {
      const r = await getStudentRegistrations(student.student_id);
      setRegs(r.data);
    } catch { setRegs([]); }
    finally { setLoading(false); }
  };

  const loadCourses = async () => {
    try {
      const r = await getCoursesBySemester(student.semester, student.department);
      setCourses(r.data);
    } catch { setCourses([]); }
  };

  useEffect(() => { loadRegs(); loadCourses(); }, []);

  const enrolledIds = new Set(regs.map(r => r.course_id));
  const availableCourses = courses.filter(c => !enrolledIds.has(c.course_id));

  const handleEnroll = async () => {
    if (!selCourse) { setEnrollErr('Please select a course.'); return; }
    setSaving(true); setEnrollErr('');
    try {
      await createRegistration({ student_id: student.student_id, course_id: selCourse });
      setEnrolling(false); setSelCourse('');
      await loadRegs(); await loadCourses();
      onEnrolled?.();
    } catch (e) { setEnrollErr(e.response?.data?.error || 'Failed to enroll.'); }
    finally { setSaving(false); }
  };

  const handleRemove = async (regId) => {
    if (!confirm('Remove this course enrollment?')) return;
    setRemoving(regId);
    try { await deleteRegistration(regId); await loadRegs(); onEnrolled?.(); }
    catch { alert('Failed to remove enrollment.'); }
    finally { setRemoving(null); }
  };

  const filtered = regs.filter(r => {
    const q = search.toLowerCase();
    return !q || r.course_title?.toLowerCase().includes(q) || r.course_code?.toLowerCase().includes(q);
  });

  return (
    <Modal title="Student Profile" onClose={onClose} maxWidth="560px">
      {/* Student Info Header */}
      <div style={{ background: 'linear-gradient(135deg, #1a2464 0%, #1e3a8a 100%)', padding: '24px', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <UserCircle size={32} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '700' }}>{student.name}</div>
            <div style={{ fontSize: '13px', opacity: 0.8, fontFamily: 'monospace', marginTop: '2px' }}>{student.usn}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
          <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '10px', padding: '10px 14px' }}>
            <div style={{ fontSize: '11px', opacity: 0.7, marginBottom: '2px' }}>DEPARTMENT</div>
            <div style={{ fontSize: '13px', fontWeight: '600' }}>{student.department}</div>
          </div>
          <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '10px', padding: '10px 14px' }}>
            <div style={{ fontSize: '11px', opacity: 0.7, marginBottom: '2px' }}>SEMESTER</div>
            <div style={{ fontSize: '13px', fontWeight: '600' }}>Semester {student.semester}</div>
          </div>
          <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '10px', padding: '10px 14px' }}>
            <div style={{ fontSize: '11px', opacity: 0.7, marginBottom: '2px' }}>ENROLLED</div>
            <div style={{ fontSize: '13px', fontWeight: '600' }}>{regs.length} course{regs.length !== 1 ? 's' : ''}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Search + Enroll button */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search enrolled courses…"
              style={{ ...inputStyle, paddingLeft: '32px', fontSize: '12.5px' }}
              onFocus={e => Object.assign(e.target.style, focusStyle)}
              onBlur={e => { e.target.style.borderColor='#e5e7eb'; e.target.style.boxShadow='none'; }} />
          </div>
          <button onClick={() => { setEnrolling(true); setEnrollErr(''); setSelCourse(''); }}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#1e3a8a', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
            <Plus size={14} /> Enroll Course
          </button>
        </div>

        {/* Enroll panel */}
        {enrolling && (
          <div style={{ backgroundColor: '#f8faff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '14px' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e3a8a', marginBottom: '10px' }}>Enroll in a New Course</div>
            {enrollErr && <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', fontSize: '12px', borderRadius: '6px', padding: '8px 10px', border: '1px solid #fecaca', marginBottom: '8px' }}>{enrollErr}</div>}
            <select value={selCourse} onChange={e => setSelCourse(e.target.value)}
              style={{ ...sel, marginBottom: '10px', fontSize: '12.5px' }}>
              <option value="">— Select a course to enroll —</option>
              {availableCourses.map(c => (
                <option key={c.course_id} value={c.course_id}>{c.title} ({c.course_code}) — {c.credits} cr</option>
              ))}
            </select>
            {availableCourses.length === 0 && <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px' }}>All available courses for this semester are already enrolled.</p>}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setEnrolling(false)} style={{ flex: 1, padding: '8px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', fontWeight: '600', color: '#374151', background: '#fff', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleEnroll} disabled={saving || !selCourse}
                style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', color: '#fff', backgroundColor: saving || !selCourse ? '#93c5fd' : '#1e3a8a', cursor: saving || !selCourse ? 'not-allowed' : 'pointer' }}>
                {saving ? 'Enrolling…' : 'Confirm Enroll'}
              </button>
            </div>
          </div>
        )}

        {/* Enrolled courses list */}
        <div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <GraduationCap size={15} /> Enrolled Courses
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '24px', color: '#9ca3af', fontSize: '13px' }}>
              <div style={{ display: 'inline-block', width: '20px', height: '20px', border: '2px solid #e5e7eb', borderTopColor: '#1e3a8a', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <p style={{ marginTop: '8px' }}>Loading courses…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: '#9ca3af', fontSize: '13px', border: '1px dashed #e5e7eb', borderRadius: '10px' }}>
              {search ? 'No courses match your search' : 'Not enrolled in any courses yet'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filtered.map(r => {
                const cdept = DEPT_COLORS[r.department] || { bg: '#f3f4f6', color: '#374151' };
                return (
                  <div key={r.registration_id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', backgroundColor: '#f9fafb', borderRadius: '10px', border: '1px solid #f3f4f6' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <BookOpen size={16} color="#1d4ed8" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.course_title}</div>
                      <div style={{ fontSize: '11.5px', color: '#6b7280', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontFamily: 'monospace' }}>{r.course_code}</span>
                        <span>·</span>
                        <span>{r.credits} credits</span>
                        <span>·</span>
                        <span style={{ padding: '1px 7px', borderRadius: '10px', fontSize: '11px', fontWeight: '600', backgroundColor: cdept.bg, color: cdept.color }}>{r.department}</span>
                      </div>
                    </div>
                    <button onClick={() => handleRemove(r.registration_id)} disabled={removing === r.registration_id}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', color: '#ef4444', flexShrink: 0, opacity: removing === r.registration_id ? 0.5 : 1 }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fef2f2'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default function Students() {
  const [students,   setStudents]  = useState([]);
  const [loading,    setLoading]   = useState(true);
  const [error,      setError]     = useState('');
  const [search,     setSearch]    = useState('');
  const [semFilter,  setSem]       = useState('');
  const [deptFilter, setDept]      = useState('');
  const [modal,      setModal]     = useState(false);
  const [editItem,   setEdit]      = useState(null);
  const [form,       setForm]      = useState(EMPTY);
  const [formErr,    setFormErr]   = useState('');
  const [saving,     setSaving]    = useState(false);
  const [detailStudent, setDetail] = useState(null);

  const load = async () => {
    setLoading(true);
    try { const r = await getStudents(); setStudents(r.data); setError(''); }
    catch { setError('Cannot reach Supabase. Check your internet connection or Supabase project status.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd  = () => { setEdit(null); setForm(EMPTY); setFormErr(''); setModal(true); };
  const openEdit = s  => { setEdit(s); setForm({ usn: s.usn, name: s.name, department: s.department, semester: s.semester }); setFormErr(''); setModal(true); };

  const save = async () => {
    if (!form.usn.trim() || !form.name.trim()) { setFormErr('USN and Name are required.'); return; }
    setSaving(true);
    try {
      editItem ? await updateStudent(editItem.student_id, form) : await createStudent(form);
      setModal(false); load();
    } catch (e) { setFormErr(e.response?.data?.error || 'Failed to save.'); }
    finally { setSaving(false); }
  };

  const remove = async (e, id) => {
    e.stopPropagation();
    if (!confirm('Delete this student and all their registrations?')) return;
    try { await deleteStudent(id); load(); }
    catch (e) { alert(e.response?.data?.error || 'Failed to delete.'); }
  };

  const list = students.filter(s => {
    const q = search.toLowerCase();
    return (
      (!q || s.name.toLowerCase().includes(q) || s.usn.toLowerCase().includes(q)) &&
      (!semFilter  || String(s.semester)   === semFilter) &&
      (!deptFilter || s.department === deptFilter)
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', letterSpacing: '-0.3px' }}>Students</h2>
          <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '4px' }}>Manage all registered students</p>
        </div>
        <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: '7px', backgroundColor: '#1e3a8a', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 18px', fontSize: '13.5px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>
          <Plus size={16} /> Add Student
        </button>
      </div>

      {error && (
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px 16px', color: '#dc2626', fontSize: '13px' }}>
          ⚠ {error}
        </div>
      )}

      {/* Filters */}
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', padding: '14px 20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or USN…"
            style={{ ...inputStyle, paddingLeft: '36px' }}
            onFocus={e => Object.assign(e.target.style, focusStyle)}
            onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }} />
        </div>
        <select value={semFilter} onChange={e => setSem(e.target.value)} style={{ ...sel, width: '145px', flexShrink: 0 }}>
          <option value="">All Semesters</option>
          {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
        </select>
        <select value={deptFilter} onChange={e => setDept(e.target.value)} style={{ ...sel, width: '155px', flexShrink: 0 }}>
          <option value="">All Departments</option>
          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <span style={{ fontSize: '12.5px', color: '#9ca3af', whiteSpace: 'nowrap' }}>{list.length} student{list.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #f3f4f6' }}>
              {['#', 'Student Name', 'USN', 'Department', 'Semester', 'Actions'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '14px 20px', fontSize: '12px', fontWeight: '700', color: '#6b7280', letterSpacing: '0.3px', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
                <div style={{ display: 'inline-block', width: '24px', height: '24px', border: '3px solid #e5e7eb', borderTopColor: '#1e3a8a', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <p style={{ marginTop: '10px' }}>Loading students…</p>
              </td></tr>
            ) : list.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
                {error ? 'Connection error — check backend' : 'No students found'}
              </td></tr>
            ) : list.map((s, i) => {
              const dc = DEPT_COLORS[s.department] || { bg: '#f3f4f6', color: '#374151' };
              return (
                <tr key={s.student_id}
                  onClick={() => setDetail(s)}
                  style={{ borderBottom: '1px solid #f9fafb', transition: 'background 0.12s', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fafbff'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td style={{ padding: '14px 20px', fontSize: '13px', color: '#9ca3af' }}>{i+1}</td>
                  <td style={{ padding: '14px 20px', fontSize: '13.5px', fontWeight: '600', color: '#111827' }}>{s.name}</td>
                  <td style={{ padding: '14px 20px', fontSize: '12px', fontFamily: 'monospace', color: '#6b7280' }}>{s.usn}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', padding: '4px 10px', borderRadius: '20px', backgroundColor: dc.bg, color: dc.color }}>
                      {s.department}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: '13px', color: '#374151' }}>Semester {s.semester}</td>
                  <td style={{ padding: '14px 20px' }} onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={e => { e.stopPropagation(); openEdit(s); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', color: '#2563eb' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#eff6ff'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}>
                        <Pencil size={14} />
                      </button>
                      <button onClick={e => remove(e, s.student_id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', color: '#ef4444' }}
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

      {/* Add/Edit Modal */}
      {modal && (
        <Modal title={editItem ? 'Edit Student' : 'Add New Student'} onClose={() => setModal(false)}>
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {formErr && <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', fontSize: '13px', borderRadius: '8px', padding: '10px 14px', border: '1px solid #fecaca' }}>{formErr}</div>}
            <Field label="USN *">
              <input value={form.usn} onChange={e => setForm({...form, usn: e.target.value})} placeholder="e.g. 1RV21CS001" style={inputStyle}
                onFocus={e => Object.assign(e.target.style, focusStyle)} onBlur={e => { e.target.style.borderColor='#e5e7eb'; e.target.style.boxShadow='none'; }} />
            </Field>
            <Field label="Full Name *">
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Rahul Sharma" style={inputStyle}
                onFocus={e => Object.assign(e.target.style, focusStyle)} onBlur={e => { e.target.style.borderColor='#e5e7eb'; e.target.style.boxShadow='none'; }} />
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <Field label="Department">
                <select value={form.department} onChange={e => setForm({...form, department: e.target.value})} style={sel}>
                  {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </Field>
              <Field label="Semester">
                <select value={form.semester} onChange={e => setForm({...form, semester: +e.target.value})} style={sel}>
                  {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
                </select>
              </Field>
            </div>
            <div style={{ display: 'flex', gap: '10px', paddingTop: '6px' }}>
              <button onClick={() => setModal(false)} style={{ flex: 1, padding: '10px', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '13.5px', fontWeight: '600', color: '#374151', background: '#fff', cursor: 'pointer' }}>Cancel</button>
              <button onClick={save} disabled={saving} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '10px', fontSize: '13.5px', fontWeight: '600', color: '#fff', backgroundColor: saving ? '#93c5fd' : '#1e3a8a', cursor: saving ? 'not-allowed' : 'pointer' }}>
                {saving ? 'Saving…' : editItem ? 'Update Student' : 'Add Student'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Student Detail Modal */}
      {detailStudent && (
        <StudentDetailModal
          student={detailStudent}
          onClose={() => setDetail(null)}
          onEnrolled={load}
        />
      )}


    </div>
  );
}
