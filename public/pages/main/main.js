// 채팅 상대별 json 파일 매핑 (확장 가능)
const chatJsonMap = {
  '김형준': '/models/chat_log/chat_friend1.json',
  '이준환': '/models/chat_log/chat_friend2.json'
  // 필요한 경우 추가
};

let openTabs = []; // [{friend, tabEl, jsonPath}]
let currentTab = null;

window.addEventListener('DOMContentLoaded', () => {
  // 초기 탭 (예시)
  openChatTab("김형준");
});

function openChatTab(friend) {
  let tabData = openTabs.find(t => t.friend === friend);
  if (!tabData) {
    const tabEl = document.createElement('div');
    tabEl.className = 'chat-tab';
    tabEl.textContent = friend;

    const closeBtn = document.createElement('span');
    closeBtn.className = 'close-tab';
    closeBtn.textContent = '×';
    closeBtn.onclick = e => {
      e.stopPropagation();
      closeChatTab(friend);
    };
    tabEl.appendChild(closeBtn);

    tabEl.onclick = () => activateChatTab(friend);

    document.getElementById('chat-tabs').appendChild(tabEl);
    tabData = { friend, tabEl, jsonPath: chatJsonMap[friend] };
    openTabs.push(tabData);
  }
  activateChatTab(friend);
}

async function activateChatTab(friend) {
  openTabs.forEach(t => t.tabEl.classList.toggle('active', t.friend === friend));
  currentTab = openTabs.find(t => t.friend === friend);

  await renderPersonalChatroom(friend, currentTab.jsonPath);
}

function closeChatTab(friend) {
  const idx = openTabs.findIndex(t => t.friend === friend);
  if (idx === -1) return;
  openTabs[idx].tabEl.remove();
  openTabs.splice(idx, 1);

  if (currentTab && currentTab.friend === friend) {
    if (openTabs.length) activateChatTab(openTabs[0].friend);
    else document.getElementById('chat-panel').innerHTML = '';
    currentTab = null;
  }
}

// Main 렌더링 함수: personal_chatroom 디자인 유지 + 데이터 동적 로딩
async function renderPersonalChatroom(friend, jsonPath) {
  const panel = document.getElementById('chat-panel');
  let chatData = [];
  try {
    if (jsonPath) {
      const res = await fetch(jsonPath);
      if (res.ok) chatData = await res.json();
    }
  } catch { chatData = []; }

  // 이름/이미지는 필요에 맞게 해야 함
  const profileImg = '/public/src/assets/friend-profile.png'; // 예시
  panel.innerHTML = `
    <div class="chat-main-content">
      <div id="modal-dark-overlay"></div>
      <div id="modal-bright-overlay"></div>
      <div class="header">
        <div class="profile-with-function">
          <div class="friend-profile">
            <img src="${profileImg}" class="friend-profile-img">
            <p class="name">${friend}</p>
          </div>
          <div class="chat-function">
            <i id="voice-call-button" class="fas fa-phone"></i>
            <i id="face-call-button" class="fas fa-video"></i>
            <i id="more-button" class="fas fa-bars"></i>
            <div class="more-functions">
              <div class="window-function"><i id="more-close-button" class="fas fa-times"></i></div>
              <div class="functions">
                <div class="more-function drawer"><i class="fa fa-shopping-basket" onclick="window.parent.postMessage({type:'chat-list'},'*')"><p>채팅방 목록</p></i></div>
                <div class="more-function drawer"><i class="fa fa-user" onclick="window.parent.postMessage({type:'friend-list'},'*')"><p>친구 목록</p></i></div>
                <div class="more-function board"><i class="fa fa-clipboard" onclick="window.parent.postMessage({type:'drawer'},'*')"><p>게시판</p></i></div>
                <div class="more-function exit"><i class="fas fa-sign-out-alt"><p>채팅방 나가기</p></i></div>
              </div>
              <div class="setting">
                <div class="left"><i class="far fa-bell"></i><i class="far fa-star"></i></div>
                <div class="right"><i class="fas fa-cog"></i></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="chat-container">
        <div class="message-container"></div>
        <div class="voice-call-start" style="display:none;">
          <div class="box-top">
            <p class="call-start-question">음성통화를 시작하시겠습니까?</p>
          </div>
          <div class="box-bottom">
            <div class="yes"><p>확인</p></div>
            <div class="divider"></div>
            <div id="cancel-voicecall-button" class="no"><p>취소</p></div>
          </div>
        </div>
        <div class="face-call-start" style="display:none;">
          <div class="box-top">
            <p class="call-start-question">영상통화를 시작하시겠습니까?</p>
          </div>
          <div class="box-bottom">
            <div class="yes"><p>확인</p></div>
            <div class="divider"></div>
            <div id="cancel-facecall-button" class="no"><p>취소</p></div>
          </div>
        </div>
        <div class="reply-footer">
          <div class="reply-info">
            <p class="reply-to-who">${friend}에게 답장</p>
            <p class="reply-to-what"></p>
          </div>
          <div class="reply-icon">
            <span id="cancel-reply-button" style="font-size:20px; font-weight:300; cursor:pointer;">&#10005;</span>
          </div>
        </div>
        <div id="chat-image-preview-wrap" style="display: none;"></div>
        <div class="footer">
          <i class="far fa-image footer-icon"></i>
          <i class="far fa-smile footer-icon"></i>
          <i class="fas fa-ellipsis-h footer-icon"></i>
          <textarea id="input-message" name="input-message" rows="3" maxlength="300" placeholder="메시지 입력"></textarea>
        </div>
        <input type="file" id="chat-image-input" accept="image/*" style="display: none;" multiple>
      </div>
    </div>
  `;

  renderChatMessagesFull(chatData, panel.querySelector('.message-container'), friend, profileImg);
  attachChatroomEventHandlers(panel, friend);
}

