<?php
require_once __DIR__ . '/../config/database.php';

class Seller {
    private PDO $db;
    private Database $database;

    public function __construct() {
        $this->database = new Database();
        $this->db = $this->database->getConnection();
    }

    public function getAll(bool $activeOnly = false): array {
        $sql = "SELECT * FROM sellers";
        if ($activeOnly) {
            $sql .= " WHERE active = 1";
        }
        $sql .= " ORDER BY `order` ASC, name ASC";

        $stmt = $this->db->query($sql);
        return array_map([$this, 'format'], $stmt->fetchAll());
    }

    public function getById(string $id): ?array {
        $sql = "SELECT * FROM sellers WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id' => $id]);
        $seller = $stmt->fetch();
        return $seller ? $this->format($seller) : null;
    }

    public function create(array $data): array {
        $id = $this->database->generateUUID();

        $sql = "INSERT INTO sellers (id, name, phone, whatsapp, active, `order`)
                VALUES (:id, :name, :phone, :whatsapp, :active, :order)";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':id' => $id,
            ':name' => $data['name'],
            ':phone' => $data['phone'],
            ':whatsapp' => $data['whatsapp'],
            ':active' => $data['active'] ?? 1,
            ':order' => $data['order'] ?? 0,
        ]);

        return $this->getById($id);
    }

    public function update(string $id, array $data): ?array {
        $fields = [];
        $params = [':id' => $id];

        $fieldMap = [
            'name' => 'name',
            'phone' => 'phone',
            'whatsapp' => 'whatsapp',
            'active' => 'active',
            'order' => '`order`',
        ];

        foreach ($fieldMap as $input => $column) {
            if (array_key_exists($input, $data)) {
                $fields[] = "$column = :$input";
                $params[":$input"] = $data[$input];
            }
        }

        if (empty($fields)) {
            return $this->getById($id);
        }

        $sql = "UPDATE sellers SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);

        return $this->getById($id);
    }

    public function delete(string $id): bool {
        $stmt = $this->db->prepare("DELETE FROM sellers WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }

    private function format(array $seller): array {
        return [
            'id' => $seller['id'],
            'name' => $seller['name'],
            'phone' => $seller['phone'],
            'whatsapp' => $seller['whatsapp'],
            'active' => (bool) $seller['active'],
            'order' => (int) $seller['order'],
            'createdAt' => $seller['created_at'],
        ];
    }
}
