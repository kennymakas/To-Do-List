// Selecting DOM elements
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

// Event listener for adding tasks
addTaskBtn.addEventListener('click', addTask);

// Load tasks from localStorage when the page is loaded
window.addEventListener('load', loadTasks);

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
    taskInput.value = ''; // Clear input field
}

// Function to add task to the DOM
function addTaskToDOM(task) {
    const taskItem = document.createElement('li');
    taskItem.classList.add(task.completed ? 'completed' : '');
    taskItem.setAttribute('data-id', task.id);

    taskItem.innerHTML = `
        <span class="task-text">${task.text}</span>
        <div class="task-actions">
            <button class="complete-btn">${task.completed ? 'Undo' : 'Complete'}</button>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn delete">Delete</button>
        </div>
    `;

    taskList.appendChild(taskItem);

    // Add event listeners for complete, edit, and delete buttons
    const completeBtn = taskItem.querySelector('.complete-btn');
    completeBtn.addEventListener('click', () => toggleCompleteTask(taskItem, task.id));

    const editBtn = taskItem.querySelector('.edit-btn');
    editBtn.addEventListener('click', () => editTask(taskItem, task.id));

    const deleteBtn = taskItem.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => deleteTask(taskItem, task.id));
}

// Function to toggle the completed status of a task
function toggleCompleteTask(taskItem, taskId) {
    const tasks = getTasksFromLocalStorage();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    tasks[taskIndex].completed = !tasks[taskIndex].completed;

    saveTasksToLocalStorage(tasks);
    taskItem.classList.toggle('completed');
    taskItem.querySelector('.complete-btn').textContent = tasks[taskIndex].completed ? 'Undo' : 'Complete';
}

// Function to edit a task
function editTask(taskItem, taskId) {
    const newText = prompt('Edit your task:', taskItem.querySelector('.task-text').textContent);
    if (newText === null || newText.trim() === '') {
        return;
    }

    const tasks = getTasksFromLocalStorage();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    tasks[taskIndex].text = newText.trim();

    saveTasksToLocalStorage(tasks);
    taskItem.querySelector('.task-text').textContent = newText.trim();
}

// Function to delete a task
function deleteTask(taskItem, taskId) {
    taskItem.remove();

    const tasks = getTasksFromLocalStorage();
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    saveTasksToLocalStorage(updatedTasks);
}

// Function to save a task to localStorage
function saveTaskToLocalStorage(task) {
    const tasks = getTasksFromLocalStorage();
    tasks.push(task);
    saveTasksToLocalStorage(tasks);
}

// Function to save tasks array to localStorage
function saveTasksToLocalStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to get tasks from localStorage
function getTasksFromLocalStorage() {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
}

// Function to load tasks from localStorage and render them
function loadTasks() {
    const tasks = getTasksFromLocalStorage();
    tasks.forEach(task => addTaskToDOM(task));
}