// --- 동일 personal_chatroom 메시지 렌더링 로직 (구현 핵심) ---
function renderChatMessagesFull(chatData, container, friend, profileImg) {
  container.innerHTML = '';
  chatData.forEach(msg => {
    // 시간 표시
    if (msg.type === 'time') {
      const timeDiv = document.createElement('div');
      timeDiv.className = 'time';
      timeDiv.textContent = msg.text;
      container.appendChild(timeDiv);
      return;
    }
    // friend 메시지
    if (msg.sender === 'friend') {
      if (msg.profile || msg.name) {
        const startDiv = document.createElement('div');
        startDiv.className = 'friend-message-start';
        startDiv.innerHTML = `
          <div class="friend-profile">
            <img src="${msg.profile || profileImg}" class="friend-profile-img">
            <div>
              <div class="name">${msg.name || friend}</div>
              <div class="friend-message">${msg.text}</div>
            </div>
          </div>
        `;
        container.appendChild(startDiv);
      } else {
        const lastDiv = document.createElement('div');
        lastDiv.className = 'friend-message-last';
        lastDiv.innerHTML = `<div class="friend-message">${msg.text}</div>`;
        container.appendChild(lastDiv);
      }
      // 감정표현
      if (msg.reactions) {
        const reactionsDiv = document.createElement('div');
        reactionsDiv.className = 'msg-reactions';
        msg.reactions.forEach(r => {
          reactionsDiv.innerHTML += `<div class="msg-reaction"><i class="${r.icon}"></i>${r.count}</div>`;
        });
        container.appendChild(reactionsDiv);
      }
      // 감정표현, 답장 
      if (msg.replyAndExpression) {
        const replyDiv = document.createElement('div');
        replyDiv.className = 'friend-message-last expression';
        replyDiv.innerHTML = `
          <div class="friend-message">${msg.text}</div>
          <div class="reply-and-expression">
            <i class="fas fa-reply" id="reply"></i>
            &nbsp;<span class="middle-bar">|</span>&nbsp;
            <i class="far fa-heart" id="expression"></i>
          </div>
        `;
        container.appendChild(replyDiv);
      }
      // 링크
      if (msg.link) {
        const linkDiv = document.createElement('div');
        linkDiv.className = 'friend-message-start';
        linkDiv.innerHTML = `
          <div class="friend-profile">
            <img src="${msg.profile || profileImg}" class="friend-profile-img">
            <div>
              <div class="name">${msg.name || friend}</div>
              <a class="friend-message link-url" href="${msg.link}" target="_blank">${msg.link}</a>
            </div>
          </div>
        `;
        container.appendChild(linkDiv);
        // 링크 카드
        if (msg.linkCard) {
          const cardDiv = document.createElement('div');
          cardDiv.className = 'link-card-container friend-message-last';
          cardDiv.innerHTML = `
            <div class="link-card">
              <div class="link-card-image"><img src="${msg.linkCard.thumbnail}" alt="링크 썸네일"></div>
              <div class="link-card-content">
                <div class="link-card-title">${msg.linkCard.title}</div>
                <div class="link-card-description">${msg.linkCard.description}</div>
                <div class="link-card-url">${msg.link}</div>
              </div>
            </div>`;
          container.appendChild(cardDiv);
        }
      }
    }
    // 내 메시지
    if (msg.sender === 'me') {
      if (msg.reply) {
        const replyDiv = document.createElement('div');
        replyDiv.className = 'my-message-start';
        replyDiv.innerHTML = `
          <div class="my-message reply">
            <p class="reply-to-who">${msg.reply.to}</p>
            <p class="reply-to-what">${msg.reply.toWhat}</p>
            <p class="reply-message">${msg.text}</p>
          </div>`;
        container.appendChild(replyDiv);
      } else if (msg.image) {
        const imgDiv = document.createElement('div');
        imgDiv.className = 'my-message-start';
        imgDiv.innerHTML = `
          <div class="my-message image">
            <img src="${msg.image}" alt="보낸 이미지" class="chat-image-msg">
          </div>`;
        container.appendChild(imgDiv);
      } else {
        const startDiv = document.createElement('div');
        startDiv.className = 'my-message-start';
        startDiv.innerHTML = `<div class="my-message">${msg.text}</div>`;
        container.appendChild(startDiv);
      }
      if (msg.last) {
        const lastDiv = document.createElement('div');
        lastDiv.className = 'my-message-last';
        lastDiv.innerHTML = `<div class="my-message">${msg.last}</div>`;
        container.appendChild(lastDiv);
      }
    }
  });
}

