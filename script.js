// Dados dos vídeos (exemplo - você pode adicionar mais)
const videos = [
    {
        id: 'video1',
        title: 'Os melhores momentos de comédia 2024',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        duration: '10:45',
        views: '125K',
        date: '2 dias atrás',
        category: 'compilacao',
        youtubeId: 'dQw4w9WgXcQ'
    },
    {
        id: 'video2',
        title: 'Stand-up: Piadas que nunca envelhecem',
        thumbnail: 'https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg',
        duration: '15:30',
        views: '89K',
        date: '5 dias atrás',
        category: 'standup',
        youtubeId: '9bZkp7q19f0'
    },
    {
        id: 'video3',
        title: 'Vines brasileiros mais engraçados',
        thumbnail: 'https://img.youtube.com/vi/ScMzIvxBSi4/maxresdefault.jpg',
        duration: '8:20',
        views: '256K',
        date: '1 semana atrás',
        category: 'vine',
        youtubeId: 'ScMzIvxBSi4'
    },
    {
        id: 'video4',
        title: 'Fail moments: Quando tudo dá errado',
        thumbnail: 'https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg',
        duration: '12:15',
        views: '178K',
        date: '3 dias atrás',
        category: 'fail',
        youtubeId: '9bZkp7q19f0'
    },
    {
        id: 'video5',
        title: 'Esquete: O dia em que tudo mudou',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        duration: '7:45',
        views: '95K',
        date: '4 dias atrás',
        category: 'comedia',
        youtubeId: 'dQw4w9WgXcQ'
    },
    {
        id: 'video6',
        title: 'Trending: Memes da semana',
        thumbnail: 'https://img.youtube.com/vi/ScMzIvxBSi4/maxresdefault.jpg',
        duration: '5:30',
        views: '340K',
        date: '12 horas atrás',
        category: 'trending',
        youtubeId: 'ScMzIvxBSi4'
    },
    {
        id: 'video7',
        title: 'Comédia stand-up ao vivo',
        thumbnail: 'https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg',
        duration: '22:10',
        views: '67K',
        date: '1 dia atrás',
        category: 'standup',
        youtubeId: '9bZkp7q19f0'
    },
    {
        id: 'video8',
        title: 'Compilação: Reações engraçadas',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        duration: '11:25',
        views: '189K',
        date: '6 dias atrás',
        category: 'compilacao',
        youtubeId: 'dQw4w9WgXcQ'
    }
];

