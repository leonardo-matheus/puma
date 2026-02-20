<?php
require_once __DIR__ . '/../config/database.php';

class Banner {
    private PDO $db;
    private Database $database;

    public function __construct() {
        $this->database = new Database();
        $this->db = $this->database->getConnection();
    }

    public function getAll(bool $activeOnly = false): array {
        $sql = "SELECT * FROM banners";
        if ($activeOnly) {
            $sql .= " WHERE active = 1";
        }
        $sql .= " ORDER BY `order` ASC, created_at DESC";

        $stmt = $this->db->query($sql);
        return array_map([$this, 'format'], $stmt->fetchAll());
    }

    public function getById(string $id): ?array {
        $sql = "SELECT * FROM banners WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id' => $id]);
        $banner = $stmt->fetch();
        return $banner ? $this->format($banner) : null;
    }

    public function create(array $data): array {
        $id = $this->database->generateUUID();

        $sql = "INSERT INTO banners (id, title, subtitle, image_url, link, active, `order`)
                VALUES (:id, :title, :subtitle, :image_url, :link, :active, :order)";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':id' => $id,
            ':title' => $data['title'] ?? null,
            ':subtitle' => $data['subtitle'] ?? null,
            ':image_url' => $data['imageUrl'],
            ':link' => $data['link'] ?? null,
            ':active' => $data['active'] ?? 1,
            ':order' => $data['order'] ?? 0,
        ]);

        return $this->getById($id);
    }

    public function update(string $id, array $data): ?array {
        $fields = [];
        $params = [':id' => $id];

        $fieldMap = [
            'title' => 'title',
            'subtitle' => 'subtitle',
            'imageUrl' => 'image_url',
            'link' => 'link',
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

        $sql = "UPDATE banners SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);

        return $this->getById($id);
    }

    public function delete(string $id): bool {
        $stmt = $this->db->prepare("DELETE FROM banners WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }

    private function format(array $banner): array {
        return [
            'id' => $banner['id'],
            'title' => $banner['title'],
            'subtitle' => $banner['subtitle'],
            'imageUrl' => $banner['image_url'],
            'link' => $banner['link'],
            'active' => (bool) $banner['active'],
            'order' => (int) $banner['order'],
            'createdAt' => $banner['created_at'],
            'updatedAt' => $banner['updated_at'],
        ];
    }
}