// personal_chatroom에서 쓰던 각종 이벤트 부착 함수
function attachChatroomEventHandlers(panel, friend) {
  // 더보기
  let moreButton = panel.querySelector('#more-button');
  if (moreButton) {
    moreButton.addEventListener('click', function() {
      panel.querySelector('#modal-bright-overlay').style.display = 'block';
      panel.querySelector('.more-functions').style.display = 'block';
      document.body.classList.add('modal-open');
    });
  }
  let moreCloseButton = panel.querySelector('#more-close-button');
  if (moreCloseButton) {
    moreCloseButton.addEventListener('click', function() {
      panel.querySelector('#modal-bright-overlay').style.display = 'none';
      panel.querySelector('.more-functions').style.display = 'none';
      document.body.classList.remove('modal-open');
    });
  }

  // 통화
  let voiceBtn = panel.querySelector('#voice-call-button');
  let faceBtn = panel.querySelector('#face-call-button');
  let cancelVoice = panel.querySelector('#cancel-voicecall-button');
  let cancelFace = panel.querySelector('#cancel-facecall-button');
  let voiceModal = panel.querySelector('.voice-call-start');
  let faceModal = panel.querySelector('.face-call-start');
  let overlay = panel.querySelector('#modal-dark-overlay');

  if (voiceBtn && voiceModal && overlay) {
    voiceBtn.addEventListener('click', function() {
      overlay.style.display = 'block';
      voiceModal.style.display = 'block';
      document.body.classList.add('modal-open');
    });
  }
  if (faceBtn && faceModal && overlay) {
    faceBtn.addEventListener('click', function() {
      overlay.style.display = 'block';
      faceModal.style.display = 'block';
      document.body.classList.add('modal-open');
    });
  }
  if (cancelVoice && overlay) {
    cancelVoice.addEventListener('click', function() {
      overlay.style.display = 'none';
      voiceModal.style.display = 'none';
      document.body.classList.remove('modal-open');
    });
  }
  if (cancelFace && overlay) {
    cancelFace.addEventListener('click', function() {
      overlay.style.display = 'none';
      faceModal.style.display = 'none';
      document.body.classList.remove('modal-open');
    });
  }

  // 답장 toggle (reply, cancel 등) 가능하면 여기에 추가
  // 그 외 개인 상세 기능도 동일하게 부착
}

// 친구/채팅 목록 iframe에서 탭 오픈 메시지 받기
window.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'open-chat-tab' && e.data.friend) {
    openChatTab(e.data.friend);
  }
  // 사이드/게시판 등 패널 토글도 아래처럼 계속 지원 (생략)
});

