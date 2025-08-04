document.querySelectorAll('.chat-item').forEach(el => {
  el.addEventListener('click', e => {
    const name = el.dataset.friend || '';

    console.log('클릭 감지:', name);

    // 친구 이름에 대응하는 JSON 경로 (main 페이지에서 사용)
    let jsonPath = null;
    if (name === '김형준') {
      jsonPath = '/models/chat_log/chat_friend1.json';
    } else if (name === '이준환') {
      jsonPath = '/models/chat_log/chat_friend2.json';
    } else {
      // 기본 채팅 데이터 경로
      jsonPath = '/models/chat_log/chat_friend1.json';
    }

    // 부모(main.html)로 친구 이름 및 채팅 데이터 경로 전달
    window.parent.postMessage({
      type: 'open-chat-tab',
      friend: name,
      jsonPath: jsonPath
    }, '*');
  });
});
