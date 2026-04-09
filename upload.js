// Upload System

let currentFile = null;
let currentType = 'video';

// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
    const user = checkAuth();
    if (!user) {
        window.location.href = 'signin.html';
        return;
    }
    
    updateAuthUI();
    loadMyUploads();
    setupDragAndDrop();
});

// Switch between Video and Photo tabs
function switchTab(type) {
    currentType = type;
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`tab-${type}`).classList.add('active');
    
    // Update file input accept
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
    // Validate file type
    if (currentType === 'video' && !file.type.startsWith('video/')) {
        alert('Por favor selecione um ficheiro de vídeo');
        return;
    }
    if (currentType === 'photo' && !file.type.startsWith('image/')) {
        alert('Por favor selecione uma imagem');
        return;
    }
    
    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
        alert('Ficheiro muito grande. Máximo 50MB');
        return;
    }
    
    currentFile = file;
    
    // Show preview
    showPreview(file);
    
    // Show form
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

// Handle upload form submission
function handleUpload(event) {
    event.preventDefault();
    
    if (!currentFile) {
        alert('Selecione um ficheiro primeiro');
        return;
    }
    
    const user = checkAuth();
    if (!user) {
        alert('Faça login primeiro');
        return;
    }
    
    // Get form values
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    const tags = document.getElementById('tags').value;
    const isPublic = document.getElementById('isPublic').checked;
    
    // Show progress
    const progressArea = document.getElementById('uploadProgress');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const submitBtn = document.getElementById('submitBtn');
    
    progressArea.style.display = 'block';
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // Generate thumbnail first (async)
            generateThumbnail(function(thumbnailData) {
                finishUpload({
                    id: Date.now().toString(),
                    title,
                    description,
                    category,
                    tags,
                    isPublic,
                    type: currentType,
                    fileName: currentFile.name,
                    fileSize: currentFile.size,
                    userId: user.id,
                    userName: user.username,
                    createdAt: new Date().toISOString(),
                    views: '0',
                    likes: 0,
                    thumbnail: thumbnailData
                });
            });
        }
        
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${Math.round(progress)}%`;
    }, 200);
}

// Generate thumbnail - converte para base64 para persistência
function generateThumbnail(callback) {
    if (currentType === 'photo') {
        const reader = new FileReader();
        reader.onload = function(e) {
            callback(e.target.result);
        };
        reader.readAsDataURL(currentFile);
    } else {
        // For video, use a default thumbnail
        callback('https://via.placeholder.com/640x360/1a1a2e/ff6b35?text=Video');
    }
}

// Finish upload
function finishUpload(uploadData) {
    // Save to localStorage
    const uploads = JSON.parse(localStorage.getItem('risadatube_uploads') || '[]');
    uploads.unshift(uploadData);
    localStorage.setItem('risadatube_uploads', JSON.stringify(uploads));
    
    // Also add to videos if public
    if (uploadData.isPublic) {
        addToVideos(uploadData);
    }
    
    // Reset form
    resetUpload();
    
    // Show success
    alert('Upload realizado com sucesso!');
    
    // Reload uploads list
    loadMyUploads();
}

// Add to videos array
function addToVideos(uploadData) {
    // In a real app, this would update the server
    // For now, we just store it locally
    const publicVideos = JSON.parse(localStorage.getItem('risadatube_public_videos') || '[]');
    
    const videoData = {
        id: `user_${uploadData.id}`,
        title: uploadData.title,
        thumbnail: uploadData.thumbnail,
        duration: uploadData.type === 'video' ? '0:00' : 'Foto',
        views: '0',
        date: 'Agora',
        category: uploadData.category,
        youtubeId: null,
        isUserUpload: true,
        userId: uploadData.userId,
        userName: uploadData.userName
    };
    
    publicVideos.unshift(videoData);
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
    const user = checkAuth();
    if (!user) return;
    
    const uploads = JSON.parse(localStorage.getItem('risadatube_uploads') || '[]');
    const myUploads = uploads.filter(u => u.userId === user.id);
    
    const container = document.getElementById('uploadsGrid');
    
    if (myUploads.length === 0) {
        container.innerHTML = `
            <div class="no-uploads">
                <i class="fas fa-inbox"></i>
                <p>Ainda não fez nenhum upload</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = myUploads.map(upload => `
        <div class="upload-item">
            <div class="upload-item-thumb">
                <img src="${upload.thumbnail}" alt="${upload.title}">
                <span class="upload-item-type">${upload.type === 'video' ? 'Vídeo' : 'Foto'}</span>
                <div class="upload-item-actions">
                    <button onclick="deleteUpload('${upload.id}')" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="upload-item-info">
                <div class="upload-item-title">${escapeHtml(upload.title)}</div>
                <div class="upload-item-meta">
                    ${upload.category} • ${formatDate(upload.createdAt)}
                </div>
            </div>
        </div>
    `).join('');
}

// Delete upload
function deleteUpload(uploadId) {
    if (!confirm('Tem certeza que deseja eliminar este upload?')) return;
    
    let uploads = JSON.parse(localStorage.getItem('risadatube_uploads') || '[]');
    uploads = uploads.filter(u => u.id !== uploadId);
    localStorage.setItem('risadatube_uploads', JSON.stringify(uploads));
    
    // Also remove from public videos
    let publicVideos = JSON.parse(localStorage.getItem('risadatube_public_videos') || '[]');
    publicVideos = publicVideos.filter(v => v.id !== `user_${uploadId}`);
    localStorage.setItem('risadatube_public_videos', JSON.stringify(publicVideos));
    
    loadMyUploads();
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return 'Agora';
    if (diff < 3600) return `${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} h`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} d`;
    return date.toLocaleDateString('pt-BR');
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Toggle user dropdown
function toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('active');
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const userMenu = document.getElementById('userMenu');
    const dropdown = document.getElementById('userDropdown');
    
    if (userMenu && !userMenu.contains(e.target)) {
        dropdown?.classList.remove('active');
    }
});