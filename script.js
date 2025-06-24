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
      <div class="mx-auto flex flex-col items-center space-y-6 rounded-lg w-[600px] bg-gray-800/80 py-6">
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
