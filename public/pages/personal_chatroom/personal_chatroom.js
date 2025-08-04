// 메시지 JSON 불러와서 렌더링
async function loadChatMessages() {

    async function loadChatLog(fileUrl) {
        try {
            const res = await fetch(fileUrl);
            if (!res.ok) {
                throw new Error(`Failed to fetch ${fileUrl}: ${res.status} ${res.statusText}`);
            }
            const data = await res.json();
            return data;  // json 데이터 반환
        } catch (error) {
            console.error('Error loading chat log:', error);
            return null; // 에러 시 null 반환하거나 처리
        }
    }

    const chatData = await loadChatLog('/models/chat_log/chat_friend1.json');
    if (chatData) {
        console.log('받은 채팅 데이터:', chatData);
        // 받은 데이터를 화면에 뿌리거나 상태에 저장하는 등 처리
    }
    const container = document.querySelector('.message-container');
    container.innerHTML = '';

    chatData.forEach(msg => {
        // 시간 메시지 처리
        if (msg.type === 'time') {
            const timeDiv = document.createElement('div');
            timeDiv.className = 'time';
            timeDiv.textContent = msg.text || '';
            container.appendChild(timeDiv);
            return;
        }

        // 상대방 메시지 - 링크 메시지 우선 처리
        if (msg.sender === 'friend') {
            if (msg.link) {
                const linkDiv = document.createElement('div');
                linkDiv.className = 'friend-message-start';
                linkDiv.innerHTML = 
                ` <div class="friend-profile">
                    <img src="${msg.profile || '/public/src/assets/friend-profile.png'}" class="friend-profile-img">
                    <div>
                      <div class="name">${msg.name || '친구'}</div>
                      <a class="friend-message link-url" href="${msg.link}" target="_blank" rel="noopener noreferrer">${msg.link}</a>
                    </div>
                  </div>
                `;
                container.appendChild(linkDiv);

                if (msg.linkCard) {
                    const cardDiv = document.createElement('div');
                    cardDiv.className = 'link-card-container friend-message-last';
                    cardDiv.innerHTML = 
                    ` <div class="link-card">
                        <div class="link-card-image">
                          <img src="${msg.linkCard.thumbnail}" alt="링크 썸네일">
                        </div>
                        <div class="link-card-content">
                          <div class="link-card-title">${msg.linkCard.title}</div>
                          <div class="link-card-description">${msg.linkCard.description}</div>
                          <div class="link-card-url">${msg.link}</div>
                        </div>
                      </div>
                    `;
                    container.appendChild(cardDiv);
                }
                return; // 링크 메시지 처리 후 종료
            }

            // 링크 메시지가 아니라면 일반 메시지 처리
            if (msg.profile && msg.text) {
                const startDiv = document.createElement('div');
                startDiv.className = 'friend-message-start';
                startDiv.innerHTML = 
                ` <div class="friend-profile">
                    <img src="${msg.profile}" class="friend-profile-img">
                    <div>
                      <div class="name">${msg.name || '친구'}</div>
                      <div class="friend-message">${msg.text}</div>
                    </div>
                  </div>
                `;
                container.appendChild(startDiv);
            } else if (msg.text) {
                const lastDiv = document.createElement('div');
                lastDiv.className = 'friend-message-last';
                lastDiv.innerHTML = `<div class="friend-message">${msg.text}</div>`;
                container.appendChild(lastDiv);
            }

            // 감정표현 및 답장
            if (msg.reactions) {
                const reactionsDiv = document.createElement('div');
                reactionsDiv.className = 'msg-reactions';
                msg.reactions.forEach(r => {
                    reactionsDiv.innerHTML += `<div class="msg-reaction"><i class="${r.icon}"></i>${r.count}</div>`;
                });
                container.appendChild(reactionsDiv);
            }
            if (msg.replyAndExpression) {
                const replyDiv = document.createElement('div');
                replyDiv.className = 'friend-message-last expression';
                replyDiv.innerHTML = 
                ` <div class="friend-message">${msg.text}</div>
                  <div class="reply-and-expression">
                    <i class="fas fa-reply" id="reply"></i>
                    &nbsp;<span class="middle-bar">|</span>&nbsp;
                    <i class="far fa-heart" id="expression"></i>
                  </div>
                `;
                container.appendChild(replyDiv);
            }

            return; // 상대방 메시지 처리 종료
        }

        // 내가 보낸 메시지 - 링크 메시지 우선 처리
        if (msg.sender === 'me') {
            if (msg.link) {
                const linkDiv = document.createElement('div');
                linkDiv.className = 'my-message-start';
                linkDiv.innerHTML = `
        <div class="my-message link-message">
          <a href="${msg.link}" target="_blank" rel="noopener noreferrer">${msg.link}</a>
        </div>
      `;
                container.appendChild(linkDiv);

                if (msg.linkCard) {
                    const cardDiv = document.createElement('div');
                    cardDiv.className = 'link-card-container my-message-last';
                    cardDiv.innerHTML = `
          <div class="link-card">
            <div class="link-card-image">
              <img src="${msg.linkCard.thumbnail}" alt="링크 썸네일">
            </div>
            <div class="link-card-content">
              <div class="link-card-title">${msg.linkCard.title}</div>
              <div class="link-card-description">${msg.linkCard.description}</div>
              <div class="link-card-url">${msg.link}</div>
            </div>
          </div>
        `;
                    container.appendChild(cardDiv);
                }
                return; // 내 링크 메시지 처리 후 종료
            }

            // 링크 메시지 아니면 일반 내 메시지 처리
            if (msg.reply) {
                const replyDiv = document.createElement('div');
                replyDiv.className = 'my-message-start';
                replyDiv.innerHTML = `
        <div class="my-message reply">
          <p class="reply-to-who">${msg.reply.to}</p>
          <p class="reply-to-what">${msg.reply.toWhat}</p>
          <p class="reply-message">${msg.text}</p>
        </div>
      `;
                container.appendChild(replyDiv);
            } else if (msg.image) {
                const imgDiv = document.createElement('div');
                imgDiv.className = 'my-message-start';
                imgDiv.innerHTML = `
        <div class="my-message image">
          <img src="${msg.image}" alt="보낸 이미지" class="chat-image-msg">
        </div>
      `;
                container.appendChild(imgDiv);
            } else if (msg.text) {
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

            return; // 내 메시지 처리 종료
        }

    });

}

// 페이지 로드 시 대화 불러오기
document.addEventListener('DOMContentLoaded', loadChatMessages);

// footer와 textarea 동적 높이 조절
document.addEventListener('DOMContentLoaded', function () {
    const textarea = document.querySelector('.type_msg');
    const footer = document.querySelector('.footer');
    if (!textarea || !footer) return;

    function getMaxFooterHeight() {
        return window.innerHeight * 0.4; // 40vh
    }

    function resizeTextarea() {
        textarea.style.height = 'auto';
        let newHeight = textarea.scrollHeight;
        // textarea 최대 높이 제한
        const maxTextareaHeight = getMaxFooterHeight() - 28; // padding 등 고려
        if (newHeight > maxTextareaHeight) {
            newHeight = maxTextareaHeight;
            textarea.style.overflowY = 'auto';
        } else {
            textarea.style.overflowY = 'hidden';
        }
        textarea.style.height = newHeight + 'px';
        // footer도 같이 늘리기
        footer.style.maxHeight = Math.max(newHeight + 28, window.innerHeight * 0.07) + 'px';
    }

    textarea.addEventListener('input', resizeTextarea);
    window.addEventListener('resize', resizeTextarea);
    resizeTextarea();
});

const replyTrigger = document.getElementById('reply');

if (replyTrigger) {
    replyTrigger.addEventListener('click', showResponseFooter);
}
// 답장 기능
function showResponseFooter() {
    // 1. response-footer 보이기
    const responseFooter = document.querySelector('.reply-footer');
    responseFooter.style.display = 'flex';

    // 3. textarea placeholder 변경
    const textarea = document.getElementById('input-message');
    if (textarea) {
        textarea.placeholder = "답장 메시지 입력";
    }
}

const cancelReply = document.getElementById('cancel-reply-button');

if (cancelReply) {
    cancelReply.addEventListener('click', hideResponseFooter);
}

// 답장 기능 취소
function hideResponseFooter() {
    const responseFooter = document.querySelector('.reply-footer');
    responseFooter.style.display = 'none';

    const textarea = document.getElementById('input-message');
    if (textarea) {
        textarea.placeholder = "메시지 입력";
    }
}


// 메시지에서 링크 추출 및 카드 생성 함수 
// 백엔드에서 puppeteer로 링크의 Open Graph 태그 파싱해서 데이터 가져와야 함
function createLinkCard(message, isMine) {
    // URL 추출 (정규식)
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = message.match(urlRegex);
    if (!urls || urls.length === 0) return null;

    // 실제로는 서버에서 링크 정보(제목, 설명, 썸네일 등)를 가져와야 함
    // 여기서는 예시로 하드코딩
    const linkCard = `
        <div class="link-card-container ${isMine ? 'my-message-last' : 'friend-message-last'}">
            <div class="link-card">
                <div class="link-card-image">
                    <img src="https://example.com/thumbnail.jpg" alt="링크 썸네일">
                </div>
                <div class="link-card-content">
                    <div class="link-card-title">예시 웹사이트</div>
                    <div class="link-card-description">여기는 예시 웹사이트입니다.</div>
                    <div class="link-card-url">${urls[0].replace(/^https?:\/\//, '')}</div>
                </div>
            </div>
        </div>
    `;
    return linkCard;
}

// 예시: 메시지 전송 시 링크 카드 추가
// document.getElementById('input-message').addEventListener('keypress', function(e) {
//     if (e.key === 'Enter' && !e.shiftKey) {
//         e.preventDefault();
//         const message = this.value.trim();
//         if (message) {
//             // 메시지 추가
//             const messageContainer = document.querySelector('.message-container');
//             const isMine = true; // 예시: 내 메시지인 경우
//             const messageElement = document.createElement('div');
//             messageElement.className = isMine ? 'my-message-start' : 'friend-message-start';
//             messageElement.innerHTML = `<div class="${isMine ? 'my-message' : 'friend-message'}">${message}</div>`;
//             messageContainer.appendChild(messageElement);

//             // 링크 카드 추가
//             const linkCard = createLinkCard(message, isMine);
//             if (linkCard) {
//                 messageContainer.insertAdjacentHTML('beforeend', linkCard);
//             }

//             this.value = '';
//         }
//     }
// });

// 음성/영상 통화 버튼 토글
document.getElementById('voice-call-button').addEventListener('click', startVoiceCall);
document.getElementById('cancel-voicecall-button').addEventListener('click', cancelVoiceCall);
document.getElementById('face-call-button').addEventListener('click', startFaceCall);
document.getElementById('cancel-facecall-button').addEventListener('click', cancelFaceCall);

function startVoiceCall() {
    document.getElementById('modal-dark-overlay').style.display = 'block';
    document.querySelector('.voice-call-start').style.display = 'block';
    document.body.classList.add('modal-open');
}

function cancelVoiceCall() {
    document.getElementById('modal-dark-overlay').style.display = 'none';
    document.querySelector('.voice-call-start').style.display = 'none';
    document.body.classList.remove('modal-open');
}

function startFaceCall() {
    document.getElementById('modal-dark-overlay').style.display = 'block';
    document.querySelector('.face-call-start').style.display = 'block';
    document.body.classList.add('modal-open');
}

function cancelFaceCall() {
    document.getElementById('modal-dark-overlay').style.display = 'none';
    document.querySelector('.face-call-start').style.display = 'none';
    document.body.classList.remove('modal-open');
}


// 더보기 버튼 토글
document.getElementById('more-button').addEventListener('click', openMore);
document.body.addEventListener('click', (e) => {
    if (e.target.matches('#more-close-button') || e.target.matches('#modal-bright-overlay')) {
        closeMore();
    }
});

function openMore() {
    document.getElementById('modal-bright-overlay').style.display = 'block';
    document.querySelector('.more-functions').style.display = 'block';
    document.body.classList.add('modal-open');
}

function closeMore() {
    document.getElementById('modal-bright-overlay').style.display = 'none';
    document.querySelector('.more-functions').style.display = 'none';
    document.body.classList.remove('modal-open');
}


// 이미지 아이콘 클릭 → 파일 선택창 열기
const imageIcon = document.querySelector('.fa-image.footer-icon');
const fileInput = document.getElementById('chat-image-input');
const previewWrap = document.getElementById('chat-image-preview-wrap');

imageIcon.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;

        const reader = new FileReader();
        reader.onload = (e) => {
            // 이미지 미리보기 컨테이너 생성
            const imgContainer = document.createElement('div');
            imgContainer.classList.add('my-message', 'image', 'preview');

            // 이미지 엘리먼트
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = '미리보기';
            img.classList.add('chat-image-msg');

            // 삭제 버튼
            const cancelBtn = document.createElement('span');
            cancelBtn.classList.add('preview-cancel');
            cancelBtn.title = '취소';
            cancelBtn.innerHTML = '&times;';

            cancelBtn.addEventListener('click', () => {
                imgContainer.remove();
                // 마지막 이미지 삭제 시 미리보기 전체 숨김
                if (previewWrap.children.length === 1) {
                    previewWrap.style.display = 'none';
                }
            });

            imgContainer.appendChild(img);
            imgContainer.appendChild(cancelBtn);

            // 오른쪽에 추가
            previewWrap.style.display = 'flex';
            previewWrap.appendChild(imgContainer);
        };
        reader.readAsDataURL(file);
    }

    // 선택 초기화
    fileInput.value = '';
});

// 페이지 로드 시 미리보기 비우기
if (previewWrap.children.length === 0) {
    previewWrap.style.display = 'none';
}

// // 미리보기 취소 버튼
// document.getElementById('preview-cancel-btn').addEventListener('click', function() {
//     document.getElementById('chat-image-preview-wrap').style.display = 'none';
//     document.getElementById('chat-image-input').value = '';
// });

// 패널 토글 함수
function togglePanel(panel) {
    window.parent.postMessage({ type: panel })
    closeMore();
}

