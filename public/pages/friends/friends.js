// friends.js
document.addEventListener('DOMContentLoaded', () => {

  // Mock friend data
  let friends = [
    { id: 1, nickname: "고영현", phone: "010-1111-1111", img: "/public/src/assets/friend-profile6.png", isNew: false, blocked: false },
    { id: 2, nickname: "이준환", phone: "010-2222-2222", img: "/public/src/assets/friend-profile2.png", isNew: false, blocked: false },
    { id: 3, nickname: "김민찬", phone: "010-3333-3333", img: "/public/src/assets/friend-profile7.png", isNew: false, blocked: false },
    { id: 4, nickname: "김형준", phone: "010-4444-4444", img: "/public/src/assets/friend-profile.png", isNew: false, blocked: false }
  ];

  // 새 친구 등록 기록용
  let newFriendEntries = []; // {friendId, expireTime}

  // 친구 목록 렌더링 함수
  function renderFriendList(list) {
    const container = document.getElementById('friends-list');
    container.innerHTML = '';
    list.forEach(friend => {
      if(friend.blocked) return; // 차단 친구는 목록에 표시 안함
      const item = document.createElement('div');
      item.className = 'friend-item d-flex align-items-center';
      item.innerHTML = `
        <img src="${friend.img}" alt="${friend.nickname}" class="friend-img" />
        <span class="friend-name flex-grow-1 ms-2">${friend.nickname}</span>
        ${friend.isNew ? '<span class="badge bg-success ms-2">새 친구</span>' : ''}
      `;
      container.appendChild(item);
    });
    document.getElementById('friend-count').textContent = list.filter(f=>!f.blocked).length;
  }

  // 페이지 진입 시 전체 렌더
  renderFriendList(friends);

  // 1) 검색 기능
  const searchInput = document.getElementById('friend-search-input');
  const searchBtn = document.getElementById('friend-search-btn');

  function doSearch() {
    const keyword = searchInput.value.trim();
    if(keyword === '') {
      renderFriendList(friends);
      return;
    }
    const filtered = friends.filter(f =>
      f.nickname.includes(keyword) && !f.blocked
    );
    renderFriendList(filtered);
  }

  searchBtn.addEventListener('click', doSearch);
  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') doSearch();
  });

  // 2) 모달 오픈/닫기 편의 함수
  function openModal(modalId) {
    document.getElementById(modalId).classList.add('show');
  }
  function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');

    // 입력창과 메시지 초기화
    if(modalId === 'modal-add-friend'){
      document.getElementById('add-nickname').value = '';
      document.getElementById('add-phone').value = '';
      document.getElementById('add-message').style.display = 'none';
    } else if(modalId === 'modal-remove-friend'){
      document.getElementById('remove-nickname').value = '';
      document.getElementById('remove-message').style.display = 'none';
    } else if(modalId === 'modal-block-friend'){
      document.getElementById('block-nickname').value = '';
      document.getElementById('block-message').style.display = 'none';
    }
  }

  // 3) 톱니바퀴 (settings) 버튼 이벤트
  document.getElementById('settings-btn').addEventListener('click', () => {
    openModal('settings-modal');
  });
  document.getElementById('settings-close-btn').addEventListener('click', () => {
    closeModal('settings-modal');
  });

  // 4) 설정 모달 내 버튼
  document.getElementById('add-friend-btn').addEventListener('click', () => {
    closeModal('settings-modal');
    openModal('modal-add-friend');
  });
  document.getElementById('remove-friend-btn').addEventListener('click', () => {
    closeModal('settings-modal');
    openModal('modal-remove-friend');
  });
  document.getElementById('block-friend-btn').addEventListener('click', () => {
    closeModal('settings-modal');
    openModal('modal-block-friend');
  });

  // 5) 친구 추가 처리
  document.getElementById('add-friend-confirm').addEventListener('click', () => {
    const nickname = document.getElementById('add-nickname').value.trim();
    const phone = document.getElementById('add-phone').value.trim();
    const msgEl = document.getElementById('add-message');

    if (!nickname || !phone) {
      msgEl.textContent = '닉네임과 전화번호를 모두 입력하세요.';
      msgEl.style.display = 'block';
      return;
    }

    // 중복 확인
    const existingFriend = friends.find(f => f.nickname === nickname && f.phone === phone);
    if (existingFriend) {
      // 이미 친구 목록에 있을 수도 있음 (차단 아닐 경우만)
      if (existingFriend.blocked) {
        existingFriend.blocked = false;
      }
      existingFriend.isNew = true;
      newFriendEntries.push({ friendId: existingFriend.id, expireTime: Date.now() + 24*60*60*1000 });
      renderFriendList(friends);
      closeModal('modal-add-friend');
      alert(`'${nickname}'님을 새 친구로 추가했습니다.`);
    } else {
      msgEl.textContent = '해당 계정이 존재하지 않습니다.';
      msgEl.style.display = 'block';
    }
  });
  document.getElementById('add-close-btn').addEventListener('click', () => closeModal('modal-add-friend'));

  // 6) 친구 삭제 처리
  document.getElementById('remove-friend-confirm').addEventListener('click', () => {
    const nickname = document.getElementById('remove-nickname').value.trim();
    const msgEl = document.getElementById('remove-message');

    if (!nickname) {
      msgEl.textContent = '닉네임을 입력하세요.';
      msgEl.style.display = 'block';
      return;
    }

    const index = friends.findIndex(f => f.nickname === nickname && !f.blocked);
    if (index >= 0) {
      friends.splice(index, 1);
      renderFriendList(friends);
      closeModal('modal-remove-friend');
      alert(`'${nickname}'님을 친구 목록에서 삭제했습니다.`);
    } else {
      msgEl.textContent = '해당 계정이 존재하지 않습니다.';
      msgEl.style.display = 'block';
    }
  });
  document.getElementById('remove-close-btn').addEventListener('click', () => closeModal('modal-remove-friend'));

  // 7) 친구 차단 처리
  document.getElementById('block-friend-confirm').addEventListener('click', () => {
    const nickname = document.getElementById('block-nickname').value.trim();
    const msgEl = document.getElementById('block-message');

    if (!nickname) {
      msgEl.textContent = '닉네임을 입력하세요.';
      msgEl.style.display = 'block';
      return;
    }

    const friend = friends.find(f => f.nickname === nickname && !f.blocked);
    if (friend) {
      friend.blocked = true;

      // 차단 시 채팅방도 삭제했다고 가정 (실제 시스템과 연동 필요)
      renderFriendList(friends);
      closeModal('modal-block-friend');
      alert(`'${nickname}'님을 차단했습니다.`);
    } else {
      msgEl.textContent = '해당 계정이 존재하지 않습니다.';
      msgEl.style.display = 'block';
    }
  });
  document.getElementById('block-close-btn').addEventListener('click', () => closeModal('modal-block-friend'));

  // 8) 새 친구 1일 유지 타이머 (간단히, 화면단 처리)
  function cleanExpiredNewFriends() {
    const now = Date.now();
    newFriendEntries = newFriendEntries.filter(entry => entry.expireTime > now);
    friends.forEach(friend => {
      friend.isNew = newFriendEntries.some(e => e.friendId === friend.id);
    });
  }

  // 주기적으로 새 친구 표시 갱신
  setInterval(() => {
    cleanExpiredNewFriends();
    renderFriendList(friends);
  }, 60*1000);


  // 모든 친구 span(혹은 엘리먼트)에 이벤트 부착
  document.querySelectorAll('.friend-name').forEach(el => {
    el.addEventListener('click', e => {
      const name = el.dataset.friend; // 예: '김형준', '이준환'
      if (!window.parent) return; // iframe이 아니면 무시

      let fileUrl = null;
      if (name === '김형준') {
        fileUrl = '/public/pages/personal_chatroom/personal_chatroom.html';
      } else if (name === '이준환') {
        fileUrl = '/public/pages/personal_chatroom2/personal_chatroom2.html';
      } else {
        // 다른 친구는 무시하거나 기본 채팅방 설정 가능
        return;
      }

      // 부모(main.html)의 iframe(src) 변경 요청 메시지 전송
      window.parent.postMessage({
        type: 'open-personal-chat',
        fileUrl
      }, '*');
    });
  });

});
