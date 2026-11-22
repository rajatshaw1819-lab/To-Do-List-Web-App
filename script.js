const taskInput = document.getElementById("taskInput");
const priority = document.getElementById("priority");
const dueDate = document.getElementById("dueDate");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    const percent = total ? Math.round(completed / total * 100) : 0;

    document.getElementById("totalTasks").textContent = total;
    document.getElementById("completedTasks").textContent = completed;
    document.getElementById("pendingTasks").textContent = pending;

    document.getElementById("progressBar").style.width = percent + "%";
    document.getElementById("progressText").textContent =
        percent + "% Completed";
}

function renderTasks() {
    taskList.innerHTML = "";

    const search = searchInput.value.toLowerCase();

    tasks.forEach(task => {
        if (!task.text.toLowerCase().includes(search)) return;

        if (currentFilter === "pending" && task.completed) return;
        if (currentFilter === "completed" && !task.completed) return;

        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "task-check";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        const span = document.createElement("span");
        span.textContent = task.text;
        span.className = "task-text";

        if (task.completed) {
            span.classList.add("completed");
        }

        const priorityLabel = document.createElement("span");
        priorityLabel.textContent = task.priority;
        priorityLabel.className = "priority " + task.priority;

        const dateLabel = document.createElement("span");
        dateLabel.textContent = task.dueDate || "No deadline";
        dateLabel.className = "task-date";

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "edit-btn";

        editBtn.addEventListener("click", () => {
            const updated = prompt("Edit task:", task.text);

            if (updated !== null && updated.trim()) {
                task.text = updated.trim();
                saveTasks();
                renderTasks();
            }
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";

        deleteBtn.addEventListener("click", () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            renderTasks();
        });

        li.append(
            checkbox, span, priorityLabel,
            dateLabel, editBtn, deleteBtn
        );

        taskList.appendChild(li);
    });

    updateStats();
}

function addTask() {
    const text = taskInput.value.trim();

    if (!text) {
        alert("Please enter a task!");
        return;
    }

    tasks.push({
        id: Date.now().toString() + Math.random(),
        text: text,
        priority: priority.value,
        dueDate: dueDate.value,
        completed: false
    });

    taskInput.value = "";
    dueDate.value = "";

    saveTasks();
    renderTasks();
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", event => {
    if (event.key === "Enter") addTask();
});

searchInput.addEventListener("input", renderTasks);

document.querySelectorAll(".filter").forEach(button => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;
        document.querySelectorAll(".filter").forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");
        renderTasks();
    });
});

document.getElementById("clearBtn").addEventListener("click", () => {
    if (tasks.length && confirm("Delete all tasks?")) {
        tasks = [];
        saveTasks();
        renderTasks();
    }
});

// Dark mode

const themeBtn = document.getElementById("themeBtn");

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeBtn.textContent = "☀️";
}

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const darkMode = document.body.classList.contains("dark");

    themeBtn.textContent = darkMode ? "☀️" : "🌙";

    localStorage.setItem("theme", darkMode ? "dark" : "light");
});

renderTasks();