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
const displayBannerData = () => {
  const dateDiv = document.querySelector('.date');
  const timeDiv = document.querySelector('.time');
  //date
  const fullDateAndTime = new Date();
  const date = String(fullDateAndTime.getDate()).padStart(2, '0');
  const month = fullDateAndTime.toLocaleString('default', { month: 'long' });;
  const year = fullDateAndTime.getFullYear();
  const formattedDate = `${date} ${month}, ${year}`;
  dateDiv.textContent = formattedDate;

  //time
  let hour = fullDateAndTime.getHours();
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12; 
  hour = hour ? hour : 12;
  const formattedHour = String(hour).padStart(2, '0');
  const minutes = String(fullDateAndTime.getMinutes()).padStart(2, '0');

  const formattedTime = `${formattedHour}:${minutes} ${ampm}`;
  timeDiv.textContent = formattedTime;
}
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


displayBannerData();

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
    renderList.innerHTML = `<p p class="text-sm text-center italic text-gray-600" > No Pending Tasks! Create One.</p > `
  } else {
    renderList.innerHTML = uncompletedTodos.map((todo) => {
      const originalIdx = todos.indexOf(todo);
      return `<div div class="flex justify-between items-center border-b border-dashed border-gray-400 rounded shadow-md px-2 py-3 hover:shadow-lg" >
                <p class="font-medium">${todo.task}</p>
                <div class="flex items-center gap-4">
                  <input title="todo" type="checkbox" ${todo.isCompleted ? 'checked' : ''} onchange="handleCheckboxChange(${originalIdx})">
                  <i class="ri-delete-bin-3-line text-red-500 hover:text-red-700 cursor-pointer" onclick="deleteTodo(${originalIdx})"></i>
                </div>
              </div > `;
    }).join('');
  }
}

