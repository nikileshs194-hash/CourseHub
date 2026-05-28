const supabase = require('../config/database');

const getRegistrations = async (req, res) => {
  const { data, error } = await supabase
    .from('registrations')
    .select(`
      registration_id,
      registration_date,
      students ( student_id, name, usn, department ),
      courses  ( course_id, title, course_code, semester )
    `)
    .order('registration_date', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  // Flatten nested objects for frontend convenience
  const flat = data.map(r => ({
    registration_id: r.registration_id,
    registration_date: r.registration_date,
    student_id: r.students?.student_id,
    student_name: r.students?.name,
    usn: r.students?.usn,
    department: r.students?.department,
    course_id: r.courses?.course_id,
    course_title: r.courses?.title,
    course_code: r.courses?.course_code,
    semester: r.courses?.semester,
  }));

  res.json(flat);
};

const createRegistration = async (req, res) => {
  const { student_id, course_id } = req.body;
  if (!student_id || !course_id) return res.status(400).json({ error: 'Student and course are required.' });

  const { data, error } = await supabase
    .from('registrations')
    .insert([{ student_id, course_id }])
    .select()
    .single();

  if (error) {
    if (error.code === '23505') return res.status(409).json({ error: 'Student is already registered for this course.' });
    return res.status(500).json({ error: error.message });
  }
  res.status(201).json(data);
};

const deleteRegistration = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('registrations')
    .delete()
    .eq('registration_id', id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Registration removed successfully.' });
};

module.exports = { getRegistrations, createRegistration, deleteRegistration };
