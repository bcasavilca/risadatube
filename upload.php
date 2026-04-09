<?php
// upload.php - Backend para receber vídeos e fotos

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Configurações
$uploadDir = 'uploads/';
$maxFileSize = 100 * 1024 * 1024; // 100MB
$allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/webm', 'image/jpeg', 'image/png', 'image/gif'];

// Criar diretório se não existir
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// Verificar se é POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Método não permitido']);
    exit;
}

// Verificar se tem ficheiro
if (!isset($_FILES['video'])) {
    echo json_encode(['success' => false, 'error' => 'Nenhum ficheiro enviado']);
    exit;
}

$file = $_FILES['video'];

// Verificar erros
if ($file['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['success' => false, 'error' => 'Erro no upload: ' . $file['error']]);
    exit;
}

// Verificar tamanho
if ($file['size'] > $maxFileSize) {
    echo json_encode(['success' => false, 'error' => 'Ficheiro muito grande (máx 100MB)']);
    exit;
}

// Verificar tipo
$fileType = mime_content_type($file['tmp_name']);
if (!in_array($fileType, $allowedTypes)) {
    echo json_encode(['success' => false, 'error' => 'Tipo de ficheiro não permitido: ' . $fileType]);
    exit;
}

// Gerar nome único
$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$fileName = uniqid() . '_' . time() . '.' . $extension;
$filePath = $uploadDir . $fileName;

// Mover ficheiro
if (move_uploaded_file($file['tmp_name'], $filePath)) {
    // Gerar thumbnail se for vídeo
    $thumbnail = '';
    if (strpos($fileType, 'video/') === 0) {
        $thumbnail = generateThumbnail($filePath, $uploadDir, pathinfo($fileName, PATHINFO_FILENAME));
    }
    
    echo json_encode([
        'success' => true,
        'file' => [
            'name' => $fileName,
            'path' => $filePath,
            'url' => 'https://' . $_SERVER['HTTP_HOST'] . '/' . $filePath,
            'thumbnail' => $thumbnail,
            'size' => $file['size'],
            'type' => $fileType
        ]
    ]);
} else {
    echo json_encode(['success' => false, 'error' => 'Erro ao mover ficheiro']);
}

// Função para gerar thumbnail (FFmpeg necessário)
function generateThumbnail($videoPath, $uploadDir, $fileName) {
    $thumbnailName = $uploadDir . 'thumbs/' . $fileName . '.jpg';
    
    // Criar pasta de thumbnails
    if (!file_exists($uploadDir . 'thumbs/')) {
        mkdir($uploadDir . 'thumbs/', 0777, true);
    }
    
    // Tentar gerar thumbnail com FFmpeg (se disponível)
    $ffmpeg = shell_exec('which ffmpeg');
    if ($ffmpeg) {
        $cmd = "ffmpeg -i " . escapeshellarg($videoPath) . " -ss 00:00:01 -vframes 1 " . escapeshellarg($thumbnailName) . " 2>/dev/null";
        shell_exec($cmd);
        
        if (file_exists($thumbnailName)) {
            return 'https://' . $_SERVER['HTTP_HOST'] . '/' . $thumbnailName;
        }
    }
    
    // Se não conseguir, retornar placeholder
    return 'https://' . $_SERVER['HTTP_HOST'] . '/uploads/thumbs/default.jpg';
}
?