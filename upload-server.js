// Upload System - Versão Server (PHP Backend)

let currentFile = null;
let currentType = 'video';

// Server endpoint
const API_URL = ''; // Mesmo diretório

// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
    const user = checkAuth ? checkAuth() : null;
    if (!user) {
        // Permite upload mesmo sem login, mas guarda como anónimo
        console.log('Upload anónimo');
    }
    
    if (updateAuthUI) updateAuthUI();
    loadMyUploads();
    setupDragAndDrop();
});

// Switch between Video and Photo tabs
function switchTab(type) {
    currentType = type;
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`tab-${type}`).classList.add('active');
    
    const fileInput = document.getElementById('fileInput');
    if (type === 'video') {
        fileInput.accept = 'video/*';
    } else {
        fileInput.accept = 'image/*';
    }
    
    resetUpload();
}

// Setup drag and drop
function setupDragAndDrop() {
    const dropZone = document.getElementById('dropZone');
    
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });
    
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });
}

// Handle file selection
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        handleFile(file);
    }
}

// Handle file
function handleFile(file) {
    if (currentType === 'video' && !file.type.startsWith('video/')) {
        alert('Por favor selecione um ficheiro de vídeo');
        return;
    }
    if (currentType === 'photo' && !file.type.startsWith('image/')) {
        alert('Por favor selecione uma imagem');
        return;
    }
    
    if (file.size > 100 * 1024 * 1024) {
        alert('Ficheiro muito grande. Máximo 100MB');
        return;
    }
    
    currentFile = file;
    showPreview(file);
    document.getElementById('uploadForm').style.display = 'block';
    document.getElementById('dropZone').style.display = 'none';
}

// Show preview
function showPreview(file) {
    const previewArea = document.getElementById('previewArea');
    const videoPreview = document.getElementById('videoPreview');
    const imagePreview = document.getElementById('imagePreview');
    
    previewArea.style.display = 'block';
    
    const url = URL.createObjectURL(file);
    
    if (file.type.startsWith('video/')) {
        videoPreview.style.display = 'block';
        imagePreview.style.display = 'none';
        videoPreview.src = url;
    } else {
        videoPreview.style.display = 'none';
        imagePreview.style.display = 'block';
        imagePreview.src = url;
    }
}

// Handle upload form submission - ENVIAR PARA SERVIDOR
async function handleUpload(event) {
    event.preventDefault();
    
    if (!currentFile) {
        alert('Selecione um ficheiro primeiro');
        return;
    }
    
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    
    if (!title || !category) {
        alert('Preencha título e categoria');
        return;
    }
    
    // Mostrar progresso
    const progressArea = document.getElementById('uploadProgress');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const submitBtn = document.getElementById('submitBtn');
    
    progressArea.style.display = 'block';
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    
    // Criar FormData para enviar
    const formData = new FormData();
    formData.append('video', currentFile);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    
    try {
        // Enviar para o servidor PHP
        const response = await fetch('upload.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Guardar metadados no localStorage também
            saveVideoMetadata({
                id: Date.now().toString(),
                title: title,
                description: description,
                category: category,
                fileName: result.file.name,
                fileUrl: result.file.url,
                thumbnail: file.type.startsWith('image/') ? result.file.url : '',
                type: currentType,
                createdAt: new Date().toISOString()
            });
            
            alert('Upload realizado com sucesso!');
            resetUpload();
            loadMyUploads();
        } else {
            alert('Erro: ' + (result.error || 'Erro desconhecido'));
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao enviar. Verifica a conexão.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-upload"></i> Publicar';
    }
}

// Guardar metadados no localStorage
function saveVideoMetadata(videoData) {
    const uploads = JSON.parse(localStorage.getItem('risadatube_uploads') || '[]');
    uploads.unshift(videoData);
    localStorage.setItem('risadatube_uploads', JSON.stringify(uploads));
    
    // Também adicionar aos vídeos públicos
    const publicVideos = JSON.parse(localStorage.getItem('risadatube_public_videos') || '[]');
    publicVideos.unshift({
        id: `user_${videoData.id}`,
        title: videoData.title,
        thumbnail: videoData.thumbnail || 'https://via.placeholder.com/640x360/1a1a2e/ff6b35?text=Video',
        duration: videoData.type === 'video' ? '0:00' : 'Foto',
        views: '0',
        date: 'Agora',
        category: videoData.category,
        youtubeId: null,
        isUserUpload: true,
        fileUrl: videoData.fileUrl
    });
    localStorage.setItem('risadatube_public_videos', JSON.stringify(publicVideos));
}

// Reset upload form
function resetUpload() {
    currentFile = null;
    
    document.getElementById('fileInput').value = '';
    document.getElementById('uploadForm').style.display = 'none';
    document.getElementById('uploadForm').reset();
    document.getElementById('previewArea').style.display = 'none';
    document.getElementById('dropZone').style.display = 'block';
    document.getElementById('uploadProgress').style.display = 'none';
    document.getElementById('progressFill').style.width = '0%';
    document.getElementById('progressText').textContent = '0%';
    
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-upload"></i> Publicar';
}

// Load my uploads
function loadMyUploads() {
    const uploads = JSON.parse(localStorage.getItem('risadatube_uploads') || '[]');
    
    const container = document.getElementById('uploadsGrid');
    
    if (uploads.length === 0) {
        container.innerHTML = `
            <div class="no-uploads">
                <i class="fas fa-inbox"></i>
                <p>Ainda não fez nenhum upload</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = uploads.map(upload => `
        <div class="upload-item">
            <div class="upload-item-thumb">
                <img src="${upload.thumbnail || 'https://via.placeholder.com/640x360/1a1a2e/ff6b35?text=Video'}" alt="${upload.title}">
                <span class="upload-item-type">${upload.type === 'video' ? 'Vídeo' : 'Foto'}</span>
            </div>
            <div class="upload-item-info">
                <div class="upload-item-title">${upload.title}</div>
                <div class="upload-item-meta">
                    ${upload.category}
                </div>
            </div>
        </div>
    `).join('');
}

function clearCommentInput() {
    const input = document.getElementById('commentInput');
    if (input) input.value = '';
}

function submitComment() {
    // Implementação básica
    console.log('Comentário enviado');
}

function toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) dropdown.classList.toggle('active');
}

document.addEventListener('click', (e) => {
    const userMenu = document.getElementById('userMenu');
    const dropdown = document.getElementById('userDropdown');
    
    if (userMenu && dropdown && !userMenu.contains(e.target)) {
        dropdown.classList.remove('active');
    }
});