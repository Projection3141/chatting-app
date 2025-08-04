const isExpired = false;     // 만료 여부
const isFinished = false;   // 종료 여부

window.addEventListener('DOMContentLoaded', () => {
    if (!isExpired && !isFinished) {        // 진행중일 시
        document.getElementById('progress').style.display = 'block';
        document.getElementById('expired').style.display = 'none';
        document.getElementById('finish').style.display = 'none';
        document.getElementById('finished').style.display = 'none';
    } else if (isExpired && !isFinished){   // 만료 시
        document.getElementById('progress').style.display = 'none';
        document.getElementById('expired').style.display = 'block';
        document.getElementById('finish').style.display = 'block';
        document.getElementById('finished').style.display = 'none';
    } else if (isExpired && isFinished){    // 종료 시
        document.getElementById('progress').style.display = 'none';
        document.getElementById('expired').style.display = 'none';
        document.getElementById('finish').style.display = 'none';
        document.getElementById('finished').style.display = 'block';
    }
});

// 예시
document.getElementById('extend-yes-btn').onclick = function() {
    document.getElementById('extend-confirm-modal').style.display = 'none';
    document.getElementById('extend-done-modal').style.display = 'flex';
};
document.getElementById('extend-no-btn').onclick = function() {
    document.getElementById('extend-confirm-modal').style.display = 'none';
};
document.getElementById('extend-done-close-btn').onclick = function() {
    document.getElementById('extend-done-modal').style.display = 'none';
};
