<?php
require_once __DIR__ . '/../config/database.php';

class Evaluation {
    private PDO $db;
    private Database $database;

    public function __construct() {
        $this->database = new Database();
        $this->db = $this->database->getConnection();
    }

    public function getAll(): array {
        $sql = "SELECT * FROM evaluations ORDER BY created_at DESC";
        $stmt = $this->db->query($sql);
        return array_map([$this, 'format'], $stmt->fetchAll());
    }

    public function getById(string $id): ?array {
        $sql = "SELECT * FROM evaluations WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id' => $id]);
        $evaluation = $stmt->fetch();
        return $evaluation ? $this->format($evaluation) : null;
    }

    public function create(array $data): array {
        $id = $this->database->generateUUID();

        $sql = "INSERT INTO evaluations (id, name, email, phone, brand, model, year, mileage, description)
                VALUES (:id, :name, :email, :phone, :brand, :model, :year, :mileage, :description)";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':id' => $id,
            ':name' => $data['name'],
            ':email' => $data['email'],
            ':phone' => $data['phone'],
            ':brand' => $data['brand'],
            ':model' => $data['model'],
            ':year' => $data['year'],
            ':mileage' => $data['mileage'],
            ':description' => $data['description'] ?? null,
        ]);

        return $this->getById($id);
    }

    public function updateStatus(string $id, string $status): ?array {
        $sql = "UPDATE evaluations SET status = :status WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id' => $id, ':status' => $status]);
        return $this->getById($id);
    }

    public function delete(string $id): bool {
        $stmt = $this->db->prepare("DELETE FROM evaluations WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }

    public function getPendingCount(): int {
        $sql = "SELECT COUNT(*) as count FROM evaluations WHERE status = 'pending'";
        $stmt = $this->db->query($sql);
        return (int) $stmt->fetch()['count'];
    }

    private function format(array $evaluation): array {
        return [
            'id' => $evaluation['id'],
            'name' => $evaluation['name'],
            'email' => $evaluation['email'],
            'phone' => $evaluation['phone'],
            'brand' => $evaluation['brand'],
            'model' => $evaluation['model'],
            'year' => (int) $evaluation['year'],
            'mileage' => (int) $evaluation['mileage'],
            'description' => $evaluation['description'],
            'status' => $evaluation['status'],
            'createdAt' => $evaluation['created_at'],
        ];
    }
}
