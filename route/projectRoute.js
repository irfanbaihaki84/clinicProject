const {
  createProject,
  getAllProjects,
  getProjectById,
} = require('../controller/projectController');

const router = require('express').Router();

router.post('/', createProject);
router.get('/getAllProjects', getAllProjects);
router.get('/getProjectById/:id', getProjectById);

module.exports = router;
