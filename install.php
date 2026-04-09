<?php
// install.php - Cria as tabelas automaticamente

require_once 'config.php';

header('Content-Type: text/html; charset=utf-8');

echo "<h1>🔧 Instalação RisadaTube</h1>";

$db = getDB();

if (!$db) {
    echo "<p style='color:red'>❌ Erro ao conectar ao banco de dados! Verifica config.php</p>";
    exit;
}

echo "<p>✅ Conexão com banco de dados OK!</p>";

try {
    // Criar tabela users
    $db->exec("CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    echo "<p>✅ Tabela 'users' criada!</p>";
    
    // Criar tabela videos
    $db->exec("CREATE TABLE IF NOT EXISTS videos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(50) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        thumbnail_path VARCHAR(500),
        file_type ENUM('video', 'photo') NOT NULL,
        file_size BIGINT NOT NULL,
        duration VARCHAR(20),
        is_public BOOLEAN DEFAULT TRUE,
        views INT DEFAULT 0,
        likes INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    echo "<p>✅ Tabela 'videos' criada!</p>";
    
    // Criar tabela comments
    $db->exec("CREATE TABLE IF NOT EXISTS comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        video_id INT NOT NULL,
        user_id INT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    echo "<p>✅ Tabela 'comments' criada!</p>";
    
    echo "<div style='background:#4CAF50;color:white;padding:20px;margin-top:20px;border-radius:10px;'>";
    echo "<h2>🎉 Instalação completa!</h2>";
    echo "<p>As tabelas foram criadas com sucesso.</p>";
    echo "<p><a href='index.html' style='color:white;'>Ir para o site →</a></p>";
    echo "</div>";
    
} catch (PDOException $e) {
    echo "<p style='color:red'>❌ Erro: " . $e->getMessage() . "</p>";
}
?