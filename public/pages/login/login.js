document.querySelector('.login-form').addEventListener('submit', function(e) {
  e.preventDefault();
  // 로그인 검증 로직 삽입
  const id = this.querySelector('input[type="text"]').value;
  const pw = this.querySelector('input[type="password"]').value;

  // 임시 승인 변수 : test / 1234
  let isApproved = false;
  if (id === 'test' && pw === '1234') {
    isApproved = true;
  }

  if (isApproved) {
    window.location.href = '/public/pages/main/main.html';
  } else {
    openLoginFailModal("아이디 또는 비밀번호가 올바르지 않습니다.");
  }
});

// 로그인 실패 모달 열기
function openLoginFailModal(msg) {
    const modal = document.getElementById('login-fail-modal');
    const message = modal.querySelector('.login-fail-message');
    if (msg) message.textContent = msg;
    modal.style.display = "flex";
    document.body.classList.add('modal-open'); // 스크롤 막기
}

// 로그인 실패 모달 닫기
function closeLoginFailModal() {
    document.getElementById('login-fail-modal').style.display = "none";
    document.body.classList.remove('modal-open');
}

// 이벤트 연결
document.getElementById('login-fail-close-btn').onclick = closeLoginFailModal;
document.getElementById('login-fail-confirm-btn').onclick = closeLoginFailModal;

document.querySelector('.login-form').addEventListener('submit', function(e) {
  e.preventDefault();
  // 로그인 검증 로직 삽입

  // 실패일 경우
  openLoginFailModal("아이디 또는 비밀번호가 올바르지 않습니다.");
});

// 회원가입 모달 열기/닫기
document.addEventListener('DOMContentLoaded', function() {
    const openBtn = document.getElementById('signup-open-btn');
    const closeBtn = document.getElementById('signup-close-btn');
    const modal = document.getElementById('signup-modal');

    openBtn.addEventListener('click', function() {
        modal.style.display = 'flex';
    });
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // 바깥 클릭 시 모달 닫기
    modal.addEventListener('click', function(e) {
        if(e.target === modal) {
            modal.style.display = 'none';
        }
    });
});
