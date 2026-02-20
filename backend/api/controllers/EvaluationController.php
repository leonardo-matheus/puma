<?php
require_once __DIR__ . '/../models/Evaluation.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class EvaluationController {
    private Evaluation $model;
    private AuthMiddleware $auth;

    public function __construct() {
        $this->model = new Evaluation();
        $this->auth = new AuthMiddleware();
    }

    public function index(): void {
        $this->auth->requireAuth();
        $evaluations = $this->model->getAll();
        $this->json($evaluations);
    }

    public function show(string $id): void {
        $this->auth->requireAuth();
        $evaluation = $this->model->getById($id);
        if (!$evaluation) {
            $this->notFound('Avaliação não encontrada');
            return;
        }
        $this->json($evaluation);
    }

    public function store(): void {
        $data = $this->getJsonInput();

        if (!$this->validateEvaluation($data)) {
            $this->badRequest('Dados inválidos. Todos os campos obrigatórios devem ser preenchidos.');
            return;
        }

        $evaluation = $this->model->create($data);
        http_response_code(201);
        $this->json($evaluation);
    }

    public function updateStatus(string $id): void {
        $this->auth->requireAuth();

        $data = $this->getJsonInput();
        if (empty($data['status'])) {
            $this->badRequest('Status é obrigatório');
            return;
        }

        $validStatuses = ['pending', 'contacted', 'scheduled', 'completed', 'cancelled'];
        if (!in_array($data['status'], $validStatuses)) {
            $this->badRequest('Status inválido');
            return;
        }

        $evaluation = $this->model->updateStatus($id, $data['status']);
        if (!$evaluation) {
            $this->notFound('Avaliação não encontrada');
            return;
        }
        $this->json($evaluation);
    }

    public function destroy(string $id): void {
        $this->auth->requireAuth();

        $existing = $this->model->getById($id);
        if (!$existing) {
            $this->notFound('Avaliação não encontrada');
            return;
        }

        $this->model->delete($id);
        $this->json(['message' => 'Avaliação excluída com sucesso']);
    }

    public function pendingCount(): void {
        $this->auth->requireAuth();
        $count = $this->model->getPendingCount();
        $this->json(['count' => $count]);
    }

    private function validateEvaluation(array $data): bool {
        return !empty($data['name'])
            && !empty($data['email'])
            && !empty($data['phone'])
            && !empty($data['brand'])
            && !empty($data['model'])
            && !empty($data['year'])
            && isset($data['mileage'])
            && filter_var($data['email'], FILTER_VALIDATE_EMAIL);
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
