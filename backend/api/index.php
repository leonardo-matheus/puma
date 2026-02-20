<?php
/**
 * Router Principal - API Puma Multimarcas
 */

// Habilitar CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Configurar tratamento de erros
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Obter URI e método
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = str_replace('/api', '', $uri);
$uri = rtrim($uri, '/');
$method = $_SERVER['REQUEST_METHOD'];

// Carregar controllers
require_once __DIR__ . '/controllers/VehicleController.php';
require_once __DIR__ . '/controllers/ContactController.php';
require_once __DIR__ . '/controllers/EvaluationController.php';
require_once __DIR__ . '/controllers/BannerController.php';
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/SettingsController.php';
require_once __DIR__ . '/controllers/StatsController.php';

// Roteamento
try {
    // Veículos
    if (preg_match('#^/vehicles/?$#', $uri)) {
        $controller = new VehicleController();
        match ($method) {
            'GET' => $controller->index(),
            'POST' => $controller->store(),
            default => methodNotAllowed(),
        };
    }
    elseif (preg_match('#^/vehicles/brands/?$#', $uri)) {
        $controller = new VehicleController();
        if ($method === 'GET') {
            $controller->brands();
        } else {
            methodNotAllowed();
        }
    }
    elseif (preg_match('#^/vehicles/stats/?$#', $uri)) {
        $controller = new VehicleController();
        if ($method === 'GET') {
            $controller->stats();
        } else {
            methodNotAllowed();
        }
    }
    elseif (preg_match('#^/vehicles/([^/]+)/images/?$#', $uri, $matches)) {
        $controller = new VehicleController();
        if ($method === 'POST') {
            $controller->uploadImages($matches[1]);
        } else {
            methodNotAllowed();
        }
    }
    elseif (preg_match('#^/vehicles/([^/]+)/images/([^/]+)/?$#', $uri, $matches)) {
        $controller = new VehicleController();
        if ($method === 'DELETE') {
            $controller->deleteImage($matches[1], $matches[2]);
        } else {
            methodNotAllowed();
        }
    }
    elseif (preg_match('#^/vehicles/([^/]+)/?$#', $uri, $matches)) {
        $controller = new VehicleController();
        match ($method) {
            'GET' => $controller->show($matches[1]),
            'PUT' => $controller->update($matches[1]),
            'DELETE' => $controller->destroy($matches[1]),
            default => methodNotAllowed(),
        };
    }
    // Contatos
    elseif (preg_match('#^/contacts/?$#', $uri)) {
        $controller = new ContactController();
        match ($method) {
            'GET' => $controller->index(),
            'POST' => $controller->store(),
            default => methodNotAllowed(),
        };
    }
    elseif (preg_match('#^/contacts/unread-count/?$#', $uri)) {
        $controller = new ContactController();
        if ($method === 'GET') {
            $controller->unreadCount();
        } else {
            methodNotAllowed();
        }
    }
    elseif (preg_match('#^/contacts/([^/]+)/read/?$#', $uri, $matches)) {
        $controller = new ContactController();
        if ($method === 'PUT') {
            $controller->markAsRead($matches[1]);
        } else {
            methodNotAllowed();
        }
    }
    elseif (preg_match('#^/contacts/([^/]+)/?$#', $uri, $matches)) {
        $controller = new ContactController();
        match ($method) {
            'GET' => $controller->show($matches[1]),
            'DELETE' => $controller->destroy($matches[1]),
            default => methodNotAllowed(),
        };
    }
    // Avaliações
    elseif (preg_match('#^/evaluations/?$#', $uri)) {
        $controller = new EvaluationController();
        match ($method) {
            'GET' => $controller->index(),
            'POST' => $controller->store(),
            default => methodNotAllowed(),
        };
    }
    elseif (preg_match('#^/evaluations/pending-count/?$#', $uri)) {
        $controller = new EvaluationController();
        if ($method === 'GET') {
            $controller->pendingCount();
        } else {
            methodNotAllowed();
        }
    }
    elseif (preg_match('#^/evaluations/([^/]+)/status/?$#', $uri, $matches)) {
        $controller = new EvaluationController();
        if ($method === 'PUT') {
            $controller->updateStatus($matches[1]);
        } else {
            methodNotAllowed();
        }
    }
    elseif (preg_match('#^/evaluations/([^/]+)/?$#', $uri, $matches)) {
        $controller = new EvaluationController();
        match ($method) {
            'GET' => $controller->show($matches[1]),
            'DELETE' => $controller->destroy($matches[1]),
            default => methodNotAllowed(),
        };
    }
    // Banners
    elseif (preg_match('#^/banners/?$#', $uri)) {
        $controller = new BannerController();
        match ($method) {
            'GET' => $controller->index(),
            'POST' => $controller->store(),
            default => methodNotAllowed(),
        };
    }
    elseif (preg_match('#^/banners/([^/]+)/?$#', $uri, $matches)) {
        $controller = new BannerController();
        match ($method) {
            'GET' => $controller->show($matches[1]),
            'PUT' => $controller->update($matches[1]),
            'DELETE' => $controller->destroy($matches[1]),
            default => methodNotAllowed(),
        };
    }
    // Autenticação
    elseif (preg_match('#^/auth/login/?$#', $uri)) {
        $controller = new AuthController();
        if ($method === 'POST') {
            $controller->login();
        } else {
            methodNotAllowed();
        }
    }
    elseif (preg_match('#^/auth/logout/?$#', $uri)) {
        $controller = new AuthController();
        if ($method === 'POST') {
            $controller->logout();
        } else {
            methodNotAllowed();
        }
    }
    elseif (preg_match('#^/auth/me/?$#', $uri)) {
        $controller = new AuthController();
        if ($method === 'GET') {
            $controller->me();
        } else {
            methodNotAllowed();
        }
    }
    elseif (preg_match('#^/auth/change-password/?$#', $uri)) {
        $controller = new AuthController();
        if ($method === 'POST') {
            $controller->changePassword();
        } else {
            methodNotAllowed();
        }
    }
    // Configurações
    elseif (preg_match('#^/settings/?$#', $uri)) {
        $controller = new SettingsController();
        match ($method) {
            'GET' => $controller->index(),
            'PUT' => $controller->update(),
            default => methodNotAllowed(),
        };
    }
    // Vendedores
    elseif (preg_match('#^/sellers/?$#', $uri)) {
        $controller = new SettingsController();
        match ($method) {
            'GET' => $controller->getSellers(),
            'POST' => $controller->createSeller(),
            default => methodNotAllowed(),
        };
    }
    elseif (preg_match('#^/sellers/([^/]+)/?$#', $uri, $matches)) {
        $controller = new SettingsController();
        match ($method) {
            'PUT' => $controller->updateSeller($matches[1]),
            'DELETE' => $controller->deleteSeller($matches[1]),
            default => methodNotAllowed(),
        };
    }
    // Estatísticas
    elseif (preg_match('#^/stats/?$#', $uri)) {
        $controller = new StatsController();
        if ($method === 'GET') {
            $controller->index();
        } else {
            methodNotAllowed();
        }
    }
    // Health check
    elseif ($uri === '' || $uri === '/') {
        header('Content-Type: application/json');
        echo json_encode([
            'status' => 'ok',
            'message' => 'API Puma Multimarcas',
            'version' => '1.0.0',
        ]);
    }
    // Rota não encontrada
    else {
        notFound();
    }
} catch (Exception $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Erro interno do servidor']);
    error_log($e->getMessage());
}

function notFound(): void {
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Endpoint não encontrado']);
}

function methodNotAllowed(): void {
    http_response_code(405);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Método não permitido']);
}
