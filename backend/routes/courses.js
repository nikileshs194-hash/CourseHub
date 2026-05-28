const express = require('express');
const router = express.Router();
const { getCourses, getCoursesBySemester, createCourse, updateCourse, deleteCourse } = require('../controllers/coursesController');

router.get('/', getCourses);
router.get('/semester/:sem', getCoursesBySemester);
router.post('/', createCourse);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);

module.exports = router;
