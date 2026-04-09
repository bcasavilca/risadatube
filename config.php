<?php
// config.php - Configurações do RisadaTube

// Configurações do banco de dados
// ALTERAR ESTES VALORES conforme o teu ProFreeHost:

// Exemplo ProFreeHost:
// Host: geralmente 'localhost' ou o IP fornecido
// Database: geralmente 'seuusuario_risadatube'
// Username: geralmente 'seuusuario_risadatube' ou 'seuusuario'
// Password: a password que definiste

define('DB_HOST', 'sql313.ezyro.com');
define('DB_NAME', 'ezyro_41623262_Risada');
define('DB_USER', 'ezyro_41623262');
define('DB_PASS', 'COLOCA_A_TUA_PASSWORD_AQUI'); // <-- ALTERA ISTO

// Configurações de upload
define('UPLOAD_DIR', 'uploads/');
define('MAX_FILE_SIZE', 100 * 1024 * 1024); // 100MB
define('ALLOWED_TYPES', json_encode([
    'video/mp4', 'video/avi', 'video/mov', 'video/webm', 
    'video/quicktime', 'video/x-msvideo', 'video/x-matroska',
    'image/jpeg', 'image/png', 'image/gif', 'image/webp'
]));

// Configurações do site
define('SITE_URL', 'https://' . $_SERVER['HTTP_HOST']);
define('SITE_NAME', 'RisadaTube');

// Conexão com o banco de dados
function getDB() {
    static $pdo = null;
    
    if ($pdo === null) {
        try {
            $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
            $pdo = new PDO($dsn, DB_USER, DB_PASS);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log('Database connection failed: ' . $e->getMessage());
            return null;
        }
    }
    
    return $pdo;
}

// Resposta JSON padronizada
function jsonResponse($success, $data = [], $error = '') {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => $success,
        'data' => $data,
        'error' => $error,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    exit;
}

// Verificar autenticação (token JWT simples ou session)
function checkAuth() {
    // Para já, usar localStorage no frontend
    // No futuro, implementar JWT ou sessions
    return true;
}

// Gerar ID único
function generateId() {
    return uniqid() . '_' . time();
}
?