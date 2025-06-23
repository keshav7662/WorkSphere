const Home = document.querySelector('.home');
const allCards = document.querySelectorAll('.actionCards');
const allPages = document.querySelectorAll('.page');
const changeTheme = document.querySelector('.changeTheme');
const totalTasks = document.querySelector('.totalTasks');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
// Update total tasks count
const updateTotalTasks = () => {
  const totalCount = todos.length;
  totalTasks.innerHTML = `<h3 class="text-lg font-medium text-gray-400 inline-block border-b">Total Tasks : ${totalCount}</h3>`;
}
updateTotalTasks();

allCards.forEach((card) => {
  card.addEventListener('click', () => {
    const targetPage = card.dataset.page;
    allPages.forEach((page) => {
      if (page.id === targetPage) {
        Home.classList.add('hideParent');
        page.classList.remove('hideParent');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    })
  })
})

allPages.forEach((page) => {
  const back = page.querySelector('.goHome');
  back.addEventListener('click', () => {
    page.classList.add('hideParent');
    Home.classList.remove('hideParent');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})

const root = document.documentElement;
changeTheme.addEventListener('click', () => {
  root.classList.toggle('dark');

  if (root.classList.contains('dark')) {
    localStorage.setItem('theme', "dark");
  } else {
    localStorage.setItem('theme', "light");
  }
});

if (localStorage.getItem('theme') === "dark") {
  root.classList.add('dark');
}

// Render Todos


const addTask = document.querySelector('.addTask');
const input = document.querySelector('input');

addTask.addEventListener('click', () => {
  const newTodo = {
    task: input.value.trim(),
    isCompleted: false
  }
  todos.push(newTodo);
  localStorage.setItem('todos', JSON.stringify(todos));
  renderTodos();
  updateTotalTasks();
  input.value = ''; // Clear the input field after adding a task
})

const renderTodos = () => {
  const renderList = document.querySelector('.renderList');
  const uncompletedTodos = todos.filter((todo) => !todo.isCompleted) || [];
  if (uncompletedTodos.length === 0) {
    renderList.innerHTML = `<p class="text-sm text-center italic text-gray-600">No Pending Tasks! Create One.</p>`
  } else {
    renderList.innerHTML = uncompletedTodos.map((todo) => {
      const originalIdx = todos.indexOf(todo);
      return `<div class="flex justify-between items-center border-b border-dashed border-gray-400 rounded shadow-md px-2 py-3 hover:shadow-lg">
                <p class="font-medium">${todo.task}</p>
                <div class="flex items-center gap-4">
                  <input title="todo" type="checkbox" ${todo.isCompleted ? 'checked' : ''} onchange="handleCheckboxChange(${originalIdx})">
                  <i class="ri-delete-bin-3-line text-red-500 hover:text-red-700 cursor-pointer" onclick="deleteTodo(${originalIdx})"></i>
                </div>
              </div>`;
    }).join('');
  }
}

const renderCompletedTodos = () => {
  const completedList = document.querySelector('.completedList');
  const completedTodos = todos.filter((todo) => todo.isCompleted) || [];

  if (completedTodos.length === 0) {
    completedList.innerHTML = `<p class="text-sm text-center italic text-gray-600">No Completed Tasks!</p>`;
  } else {
    completedList.innerHTML = completedTodos.map((todo) => {
      const originalIdx = todos.indexOf(todo); // because we need the original index not the filtered one
      return `<div class="flex justify-between items-center border-b border-dashed border-gray-400 rounded shadow-md px-2 py-3 hover:shadow-lg">
                <p class="font-medium text-gray-500 line-through">${todo.task}</p>
                <div class="flex items-center gap-4">
                  <input title="todo" type="checkbox" ${todo.isCompleted ? 'checked' : ''} onchange="handleCheckboxChange(${originalIdx})">
                  <i class="ri-delete-bin-3-line text-red-500 hover:text-red-700 cursor-pointer" onclick="deleteTodo(${originalIdx})"></i>
                </div>
              </div>`;
    }).join('');
  }
}


const handleCheckboxChange = (idx) => {
  todos[idx].isCompleted = !todos[idx].isCompleted;
  localStorage.setItem('todos', JSON.stringify(todos));
  renderTodos();
  renderCompletedTodos();
}

const deleteTodo = (idx) => {
  todos.splice(idx, 1);
  localStorage.setItem('todos', JSON.stringify(todos));
  renderTodos();
  renderCompletedTodos();
  updateTotalTasks();
}

renderTodos();
renderCompletedTodos();

//------------------------- DailyPlanner------------------------------
const PLANNER_KEY = 'dailyPlannerData';
const PLANNER_DATE_KEY = 'plannerLastSavedDate';

const renderPlannerInputs = document.querySelector('.render-planner');

// Generate hours from 6 to 21
const hours = Array.from({ length: 16 }, (_, idx) => 6 + idx);

let collectAllInputs = '';
hours.forEach((hour) => {
  const labelText = hour === 12
    ? '12 PM'
    : hour === 0
      ? '12 AM'
      : hour > 12
        ? `${hour - 12} PM`
        : `${hour} AM`;

  collectAllInputs += `
    <div class="flex gap-4 items-center px-4 py-2 border border-gray-400 rounded">
      <label class="font-bold text-sm w-16">${labelText}</label>
      <input type="text" title="x"
        class="dailyPlanInput focus:outline-none p-2 border-b border-dashed border-gray-400 text-[var(--text-color)] text-lg font-medium flex-1 rounded">
      <input class="dailyPlanCheckbox" type="checkbox" title="c">
    </div>
  `;
});

renderPlannerInputs.innerHTML = collectAllInputs;

const getTodayDate = () => new Date().toISOString().split('T')[0];

const loadPlannerData = () => {
  const savedDate = localStorage.getItem(PLANNER_DATE_KEY);
  const today = getTodayDate();

  if (savedDate !== today) {

    localStorage.removeItem(PLANNER_KEY);
    localStorage.setItem(PLANNER_DATE_KEY, today);
    return [];
  }

  return JSON.parse(localStorage.getItem(PLANNER_KEY)) || [];
};


const saveplannerData = (data) => {
  localStorage.setItem(PLANNER_KEY, JSON.stringify(data));
  localStorage.setItem(PLANNER_DATE_KEY, getTodayDate());
}

const plannerInputs = document.querySelectorAll('.dailyPlanInput');
const plannerCheckboxes = document.querySelectorAll('.dailyPlanCheckbox');

const renderPlanner = () => {
  const data = loadPlannerData();
  plannerInputs.forEach((input, idx) => {
    input.value = data[idx]?.text || '';
    if (data[idx]?.checked) {
      input.classList.add('line-through', 'text-gray-400')
    } else {
      input.classList.remove('line-through', 'text-gray-400');
    }
  })
  plannerCheckboxes.forEach((checkbox, idx) => {
    checkbox.checked = data[idx]?.checked || false;
  })
}

const handlePlannerInputChange = () => {
  console.log("input is changing")
  const data = Array.from(plannerInputs).map((input, idx) => ({
    text: input.value,
    checked: plannerCheckboxes[idx]?.checked
  }))
  saveplannerData(data);
  renderPlanner();
}

document.addEventListener('DOMContentLoaded', () => {
  renderPlanner();
  plannerInputs.forEach(input => {
    input.addEventListener('input', handlePlannerInputChange);
  });
  plannerCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', handlePlannerInputChange);
  });
});

// -----------Motivation Page-------------------

