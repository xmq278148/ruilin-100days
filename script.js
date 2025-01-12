// 初始化轮播图
const swiper = new Swiper('.swiper', {
    loop: true,
    effect: 'fade',
    fadeEffect: {
        crossFade: true
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    autoplay: {
        delay: 2000,
        disableOnInteraction: false
    },
    speed: 800,
});

// 监听滑动结束事件，隐藏已播放的照片
swiper.on('slideChange', function () {
    const slides = document.querySelectorAll('.swiper-slide');
    // 只隐藏上一张照片
    if (swiper.previousIndex >= 0) {
        slides[swiper.previousIndex].style.opacity = '0';
        slides[swiper.previousIndex].style.transition = 'opacity 0.5s';
    }
    // 当回到第一张时，重置所有照片的透明度
    if (swiper.activeIndex === 0) {
        slides.forEach(slide => {
            slide.style.opacity = '1';
        });
    }
});

// 在初始化时确保所有照片都是可见的
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.swiper-slide');
    slides.forEach(slide => {
        slide.style.opacity = '1';
    });
});

// 更新照片网格
const photoGrid = document.querySelector('.photo-grid');

// 照片数据
const photos = [
    { url: './百天照/198A1040.jpg', title: '熊睿霖百天照1' },
    { url: './百天照/198A1198.jpg', title: '熊睿霖百天照2' },
    { url: './百天照/198A1243.jpg', title: '熊睿霖百天照3' },
    { url: './百天照/CAAC0046.jpg', title: '熊睿霖百天照4' },
    { url: './百天照/CAAC9641.jpg', title: '熊睿霖百天照5' },
    { url: './百天照/CAAC9874.jpg', title: '熊睿霖百天照6' },
    { url: './百天照/CAAC9968.jpg', title: '熊睿霖百天照7' },
    { url: './百天照/CAAC9741.jpg', title: '熊睿霖百天照8' }
];

// 按原始顺序显示照片
photos.forEach(photo => {
    const img = document.createElement('img');
    img.src = photo.url;
    img.alt = photo.title;
    img.onerror = () => {
        console.error(`图片加载失败: ${photo.url}`);
    };
    img.onload = () => {
        console.log(`图片加载成功: ${photo.url}`);
    };
    img.addEventListener('mouseenter', () => {
        requestAnimationFrame(() => {
            img.style.transform = 'scale(1.15) translateZ(0)';
            img.style.boxShadow = '0 12px 30px rgba(102, 179, 255, 0.3)';
            img.style.zIndex = '1';
        });
    });
    img.addEventListener('mouseleave', () => {
        requestAnimationFrame(() => {
            img.style.transform = 'scale(1) translateZ(0)';
            img.style.boxShadow = 'none';
            img.style.zIndex = '0';
        });
    });
    photoGrid.appendChild(img);
});

// 背景音乐控制
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');
let isPlaying = false;  // 初始状态改为未播放

// 监听用户交互来开始播放音乐
function startMusic() {
    if (!isPlaying) {
        bgMusic.play().then(() => {
            musicToggle.textContent = '⏸';
            musicToggle.classList.add('playing');
            isPlaying = true;
        }).catch(err => {
            console.log('音乐播放失败:', err);
        });
    }
}

// 监听各种用户交互
document.addEventListener('click', startMusic, { once: true });
document.addEventListener('touchstart', startMusic, { once: true });
document.addEventListener('scroll', startMusic, { once: true });
document.addEventListener('mousemove', startMusic, { once: true });

// 音乐控制按钮点击事件
musicToggle.addEventListener('click', (e) => {
    e.stopPropagation();  // 防止触发document的click事件
    if (isPlaying) {
        bgMusic.pause();
        musicToggle.textContent = '🎵';
        musicToggle.classList.remove('playing');
    } else {
        bgMusic.play();
        musicToggle.textContent = '⏸';
        musicToggle.classList.add('playing');
    }
    isPlaying = !isPlaying;
});

// 留言功能
const messageForm = document.getElementById('messageForm');
const messagesDiv = document.querySelector('.messages');
const paginationDiv = document.createElement('div');
paginationDiv.className = 'pagination';
messagesDiv.parentNode.insertBefore(paginationDiv, messagesDiv.nextSibling);

const messagesPerPage = 5;
let currentPage = 1;

// 从服务器加载留言
document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:5000/api/messages')
        .then(response => response.json())
        .then(messages => {
            renderMessages(messages, currentPage);
        })
        .catch(error => {
            console.error('加载留言失败:', error);
        });
});

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = messageForm.querySelector('input').value;
    const content = messageForm.querySelector('textarea').value;
    
    const message = {
        id: Date.now().toString(),
        author: name,
        content: content,
        timestamp: new Date().toLocaleString()
    };
    
    // 发送留言到服务器
    fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message)
    })
    .then(response => response.json())
    .then(() => {
        // 重新加载所有留言
        return fetch('http://localhost:5000/api/messages');
    })
    .then(response => response.json())
    .then(messages => {
        renderMessages(messages, currentPage);
        messageForm.reset();
    })
    .catch(error => {
        console.error('发送留言失败:', error);
    });
});

// 渲染留言和分页
function renderMessages(messages, page) {
    messagesDiv.innerHTML = '';
    const start = (page - 1) * messagesPerPage;
    const end = start + messagesPerPage;
    const paginatedMessages = messages.slice(start, end);
    paginatedMessages.forEach(message => addMessageToDOM(message));
    renderPagination(messages.length, page);
}

