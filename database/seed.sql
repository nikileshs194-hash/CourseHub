-- Sample Data for MIT Mysore Course Registration System
-- Safe to run multiple times (uses ON CONFLICT DO NOTHING)

-- ============ COURSES ============
INSERT INTO courses (course_code, title, semester, credits) VALUES
-- Semester 1
('MA101', 'Engineering Mathematics I', 1, 4),
('PH101', 'Engineering Physics', 1, 4),
('CH101', 'Engineering Chemistry', 1, 3),
('CS101', 'Programming in C', 1, 3),
('ME101', 'Engineering Graphics', 1, 2),
('EL101', 'Basic Electronics', 1, 3),
-- Semester 2
('MA201', 'Engineering Mathematics II', 2, 4),
('PH201', 'Applied Physics', 2, 3),
('CS201', 'Data Structures', 2, 4),
('EC201', 'Digital Electronics', 2, 3),
('ME201', 'Workshop Practice', 2, 2),
('CS202', 'Object Oriented Programming', 2, 4),
-- Semester 3
('CS301', 'Database Management Systems', 3, 4),
('CS302', 'Operating Systems', 3, 4),
('CS303', 'Computer Networks', 3, 4),
('MA301', 'Discrete Mathematics', 3, 3),
('CS304', 'Data Structures & Algorithms', 3, 4),
('EC301', 'Microprocessors', 3, 3),
-- Semester 4
('CS401', 'Software Engineering', 4, 4),
('CS402', 'Theory of Computation', 4, 4),
('CS403', 'Computer Organization', 4, 3),
('MA401', 'Probability & Statistics', 4, 3),
('CS404', 'Java Programming', 4, 4),
-- Semester 5
('CS501', 'Compiler Design', 5, 4),
('CS502', 'Web Technologies', 5, 3),
('CS503', 'Artificial Intelligence', 5, 4),
('CS504', 'Computer Graphics', 5, 3),
('CS505', 'Cryptography & Network Security', 5, 3),
-- Semester 6
('CS601', 'Machine Learning', 6, 4),
('CS602', 'Cloud Computing', 6, 3),
('CS603', 'Mobile Application Development', 6, 3),
('CS604', 'Big Data Analytics', 6, 4),
-- Semester 7
('CS701', 'Deep Learning', 7, 4),
('CS702', 'Internet of Things', 7, 3),
('CS703', 'Blockchain Technology', 7, 3),
-- Semester 8
('CS801', 'Project Work', 8, 4),
('CS802', 'Seminar', 8, 2),
('CS803', 'Industrial Training', 8, 3)
ON CONFLICT (course_code) DO NOTHING;

-- ============ STUDENTS ============
INSERT INTO students (usn, name, department, semester) VALUES
('1RV21CS001', 'Rahul Sharma',    'CSE', 3),
('1RV21CS014', 'Ananya Shetty',   'CSE', 3),
('1RV21CS032', 'Vikram Reddy',    'CSE', 3),
('1RV21CS045', 'Meghana S',       'CSE', 5),
('1RV21CS009', 'Aditya Patel',    'CSE', 2),
('1RV21IS001', 'Priya Nair',      'ISE', 3),
('1RV21IS015', 'Karthik M',       'ISE', 4),
('1RV21IS023', 'Sneha Rao',       'ISE', 3),
('1RV21EC005', 'Arjun Kumar',     'ECE', 3),
('1RV21EC018', 'Divya Menon',     'ECE', 5),
('1RV21AI001', 'Rohan Gowda',     'AIML', 3),
('1RV21AI010', 'Nisha Patel',     'AIML', 4),
('1RV21ME002', 'Suresh T',        'Mechanical', 3),
('1RV21ME019', 'Kavya N',         'Mechanical', 2),
('1RV21CV003', 'Ramesh BN',       'Civil', 3),
('1RV22CS001', 'Pooja Verma',     'CSE', 1),
('1RV22CS010', 'Akash Jain',      'CSE', 2),
('1RV22IS005', 'Deepak Kumar',    'ISE', 2),
('1RV22EC008', 'Lakshmi R',       'ECE', 1),
('1RV22AI003', 'Yash Mehta',      'AIML', 2),
('1RV21CS055', 'Shruti KP',       'CSE', 5),
('1RV21CS067', 'Naveen Raj',      'CSE', 6),
('1RV21IS030', 'Amulya MK',       'ISE', 5),
('1RV21EC022', 'Ganesh Prasad',   'ECE', 4),
('1RV21AI015', 'Tejas Kulkarni',  'AIML', 6)
ON CONFLICT (usn) DO NOTHING;

-- ============ REGISTRATIONS ============
INSERT INTO registrations (student_id, course_id)
SELECT s.student_id, c.course_id FROM students s, courses c
WHERE s.usn = '1RV21CS001' AND c.course_code IN ('CS301','CS302','CS303','MA301')
ON CONFLICT (student_id, course_id) DO NOTHING;

INSERT INTO registrations (student_id, course_id)
SELECT s.student_id, c.course_id FROM students s, courses c
WHERE s.usn = '1RV21CS014' AND c.course_code IN ('CS301','CS302','CS303','CS304')
ON CONFLICT (student_id, course_id) DO NOTHING;

