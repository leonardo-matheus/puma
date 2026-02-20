<?php
require_once __DIR__ . '/../config/database.php';

class User {
    private PDO $db;
    private Database $database;

    public function __construct() {
        $this->database = new Database();
        $this->db = $this->database->getConnection();
    }

    public function getByEmail(string $email): ?array {
        $sql = "SELECT * FROM users WHERE email = :email";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':email' => $email]);
        return $stmt->fetch() ?: null;
    }

    public function getById(string $id): ?array {
        $sql = "SELECT id, email, name, role, created_at FROM users WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id' => $id]);
        $user = $stmt->fetch();
        return $user ? $this->format($user) : null;
    }

    public function create(array $data): array {
        $id = $this->database->generateUUID();
        $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT, ['cost' => 12]);

        $sql = "INSERT INTO users (id, email, password, name, role)
                VALUES (:id, :email, :password, :name, :role)";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':id' => $id,
            ':email' => $data['email'],
            ':password' => $hashedPassword,
            ':name' => $data['name'],
            ':role' => $data['role'] ?? 'admin',
        ]);

        return $this->getById($id);
    }

    public function verifyPassword(string $password, string $hashedPassword): bool {
        return password_verify($password, $hashedPassword);
    }

    public function updatePassword(string $id, string $newPassword): bool {
        $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT, ['cost' => 12]);
        $sql = "UPDATE users SET password = :password WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([':id' => $id, ':password' => $hashedPassword]);
    }

    private function format(array $user): array {
        return [
            'id' => $user['id'],
            'email' => $user['email'],
            'name' => $user['name'],
            'role' => $user['role'],
            'createdAt' => $user['created_at'] ?? null,
        ];
    }
}
