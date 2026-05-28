const supabase = require('../config/database');

const getCourses = async (req, res) => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('semester', { ascending: true })
    .order('title', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

const getCoursesBySemester = async (req, res) => {
  const { sem } = req.params;
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('semester', parseInt(sem))
    .order('title', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

const createCourse = async (req, res) => {
  const { course_code, title, semester, credits } = req.body;
  if (!course_code || !title) return res.status(400).json({ error: 'Course code and title are required.' });

  const { data, error } = await supabase
    .from('courses')
    .insert([{ course_code: course_code.trim().toUpperCase(), title: title.trim(), semester, credits }])
    .select()
    .single();

  if (error) {
    if (error.code === '23505') return res.status(409).json({ error: 'Course code already exists.' });
    return res.status(500).json({ error: error.message });
  }
  res.status(201).json(data);
};

const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { course_code, title, semester, credits } = req.body;

  const { data, error } = await supabase
    .from('courses')
    .update({ course_code: course_code.trim().toUpperCase(), title: title.trim(), semester, credits })
    .eq('course_id', id)
    .select()
    .single();

  if (error) {
    if (error.code === '23505') return res.status(409).json({ error: 'Course code already exists.' });
    return res.status(500).json({ error: error.message });
  }
  if (!data) return res.status(404).json({ error: 'Course not found.' });
  res.json(data);
};

const deleteCourse = async (req, res) => {
  const { id } = req.params;

  await supabase.from('registrations').delete().eq('course_id', id);

  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('course_id', id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Course deleted successfully.' });
};

module.exports = { getCourses, getCoursesBySemester, createCourse, updateCourse, deleteCourse };
