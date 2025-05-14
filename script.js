const banners = [
    'https://images.unsplash.com/photo-1485160497022-3e09382fb310?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fG1vdW50YWluc3xlbnwwfDB8MHx8fDA%3D',
    'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fG1vdW50YWluc3xlbnwwfDB8MHx8fDA%3D',
    'https://media.istockphoto.com/id/1195458582/photo/aerial-view-of-misty-mountains-at-sunrise.webp?a=1&b=1&s=612x612&w=0&k=20&c=BRdUrBGcJ80x_DeNDBZZP8jUIOdISzhR05mLZK5I7As=',
    'https://media.istockphoto.com/id/1206473179/photo/mount-abu-hill-station-india.webp?a=1&b=1&s=612x612&w=0&k=20&c=-yr_wjoyQHDCIH6MV0cD3ltYfTm-JncFQqpNEo9MGTM=',
    'https://media.istockphoto.com/id/636215274/photo/people-with-backpacks-and-trekking-sticks-traveling-in-mountains.webp?a=1&b=1&s=612x612&w=0&k=20&c=0zh5I1WT2SKeKZ4MZ64iXLY32o2dVjA9eA_cA-1r9Iw=',
    'https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/355465/pexels-photo-355465.jpeg?auto=compress&cs=tinysrgb&w=600',
];
const labelColors = {
    Fitness: 'bg-blue-600',
    Study: 'bg-green-600',
    Shopping: 'bg-pink-600',
    Work: 'bg-yellow-600',
    Health: 'bg-red-600',
    Finance: 'bg-purple-600'
};

const q = (classname) => document.querySelector(classname);
const bannerBackground = q('.banner');
const Home = q('.Home');
const banner = q('.banner');
const TodoCard = q('.Todo');
const closeBtn = q('.closeBtn');
const TodoPage = q('.TodoPage');
const addTaskBtn = q('.addTask');
const closePopupBtn = q('.closePopup');
const popup = q('.popup');
const saveTaskBtn = q('.saveTask');
const themeBtn = q('.theme-toggle-btn');
const changeHomeTheme = q('.changeTheme');
const bannerDisplay = q('.bannerDisplay');

let rotated = false;
let tasksArray = JSON.parse(localStorage.getItem('Tasks')) || [];

// format time
const formatDate = () => {
    const date = new Date();
    const currentDate = date.getDate();
    const currentMonth = date.toLocaleString('default', { month: 'long' });
    const currentYear = date.getFullYear();
    const currentDay = date.toLocaleString('default', { weekday: 'long' });
    const hour = date.getHours() % 12 || 12;
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    const AmPm = date.getHours() >= 12 ? 'PM' : 'AM';

    const bannerText =
        `<div class="flex items-center gap-4">
            <div class="rounded-lg bg-white/10 backdrop-blur-sm p-2">
                ${hour}:${minute}:${second} ${AmPm}
            </div>
            <div>
                <h2 class="font-semibold">${currentDay}</h2>
                <p class="text-gray-400 ">${currentMonth} ${currentDate}, ${currentYear}</p>
            </div>
        </div>
        <div class="flex items-center gap-4">
            <div
                class=" rounded-lg bg-white/10 backdrop-blur-sm p-2">
                <i class="ri-sun-line"></i>
            </div>
            <div>
                <h2 class="font-semibold">24 <sup>o</sup>C</h2>
                <p class="text-gray-400 ">Sunny</p>
            </div>
        </div>`;

    bannerDisplay.innerHTML = bannerText;
};

setInterval(formatDate, 1000);
// Create To Do
const createTaskHTML = (task, index) => {
    const labelColorClass = labelColors[task.label] || 'bg-gray-600';
    return `
    <div class=" border border-gray-700 rounded-2xl p-4 shadow-xl w-full flex justify-between items-center mt-4 transition-transform duration-200 hover:scale-[1.01]">
        <!-- Task Title with Label -->
        <h2 class="  text-xl font-semibold ">
            ${task.task} <sup> <sup class="${labelColorClass} px-2 text-center py-0.5 text-xs rounded-xl text-white">${task.label || task.customLabel}</sup></sup>
        </h2>
        <!-- Action Section -->
        <div class="flex items-center gap-4">
            <!-- Mark as Done -->
            <div class="flex gap-4 items-center">
                <p class="text-sm text-gray-400 italic mb-1">Mark as done</p>
                <input type="checkbox" class="w-5 h-5 accent-green-500 toggle-checkbox  hover:cursor-pointer" data-index="${index}">
            </div>
            <!-- Delete Button -->
            <i class="ri-delete-bin-6-line text-2xl text-red-400 hover:text-red-600 cursor-pointer deleteBtn" data-index="${index}" data-type="todo"></i>
        </div>
    </div>
    `
};

// Completed Todos
const createCompletedTask = (task, index) => {
    return `
        <div class=" border border-gray-700 rounded-2xl p-4 shadow-xl w-full flex justify-between items-center mt-4 transition-transform duration-200 hover:scale-[1.01]">

            <!-- Task Title with Label -->
            <div class="relative w-fit">
                <h2 class="text-xl font-semibold ">
                    <span class="line-through">${task.task}</span>
                    <sup>
                        <sup class="bg-gray-600 px-2 text-center py-0.5 text-xs rounded-xl text-white">
                            ${task.label || task.customLabel}
                        </sup>
                    </sup>
                </h2>
            </div>

            <!-- Action Section -->
            <div class="flex items-center gap-4">

                <!-- Mark as Not Done -->
                <div class="flex gap-4 items-center">
                    <p class="text-sm text-gray-400 italic mb-1">Mark as not done</p>
                    <input type="checkbox" class="w-5 h-5 accent-green-500 toggle-checkbox hover:cursor-pointer" data-index="${index}" checked>
                </div>

                <!-- Delete Button -->
                <i class="ri-delete-bin-6-line text-2xl text-red-400 hover:text-red-600 cursor-pointer deleteBtn"  data-index="${index}" data-type="completed"></i>

            </div>
        </div>
    `;
};