INSERT INTO registrations (student_id, course_id)
SELECT s.student_id, c.course_id FROM students s, courses c
WHERE s.usn = '1RV21CS032' AND c.course_code IN ('CS301','CS302','CS303')
ON CONFLICT (student_id, course_id) DO NOTHING;

INSERT INTO registrations (student_id, course_id)
SELECT s.student_id, c.course_id FROM students s, courses c
WHERE s.usn = '1RV21CS045' AND c.course_code IN ('CS501','CS502','CS503')
ON CONFLICT (student_id, course_id) DO NOTHING;

INSERT INTO registrations (student_id, course_id)
SELECT s.student_id, c.course_id FROM students s, courses c
WHERE s.usn = '1RV21CS009' AND c.course_code IN ('MA201','CS201','CS202')
ON CONFLICT (student_id, course_id) DO NOTHING;

INSERT INTO registrations (student_id, course_id)
SELECT s.student_id, c.course_id FROM students s, courses c
WHERE s.usn = '1RV21IS001' AND c.course_code IN ('CS301','CS302','MA301')
ON CONFLICT (student_id, course_id) DO NOTHING;

INSERT INTO registrations (student_id, course_id)
SELECT s.student_id, c.course_id FROM students s, courses c
WHERE s.usn = '1RV21IS015' AND c.course_code IN ('CS401','CS402','CS403','MA401')
ON CONFLICT (student_id, course_id) DO NOTHING;

INSERT INTO registrations (student_id, course_id)
SELECT s.student_id, c.course_id FROM students s, courses c
WHERE s.usn = '1RV21IS023' AND c.course_code IN ('CS301','CS302','CS303')
ON CONFLICT (student_id, course_id) DO NOTHING;

INSERT INTO registrations (student_id, course_id)
SELECT s.student_id, c.course_id FROM students s, courses c
WHERE s.usn = '1RV21EC005' AND c.course_code IN ('CS301','CS302','EC301')
ON CONFLICT (student_id, course_id) DO NOTHING;

INSERT INTO registrations (student_id, course_id)
SELECT s.student_id, c.course_id FROM students s, courses c
WHERE s.usn = '1RV21EC018' AND c.course_code IN ('CS501','CS502','CS503')
ON CONFLICT (student_id, course_id) DO NOTHING;

INSERT INTO registrations (student_id, course_id)
SELECT s.student_id, c.course_id FROM students s, courses c
WHERE s.usn = '1RV21AI001' AND c.course_code IN ('CS301','CS303','CS304')
ON CONFLICT (student_id, course_id) DO NOTHING;

INSERT INTO registrations (student_id, course_id)
SELECT s.student_id, c.course_id FROM students s, courses c
WHERE s.usn = '1RV21AI010' AND c.course_code IN ('CS401','CS402','CS404')
ON CONFLICT (student_id, course_id) DO NOTHING;

INSERT INTO registrations (student_id, course_id)
SELECT s.student_id, c.course_id FROM students s, courses c
WHERE s.usn = '1RV21ME002' AND c.course_code IN ('CS301','MA301')
ON CONFLICT (student_id, course_id) DO NOTHING;

INSERT INTO registrations (student_id, course_id)
SELECT s.student_id, c.course_id FROM students s, courses c
WHERE s.usn = '1RV21CV003' AND c.course_code IN ('CS301','CS302')
ON CONFLICT (student_id, course_id) DO NOTHING;

INSERT INTO registrations (student_id, course_id)
SELECT s.student_id, c.course_id FROM students s, courses c
WHERE s.usn = '1RV22CS001' AND c.course_code IN ('MA101','PH101','CS101')
ON CONFLICT (student_id, course_id) DO NOTHING;

INSERT INTO registrations (student_id, course_id)
SELECT s.student_id, c.course_id FROM students s, courses c
WHERE s.usn = '1RV22CS010' AND c.course_code IN ('CS201','CS202','MA201')
ON CONFLICT (student_id, course_id) DO NOTHING;

INSERT INTO registrations (student_id, course_id)
SELECT s.student_id, c.course_id FROM students s, courses c
WHERE s.usn = '1RV21CS055' AND c.course_code IN ('CS501','CS502','CS504','CS505')
ON CONFLICT (student_id, course_id) DO NOTHING;

INSERT INTO registrations (student_id, course_id)
SELECT s.student_id, c.course_id FROM students s, courses c
WHERE s.usn = '1RV21CS067' AND c.course_code IN ('CS601','CS602','CS603')
ON CONFLICT (student_id, course_id) DO NOTHING;

INSERT INTO registrations (student_id, course_id)
SELECT s.student_id, c.course_id FROM students s, courses c
WHERE s.usn = '1RV21IS030' AND c.course_code IN ('CS501','CS503','CS505')
ON CONFLICT (student_id, course_id) DO NOTHING;

INSERT INTO registrations (student_id, course_id)
SELECT s.student_id, c.course_id FROM students s, courses c
WHERE s.usn = '1RV21EC022' AND c.course_code IN ('CS401','CS403','MA401')
ON CONFLICT (student_id, course_id) DO NOTHING;

INSERT INTO registrations (student_id, course_id)
SELECT s.student_id, c.course_id FROM students s, courses c
WHERE s.usn = '1RV21AI015' AND c.course_code IN ('CS601','CS604')
ON CONFLICT (student_id, course_id) DO NOTHING;
