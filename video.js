const video_container = document.querySelector('.video_container')
const video_controls_container = document.querySelector('.video_controls_container')
const pause_TIME = document.querySelector('.pause_TIME')
var video = document.querySelector('video');
var timeline_bg = document.querySelector('.timeline_bg')
var timeline = document.querySelector('.timeline')
var play_INIT;

timeline_bg.addEventListener('mousemove', handledTimelineUpdate)
timeline_bg.addEventListener('mousedown', toggleScrubbing)

let isScrubbing = false;
let wasPaused
document.addEventListener("mouseup", e => {
    if (isScrubbing) toggleScrubbing(e)
})
document.addEventListener("mousemove", e => {
    if (isScrubbing) handledTimelineUpdate(e)
})

function handledTimelineUpdate(e) {
    const rect = timeline_bg.getBoundingClientRect()
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width

    timeline_bg.style.setProperty("--preview-progress", percent)

}

if (document.cookie.indexOf("volumeUSER") < 0) {
    video.volume = 0.3
} else {
    video.volume = document.cookie.volumeUSER
}

video.addEventListener('loadstart', () => {
    document.querySelector('.load_video').style.display = "flex";
})

video.addEventListener('canplaythrough', () => {
    document.querySelector('.load_video').style.display = "none";
});

video.addEventListener('seeking', () => {
    document.querySelector('.load_video').style.display = "flex";
});

video.addEventListener('seeked', () => {
    document.querySelector('.load_video').style.display = "none";
});



function toggleScrubbing(e) {
    const rect = timeline_bg.getBoundingClientRect()
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width

    isScrubbing = (e.buttons & 1) === 1
    video_container.classList.toggle("scrubbing", isScrubbing)
    if (isScrubbing) {
        wasPaused = video.paused
        video.pause
    } else {
        video.currentTime = percent * video.duration
        if (!wasPaused) video.play()
    }

    handledTimelineUpdate(e)
}

document.addEventListener('keydown', e => {

    switch (e.key.toLowerCase()) {
        case 'k':
        case ' ':
            play_START()
            break
        case "f":
            fullscreen()
            break
        case "arrowright":
        case "l":
            skip("skip_PLUS")
            break
        case "arrowleft":
        case "j":
            skip("skip_SMALL")
            break
        case "arrowup":
            volume("up")
            break
        case "arrowdown":
            volume("down")
            break
    }
})

function togglePlay() {
    video.paused ? video.play() : video.pause()
}

video.addEventListener('click', togglePlay)

function play_START() {
    play_INIT = 1
    console.log('init=' + play_INIT)
    togglePlay();


    pause_TIME.classList.add('disabled')
    video_container.classList.add('disabled')

    document.querySelector('.play_MAIN').style.display = "none"

}

/* Controls PLAYER */

video.addEventListener('play', () => {
    video_container.classList.remove('paused')
})

video.addEventListener('pause', () => {
    video_container.classList.add('paused')

    setTimeout(() => {
        if (video.paused) {

            pause_TIME.classList.remove('disabled')
            video_container.classList.remove('disabled')
        } else {

            pause_TIME.classList.add('disabled')
            video_container.classList.add('disabled')

            document.querySelector('.play_MAIN').setAttribute('disabled', 'on')
        }
    }, 15000)
})

function fullscreen() {
    document.querySelector('.fullscreen').classList.toggle('active')

    if ((document.fullScreenElement && document.fullScreenElement !== null) ||
        (!document.mozFullScreen && !document.webkitIsFullScreen)) {
        if (document.documentElement.requestFullScreen) {
            document.documentElement.requestFullScreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullScreen) {
            document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    }
}

function volume(e) {
    var value = document.querySelector('#volume_RANGE').value;
    if (e != null) {
        if (e == "up") {
            video.volume += 0.05;
            document.querySelector('#volume_RANGE').value = video.volume
        }
        
        if (e == "down") {
            video.volume -= 0.05;
            document.querySelector('#volume_RANGE').value = video.volume
        }
    } else {
        video.volume = value

        if (value >= 0.3) {
            video_container.setAttribute('data-volume-level', 'high')
        } if (value < 0.3) {
            video_container.setAttribute('data-volume-level', 'low')
        } if (value == 0) {
            video_container.setAttribute('data-volume-level', 'muted')
        }

        document.cookie = `volumeUSER=${value}`;
    }
}

var total_time = document.querySelector('.total_time')
var current_time = document.querySelector('.current_time')

video.addEventListener('timeupdate', () => {
    current_time.textContent = formatDuration(video.currentTime)
    const percent = video.currentTime / video.duration
    timeline_bg.style.setProperty("--progress-position", percent)
})

video.addEventListener('loadeddata', () => {
    total_time.textContent = formatDuration(video.duration)
})
const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
    minimumIntegerDigits: 2
})
function formatDuration(time) {
    const seconds = Math.floor(time % 60)
    const minutes = Math.floor(time / 60) % 60
    const hours = Math.floor(time / 3600)

    if (hours === 0) {
        return `${minutes}:${leadingZeroFormatter.format(seconds)}`
    } else {
        return `${hours}:${leadingZeroFormatter.format(minutes)}:${leadingZeroFormatter.format(seconds)}`
    }
}

function skip(id) {
    if (id == "skip_SMALL") {
        video.currentTime -= 10;
    }

    if (id == "skip_PLUS") {
        video.currentTime += 10;
    }
}

let timer, currSeconds = 0;
function resetTimer() {

    video_controls_container.style.opacity = "1"
    document.body.style.cursor = "default"

    if (play_INIT == 1) {

        pause_TIME.classList.add('disabled')
        video_container.classList.add('disabled')
    }


    /* Clear the previous interval */
    clearInterval(timer);

    /* Reset the seconds of the timer */
    currSeconds = 0;

    /* Set a new interval */
    timer =
        setInterval(startIdleTimer, 1000);
}

// Define the events that
// would reset the timer
window.onload = resetTimer;
window.onmousemove = resetTimer;
window.onmousedown = resetTimer;
window.ontouchstart = resetTimer;
window.onclick = resetTimer;
window.onkeypress = resetTimer;

function startIdleTimer() {

    /* Increment the
        timer seconds */
    currSeconds++;

    /* Set the timer text
        to the new value */
    if (currSeconds >= 2) {
        video_controls_container.style.opacity = "0"
        document.body.style.cursor = "none"
    }
}
