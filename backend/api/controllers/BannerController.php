<?php
require_once __DIR__ . '/../models/Banner.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class BannerController {
    private Banner $model;
    private AuthMiddleware $auth;

    public function __construct() {
        $this->model = new Banner();
        $this->auth = new AuthMiddleware();
    }

    public function index(): void {
        $activeOnly = !$this->auth->authenticate();
        $banners = $this->model->getAll($activeOnly);
        $this->json($banners);
    }

    public function show(string $id): void {
        $banner = $this->model->getById($id);
        if (!$banner) {
            $this->notFound('Banner não encontrado');
            return;
        }
        $this->json($banner);
    }

    public function store(): void {
        $this->auth->requireAuth();

        // Verificar se é upload de arquivo ou dados JSON
        if (!empty($_FILES['image'])) {
            $data = $this->handleUpload();
        } else {
            $data = $this->getJsonInput();
        }

        if (empty($data['imageUrl'])) {
            $this->badRequest('Imagem é obrigatória');
            return;
        }

        $banner = $this->model->create($data);
        http_response_code(201);
        $this->json($banner);
    }

    public function update(string $id): void {
        $this->auth->requireAuth();

        $existing = $this->model->getById($id);
        if (!$existing) {
            $this->notFound('Banner não encontrado');
            return;
        }

        if (!empty($_FILES['image'])) {
            $data = $this->handleUpload();
        } else {
            $data = $this->getJsonInput();
        }

        $banner = $this->model->update($id, $data);
        $this->json($banner);
    }

    public function destroy(string $id): void {
        $this->auth->requireAuth();

        $existing = $this->model->getById($id);
        if (!$existing) {
            $this->notFound('Banner não encontrado');
            return;
        }

        $this->model->delete($id);
        $this->json(['message' => 'Banner excluído com sucesso']);
    }

    private function handleUpload(): array {
        $uploadDir = __DIR__ . '/../../uploads/banners/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $file = $_FILES['image'];
        if ($file['error'] !== UPLOAD_ERR_OK) {
            $this->badRequest('Erro no upload da imagem');
            exit;
        }

        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = uniqid() . '_' . time() . '.' . $ext;
        $filepath = $uploadDir . $filename;

        if (!move_uploaded_file($file['tmp_name'], $filepath)) {
            $this->badRequest('Erro ao salvar imagem');
            exit;
        }

        return array_merge($_POST, [
            'imageUrl' => '/uploads/banners/' . $filename,
        ]);
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
