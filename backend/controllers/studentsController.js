const supabase = require('../config/database');

const getStudents = async (req, res) => {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .order('name', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

const createStudent = async (req, res) => {
  const { usn, name, department, semester } = req.body;
  if (!usn || !name) return res.status(400).json({ error: 'USN and name are required.' });

  const { data, error } = await supabase
    .from('students')
    .insert([{ usn: usn.trim().toUpperCase(), name: name.trim(), department, semester }])
    .select()
    .single();

  if (error) {
    if (error.code === '23505') return res.status(409).json({ error: 'USN already exists.' });
    return res.status(500).json({ error: error.message });
  }
  res.status(201).json(data);
};

const updateStudent = async (req, res) => {
  const { id } = req.params;
  const { usn, name, department, semester } = req.body;

  const { data, error } = await supabase
    .from('students')
    .update({ usn: usn.trim().toUpperCase(), name: name.trim(), department, semester })
    .eq('student_id', id)
    .select()
    .single();

  if (error) {
    if (error.code === '23505') return res.status(409).json({ error: 'USN already exists.' });
    return res.status(500).json({ error: error.message });
  }
  if (!data) return res.status(404).json({ error: 'Student not found.' });
  res.json(data);
};

const deleteStudent = async (req, res) => {
  const { id } = req.params;

  // Registrations cascade-delete via FK, but we do it explicitly for safety
  await supabase.from('registrations').delete().eq('student_id', id);

  const { error } = await supabase
    .from('students')
    .delete()
    .eq('student_id', id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Student deleted successfully.' });
};

module.exports = { getStudents, createStudent, updateStudent, deleteStudent };