// 渲染分页按钮
function renderPagination(totalMessages, page) {
    paginationDiv.innerHTML = '';
    const totalPages = Math.ceil(totalMessages / messagesPerPage);
    
    // 添加左箭头
    const prevButton = document.createElement('button');
    prevButton.textContent = '◀';
    prevButton.disabled = page === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetch('http://localhost:5000/api/messages')
                .then(response => response.json())
                .then(messages => {
                    renderMessages(messages, currentPage);
                });
        }
    });
    paginationDiv.appendChild(prevButton);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.className = i === page ? 'active' : '';
        pageButton.addEventListener('click', () => {
            currentPage = i;
            fetch('http://localhost:5000/api/messages')
                .then(response => response.json())
                .then(messages => {
                    renderMessages(messages, currentPage);
                });
        });
        paginationDiv.appendChild(pageButton);
    }
    
    // 添加右箭头
    const nextButton = document.createElement('button');
    nextButton.textContent = '▶';
    nextButton.disabled = page === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            fetch('http://localhost:5000/api/messages')
                .then(response => response.json())
                .then(messages => {
                    renderMessages(messages, currentPage);
                });
        }
    });
    paginationDiv.appendChild(nextButton);
}

// 将留言添加到 DOM
function addMessageToDOM(message) {
    const messageEl = document.createElement('div');
    messageEl.className = 'message';
    messageEl.dataset.id = message.id;
    messageEl.dataset.author = message.author;
    messageEl.innerHTML = `
        <strong>${message.author}</strong>
        <p>${message.content}</p>
        <small>${message.timestamp}</small>
        <button class="delete-btn" title="删除">🗑️</button>
    `;
    
    // 添加删除按钮的事件监听
    const deleteBtn = messageEl.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        if (confirm('确定要删除这条留言吗？')) {
            messageEl.style.opacity = '0';
            messageEl.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                messagesDiv.removeChild(messageEl);
                // 从 localStorage 中删除留言
                const storedMessages = JSON.parse(localStorage.getItem('messages')) || [];
                const updatedMessages = storedMessages.filter(m => m.id !== message.id);
                localStorage.setItem('messages', JSON.stringify(updatedMessages));
            }, 300);
        }
    });
    
    messagesDiv.insertBefore(messageEl, messagesDiv.firstChild);
    
    // 添加出现动画
    messageEl.style.opacity = '0';
    messageEl.style.transform = 'translateY(-20px)';
    setTimeout(() => {
        messageEl.style.opacity = '1';
        messageEl.style.transform = 'translateY(0)';
    }, 10);
}

// 添加右键菜单功能
document.addEventListener('contextmenu', function(e) {
    const messageEl = e.target.closest('.message');
    if (messageEl) {
        e.preventDefault();
        const author = messageEl.dataset.author;
        
        // 如果是留言作者或管理员
        if (isAdmin || author === messageForm.querySelector('input').value) {
            const contextMenu = document.createElement('div');
            contextMenu.className = 'context-menu';
            contextMenu.innerHTML = `
                <button class="delete-btn">删除留言</button>
            `;
            
            contextMenu.style.position = 'fixed';
            contextMenu.style.left = e.pageX + 'px';
            contextMenu.style.top = e.pageY + 'px';
            
            document.body.appendChild(contextMenu);
            
            // 点击删除按钮
            contextMenu.querySelector('.delete-btn').addEventListener('click', () => {
                if (confirm('确定要删除这条留言吗？')) {
                    messageEl.style.opacity = '0';
                    messageEl.style.transform = 'translateY(-20px)';
                    setTimeout(() => {
                        messagesDiv.removeChild(messageEl);
                    }, 300);
                }
                document.body.removeChild(contextMenu);
            });
            
            // 点击其他地方关闭菜单
            setTimeout(() => {
                document.addEventListener('click', function closeMenu() {
                    if (document.body.contains(contextMenu)) {
                        document.body.removeChild(contextMenu);
                    }
                    document.removeEventListener('click', closeMenu);
                });
            }, 0);
        }
    }
});

// 管理员功能
let isAdmin = false;
const adminPassword = '921226';  // 设置管理员密码

document.getElementById('adminLoginBtn').addEventListener('click', () => {
    const modal = document.createElement('div');
    modal.className = 'admin-modal';
    modal.innerHTML = `
        <div class="modal-header">
            <h3>管理员登录</h3>
            <button class="close-btn">×</button>
        </div>
        <input type="password" placeholder="请输入管理员密码" id="adminPassword">
        <button id="loginBtn">登录</button>
    `;
    
    document.body.appendChild(modal);
    
    // 添加关闭按钮事件
    modal.querySelector('.close-btn').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    document.getElementById('loginBtn').addEventListener('click', () => {
        const password = document.getElementById('adminPassword').value;
        if (password === adminPassword) {
            isAdmin = true;
            alert('登录成功！现在您可以删除任何留言。');
            document.body.removeChild(modal);
        } else {
            alert('密码错误！');
        }
    });
    
    // 确保弹窗在打开时居中
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
});

// 删除留言
function deleteMessage(messageEl, messageId) {
    fetch(`http://localhost:5000/api/messages/${messageId}`, {
        method: 'DELETE'
    })
    .then(() => {
        messageEl.style.opacity = '0';
        messageEl.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            messagesDiv.removeChild(messageEl);
        }, 300);
    })
    .catch(error => {
        console.error('删除留言失败:', error);
    });
} 