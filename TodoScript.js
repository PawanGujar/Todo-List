document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('todo-input');
    const timeInput = document.getElementById('todo-time');
    const addBtn = document.getElementById('add-btn');
    const listIncomplete = document.getElementById('todo-list-incomplete');
    const listCompleted = document.getElementById('todo-list-completed');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const container = document.querySelector('.container');
    const footer = document.querySelector('.footer');
    const h1 = document.querySelector('h1');
    const listTitles = document.querySelectorAll('.list-title');

    // Load todos from localStorage
    let todos = [];
    try {
        todos = JSON.parse(localStorage.getItem('todos')) || [];
    } catch (e) {
        todos = [];
    }
    renderTodos();

    // Theme mode
    let darkMode = localStorage.getItem('darkMode') === 'true';
    setTheme(darkMode);

    themeToggle.addEventListener('click', function() {
        darkMode = !darkMode;
        setTheme(darkMode);
        localStorage.setItem('darkMode', darkMode);
    });

    addBtn.addEventListener('click', addTodo);
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') addTodo();
    });
    timeInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') addTodo();
    });

    function setTheme(isDark) {
        document.body.classList.toggle('dark-mode', isDark);
        container.classList.toggle('dark-mode', isDark);
        footer.classList.toggle('dark-mode', isDark);
        h1.classList.toggle('dark-mode', isDark);
        listTitles.forEach(t => t.classList.toggle('dark-mode', isDark));
        themeIcon.textContent = isDark ? '\u263D' : '\u263C';
        if (isDark) {
            themeToggle.classList.add('dark');
        } else {
            themeToggle.classList.remove('dark');
        }
        // Update todo cards and list items
        document.querySelectorAll('.todo-card').forEach(card => card.classList.toggle('dark-mode', isDark));
        document.querySelectorAll('#todo-list-incomplete li, #todo-list-completed li').forEach(li => {
            li.classList.toggle('dark-mode', isDark);
            if (li.classList.contains('completed')) {
                li.classList.toggle('completed-dark', isDark);
            }
        });
        document.querySelectorAll('.delete-btn').forEach(btn => btn.classList.toggle('dark-mode', isDark));
    }

    function addTodo() {
        console.log('Add button clicked');
        const value = input.value.trim();
        const time = timeInput.value;
        if (!value) return;
        todos.push({ text: value, time: time, completed: false });
        input.value = '';
        timeInput.value = '';
        saveTodos();
        renderTodos();
    }

    function renderTodos() {
        listIncomplete.innerHTML = '';
        listCompleted.innerHTML = '';
        // Sort by time for incomplete
        const incomplete = todos.filter(t => !t.completed).sort((a, b) => (a.time || '').localeCompare(b.time || ''));
        const completed = todos.filter(t => t.completed);

        incomplete.forEach((todo, idx) => {
            const li = createTodoElement(todo, idx, false);
            listIncomplete.appendChild(li);
        });
        completed.forEach((todo, idx) => {
            const li = createTodoElement(todo, idx, true);
            listCompleted.appendChild(li);
        });
        // Do not call setTheme here; theme is handled on page load and toggle only
    }

    function createTodoElement(todo, idx, isCompleted) {
        const li = document.createElement('li');
        const textSpan = document.createElement('span');
        textSpan.style.flex = '1';
        // Add alarm icon before task name
        textSpan.innerHTML = '<span style="margin-right:7px;font-size:18px;vertical-align:middle;">&#128276;</span>' + todo.text;
        li.appendChild(textSpan);
        if (todo.time) {
            const timeSpan = document.createElement('span');
            timeSpan.textContent = todo.time;
            timeSpan.style.marginLeft = '10px';
            timeSpan.style.color = 'white';
            li.appendChild(timeSpan);
        }
        if (isCompleted) li.classList.add('completed');
        li.addEventListener('click', function(e) {
            if (e.target.classList.contains('delete-btn')) return;
            todos[getTodoIndex(todo, isCompleted)].completed = !todos[getTodoIndex(todo, isCompleted)].completed;
            saveTodos();
            renderTodos();
        });
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.className = 'delete-btn';
        delBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            todos.splice(getTodoIndex(todo, isCompleted), 1);
            saveTodos();
            renderTodos();
        });
        li.appendChild(delBtn);
        return li;
    }

    function getTodoIndex(todo, isCompleted) {
        // Find index in todos array
        return todos.findIndex(t => t.text === todo.text && t.time === todo.time && t.completed === isCompleted);
    }

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }
});

