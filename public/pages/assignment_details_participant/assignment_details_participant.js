
const hasSubmitted = true; // 제출 여부

window.addEventListener('DOMContentLoaded', () => {
    if (!hasSubmitted) {
        document.getElementById('submit-btn').style.display = 'block';
        document.getElementById('resubmit-btn').style.display = 'none';
        document.querySelector('.my-submit-item').style.display = 'none';
    } else {
        document.getElementById('submit-btn').style.display = 'none';
        document.getElementById('resubmit-btn').style.display = 'block';
        document.querySelector('.my-submit-item').style.display = 'flex';
    }
});



document.getElementById('submit-btn').addEventListener('click', submit);
document.getElementById('cancel-submit').addEventListener('click', cancelSubmit);
document.getElementById('resubmit-btn').addEventListener('click', resubmit);
document.getElementById('cancel-resubmit').addEventListener('click', cancelResubmit);

function submit() {
    document.querySelector('.submit-modal').style.display = 'flex';
}
function cancelSubmit() {
    document.querySelector('.submit-modal').style.display = 'none';
}
function resubmit() {
    document.querySelector('.resubmit-modal').style.display = 'flex';
}
function cancelResubmit() {
    document.querySelector('.resubmit-modal').style.display = 'none';
}


// 연장 알림 모달 열기
// document.getElementById('extend-notice-modal').style.display = 'flex';

// 연장 알림 모달 닫기
document.getElementById('extend-notice-close-btn').onclick = function() {
    document.getElementById('extend-notice-modal').style.display = 'none';
};