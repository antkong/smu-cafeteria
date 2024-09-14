tailwind.config = {
    theme: {
        extend: {
            colors: {
                customBlue: '#0e207f',
            },
            fontFamily: {
                'comic': ['"Comic Sans MS"', 'cursive'],
            }
        }
    }
};

let activeToggle = null; // 현재 열려 있는 토글을 추적

function updateDate() {
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 19).replace("T", " ");
    const dateElements = document.querySelectorAll('[id^=currentDate]');
    dateElements.forEach(el => el.textContent = formattedDate);
}

// 페이지 로드 시 바로 날짜 표시 및 1초마다 업데이트
updateDate();
setInterval(updateDate, 1000);

function toggleContent(id) {
    const content = document.getElementById(id);
    
    // 다른 토글이 켜져있으면 그것을 끔
    if (activeToggle && activeToggle !== id) {
        const activeContent = document.getElementById(activeToggle);
        activeContent.classList.add('max-h-0');
        activeContent.classList.remove('max-h-expand');
    }

    content.classList.toggle('max-h-0');
    content.classList.toggle('max-h-expand');
    
    // 새로운 활성 상태를 업데이트
    if (content.classList.contains('max-h-expand')) {
        activeToggle = id;
    } else {
        activeToggle = null;
    }
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
    .then(function(registration) {
        console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch(function(error) {
        console.log('Service Worker registration failed:', error);
    });
}

window.addEventListener('load', function() {
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
        document.getElementById('installguide').style.display = 'none';
    }
});


