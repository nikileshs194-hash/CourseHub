-- Add department column to courses
ALTER TABLE courses ADD COLUMN IF NOT EXISTS department VARCHAR(50) DEFAULT 'Common';

-- Update existing courses with their departments
UPDATE courses SET department = 'Common'    WHERE course_code IN ('MA101','MA201','MA301','PH101','PH201','CH101','ME101','ME201','EL101');
UPDATE courses SET department = 'CSE'       WHERE course_code IN ('CS101','CS201','CS202','CS301','CS302','CS303','CS304','CS401','CS402','CS403','CS404','CS405','CS501','CS502','CS503','CS504','CS505','CS601','CS602','CS603','CS701','CS702','CS801','CS802','CS803');
UPDATE courses SET department = 'ECE'       WHERE course_code IN ('EC201','EC301');
