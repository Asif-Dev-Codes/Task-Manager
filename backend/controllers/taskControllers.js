const asyncHandler = require('express-async-handler');
const Task = require('../models/taskModel');

// const getTasks = asyncHandler((req, res) => {
//     const tasks = await Task.find()
//     res.status(200).json(tasks);
// })
const getTasks = asyncHandler(async (req, res) => {
    const tasks = await Task.find({ user: req.user.id }) // Ensure tasks are filtered by the authenticated user;
    res.status(200).json(tasks);
});


const setTasks = asyncHandler(async (req, res) => {
    if (!req.body || !req.body.text || req.body.text.trim() === "") {
        throw new Error('Please enter a Task');
    }

    const task = await Task.create({ text: req.body.text, user: req.user.id }); // Associate task with the authenticated user
    res.status(200).json(task);
})

// const setTasks = (req, res) => {
//     if (!req.body.text) {
//         res.status(400)
//         throw new Error('Please enter a Task')
//     }
//     res.status(200).json({ message: 'Create Task' })
// }
const user = require('../models/userModel');

const updateTasks = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id)

    if (!task) {
        res.status(400)
        throw new Error('Task not found')

    }
    const user = await User.findById(req.user.id)
    if (!user) {
        res.status(401)
        throw new Error('No such user found')
    }
    if (task.user.toString() !== user.id) {
        res.status(401)
        throw new Error('User is not authorized to update')
    }
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(200).json(updatedTask)
})



// const deleteTasks = asyncHandler(async (req, res) => {
//     const task = await Task.findById(req.params.id);

//     if (!task) {
//         res.status(404);
//         throw new Error("Task not found");
//     }
    

//     await task.deleteOne(); // ✅ correct document method

//     res.status(200).json({ message: `Task ${req.params.id} deleted` });
// });
// const deleteTasks = asyncHandler(async (req, res) => {
//     const task = await Task.findById(req.params.id);

//     if (!task) {
//         res.status(404);
//         throw new Error("Task not found");
//     }

//     // Check if the logged-in user exists
//     const user = await User.findById(req.user.id);
//     if (!user) {
//         res.status(401);
//         throw new Error('No such user found');
//     }

//     // Check if the task belongs to the logged-in user
//     if (task.user.toString() !== user.id) {
//         res.status(401);
//         throw new Error('User is not authorized to delete this task');
//     }

//     await task.deleteOne();

//     res.status(200).json({ 
//         message: `Task ${req.params.id} deleted successfully` 
//     });
// });

const deleteTasks = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(404);
        throw new Error("Task not found");
    }

    // Ownership Check (Best & Simple Way)
    if (task.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User is not authorized to delete this task');
    }

    await task.deleteOne();

    res.status(200).json({ 
        message: `Task ${req.params.id} deleted successfully` 
    });
});

module.exports = { getTasks, setTasks, updateTasks, deleteTasks }