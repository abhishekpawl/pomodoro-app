const timer = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4
};

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