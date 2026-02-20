<?php
require_once __DIR__ . '/../config/database.php';

class Vehicle {
    private PDO $db;
    private Database $database;

    public function __construct() {
        $this->database = new Database();
        $this->db = $this->database->getConnection();
    }

    public function getAll(array $filters = []): array {
        $sql = "SELECT v.*,
                GROUP_CONCAT(DISTINCT vi.url ORDER BY vi.order) as image_urls,
                GROUP_CONCAT(DISTINCT vo.name) as optional_names
                FROM vehicles v
                LEFT JOIN vehicle_images vi ON v.id = vi.vehicle_id
                LEFT JOIN vehicle_optionals vo ON v.id = vo.vehicle_id
                WHERE v.sold = 0";

        $params = [];

        if (!empty($filters['brand'])) {
            $sql .= " AND v.brand = :brand";
            $params[':brand'] = $filters['brand'];
        }

        if (!empty($filters['minPrice'])) {
            $sql .= " AND v.price >= :minPrice";
            $params[':minPrice'] = $filters['minPrice'];
        }

        if (!empty($filters['maxPrice'])) {
            $sql .= " AND v.price <= :maxPrice";
            $params[':maxPrice'] = $filters['maxPrice'];
        }

        if (!empty($filters['minYear'])) {
            $sql .= " AND v.year >= :minYear";
            $params[':minYear'] = $filters['minYear'];
        }

        if (!empty($filters['maxYear'])) {
            $sql .= " AND v.year <= :maxYear";
            $params[':maxYear'] = $filters['maxYear'];
        }

        if (!empty($filters['fuel'])) {
            $sql .= " AND v.fuel = :fuel";
            $params[':fuel'] = $filters['fuel'];
        }

        if (!empty($filters['transmission'])) {
            $sql .= " AND v.transmission = :transmission";
            $params[':transmission'] = $filters['transmission'];
        }

        if (!empty($filters['search'])) {
            $sql .= " AND (v.brand LIKE :search OR v.model LIKE :search OR v.version LIKE :search)";
            $params[':search'] = '%' . $filters['search'] . '%';
        }

        if (!empty($filters['featured'])) {
            $sql .= " AND v.featured = 1";
        }

        $sql .= " GROUP BY v.id ORDER BY v.featured DESC, v.created_at DESC";

        if (!empty($filters['limit'])) {
            $sql .= " LIMIT " . intval($filters['limit']);
        }

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $vehicles = $stmt->fetchAll();

        return array_map([$this, 'formatVehicle'], $vehicles);
    }

    public function getById(string $id): ?array {
        $sql = "SELECT v.* FROM vehicles v WHERE v.id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id' => $id]);
        $vehicle = $stmt->fetch();

        if (!$vehicle) {
            return null;
        }

        // Buscar imagens
        $sqlImages = "SELECT * FROM vehicle_images WHERE vehicle_id = :id ORDER BY `order`";
        $stmtImages = $this->db->prepare($sqlImages);
        $stmtImages->execute([':id' => $id]);
        $vehicle['images'] = $stmtImages->fetchAll();

        // Buscar opcionais
        $sqlOptionals = "SELECT * FROM vehicle_optionals WHERE vehicle_id = :id";
        $stmtOptionals = $this->db->prepare($sqlOptionals);
        $stmtOptionals->execute([':id' => $id]);
        $vehicle['optionals'] = $stmtOptionals->fetchAll();

        return $this->formatVehicleDetailed($vehicle);
    }

