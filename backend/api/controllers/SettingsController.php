<?php
require_once __DIR__ . '/../models/Settings.php';
require_once __DIR__ . '/../models/Seller.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class SettingsController {
    private Settings $model;
    private Seller $sellerModel;
    private AuthMiddleware $auth;

    public function __construct() {
        $this->model = new Settings();
        $this->sellerModel = new Seller();
        $this->auth = new AuthMiddleware();
    }

    public function index(): void {
        $settings = $this->model->get();
        $this->json($settings);
    }

    public function update(): void {
        $this->auth->requireAuth();

        $data = $this->getJsonInput();
        $settings = $this->model->update($data);
        $this->json($settings);
    }

    // Vendedores
    public function getSellers(): void {
        $activeOnly = !$this->auth->authenticate();
        $sellers = $this->sellerModel->getAll($activeOnly);
        $this->json($sellers);
    }

    public function createSeller(): void {
        $this->auth->requireAuth();
        $data = $this->getJsonInput();

        if (empty($data['name']) || empty($data['phone']) || empty($data['whatsapp'])) {
            $this->badRequest('Nome, telefone e WhatsApp são obrigatórios');
            return;
        }

        $seller = $this->sellerModel->create($data);
        http_response_code(201);
        $this->json($seller);
    }

    public function updateSeller(string $id): void {
        $this->auth->requireAuth();

        $existing = $this->sellerModel->getById($id);
        if (!$existing) {
            $this->notFound('Vendedor não encontrado');
            return;
        }

        $data = $this->getJsonInput();
        $seller = $this->sellerModel->update($id, $data);
        $this->json($seller);
    }

    public function deleteSeller(string $id): void {
        $this->auth->requireAuth();

        $existing = $this->sellerModel->getById($id);
        if (!$existing) {
            $this->notFound('Vendedor não encontrado');
            return;
        }

        $this->sellerModel->delete($id);
        $this->json(['message' => 'Vendedor excluído com sucesso']);
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
