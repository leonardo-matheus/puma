<?php
require_once __DIR__ . '/../models/Vehicle.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class VehicleController {
    private Vehicle $model;
    private AuthMiddleware $auth;

    public function __construct() {
        $this->model = new Vehicle();
        $this->auth = new AuthMiddleware();
    }

    public function index(): void {
        $filters = [
            'brand' => $_GET['brand'] ?? null,
            'minPrice' => $_GET['minPrice'] ?? null,
            'maxPrice' => $_GET['maxPrice'] ?? null,
            'minYear' => $_GET['minYear'] ?? null,
            'maxYear' => $_GET['maxYear'] ?? null,
            'fuel' => $_GET['fuel'] ?? null,
            'transmission' => $_GET['transmission'] ?? null,
            'search' => $_GET['search'] ?? null,
            'featured' => $_GET['featured'] ?? null,
            'limit' => $_GET['limit'] ?? null,
        ];

        $vehicles = $this->model->getAll(array_filter($filters));
        $this->json($vehicles);
    }

    public function show(string $id): void {
        $vehicle = $this->model->getById($id);
        if (!$vehicle) {
            $this->notFound('Veículo não encontrado');
            return;
        }
        $this->json($vehicle);
    }

    public function store(): void {
        $this->auth->requireAuth();
        $data = $this->getJsonInput();

        if (!$this->validateVehicle($data)) {
            $this->badRequest('Dados inválidos');
            return;
        }

        $vehicle = $this->model->create($data);
        http_response_code(201);
        $this->json($vehicle);
    }

    public function update(string $id): void {
        $this->auth->requireAuth();

        $existing = $this->model->getById($id);
        if (!$existing) {
            $this->notFound('Veículo não encontrado');
            return;
        }

        $data = $this->getJsonInput();
        $vehicle = $this->model->update($id, $data);
        $this->json($vehicle);
    }

    public function destroy(string $id): void {
        $this->auth->requireAuth();

        $existing = $this->model->getById($id);
        if (!$existing) {
            $this->notFound('Veículo não encontrado');
            return;
        }

        $this->model->delete($id);
        $this->json(['message' => 'Veículo excluído com sucesso']);
    }

    public function uploadImages(string $id): void {
        $this->auth->requireAuth();

        $existing = $this->model->getById($id);
        if (!$existing) {
            $this->notFound('Veículo não encontrado');
            return;
        }

        if (empty($_FILES['images'])) {
            $this->badRequest('Nenhuma imagem enviada');
            return;
        }

        $uploadDir = __DIR__ . '/../../uploads/vehicles/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $images = [];
        $files = $_FILES['images'];

        // Normalizar array de arquivos
        if (!is_array($files['name'])) {
            $files = [
                'name' => [$files['name']],
                'type' => [$files['type']],
                'tmp_name' => [$files['tmp_name']],
                'error' => [$files['error']],
                'size' => [$files['size']],
            ];
        }

        $order = count($existing['images']);

        for ($i = 0; $i < count($files['name']); $i++) {
            if ($files['error'][$i] !== UPLOAD_ERR_OK) {
                continue;
            }

            $ext = pathinfo($files['name'][$i], PATHINFO_EXTENSION);
            $filename = uniqid() . '_' . time() . '.' . $ext;
            $filepath = $uploadDir . $filename;

            if (move_uploaded_file($files['tmp_name'][$i], $filepath)) {
                $url = '/uploads/vehicles/' . $filename;
                $image = $this->model->addImage($id, $url, $order);
                $images[] = $image;
                $order++;
            }
        }

        $this->json(['images' => $images]);
    }

    public function deleteImage(string $vehicleId, string $imageId): void {
        $this->auth->requireAuth();
        $this->model->deleteImage($imageId);
        $this->json(['message' => 'Imagem excluída']);
    }

    public function brands(): void {
        $brands = $this->model->getBrands();
        $this->json($brands);
    }

    public function stats(): void {
        $this->auth->requireAuth();
        $stats = $this->model->getStats();
        $this->json($stats);
    }

    private function validateVehicle(array $data): bool {
        return !empty($data['brand'])
            && !empty($data['model'])
            && !empty($data['year'])
            && !empty($data['price'])
            && isset($data['mileage'])
            && !empty($data['fuel'])
            && !empty($data['transmission']);
    }

    private function getJsonInput(): array {
        $json = file_get_contents('php://input');
        return json_decode($json, true) ?? [];
    }

    private function json($data): void {
        header('Content-Type: application/json');
        echo json_encode($data);
    }

    private function notFound(string $message): void {
        http_response_code(404);
        $this->json(['error' => $message]);
    }

    private function badRequest(string $message): void {
        http_response_code(400);
        $this->json(['error' => $message]);
    }
}
