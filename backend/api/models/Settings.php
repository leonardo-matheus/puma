<?php
require_once __DIR__ . '/../config/database.php';

class Settings {
    private PDO $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    public function get(): array {
        $sql = "SELECT * FROM settings WHERE id = 'settings'";
        $stmt = $this->db->query($sql);
        $settings = $stmt->fetch();

        if (!$settings) {
            // Criar configurações padrão se não existirem
            $this->db->exec("INSERT INTO settings (id) VALUES ('settings')");
            return $this->get();
        }

        return $this->format($settings);
    }

    public function update(array $data): array {
        $fields = [];
        $params = [':id' => 'settings'];

        $fieldMap = [
            'companyName' => 'company_name',
            'description' => 'description',
            'email' => 'email',
            'phone' => 'phone',
            'whatsapp' => 'whatsapp',
            'address' => 'address',
            'workingHours' => 'working_hours',
            'facebook' => 'facebook',
            'instagram' => 'instagram',
            'logoUrl' => 'logo_url',
            'bannerUrl' => 'banner_url',
        ];

        foreach ($fieldMap as $input => $column) {
            if (array_key_exists($input, $data)) {
                $fields[] = "$column = :$input";
                $params[":$input"] = $data[$input];
            }
        }

        if (!empty($fields)) {
            $sql = "UPDATE settings SET " . implode(', ', $fields) . " WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
        }

        return $this->get();
    }

    private function format(array $settings): array {
        return [
            'id' => $settings['id'],
            'companyName' => $settings['company_name'],
            'description' => $settings['description'],
            'email' => $settings['email'],
            'phone' => $settings['phone'],
            'whatsapp' => $settings['whatsapp'],
            'address' => $settings['address'],
            'workingHours' => $settings['working_hours'],
            'facebook' => $settings['facebook'],
            'instagram' => $settings['instagram'],
            'logoUrl' => $settings['logo_url'],
            'bannerUrl' => $settings['banner_url'],
        ];
    }
}
