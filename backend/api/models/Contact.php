<?php
require_once __DIR__ . '/../config/database.php';

class Contact {
    private PDO $db;
    private Database $database;

    public function __construct() {
        $this->database = new Database();
        $this->db = $this->database->getConnection();
    }

    public function getAll(): array {
        $sql = "SELECT * FROM contacts ORDER BY created_at DESC";
        $stmt = $this->db->query($sql);
        return array_map([$this, 'format'], $stmt->fetchAll());
    }

    public function getById(string $id): ?array {
        $sql = "SELECT * FROM contacts WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id' => $id]);
        $contact = $stmt->fetch();
        return $contact ? $this->format($contact) : null;
    }

    public function create(array $data): array {
        $id = $this->database->generateUUID();

        $sql = "INSERT INTO contacts (id, name, email, phone, message, vehicle_id)
                VALUES (:id, :name, :email, :phone, :message, :vehicle_id)";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':id' => $id,
            ':name' => $data['name'],
            ':email' => $data['email'],
            ':phone' => $data['phone'],
            ':message' => $data['message'],
            ':vehicle_id' => $data['vehicleId'] ?? null,
        ]);

        return $this->getById($id);
    }

    public function markAsRead(string $id): ?array {
        $sql = "UPDATE contacts SET `read` = 1 WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id' => $id]);
        return $this->getById($id);
    }

    public function delete(string $id): bool {
        $stmt = $this->db->prepare("DELETE FROM contacts WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }

    public function getUnreadCount(): int {
        $sql = "SELECT COUNT(*) as count FROM contacts WHERE `read` = 0";
        $stmt = $this->db->query($sql);
        return (int) $stmt->fetch()['count'];
    }

    private function format(array $contact): array {
        return [
            'id' => $contact['id'],
            'name' => $contact['name'],
            'email' => $contact['email'],
            'phone' => $contact['phone'],
            'message' => $contact['message'],
            'vehicleId' => $contact['vehicle_id'],
            'read' => (bool) $contact['read'],
            'createdAt' => $contact['created_at'],
        ];
    }
}
