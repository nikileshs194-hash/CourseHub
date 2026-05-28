-- AIML Semester 4 Courses — MIT Mysore
-- Run this in Supabase SQL Editor

INSERT INTO courses (course_code, title, semester, credits, department) VALUES
('M23BMAT401',  'Mathematics – III',                          4, 3, 'AIML'),
('M23BCS402',   'Analysis & Design of Algorithms',            4, 4, 'AIML'),
('M23BCS403',   'Microcontroller',                            4, 3, 'AIML'),
('M23BCS404',   'Database Management Systems',                4, 4, 'AIML'),
('M23BCS405',   'Introduction to Artificial Intelligence',    4, 4, 'AIML'),
('M23BCSL406',  'Analysis & Design of Algorithms Lab',        4, 1, 'AIML'),
('M23BCS407B',  'Linear Algebra',                             4, 3, 'AIML'),
('M23BCS408B',  'MongoDB',                                    4, 3, 'AIML'),
('M23BUHK409',  'Universal Human Values',                     4, 2, 'AIML'),
('M23BNSK410',  'National Service Scheme',                    4, 1, 'AIML'),
('M23BDIPM411', 'Diploma Mathematics-2',                      4, 3, 'AIML')
ON CONFLICT (course_code) DO NOTHING;

-- Descriptions
UPDATE courses SET description = 'Advanced engineering mathematics covering Fourier transforms, Z-transforms, numerical methods, and statistical techniques relevant to engineering applications.' WHERE course_code = 'M23BMAT401';
UPDATE courses SET description = 'Design and analysis of algorithms including sorting, searching, dynamic programming, greedy techniques, graph algorithms, and complexity analysis using asymptotic notation.' WHERE course_code = 'M23BCS402';
UPDATE courses SET description = 'Architecture, programming and interfacing of microcontrollers including ARM Cortex-M, timers, interrupts, serial communication, ADC, and embedded system design.' WHERE course_code = 'M23BCS403';
UPDATE courses SET description = 'Comprehensive study of relational database design, SQL, normalization, transaction management, indexing, query optimization, and database administration concepts.' WHERE course_code = 'M23BCS404';
UPDATE courses SET description = 'Fundamentals of AI including search algorithms, knowledge representation, expert systems, natural language processing, machine learning basics, and AI applications.' WHERE course_code = 'M23BCS405';
UPDATE courses SET description = 'Practical implementation of algorithms in a laboratory setting, including sorting, graph traversal, dynamic programming, and performance benchmarking exercises.' WHERE course_code = 'M23BCSL406';
UPDATE courses SET description = 'Study of vector spaces, linear transformations, eigenvalues and eigenvectors, matrix decomposition, and applications in data science and machine learning.' WHERE course_code = 'M23BCS407B';
UPDATE courses SET description = 'Introduction to MongoDB NoSQL database including document model, CRUD operations, aggregation pipeline, indexing, replication, and integration with applications.' WHERE course_code = 'M23BCS408B';
UPDATE courses SET description = 'Exploration of human values, ethics, and professional responsibility including self-awareness, relationships, societal harmony, and sustainable living principles.' WHERE course_code = 'M23BUHK409';
UPDATE courses SET description = 'Community service and social development activities promoting national integration, discipline, and civic responsibility through organized service programs.' WHERE course_code = 'M23BNSK410';
UPDATE courses SET description = 'Mathematics foundation course covering algebra, trigonometry, calculus basics, and applied mathematics for diploma-level engineering students.' WHERE course_code = 'M23BDIPM411';
