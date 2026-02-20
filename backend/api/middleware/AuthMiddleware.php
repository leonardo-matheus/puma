<?php
require_once __DIR__ . '/../models/User.php';

class AuthMiddleware {
    private string $jwtSecret;

    public function __construct() {
        $this->jwtSecret = getenv('JWT_SECRET') ?: 'puma-multimarcas-secret-key-2024';
    }

    public function authenticate(): ?array {
        $token = $this->getTokenFromHeader();

        if (!$token) {
            return null;
        }

        $payload = $this->verifyToken($token);
        if (!$payload) {
            return null;
        }

        $userModel = new User();
        return $userModel->getById($payload['userId']);
    }

    public function requireAuth(): array {
        $user = $this->authenticate();
        if (!$user) {
            http_response_code(401);
            echo json_encode(['error' => 'Não autorizado']);
            exit;
        }
        return $user;
    }

    public function generateToken(string $userId): string {
        $header = $this->base64UrlEncode(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
        $payload = $this->base64UrlEncode(json_encode([
            'userId' => $userId,
            'iat' => time(),
            'exp' => time() + (7 * 24 * 60 * 60), // 7 dias
        ]));

        $signature = $this->base64UrlEncode(
            hash_hmac('sha256', "$header.$payload", $this->jwtSecret, true)
        );

        return "$header.$payload.$signature";
    }

    public function verifyToken(string $token): ?array {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }

        [$header, $payload, $signature] = $parts;

        $expectedSignature = $this->base64UrlEncode(
            hash_hmac('sha256', "$header.$payload", $this->jwtSecret, true)
        );

        if (!hash_equals($expectedSignature, $signature)) {
            return null;
        }

        $payloadData = json_decode($this->base64UrlDecode($payload), true);

        if (!$payloadData || !isset($payloadData['exp']) || $payloadData['exp'] < time()) {
            return null;
        }

        return $payloadData;
    }

    private function getTokenFromHeader(): ?string {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

        if (preg_match('/Bearer\s+(.+)$/i', $authHeader, $matches)) {
            return $matches[1];
        }

        // Fallback: verificar cookie
        return $_COOKIE['auth-token'] ?? null;
    }

    private function base64UrlEncode(string $data): string {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private function base64UrlDecode(string $data): string {
        return base64_decode(strtr($data, '-_', '+/'));
    }
}
