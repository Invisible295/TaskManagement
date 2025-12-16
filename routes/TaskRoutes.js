// routes/TaskRoutes.js - CẬP NHẬT
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task');
const authMiddleware = require('../middlewares/authcompare');
const { validateTask } = require('../middlewares/validation');

// Tất cả routes đều cần authentication
router.use(authMiddleware);

// CRUD cơ bản
router.post('/create', validateTask, taskController.createTask);
router.get('/', taskController.getMyTasks);
router.get('/stats', taskController.getTaskStats);
router.get('/search', taskController.searchTasks);
router.get('/status/:status', taskController.getTasksByStatus);
router.get('/priority/:priority', taskController.getTasksByPriority);
router.get('/group/:groupID', taskController.getGroupTasks);



// ===== TASK ASSIGNMENT ROUTES (MỚI) =====
// Lấy tasks được assign cho tôi
router.get('/assigned-to-me', taskController.getMyAssignedTasks);

// Lấy tasks tôi đã assign
router.get('/assigned-by-me', taskController.getTasksIAssigned);

// Lấy assignees của task
router.get('/:taskid/assignees', taskController.getTaskAssignees);

// Assign task cho user
router.post('/:taskid/assign', taskController.assignTask);

// Assign task cho nhiều users
router.post('/:taskid/assign-multiple', taskController.assignMultipleUsers);

// Unassign task
router.delete('/:taskid/assign/:userId', taskController.unassignTask);




// ===== CÁC ROUTES CŨ =====
router.get('/:taskid', taskController.getTask);
router.put('/:taskid', validateTask, taskController.updateTask);
router.delete('/:taskid', taskController.deleteTask);

// update Status
router.patch('/:taskid/status', taskController.updateStatus);

// filter task
router.get('/filter', taskController.filterTasks);

module.exports = router;