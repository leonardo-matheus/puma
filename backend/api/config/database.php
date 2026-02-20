<?php
/**
 * Configuração de conexão com o banco de dados MySQL
 */

class Database {
    private $host = 'sql101.infinityfree.com';
    private $database = 'if0_41206978_puma';
    private $username = 'if0_41206978';
    private $password = 'yiERMV936cmVm4U';
    private $charset = 'utf8mb4';
    private $pdo = null;

    public function __construct() {
        // Permite sobrescrever configurações via variáveis de ambiente
        $this->host = getenv('DB_HOST') ?: $this->host;
        $this->database = getenv('DB_NAME') ?: $this->database;
        $this->username = getenv('DB_USER') ?: $this->username;
        $this->password = getenv('DB_PASS') ?: $this->password;
    }

    public function getConnection(): PDO {
        if ($this->pdo === null) {
            try {
                $dsn = "mysql:host={$this->host};dbname={$this->database};charset={$this->charset}";
                $options = [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ];
                $this->pdo = new PDO($dsn, $this->username, $this->password, $options);
            } catch (PDOException $e) {
                http_response_code(500);
                die(json_encode(['error' => 'Erro de conexão com o banco de dados']));
            }
        }
        return $this->pdo;
    }

    public function generateUUID(): string {
        return sprintf(
            '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
    }
}