const renderCompletedTodos = () => {
  const completedList = document.querySelector('.completedList');
  const completedTodos = todos.filter((todo) => todo.isCompleted) || [];

  if (completedTodos.length === 0) {
    completedList.innerHTML = `<p p class="text-sm text-center italic text-gray-600" > No Completed Tasks!</p > `;
  } else {
    completedList.innerHTML = completedTodos.map((todo) => {
      const originalIdx = todos.indexOf(todo); // because we need the original index not the filtered one
      return `<div div class="flex justify-between items-center border-b border-dashed border-gray-400 rounded shadow-md px-2 py-3 hover:shadow-lg" >
                <p class="font-medium text-gray-500 line-through">${todo.task}</p>
                <div class="flex items-center gap-4">
                  <input title="todo" type="checkbox" ${todo.isCompleted ? 'checked' : ''} onchange="handleCheckboxChange(${originalIdx})">
                  <i class="ri-delete-bin-3-line text-red-500 hover:text-red-700 cursor-pointer" onclick="deleteTodo(${originalIdx})"></i>
                </div>
              </div > `;
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
  <div div class="flex gap-4 items-center px-4 py-2 border border-gray-400 rounded" >
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


const motivationPage = () => {

  const quotes = [
    {
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
    },
    {
      text: "Innovation distinguishes between a leader and a follower.",
      author: "Steve Jobs",
    },
    {
      text: "Life is what happens to you while you're busy making other plans.",
      author: "John Lennon",
    },
    {
      text: "The future belongs to those who believe in the beauty of their dreams.",
      author: "Eleanor Roosevelt",
    },
    {
      text: "It is during our darkest moments that we must focus to see the light.",
      author: "Aristotle",
    },
    {
      text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill",
    },
    {
      text: "The only impossible journey is the one you never begin.",
      author: "Tony Robbins",
    },
    {
      text: "In the middle of difficulty lies opportunity.",
      author: "Albert Einstein",
    },
    {
      text: "Believe you can and you're halfway there.",
      author: "Theodore Roosevelt",
    },
    {
      text: "The only person you are destined to become is the person you decide to be.",
      author: "Ralph Waldo Emerson",
    },
    {
      text: "Don't watch the clock; do what it does. Keep going.",
      author: "Sam Levenson",
    },
    {
      text: "Everything you've ever wanted is on the other side of fear.",
      author: "George Addair",
    },
    {
      text: "Hardships often prepare ordinary people for an extraordinary destiny.",
      author: "C.S. Lewis",
    },
    {
      text: "The way to get started is to quit talking and begin doing.",
      author: "Walt Disney",
    },
    {
      text: "Don't be afraid to give up the good to go for the great.",
      author: "John D. Rockefeller",
    },
  ]
  const renderQuote = document.querySelector('.renderQuote');
  const renderAuthor = document.querySelector('.renderAuthor');

  const getNewQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const newQuote = {
      text: quotes[randomIndex].text,
      author: quotes[randomIndex].author
    }

    return newQuote;
  }
  const currentQuote = getNewQuote();
  renderQuote.innerHTML = currentQuote.text;
  renderAuthor.innerHTML = ` - ${currentQuote.author}`;
  const generateQuoteBtn = document.querySelector('.generateQuote');
  generateQuoteBtn.addEventListener('click', () => {
    const latestQuote = getNewQuote();
    const quote = latestQuote.text;
    const author = latestQuote.author;
    renderQuote.innerHTML = quote;
    renderAuthor.innerHTML = ` - ${author}`;
  })
}
motivationPage();

const PomodoroTimer = () => {

  const timerController = document.querySelector('.timer-controller');
  timerController.innerHTML = `
    <div class="text-center space-y-6">
      <div id="pomodoro-icon-container" class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-800 to-gray-500 text-white rounded-full shadow-lg transition-all duration-300">
        <i id="pomodoro-icon" class="ri-suitcase-line"></i>
      </div>
      <div>
        <span id="pomodoro-mode" class="px-4 py-1 rounded-full bg-gray-800 text-white font-medium text-sm hover:bg-gray-900"></span>
      </div>
      <div class="mx-auto flex flex-col items-center space-y-6 rounded-lg w-[600px] bg-[var(--bg-color)] shadow-lg py-6">
        <div id="pomodoro-display" class="w-44 h-44 border-4 border-[var(--text-color)] bg-[var(--bg-color)] text-[var(--text-color)] rounded-full flex justify-center items-center text-4xl font-bold shadow-lg transition-all duration-300 ring-2 ring-blue-400/30">
          25:00
        </div>
        <div class="flex gap-3">
          <button id="pomodoro-start" class="bg-gray-900 px-8 py-2 text-white rounded-full cursor-pointer">Start</button>
          <button id="pomodoro-reset" class="bg-gray-900/60 px-8 py-2 text-white rounded-full cursor-pointer">Reset</button>
        </div>
        <div>
          <button id="pomodoro-work" class="bg-[var(--bg-color)] text-[var(--text-color)] px-8 py-2 rounded-full cursor-pointer text-xs font-medium">Work</button>
          <button id="pomodoro-short" class="bg-[var(--bg-color)] text-[var(--text-color)] px-8 py-2 rounded-full cursor-pointer text-xs font-medium">Short Break</button>
          <button id="pomodoro-long" class="bg-[var(--bg-color)] text-[var(--text-color)] px-8 py-2 rounded-full cursor-pointer text-xs font-medium">Long Break</button>
        </div>
      </div>
    </div>
  `;

  // Timer logic
  let timer = null;
  let mode = 'work';
  let durations = { work: 25 * 60, short: 5 * 60, long: 15 * 60 };
  let remaining = durations[mode];
  let running = false;

  const display = document.getElementById('pomodoro-display');
  const startBtn = document.getElementById('pomodoro-start');
  const resetBtn = document.getElementById('pomodoro-reset');
  const workBtn = document.getElementById('pomodoro-work');
  const shortBtn = document.getElementById('pomodoro-short');
  const longBtn = document.getElementById('pomodoro-long');
  const modeDisplay = document.getElementById('pomodoro-mode');
  const iconContainer = document.getElementById('pomodoro-icon-container');
  const icon = document.getElementById('pomodoro-icon');

  function updateDisplay() {
    const min = String(Math.floor(remaining / 60)).padStart(2, '0');
    const sec = String(remaining % 60).padStart(2, '0');
    display.textContent = `${min}:${sec}`;
  }

  function startTimer() {
    if (running) return;
    running = true;
    startBtn.textContent = 'Pause';
    timer = setInterval(() => {
      if (remaining > 0) {
        remaining--;
        updateDisplay();
      } else {
        clearInterval(timer);
        running = false;
        startBtn.textContent = 'Start';
      }
    }, 1000);
  }

  function pauseTimer() {
    running = false;
    startBtn.textContent = 'Start';
    clearInterval(timer);
  }

  function resetTimer() {
    pauseTimer();
    remaining = durations[mode];
    updateDisplay();
  }

  function switchMode(newMode) {
    mode = newMode;

    // Remove highlight from all buttons
    workBtn.classList.remove('ring-2', 'ring-blue-700');
    shortBtn.classList.remove('ring-2', 'ring-blue-700');
    longBtn.classList.remove('ring-2', 'ring-blue-700');

    // Change icon and gradient based on mode
    if (mode === 'work') {
      modeDisplay.textContent = 'Focus Time';
      workBtn.classList.add('ring-2', 'ring-blue-700');
      icon.className = 'ri-suitcase-line text-3xl';
      iconContainer.className = 'inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-800 to-gray-500 text-white rounded-full shadow-lg transition-all duration-300';
    } else if (mode === 'short') {
      modeDisplay.textContent = 'Short Break';
      shortBtn.classList.add('ring-2', 'ring-blue-700');
      icon.className = 'ri-drinks-line text-3xl';
      iconContainer.className = 'inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-400 to-gray-400 text-white rounded-full shadow-lg transition-all duration-300';
    } else {
      modeDisplay.textContent = 'Long Break';
      longBtn.classList.add('ring-2', 'ring-blue-700');
      icon.className = 'ri-drinks-line text-3xl';
      iconContainer.className = 'inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-400 to-gray-700 text-white rounded-full shadow-lg transition-all duration-300';
    }

    resetTimer();
  }

  startBtn.onclick = () => {
    if (running) {
      pauseTimer();
    } else {
      startTimer();
    }
  };
  resetBtn.onclick = resetTimer;
  workBtn.onclick = () => switchMode('work');
  shortBtn.onclick = () => switchMode('short');
  longBtn.onclick = () => switchMode('long');

  updateDisplay();
  modeDisplay.textContent = 'Focus Time';
  workBtn.classList.add('ring-2', 'ring-blue-700');
  // Set initial icon and gradient
  icon.className = 'ri-suitcase-line text-3xl';
  iconContainer.className = 'inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-800 to-gray-500 text-white rounded-full shadow-lg transition-all duration-300';
}
PomodoroTimer();

const dailyGoals = () => {

  const goalInputField = document.getElementById('goalInput');
  const prioritySelector = document.getElementById('priorityInput');
  const categorySelector = document.getElementById('categoryInput');
  const addGoalButton = document.querySelector('.addGoals');
  const noGoalsMessageContainer = document.querySelector('.noGoals-container');
  const goalsListContainer = document.querySelector('.renderGoals-container');

  const updateDate = () => {
    const renderDate = document.querySelector('.date-time');
    const fullDate = new Date();
    const date = String(fullDate.getDate()).padStart(2, '0');
    const month = fullDate.toLocaleString('default', { month: 'long' });;
    const year = fullDate.getFullYear();
    const formattedDate = `${date} ${month}, ${year}`;
    renderDate.textContent = formattedDate;
  }
  const getStoredGoals = () => JSON.parse(localStorage.getItem('goal')) || [];

  const saveGoalsToStorage = (goals) => {
    localStorage.setItem('goal', JSON.stringify(goals));
  };

  const updateStatistics = () => {
    const goals = getStoredGoals();
    const completedGoals = goals.filter(goal => goal.isCompleted);
    const remainingGoals = goals.filter(goal => !goal.isCompleted);

    const completionPercentage = goals.length
      ? Math.round((completedGoals.length / goals.length) * 100)
      : 0;

    document.querySelector('.totalGoals').textContent = goals.length;
    document.querySelector('.completedGoals').textContent = completedGoals.length;
    document.querySelector('.remainingGoals').textContent = remainingGoals.length;
    document.querySelector('.progressPercentage').textContent = `${completionPercentage}%`;

    document.querySelector('.loader-inner').style.width = `${completionPercentage}%`;
    document.getElementById('completeText').textContent = `${completionPercentage}% complete`;
    document.getElementById('remainingText').textContent = `${goals.length - completedGoals.length} remaining`;
    document.querySelector('.remaining-by-completed').textContent = `${completedGoals.length}/${goals.length} completed`;
  };
  const renderGoalsList = () => {
    const goals = getStoredGoals();
    goalsListContainer.innerHTML = '';
    noGoalsMessageContainer.innerHTML = '';

    if (goals.length === 0) {
      noGoalsMessageContainer.innerHTML = `
        <div class="text-center shadow-xl bg-purple-900/50 shadow-purple-900/30 backdrop-blur-sm hover:scale-[1.01] transition-all duration-300 py-10 rounded-lg">
          <i class="ri-focus-2-line text-6xl text-purple-400 mb-4"></i>
          <h2 class="text-purple-300 font-semibold text-xl mb-2">No goals yet</h2>
          <p class="text-sm text-purple-400">Add your first goal to get started on a productive day!</p>
        </div>
      `;
      return;
    }
    goalsListContainer.innerHTML = goals.map((goal, idx) => {
      return `<div
            class="shadow-xl bg-purple-900/50 shadow-purple-900/30 backdrop-blur-sm ${goal.isCompleted ? '' : 'hover:scale-[1.01]'} transition-all duration-300 p-6 rounded-lg space-y-4">
            <div class="flex justify-between items-center">
              <div class="flex gap-6 items-center">
                <input type="checkbox" title="Mark as complete" ${goal.isCompleted ? 'checked' : ''} data-idx=${idx}>
                <div>
                  <h3 class="goal-text text-purple-300 text-xl font-semibold mb-3 ${goal.isCompleted ? 'line-through text-purple-500' : ''}" data-idx="${idx}">
                    ${goal.name}
                  </h3>
                  <div class="flex gap-2 items-center text-white">
                    <p class="px-2 py-1 text-xs bg-orange-500 rounded-full">${goal.priority.toLowerCase()}</p>
                    <p class="px-2 py-1 text-xs border border-puple-300 rounded-full">${goal.category.toLowerCase()}</p>
                  </div>
                </div>
              </div>
              <div class="flex gap-4 items-center text-purple-300 text-2xl">
                <i
                  class="ri-edit-line text-purple-400 hover:text-purple-200 hover:bg-purple-800 cursor-pointer px-2 py-1 rounded edit-goal" data-idx=${idx}></i>
                <i
                  class="ri-delete-bin-line text-purple-400 hover:text-red-400 hover:bg-red-900/20 cursor-pointer px-2 py-1 rounded delete-goal" data-idx=${idx}></i>
              </div>
            </div>
          </div>`
    }).join('')

  }

  addGoalButton.addEventListener('click', () => {
    const name = goalInputField.value.trim();
    const priority = prioritySelector.value;
    const category = categorySelector.value;

    if (!name) {
      alert('Please enter a valid goal.');
      return;
    }

    const newGoal = {
      name,
      priority,
      category,
      isCompleted: false
    };

    const goals = getStoredGoals();
    goals.push(newGoal);
    saveGoalsToStorage(goals);

    goalInputField.value = '';
    updateStatistics();
    renderGoalsList();
  });

  //checkboxListeners
  goalsListContainer.addEventListener('change', (e) => {
    if (e.target.type === 'checkbox') {
      const idx = parseInt(e.target.getAttribute('data-idx'));
      const goals = getStoredGoals();
      goals[idx].isCompleted = e.target.checked;
      saveGoalsToStorage(goals);
      renderGoalsList();
      updateStatistics();
    }
  })

  // edit and delete
  goalsListContainer.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.edit-goal');
    const deleteBtn = e.target.closest('.delete-goal')
    if (editBtn) {
      const idx = parseInt(editBtn.dataset.idx);
      const h3 = goalsListContainer.querySelector(`.goal-text[data-idx="${idx}"]`);

      // Replace <h3> with <input>
      const input = document.createElement('input');
      input.type = 'text';
      input.value = h3.textContent.trim();
      input.className = 'goal-edit-input text-purple-300 text-xl font-semibold mb-3 bg-transparent border-b border-purple-400 focus:outline-none w-full';
      input.setAttribute('data-idx', idx);

      h3.replaceWith(input);
      input.focus();

      const saveEdit = () => {
        const newValue = input.value.trim();
        if (newValue !== '') {
          const goals = getStoredGoals();
          goals[idx].name = newValue;
          saveGoalsToStorage(goals);
          updateStatistics();
          renderGoalsList();
        } else {
          renderGoalsList();
        }
      };

      input.addEventListener('blur', saveEdit);
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          saveEdit();
        }
      });
    }
    if (deleteBtn) {
      const idx = parseInt(e.target.getAttribute('data-idx'))
      const goals = getStoredGoals();
      if (confirm('Are you sure you want to delete this goal?')) {
        goals.splice(idx, 1);
        saveGoalsToStorage(goals);
        updateStatistics();
        renderGoalsList();
      }
    }
  })

  // Initialize UI on page load
  updateStatistics();
  renderGoalsList();
  updateDate();
};
dailyGoals();