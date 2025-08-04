// 로그인

document.querySelector('.login-form').addEventListener('submit', function (e) {
  e.preventDefault();

  function getLoginTryCount() {
    return false;
  }

  // 로그인 실패 중첩 시 로그인 방지
  if (getLoginTryCount()) {
    openLoginFailModal("로그인 시도 횟수를 초과했습니다. <br>잠시 후 다시 시도해주세요.");
    return;
  }

  // id/pw 입력값 가져오기
  const id = this.querySelector('input[type="text"]').value;
  const pw = this.querySelector('input[type="password"]').value;


  // 로그인 검증 로직 ( 임시 승인 변수 : 차재원 / 0120 )
  let isApproved = false;
  function LoginUser(id, pw) {
    return id === '차재원' && pw === '0120';
  }

  // 로그인 검증
  if (LoginUser(id, pw)) {
    isApproved = true;
  }

  // 로그인 성공 시 메인 페이지로 이동
  if (isApproved) {
    window.location.href = '/public/pages/main/main.html';
  }
  // 실패 시 로그인 실패 모달 활성화, 로그인 시도 횟수 증가
  else {
    openLoginFailModal("아이디 또는 비밀번호가 올바르지 않습니다.");
    loginTry();
    return
  }
});

// 로그인 실패 모달 열기
function openLoginFailModal(msg) {
  const modal = document.getElementById('login-fail-modal');
  const message = modal.querySelector('.login-fail-message');

  // 모달 메시지 설정
  if (msg)
    message.innerHTML = msg;

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

// 회원가입 모달 열기/닫기
document.addEventListener('DOMContentLoaded', function () {
  const openBtn = document.getElementById('signup-open-btn');
  const closeBtn = document.getElementById('signup-close-btn');
  const modal = document.getElementById('signup-modal');

  openBtn.addEventListener('click', function () {
    modal.style.display = 'flex';
  });
  closeBtn.addEventListener('click', function () {
    modal.style.display = 'none';
  });
});

//--------------------------------------------------------------------------------//

// 회원가입

// 임의 데이터
const existedIds = ['차재원', '이준환', '김형준', '권혁윤'];

// 요소 참조
const usernameInput = document.getElementById('signup-username');
const idCheckBtn = document.getElementById('id-check-btn');
const signupBtn = document.getElementById('signup-btn');
const pwInput = document.getElementById('pw');
const pwCheckInput = document.getElementById('pw-check');

// 초기 상태 설정
signupBtn.disabled = true;

// 1. 아이디 중복 체크

// 아이디 중복 확인 변수 
let idAvailable = false;

idCheckBtn.addEventListener('click', function () {

  const value = usernameInput.value.trim();

  // 입력 없으면 무시
  if (!value) return;

  // 중복 확인
  if (existedIds.includes(value)) {
    // 사용 불가
    usernameInput.classList.remove('id-available');
    usernameInput.classList.add('id-unavailable');
    usernameInput.value = '';
    usernameInput.placeholder = '사용할 수 없는 id입니다';
    idCheckBtn.innerHTML = '아이디 중복 확인';
    idCheckBtn.classList.remove('id-available');
    signupBtn.disabled = true;
    idAvailable = false;
  } else {
    // 사용 가능
    usernameInput.classList.remove('id-unavailable');
    usernameInput.classList.add('id-available');
    idCheckBtn.innerHTML = '사용할 수 있는 id입니다';
    idCheckBtn.classList.add('id-available');
    signupBtn.disabled = false;
    idAvailable = true;
  }
});

// usernameInput 다시 입력시 리셋
usernameInput.addEventListener('input', function () {
  usernameInput.classList.remove('id-unavailable', 'id-available');
  usernameInput.placeholder = '아이디';
  idCheckBtn.innerHTML = '아이디 중복 확인';
  idCheckBtn.classList.remove('id-available');
  signupBtn.disabled = true;
  idAvailable = false;
});


// 2. 비밀번호 확인 체크

document.querySelector('.signup-form').addEventListener('submit', function (e) {
  const pw = pwInput.value;
  const pwConfirm = pwCheckInput.value;

  console.log(pw, pwConfirm);

  if (pw !== pwConfirm) {
    e.preventDefault();
    pwInput.value = '';
    pwCheckInput.value = '';
    alert('비밀번호가 일치하지 않습니다.');
    return;
  } else {
    alert('회원가입이 완료되었습니다!');
    closeBtn.addEventListener('click', function () {
      modal.style.display = 'none';
    });
  }
});