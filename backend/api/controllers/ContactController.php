<?php
require_once __DIR__ . '/../models/Contact.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class ContactController {
    private Contact $model;
    private AuthMiddleware $auth;

    public function __construct() {
        $this->model = new Contact();
        $this->auth = new AuthMiddleware();
    }

    public function index(): void {
        $this->auth->requireAuth();
        $contacts = $this->model->getAll();
        $this->json($contacts);
    }

    public function show(string $id): void {
        $this->auth->requireAuth();
        $contact = $this->model->getById($id);
        if (!$contact) {
            $this->notFound('Contato não encontrado');
            return;
        }
        $this->json($contact);
    }

    public function store(): void {
        $data = $this->getJsonInput();

        if (!$this->validateContact($data)) {
            $this->badRequest('Dados inválidos. Nome, email, telefone e mensagem são obrigatórios.');
            return;
        }

        $contact = $this->model->create($data);
        http_response_code(201);
        $this->json($contact);
    }

    public function markAsRead(string $id): void {
        $this->auth->requireAuth();

        $contact = $this->model->markAsRead($id);
        if (!$contact) {
            $this->notFound('Contato não encontrado');
            return;
        }
        $this->json($contact);
    }

    public function destroy(string $id): void {
        $this->auth->requireAuth();

        $existing = $this->model->getById($id);
        if (!$existing) {
            $this->notFound('Contato não encontrado');
            return;
        }

        $this->model->delete($id);
        $this->json(['message' => 'Contato excluído com sucesso']);
    }

    public function unreadCount(): void {
        $this->auth->requireAuth();
        $count = $this->model->getUnreadCount();
        $this->json(['count' => $count]);
    }

    private function validateContact(array $data): bool {
        return !empty($data['name'])
            && !empty($data['email'])
            && !empty($data['phone'])
            && !empty($data['message'])
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
