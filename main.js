const timer = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4
};

const updateClock = () => {
    const { remainingTime } = timer;
    const minutes = `${remainingTime.minutes}`.padStart(2, '0');
    const seconds = `${remainingTime.seconds}`.padStart(2, '0');

    const min = document.getElementById('js-minutes');
    const sec = document.getElementById('js-seconds');

    min.textContent = minutes;
    sec.textContent = seconds;
}

const clickHandler = (e) => {
    console.log(e.target.dataset.mode);
    const { mode } = e.target.dataset;
    timer.mode = mode;
    timer.remainingTime = {
        total: timer[mode] * 60,
        minutes: timer[mode],
        seconds: 0
    };

    document.querySelectorAll('button[data-mode]').forEach(e => e.classList.remove('actice'));

    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');

    document.body.style.backgroundColor = `var(--${mode})`;

    updateClock();
}

const pomodoroButton = document.querySelector('#js-pomodoro');
const shortBreakButton = document.querySelector('#js-short-break');
const longBreakButton = document.querySelector('#js-long-break');

pomodoroButton.addEventListener('click', clickHandler);
shortBreakButton.addEventListener('click', clickHandler);
longBreakButton.addEventListener('click', clickHandler);