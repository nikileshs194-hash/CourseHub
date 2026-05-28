import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

/* ─── helper: throw on supabase error ─── */
function check({ data, error }) {
  if (error) throw new Error(error.message);
  return { data };
}

/* ════════════════════════════════════════
   STUDENTS
════════════════════════════════════════ */
export const getStudents = () =>
  supabase.from('students').select('*').order('name').then(check);

export const createStudent = (body) =>
  supabase.from('students')
    .insert([{ ...body, usn: body.usn.trim().toUpperCase(), name: body.name.trim() }])
    .select().single()
    .then(({ data, error }) => {
      if (error?.code === '23505') throw { response: { data: { error: 'USN already exists.' } } };
      if (error) throw new Error(error.message);
      return { data };
    });

export const updateStudent = (id, body) =>
  supabase.from('students')
    .update({ ...body, usn: body.usn.trim().toUpperCase(), name: body.name.trim() })
    .eq('student_id', id).select().single()
    .then(({ data, error }) => {
      if (error?.code === '23505') throw { response: { data: { error: 'USN already exists.' } } };
      if (error) throw new Error(error.message);
      return { data };
    });

export const deleteStudent = async (id) => {
  await supabase.from('registrations').delete().eq('student_id', id);
  const { error } = await supabase.from('students').delete().eq('student_id', id);
  if (error) throw new Error(error.message);
  return { data: { message: 'Deleted' } };
};

/* ════════════════════════════════════════
   COURSES
════════════════════════════════════════ */
export const getCourses = () =>
  supabase.from('courses').select('*').order('semester').order('title').then(check);

export const getCoursesBySemester = (sem) =>
  supabase.from('courses').select('*').eq('semester', Number(sem)).order('title').then(check);

export const createCourse = (body) =>
  supabase.from('courses')
    .insert([{ ...body, course_code: body.course_code.trim().toUpperCase(), title: body.title.trim() }])
    .select().single()
    .then(({ data, error }) => {
      if (error?.code === '23505') throw { response: { data: { error: 'Course code already exists.' } } };
      if (error) throw new Error(error.message);
      return { data };
    });

export const updateCourse = (id, body) =>
  supabase.from('courses')
    .update({ ...body, course_code: body.course_code.trim().toUpperCase(), title: body.title.trim() })
    .eq('course_id', id).select().single()
    .then(({ data, error }) => {
      if (error?.code === '23505') throw { response: { data: { error: 'Course code already exists.' } } };
      if (error) throw new Error(error.message);
      return { data };
    });

export const deleteCourse = async (id) => {
  await supabase.from('registrations').delete().eq('course_id', id);
  const { error } = await supabase.from('courses').delete().eq('course_id', id);
  if (error) throw new Error(error.message);
  return { data: { message: 'Deleted' } };
};

/* ════════════════════════════════════════
   REGISTRATIONS
════════════════════════════════════════ */
export const getRegistrations = async () => {
  const { data, error } = await supabase
    .from('registrations')
    .select(`registration_id, registration_date,
             students(student_id, name, usn, department),
             courses(course_id, title, course_code, semester)`)
    .order('registration_date', { ascending: false });
  if (error) throw new Error(error.message);
  return {
    data: data.map(r => ({
      registration_id:   r.registration_id,
      registration_date: r.registration_date,
      student_id:   r.students?.student_id,
      student_name: r.students?.name,
      usn:          r.students?.usn,
      department:   r.students?.department,
      course_id:    r.courses?.course_id,
      course_title: r.courses?.title,
      course_code:  r.courses?.course_code,
      semester:     r.courses?.semester,
    }))
  };
};

export const createRegistration = (body) =>
  supabase.from('registrations').insert([body]).select().single()
    .then(({ data, error }) => {
      if (error?.code === '23505') throw { response: { data: { error: 'Student is already registered for this course.' } } };
      if (error) throw new Error(error.message);
      return { data };
    });

export const deleteRegistration = (id) =>
  supabase.from('registrations').delete().eq('registration_id', id)
    .then(({ error }) => { if (error) throw new Error(error.message); return { data: {} }; });

