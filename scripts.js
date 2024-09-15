// Select DOM elements
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

// Load tasks from localStorage on page load
window.onload = function () {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.forEach(task => addTaskToDOM(task));
}

// Event listener for adding tasks
addTaskBtn.addEventListener('click', addTask);

// Function to add a task
function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        alert('Please enter a task.');
        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    addTaskToDOM(task);
    saveTaskToLocalStorage(task);

    taskInput.value = ''; // Clear the input field
}

// Function to add task to the DOM
function addTaskToDOM(task) {
    const taskItem = document.createElement('li');
    taskItem.setAttribute('data-id', task.id);

    taskItem.innerHTML = `
        <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
        <div class="task-actions">
            <i class="fas fa-check complete-btn"></i>
            <i class="fas fa-edit edit-btn"></i>
            <i class="fas fa-trash delete-btn"></i>
        </div>
    `;

    taskList.appendChild(taskItem);

    // Add event listeners for actions
    const completeBtn = taskItem.querySelector('.complete-btn');
    completeBtn.addEventListener('click', () => toggleCompleteTask(taskItem));

    const editBtn = taskItem.querySelector('.edit-btn');
    editBtn.addEventListener('click', () => editTask(taskItem));

    const deleteBtn = taskItem.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => deleteTask(taskItem));
}

// Function to toggle complete task
function toggleCompleteTask(taskItem) {
    const taskTextElement = taskItem.querySelector('.task-text');
    taskTextElement.classList.toggle('completed');

    updateTaskInLocalStorage(taskItem.getAttribute('data-id'), 'completed', taskTextElement.classList.contains('completed'));
}

// Function to edit a task
function editTask(taskItem) {
    const newTaskText = prompt('Edit your task:', taskItem.querySelector('.task-text').textContent);

    if (newTaskText !== null && newTaskText.trim() !== '') {
        taskItem.querySelector('.task-text').textContent = newTaskText.trim();
        updateTaskInLocalStorage(taskItem.getAttribute('data-id'), 'text', newTaskText.trim());
    }
}

// Function to delete a task
function deleteTask(taskItem) {
    taskItem.remove();
    removeTaskFromLocalStorage(taskItem.getAttribute('data-id'));
}

// Save task to localStorage
function saveTaskToLocalStorage(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Update task in localStorage
function updateTaskInLocalStorage(taskId, key, value) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(task => task.id == taskId);

    if (taskIndex !== -1) {
        tasks[taskIndex][key] = value;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

// Remove task from localStorage
function removeTaskFromLocalStorage(taskId) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = tasks.filter(task => task.id != taskId);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}
