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

// Abrir vídeo no modal
function openVideo(videoId) {
    const video = videos.find(v => v.id === videoId);
    if (!video) return;

    const modal = document.getElementById('videoModal');
    const container = document.getElementById('videoContainer');
    const info = document.getElementById('videoInfo');

    // Pegar recomendações (vídeos da mesma categoria, excluindo o atual)
    const recommendations = videos
        .filter(v => v.category === video.category && v.id !== video.id)
        .slice(0, 4);

    // Se não tiver enough da mesma categoria, pegar aleatórios
    if (recommendations.length < 4) {
        const otherVideos = videos.filter(v => v.id !== video.id && !recommendations.includes(v));
        while (recommendations.length < 4 && otherVideos.length > 0) {
            recommendations.push(otherVideos.shift());
        }
    }

    // Criar HTML das recomendações
    const recsHTML = recommendations.map(rec => `
        <div class="rec-card" onclick="openVideo('${rec.id}')">
            <div class="rec-thumbnail">
                <img src="${rec.thumbnail}" alt="${rec.title}">
                <span class="rec-duration">${rec.duration}</span>
            </div>
            <div class="rec-info">
                <div class="rec-title">${rec.title}</div>
                <div class="rec-views">${rec.views} views</div>
            </div>
        </div>
    `).join('');

    container.innerHTML = `
        <div class="video-layout">
            <div class="main-video">
                <iframe src="https://www.youtube.com/embed/${video.youtubeId}?autoplay=1" 
                        allowfullscreen>
                </iframe>
            </div>
            <div class="recommendations">
                <h3><i class="fas fa-fire"></i> Recomendados</h3>
                ${recsHTML}
            </div>
        </div>
    `;

    info.innerHTML = `
        <div style="padding: 20px;">
            <h2 style="margin-bottom: 10px;">${video.title}</h2>
            <div class="video-meta" style="font-size: 1rem;">
                <span><i class="fas fa-eye"></i> ${video.views} visualizações</span>
                <span><i class="fas fa-calendar"></i> ${video.date}</span>
                <span><i class="fas fa-tag"></i> ${video.category}</span>
            </div>
        </div>
    `;

    modal.classList.add('active');
}

// Fechar vídeo
function closeVideo() {
    const modal = document.getElementById('videoModal');
    const container = document.getElementById('videoContainer');
    
    container.innerHTML = '';
    modal.classList.remove('active');
}

// Toggle menu mobile
function toggleMenu() {
    document.getElementById('sidebar').classList.toggle('active');
}

// Fechar modal ao clicar fora
document.getElementById('videoModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeVideo();
    }
});

// Busca ao pressionar Enter
document.getElementById('searchInput')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchVideos();
    }
});

// Inicializar
renderVideos(videos);
