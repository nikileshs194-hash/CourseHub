const supabase = require('../config/database');

const getStats = async (req, res) => {
  // Fetch all data in parallel
  const [students, courses, registrations] = await Promise.all([
    supabase.from('students').select('semester, department'),
    supabase.from('courses').select('semester'),
    supabase.from('registrations').select('course_id, courses(semester)'),
  ]);

  if (students.error || courses.error || registrations.error) {
    return res.status(500).json({ error: 'Failed to load stats.' });
  }

  const allStudents = students.data;
  const allCourses = courses.data;
  const allRegs = registrations.data;

  // Aggregate courses by semester
  const coursesBySemMap = {};
  allCourses.forEach(c => {
    coursesBySemMap[c.semester] = (coursesBySemMap[c.semester] || 0) + 1;
  });
  const coursesBySemester = Object.entries(coursesBySemMap)
    .map(([semester, count]) => ({ semester: parseInt(semester), count }))
    .sort((a, b) => a.semester - b.semester);

  // Aggregate registrations by course semester
  const regsBySemMap = {};
  allRegs.forEach(r => {
    const sem = r.courses?.semester;
    if (sem) regsBySemMap[sem] = (regsBySemMap[sem] || 0) + 1;
  });
  const registrationsBySemester = Object.entries(regsBySemMap)
    .map(([semester, count]) => ({ semester: parseInt(semester), count }))
    .sort((a, b) => a.semester - b.semester);

  // Aggregate students by department
  const deptMap = {};
  allStudents.forEach(s => {
    if (s.department) deptMap[s.department] = (deptMap[s.department] || 0) + 1;
  });
  const studentsByDepartment = Object.entries(deptMap)
    .map(([department, count]) => ({ department, count }))
    .sort((a, b) => b.count - a.count);

  // Unique departments count
  const uniqueDepts = new Set(allStudents.map(s => s.department).filter(Boolean));

  res.json({
    totalStudents: allStudents.length,
    totalCourses: allCourses.length,
    totalRegistrations: allRegs.length,
    totalDepartments: uniqueDepts.size,
    coursesBySemester,
    registrationsBySemester,
    studentsByDepartment,
  });
};

const getRecentRegistrations = async (req, res) => {
  const { data, error } = await supabase
    .from('registrations')
    .select(`
      registration_id,
      registration_date,
      students ( name, usn ),
      courses  ( title, semester )
    `)
    .order('registration_date', { ascending: false })
    .limit(5);

  if (error) return res.status(500).json({ error: error.message });

  const flat = data.map(r => ({
    registration_id: r.registration_id,
    registration_date: r.registration_date,
    student_name: r.students?.name,
    usn: r.students?.usn,
    course_title: r.courses?.title,
    semester: r.courses?.semester,
  }));

  res.json(flat);
};

const getMostRegisteredCourses = async (req, res) => {
  // Fetch all registrations with course info
  const { data, error } = await supabase
    .from('registrations')
    .select('course_id, courses(course_id, title, course_code)');

  if (error) return res.status(500).json({ error: error.message });

  // Count per course
  const countMap = {};
  const infoMap = {};
  data.forEach(r => {
    const id = r.course_id;
    countMap[id] = (countMap[id] || 0) + 1;
    if (r.courses) infoMap[id] = r.courses;
  });

  const result = Object.entries(countMap)
    .map(([course_id, count]) => ({
      course_id,
      title: infoMap[course_id]?.title || 'Unknown',
      course_code: infoMap[course_id]?.course_code || '',
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  res.json(result);
};

module.exports = { getStats, getRecentRegistrations, getMostRegisteredCourses };