// Update task list
const updateList = () => {
    const listAllTasks = q('.listAllTasks');
    const listCompletedTasks = q('.listCompletedTasks');
    const todoTasks = q('.todoTasks');

    const savedTheme = JSON.parse(localStorage.getItem('Theme'));
    if (savedTheme) {
        if (savedTheme.background) TodoPage.classList.add(savedTheme.background);
        if (savedTheme.color) TodoPage.classList.add(savedTheme.color);
        themeBtn.classList.add(savedTheme.icon);
    } else {
        themeBtn.classList.add('ri-sun-fill');
    }
    tasksArray.length > 0 ? todoTasks.classList.add('border-r', 'border-gray-700') : todoTasks.classList.remove('border-r', 'border-gray-700');

    // Pending tasks
    const pendingTasks = tasksArray
        .map((task, index) => !task.completed ? createTaskHTML(task, index) : '')
        .join('');
    listAllTasks.innerHTML = pendingTasks || `<div class="text-gray-500 font-medium"><i>Your to-do list is empty. Add a new task to get started.!</i></div>`;

    // Completed tasks
    const completedTasks = tasksArray
        .map((task, index) => task.completed ? createCompletedTask(task, index) : '')
        .join('');
    listCompletedTasks.innerHTML = completedTasks || `<div class="text-gray-500 font-medium flex justify-end"><i>Start finishing tasks and they’ll show up here.!</i></div>`;

    // Event listeners for checkboxes
    document.querySelectorAll('.toggle-checkbox').forEach((checkbox) => {
        checkbox.addEventListener('change', (e) => {
            const index = e.target.dataset.index;
            tasksArray[index].completed = !tasksArray[index].completed;
            localStorage.setItem('Tasks', JSON.stringify(tasksArray));
            updateList();
        });
    });

    //deleteTodos
    document.querySelectorAll('.deleteBtn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            tasksArray.splice(index, 1);
            localStorage.setItem('Tasks', JSON.stringify(tasksArray));
            updateList();
        })
    })
};

// Event listeners
TodoCard.addEventListener('click', () => {
    Home.classList.add('hideParent');
    TodoPage.classList.remove('hideParent');
});

closeBtn.addEventListener('click', () => {
    Home.classList.remove('hideParent');
    TodoPage.classList.add('hideParent');
});

addTaskBtn.addEventListener('click', () => {
    popup.classList.remove('hideParent');
});

closePopupBtn.addEventListener('click', () => {
    popup.classList.add('hideParent');
});

saveTaskBtn.addEventListener('click', () => {
    const label = q('input[name="label"]:checked');
    const customLabel = q('input[name="custom"]');
    const taskName = q('input[name="taskName"]');
    if (!taskName.value.trim()) return; // Prevent empty tasks
    const newTask = {
        label: label?.value || '',
        customLabel: customLabel.value.trim(),
        task: taskName.value.trim(),
        completed: false
    };
    tasksArray.push(newTask);
    taskName.value = '';
    customLabel.value = '';
    if (label) label.checked = false;
    localStorage.setItem('Tasks', JSON.stringify(tasksArray));
    updateList();
    popup.classList.add('hideParent');
});

themeBtn.addEventListener('click', () => {
    themeBtn.style.transition = 'transform 0.3s ease';
    rotated = !rotated;
    themeBtn.style.transform = rotated ? 'rotate(360deg)' : 'rotate(0deg)';

    const isDark = TodoPage.classList.toggle('bg-black');
    TodoPage.classList.toggle('text-white');

    if (isDark) {
        // Apply dark theme
        themeBtn.classList.remove('ri-sun-fill');
        themeBtn.classList.add('ri-moon-fill');
        localStorage.setItem('Theme', JSON.stringify({
            background: 'bg-black',
            color: 'text-white',
            icon: 'ri-moon-fill'
        }));
    } else {
        // Apply light theme
        themeBtn.classList.remove('ri-moon-fill');
        themeBtn.classList.add('ri-sun-fill');
        localStorage.setItem('Theme', JSON.stringify({
            background: '',
            color: '',
            icon: 'ri-sun-fill'
        }));
    }

})
changeHomeTheme.addEventListener('click', () => {
    let c1 = Math.floor(Math.random() * 256);
    let c2 = Math.floor(Math.random() * 256);
    let c3 = Math.floor(Math.random() * 256);

    Home.style.backgroundColor = `rgb(${c1}, ${c2}, ${c3})`;

    // Calculate relative luminance (brightness)
    let luminance = 0.299 * c1 + 0.587 * c2 + 0.114 * c3;

    if (luminance < 128) {
        Home.style.color = "white";
    } else {
        Home.style.color = "black";
    }
});


// Initial load
window.addEventListener('DOMContentLoaded', () => {
    updateList();
    // formatDate();
});
