document.addEventListener('DOMContentLoaded', () => {
  const todoForm = document.getElementById('todo-form');
  const todoInput = document.getElementById('todo-input');
  const todoList = document.getElementById('todo-list');

  // Load saved todos from storage
  chrome.storage.sync.get('todos', (data) => {
    if (data.todos) {
      data.todos.forEach(todo => addTodoToList(todo.text, todo.completed));
    }
  });

  todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (text) {
      addTodoToList(text);
      saveTodoToStorage(text);
      todoInput.value = '';
    }
  });

  function addTodoToList(text, completed = false) {
    const li = document.createElement('li');
    li.textContent = text;
    if (completed) {
      li.classList.add('completed');
    }

    const completeButton = document.createElement('button');
    completeButton.textContent = '✔';
    completeButton.addEventListener('click', () => {
      li.classList.toggle('completed');
      updateTodoInStorage(text, li.classList.contains('completed'));
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '✖';
    deleteButton.addEventListener('click', () => {
      li.remove();
      removeTodoFromStorage(text);
    });

    li.appendChild(completeButton);
    li.appendChild(deleteButton);
    todoList.appendChild(li);
  }

  function saveTodoToStorage(text) {
    chrome.storage.sync.get('todos', (data) => {
      const todos = data.todos || [];
      todos.push({ text, completed: false });
      chrome.storage.sync.set({ todos });
    });
  }

  function updateTodoInStorage(text, completed) {
    chrome.storage.sync.get('todos', (data) => {
      const todos = data.todos || [];
      const todo = todos.find(todo => todo.text === text);
      if (todo) {
        todo.completed = completed;
        chrome.storage.sync.set({ todos });
      }
    });
  }

  function removeTodoFromStorage(text) {
    chrome.storage.sync.get('todos', (data) => {
      let todos = data.todos || [];
      todos = todos.filter(todo => todo.text !== text);
      chrome.storage.sync.set({ todos });
    });
  }
});
