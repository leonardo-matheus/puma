<?php
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class AuthController {
    private User $model;
    private AuthMiddleware $auth;

    public function __construct() {
        $this->model = new User();
        $this->auth = new AuthMiddleware();
    }

    public function login(): void {
        $data = $this->getJsonInput();

        if (empty($data['email']) || empty($data['password'])) {
            $this->badRequest('Email e senha são obrigatórios');
            return;
        }

        $user = $this->model->getByEmail($data['email']);
        if (!$user) {
            $this->unauthorized('Credenciais inválidas');
            return;
        }

        if (!$this->model->verifyPassword($data['password'], $user['password'])) {
            $this->unauthorized('Credenciais inválidas');
            return;
        }

        $token = $this->auth->generateToken($user['id']);

        // Definir cookie HTTP-only
        setcookie('auth-token', $token, [
            'expires' => time() + (7 * 24 * 60 * 60),
            'path' => '/',
            'httponly' => true,
            'samesite' => 'Lax',
        ]);

        $this->json([
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'email' => $user['email'],
                'name' => $user['name'],
                'role' => $user['role'],
            ],
        ]);
    }

    public function logout(): void {
        setcookie('auth-token', '', [
            'expires' => time() - 3600,
            'path' => '/',
            'httponly' => true,
            'samesite' => 'Lax',
        ]);

        $this->json(['message' => 'Logout realizado com sucesso']);
    }

    public function me(): void {
        $user = $this->auth->authenticate();
        if (!$user) {
            $this->unauthorized('Não autorizado');
            return;
        }
        $this->json($user);
    }

    public function changePassword(): void {
        $user = $this->auth->requireAuth();
        $data = $this->getJsonInput();

        if (empty($data['currentPassword']) || empty($data['newPassword'])) {
            $this->badRequest('Senhas atual e nova são obrigatórias');
            return;
        }

        $fullUser = $this->model->getByEmail($user['email']);
        if (!$this->model->verifyPassword($data['currentPassword'], $fullUser['password'])) {
            $this->badRequest('Senha atual incorreta');
            return;
        }

        $this->model->updatePassword($user['id'], $data['newPassword']);
        $this->json(['message' => 'Senha alterada com sucesso']);
    }

    private function getJsonInput(): array {
        $json = file_get_contents('php://input');
        return json_decode($json, true) ?? [];
    }

    private function json($data): void {
        header('Content-Type: application/json');
        echo json_encode($data);
    }

    private function unauthorized(string $message): void {
        http_response_code(401);
        $this->json(['error' => $message]);
    }

    private function badRequest(string $message): void {
        http_response_code(400);
        $this->json(['error' => $message]);
    }
}
