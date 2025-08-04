document.getElementById('assignment-btn').addEventListener('click', selectAssignment);
document.getElementById('all-btn').addEventListener('click', selectAll);
document.getElementById('notification-btn').addEventListener('click', selectNotification);
document.getElementById('vote-btn').addEventListener('click', selectVote);
document.getElementById('file-btn').addEventListener('click', selectFile);

function selectAssignment() {

    const menuItems = document.querySelectorAll('.chat-menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function () {
            // 기존 active 클래스 제거
            menuItems.forEach(i => i.classList.remove('active'));
            // 클릭한 요소에 active 클래스 추가
            this.classList.add('active');
        });
    });

    document.getElementById('assignment-content').style.display = 'flex';
    document.getElementById('all-content').style.display = 'none';
    document.getElementById('notification-content').style.display = 'none';
    document.getElementById('vote-content').style.display = 'none';
    document.getElementById('file-content').style.display = 'none';
}

function selectAll() {

    const menuItems = document.querySelectorAll('.chat-menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function () {
            // 기존 active 클래스 제거
            menuItems.forEach(i => i.classList.remove('active'));
            // 클릭한 요소에 active 클래스 추가
            this.classList.add('active');
        });
    });

    document.getElementById('assignment-content').style.display = 'none';
    document.getElementById('all-content').style.display = 'flex';
    document.getElementById('notification-content').style.display = 'none';
    document.getElementById('vote-content').style.display = 'none';
    document.getElementById('file-content').style.display = 'none';
}

function selectNotification() {

    const menuItems = document.querySelectorAll('.chat-menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function () {
            // 기존 active 클래스 제거
            menuItems.forEach(i => i.classList.remove('active'));
            // 클릭한 요소에 active 클래스 추가
            this.classList.add('active');
        });
    });

    document.getElementById('assignment-content').style.display = 'none';
    document.getElementById('all-content').style.display = 'none';
    document.getElementById('notification-content').style.display = 'flex';
    document.getElementById('vote-content').style.display = 'none';
    document.getElementById('file-content').style.display = 'none';
}

function selectVote() {

    const menuItems = document.querySelectorAll('.chat-menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function () {
            // 기존 active 클래스 제거
            menuItems.forEach(i => i.classList.remove('active'));
            // 클릭한 요소에 active 클래스 추가
            this.classList.add('active');
        });
    });

    document.getElementById('assignment-content').style.display = 'none';
    document.getElementById('all-content').style.display = 'none';
    document.getElementById('notification-content').style.display = 'none';
    document.getElementById('vote-content').style.display = 'flex';
    document.getElementById('file-content').style.display = 'none';
}

function selectFile() {

    const menuItems = document.querySelectorAll('.chat-menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function () {
            // 기존 active 클래스 제거
            menuItems.forEach(i => i.classList.remove('active'));
            // 클릭한 요소에 active 클래스 추가
            this.classList.add('active');
        });
    });

    document.getElementById('assignment-content').style.display = 'none';
    document.getElementById('all-content').style.display = 'none';
    document.getElementById('notification-content').style.display = 'none';
    document.getElementById('vote-content').style.display = 'none';
    document.getElementById('file-content').style.display = 'flex';
}

// 상세 검색 버튼 토글
document.getElementById('detail-search-toggle').addEventListener('click', function () {
    const box = document.getElementById('detail-search-box');
    box.style.display = (box.style.display === 'none' || box.style.display === '') ? 'block' : 'none';
});

// 취소 버튼 클릭 시 닫기
document.querySelector('.filter-action-btn.cancel').addEventListener('click', function () {
    document.getElementById('detail-search-box').style.display = 'none';
});

// 과제 등록
document.getElementById('register-assignment').addEventListener('click', () => {
    window.loadPanelContent('board-contents', '/public/pages/register_assignment/register_assignment.html');
    console.log('과제 등록 페이지 전환');
});