/* ════════════════════════════════════════
   DASHBOARD
════════════════════════════════════════ */
export const getDashboardStats = async () => {
  const [students, courses, registrations] = await Promise.all([
    supabase.from('students').select('semester, department'),
    supabase.from('courses').select('semester'),
    supabase.from('registrations').select('course_id, courses(semester)'),
  ]);

  if (students.error) throw new Error(students.error.message);

  const allStudents = students.data ?? [];
  const allCourses  = courses.data  ?? [];
  const allRegs     = registrations.data ?? [];

  // Courses per semester
  const csMap = {};
  allCourses.forEach(c => { csMap[c.semester] = (csMap[c.semester] || 0) + 1; });
  const coursesBySemester = Object.entries(csMap)
    .map(([s, count]) => ({ semester: +s, count })).sort((a,b) => a.semester - b.semester);

  // Registrations per semester
  const rsMap = {};
  allRegs.forEach(r => { const s = r.courses?.semester; if (s) rsMap[s] = (rsMap[s] || 0) + 1; });
  const registrationsBySemester = Object.entries(rsMap)
    .map(([s, count]) => ({ semester: +s, count })).sort((a,b) => a.semester - b.semester);

  // Students per department
  const dMap = {};
  allStudents.forEach(s => { if (s.department) dMap[s.department] = (dMap[s.department] || 0) + 1; });
  const studentsByDepartment = Object.entries(dMap)
    .map(([department, count]) => ({ department, count })).sort((a,b) => b.count - a.count);

  return {
    data: {
      totalStudents:      allStudents.length,
      totalCourses:       allCourses.length,
      totalRegistrations: allRegs.length,
      totalDepartments:   new Set(allStudents.map(s => s.department).filter(Boolean)).size,
      coursesBySemester,
      registrationsBySemester,
      studentsByDepartment,
    }
  };
};

export const getRecentRegistrations = async () => {
  const { data, error } = await supabase
    .from('registrations')
    .select(`registration_id, registration_date,
             students(name, usn),
             courses(title, semester)`)
    .order('registration_date', { ascending: false })
    .limit(5);
  if (error) throw new Error(error.message);
  return {
    data: data.map(r => ({
      registration_id:   r.registration_id,
      registration_date: r.registration_date,
      student_name: r.students?.name,
      usn:          r.students?.usn,
      course_title: r.courses?.title,
      semester:     r.courses?.semester,
    }))
  };
};

/* ════════════════════════════════════════
   SETTINGS
════════════════════════════════════════ */
export const getSettings = async () => {
  const { data, error } = await supabase.from('settings').select('*').single();
  if (error?.code === 'PGRST116' || !data) {
    // Table empty — return hardcoded defaults (user can save to persist)
    return {
      data: {
        id: null,
        admin_name: 'Administrator',
        email: 'admin@mitmysore.edu.in',
        institution_name: 'Maharaja Institute of Technology, Mysore',
        academic_year: '2024-25',
        website: 'https://mitmysore.in',
      }
    };
  }
  if (error) throw new Error(error.message);
  return { data };
};

export const updateSettings = async (id, body) => {
  const payload = { ...body, updated_at: new Date().toISOString() };
  if (id) {
    const { data, error } = await supabase.from('settings').update(payload).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return { data };
  } else {
    const { data, error } = await supabase.from('settings').insert([payload]).select().single();
    if (error) throw new Error(error.message);
    return { data };
  }
};

export const getMostRegisteredCourses = async () => {
  const { data, error } = await supabase
    .from('registrations')
    .select('course_id, courses(course_id, title, course_code)');
  if (error) throw new Error(error.message);

  const countMap = {}, infoMap = {};
  data.forEach(r => {
    countMap[r.course_id] = (countMap[r.course_id] || 0) + 1;
    if (r.courses) infoMap[r.course_id] = r.courses;
  });

  return {
    data: Object.entries(countMap)
      .map(([id, count]) => ({ course_id: id, title: infoMap[id]?.title || '', course_code: infoMap[id]?.course_code || '', count }))
      .sort((a,b) => b.count - a.count).slice(0, 5)
  };
};