// Renderizar vídeos
function renderVideos(videoList) {
    const grid = document.getElementById('videoGrid');
    grid.innerHTML = videoList.map(video => `
        <div class="video-card" onclick="openVideo('${video.id}')">
            <div class="video-thumbnail">
                <img src="${video.thumbnail}" alt="${video.title}">
                <span class="video-duration">${video.duration}</span>
            </div>
            <div class="video-info">
                <div class="video-title">${video.title}</div>
                <div class="video-meta">
                    <span><i class="fas fa-eye"></i> ${video.views}</span>
                    <span><i class="fas fa-clock"></i> ${video.date}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Filtrar por categoria
function filterCategory(category) {
    // Atualizar tags ativas
    document.querySelectorAll('.tag').forEach(tag => {
        tag.classList.remove('active');
        if (tag.textContent.toLowerCase().includes(category) || 
            (category === 'all' && tag.textContent === 'Todos')) {
            tag.classList.add('active');
        }
    });

    // Atualizar sidebar
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event?.target?.closest('.nav-item')?.classList.add('active');

    // Filtrar vídeos
    if (category === 'all') {
        renderVideos(videos);
    } else if (category === 'trending' || category === 'recente') {
        // Ordenar por views para trending, por data para recente
        const sorted = [...videos].sort((a, b) => {
            if (category === 'trending') {
                return parseInt(b.views) - parseInt(a.views);
            }
            return 0; // Simplificado para recente
        });
        renderVideos(sorted);
    } else {
        const filtered = videos.filter(v => v.category === category);
        renderVideos(filtered);
    }
}

// Buscar vídeos
function searchVideos() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = videos.filter(v => 
        v.title.toLowerCase().includes(query) ||
        v.category.toLowerCase().includes(query)
    );
    renderVideos(filtered);
}

// Abrir vídeo
function openVideo(videoId) {
    const video = videos.find(v => v.id === videoId);
    if (!video) return;

    const modal = document.getElementById('videoModal');
    
    // Mostrar modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Vídeo
    document.getElementById('videoWrapper').innerHTML = `
        <iframe src="https://www.youtube.com/embed/${video.youtubeId}?autoplay=1" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
        </iframe>
    `;

    // Título
    document.getElementById('modalVideoTitle').textContent = video.title;

    // Stats
    document.getElementById('modalVideoStats').innerHTML = `
        <span><i class="fas fa-eye"></i> ${video.views} visualizações</span>
        <span><i class="fas fa-calendar"></i> ${video.date}</span>
        <span class="category-badge"><i class="fas fa-tag"></i> ${video.category}</span>
    `;

    // Guardar ID do vídeo atual
    currentVideoId = videoId;

    // Renderizar comentários
    renderComments(videoId);

    const recommendations = videos
        .filter(v => v.category === video.category && v.id !== video.id)
        .slice(0, 6);
    
    if (recommendations.length < 6) {
        const outros = videos.filter(v => v.id !== video.id && !recommendations.find(r => r.id === v.id));
        while (recommendations.length < 6 && outros.length > 0) {
            recommendations.push(outros.shift());
        }
    }

    // Renderizar recomendações
    document.getElementById('modalRecGrid').innerHTML = recommendations.map(rec => `
        <div class="modal-rec-item" onclick="openVideo('${rec.id}')">
            <div class="modal-rec-thumb">
                <img src="${rec.thumbnail}" alt="${rec.title}">
                <span class="modal-rec-time">${rec.duration}</span>
            </div>
            <div class="modal-rec-title">${rec.title}</div>
            <div class="modal-rec-views">${rec.views} views</div>
        </div>
    `).join('');
}

// Toggle sidebar no player
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
}

// Fechar vídeo
function closeVideo() {
    const modal = document.getElementById('videoModal');
    
    document.getElementById('videoWrapper').innerHTML = '';
    modal.style.display = 'none';
    document.body.style.overflow = '';
    
    // Fechar sidebar se estiver aberta
    document.getElementById('sidebar').classList.remove('active');
}

// Filtrar a partir do player
function filterFromPlayer(category) {
    closeVideo();
    filterCategory(category);
}

// Toggle menu mobile
function toggleMenu() {
    document.getElementById('sidebar').classList.toggle('active');
}

// Focus no campo de busca
function focusSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.focus();
        searchInput.scrollIntoView({ behavior: 'smooth' });
    }
}

// Mostrar/ocultar categorias
function showCategories() {
    const subcategories = document.querySelectorAll('.nav-item.subcategory');
    subcategories.forEach(cat => {
        cat.style.display = cat.style.display === 'none' ? 'flex' : 'none';
    });
}

// Fechar modal ao clicar fora (só depois que DOM carregar)
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('videoModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeVideo();
            }
        });
    }
    
    // Busca ao pressionar Enter
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchVideos();
            }
        });
    }
    
    // Comentário ao pressionar Enter
    const commentInput = document.getElementById('commentInput');
    if (commentInput) {
        commentInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                submitComment();
            }
        });
    }
    
    // Renderizar vídeos iniciais
    renderVideos(videos);
});

// ==================== SISTEMA DE COMENTÁRIOS ====================

const commentsDB = JSON.parse(localStorage.getItem('risadatube_comments') || '{}');

function submitComment() {
    const input = document.getElementById('commentInput');
    const text = input.value.trim();
    if (!text) return;
    
    const videoId = currentVideoId;
    if (!videoId) return;
    
    const comment = {
        id: Date.now(),
        text: text,
        author: 'Você',
        time: new Date().toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }),
        likes: 0,
        liked: false
    };
    
    if (!commentsDB[videoId]) {
        commentsDB[videoId] = [];
    }
    commentsDB[videoId].unshift(comment);
    
    localStorage.setItem('risadatube_comments', JSON.stringify(commentsDB));
    
    input.value = '';
    clearCommentInput();
    renderComments(videoId);
}

function clearCommentInput() {
    const input = document.getElementById('commentInput');
    input.value = '';
}

function renderComments(videoId) {
    const commentsList = document.getElementById('commentsList');
    const commentCount = document.getElementById('commentCount');
    const comments = commentsDB[videoId] || [];
    
    commentCount.textContent = comments.length;
    
    if (comments.length === 0) {
        commentsList.innerHTML = `
            <div class="no-comments">
                <i class="far fa-comment-dots"></i>
                <p>Seja o primeiro a comentar!</p>
            </div>
        `;
        return;
    }
    
    commentsList.innerHTML = comments.map(c => `
        <div class="comment-item" data-id="${c.id}">
            <div class="comment-avatar">
                <i class="fas fa-user-circle"></i>
            </div>
            <div class="comment-content">
                <div class="comment-header">
                    <span class="comment-author">${c.author}</span>
                    <span class="comment-time">${c.time}</span>
                </div>
                <div class="comment-text">${escapeHtml(c.text)}</div>
                <div class="comment-actions-bar">
                    <div class="comment-action ${c.liked ? 'liked' : ''}" onclick="toggleLikeComment(${c.id}, '${videoId}')">
                        <i class="fas fa-thumbs-up"></i>
                        <span>${c.likes || 0}</span>
                    </div>
                    <div class="comment-action" onclick="replyComment(${c.id})">
                        <i class="fas fa-reply"></i>
                        <span>Responder</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function toggleLikeComment(commentId, videoId) {
    const comments = commentsDB[videoId] || [];
    const comment = comments.find(c => c.id === commentId);
    if (!comment) return;
    
    comment.liked = !comment.liked;
    comment.likes = (comment.likes || 0) + (comment.liked ? 1 : -1);
    
    localStorage.setItem('risadatube_comments', JSON.stringify(commentsDB));
    renderComments(videoId);
}

function replyComment(commentId) {
    const input = document.getElementById('commentInput');
    input.focus();
    input.placeholder = 'Responder ao comentário...';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