    public function create(array $data): array {
        $id = $this->database->generateUUID();

        $sql = "INSERT INTO vehicles (id, brand, model, version, year, year_model, price, mileage,
                fuel, transmission, body_type, color, doors, plate, description, `condition`, featured, sold)
                VALUES (:id, :brand, :model, :version, :year, :year_model, :price, :mileage,
                :fuel, :transmission, :body_type, :color, :doors, :plate, :description, :condition, :featured, :sold)";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':id' => $id,
            ':brand' => $data['brand'],
            ':model' => $data['model'],
            ':version' => $data['version'] ?? null,
            ':year' => $data['year'],
            ':year_model' => $data['yearModel'] ?? $data['year'],
            ':price' => $data['price'],
            ':mileage' => $data['mileage'],
            ':fuel' => $data['fuel'],
            ':transmission' => $data['transmission'],
            ':body_type' => $data['bodyType'] ?? null,
            ':color' => $data['color'] ?? null,
            ':doors' => $data['doors'] ?? null,
            ':plate' => $data['plate'] ?? null,
            ':description' => $data['description'] ?? null,
            ':condition' => $data['condition'] ?? 'used',
            ':featured' => $data['featured'] ?? 0,
            ':sold' => $data['sold'] ?? 0,
        ]);

        // Inserir opcionais
        if (!empty($data['optionals'])) {
            $this->saveOptionals($id, $data['optionals']);
        }

        return $this->getById($id);
    }

    public function update(string $id, array $data): ?array {
        $fields = [];
        $params = [':id' => $id];

        $fieldMap = [
            'brand' => 'brand',
            'model' => 'model',
            'version' => 'version',
            'year' => 'year',
            'yearModel' => 'year_model',
            'price' => 'price',
            'mileage' => 'mileage',
            'fuel' => 'fuel',
            'transmission' => 'transmission',
            'bodyType' => 'body_type',
            'color' => 'color',
            'doors' => 'doors',
            'plate' => 'plate',
            'description' => 'description',
            'condition' => '`condition`',
            'featured' => 'featured',
            'sold' => 'sold',
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

        $sql = "UPDATE vehicles SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);

        // Atualizar opcionais se fornecidos
        if (isset($data['optionals'])) {
            $this->db->prepare("DELETE FROM vehicle_optionals WHERE vehicle_id = :id")->execute([':id' => $id]);
            $this->saveOptionals($id, $data['optionals']);
        }

        return $this->getById($id);
    }

    public function delete(string $id): bool {
        $stmt = $this->db->prepare("DELETE FROM vehicles WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }

    public function addImage(string $vehicleId, string $url, int $order = 0): array {
        $id = $this->database->generateUUID();
        $sql = "INSERT INTO vehicle_images (id, url, `order`, vehicle_id) VALUES (:id, :url, :order, :vehicle_id)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':id' => $id,
            ':url' => $url,
            ':order' => $order,
            ':vehicle_id' => $vehicleId,
        ]);
        return ['id' => $id, 'url' => $url, 'order' => $order, 'vehicleId' => $vehicleId];
    }

    public function deleteImage(string $imageId): bool {
        $stmt = $this->db->prepare("DELETE FROM vehicle_images WHERE id = :id");
        return $stmt->execute([':id' => $imageId]);
    }

    public function getBrands(): array {
        $sql = "SELECT DISTINCT brand FROM vehicles WHERE sold = 0 ORDER BY brand";
        $stmt = $this->db->query($sql);
        return array_column($stmt->fetchAll(), 'brand');
    }

    public function getStats(): array {
        $sql = "SELECT
                COUNT(*) as total,
                SUM(CASE WHEN sold = 0 THEN 1 ELSE 0 END) as available,
                SUM(CASE WHEN sold = 1 THEN 1 ELSE 0 END) as sold,
                SUM(CASE WHEN featured = 1 AND sold = 0 THEN 1 ELSE 0 END) as featured
                FROM vehicles";
        $stmt = $this->db->query($sql);
        return $stmt->fetch();
    }

    private function saveOptionals(string $vehicleId, array $optionals): void {
        $sql = "INSERT INTO vehicle_optionals (id, name, vehicle_id) VALUES (:id, :name, :vehicle_id)";
        $stmt = $this->db->prepare($sql);

        foreach ($optionals as $optional) {
            $name = is_array($optional) ? $optional['name'] : $optional;
            $stmt->execute([
                ':id' => $this->database->generateUUID(),
                ':name' => $name,
                ':vehicle_id' => $vehicleId,
            ]);
        }
    }

    private function formatVehicle(array $vehicle): array {
        $images = [];
        if (!empty($vehicle['image_urls'])) {
            $urls = explode(',', $vehicle['image_urls']);
            foreach ($urls as $index => $url) {
                $images[] = ['url' => $url, 'order' => $index];
            }
        }

        $optionals = [];
        if (!empty($vehicle['optional_names'])) {
            foreach (explode(',', $vehicle['optional_names']) as $name) {
                $optionals[] = ['name' => $name];
            }
        }

        unset($vehicle['image_urls'], $vehicle['optional_names']);

        return array_merge($this->snakeToCamel($vehicle), [
            'images' => $images,
            'optionals' => $optionals,
        ]);
    }

    private function formatVehicleDetailed(array $vehicle): array {
        $images = $vehicle['images'] ?? [];
        $optionals = $vehicle['optionals'] ?? [];
        unset($vehicle['images'], $vehicle['optionals']);

        return array_merge($this->snakeToCamel($vehicle), [
            'images' => array_map(fn($i) => $this->snakeToCamel($i), $images),
            'optionals' => array_map(fn($o) => $this->snakeToCamel($o), $optionals),
        ]);
    }

    private function snakeToCamel(array $data): array {
        $result = [];
        foreach ($data as $key => $value) {
            $camelKey = lcfirst(str_replace('_', '', ucwords($key, '_')));
            $result[$camelKey] = $value;
        }
        return $result;
    }
}
