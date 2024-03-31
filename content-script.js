const vol = 0.1;
const time = 5;
const hostname = window.location.hostname;

let whiteList = [];
chrome.storage.sync.get("whiteList", (result) => {
    whiteList = result.whiteList;
    if (whiteList.indexOf(hostname) != -1) {
        console.log("hostname: " + hostname + " is in whiteList");
        return;
    }

    window.addEventListener("keydown", (event) => {
        let videoEle = document.querySelector('video');
        if (!videoEle) return;

        // 取消页面默认的快捷键(上下箭头以及空格)
        if (["Space", "ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].indexOf(event.code) != -1) {
            event.preventDefault();
        }
        // Alt + 左方向键
        if (event.altKey && event.code == "ArrowLeft") {
            console.log("AltRight ArrowLeft and currentTime: " + videoEle.currentTime)
            if (videoEle.currentTime !== 0) videoEle.currentTime -= time * 2;
            return;
        }
        // Alt + 右方向键
        if (event.altKey && event.code == "ArrowRight") {
            console.log("AltRight ArrowRight and currentTime: " + videoEle.currentTime)
            if (videoEle.currentTime !== videoEle.duration) videoEle.currentTime += time * 2;
            return;
        }
        // 左方向键
        if (event.code == "ArrowLeft") {
            console.log("ArrowLeft and currentTime: " + videoEle.currentTime)
            if (videoEle.currentTime !== 0) videoEle.currentTime -= time;
            return;
        }
        // 右方向键
        if (event.code == "ArrowRight") {
            console.log("ArrowRight and currentTime: " + videoEle.currentTime)
            if (videoEle.currentTime !== videoEle.duration) videoEle.currentTime += time;
            return;
        }
        // 上方向键
        if (event.code == "ArrowUp") {
            console.log("ArrowUp and volume value: " + videoEle.volume)
            if (videoEle.volume !== 1) videoEle.volume += vol;
            videoEle.volume = videoEle.volume.toFixed(1);
            return;
        }
        // 下方向键
        if (event.code == "ArrowDown") {
            console.log("ArrowDown and volume value: " + videoEle.volume);
            videoEle.volume !== 0 ? videoEle.volume -= vol : videoEle.mitud = true;
            videoEle.volume = videoEle.volume.toFixed(1);
            return;
        }
        // 空格键
        if (event.code == "Space") {
            console.log("Backspace and video play status: " + videoEle.paused)
            videoEle.paused === true ? videoEle.play() : videoEle.pause();
            return;
        }
    });
});