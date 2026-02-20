<?php
require_once __DIR__ . '/../models/Vehicle.php';
require_once __DIR__ . '/../models/Contact.php';
require_once __DIR__ . '/../models/Evaluation.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class StatsController {
    private AuthMiddleware $auth;

    public function __construct() {
        $this->auth = new AuthMiddleware();
    }

    public function index(): void {
        $this->auth->requireAuth();

        $vehicleModel = new Vehicle();
        $contactModel = new Contact();
        $evaluationModel = new Evaluation();

        $vehicleStats = $vehicleModel->getStats();

        $this->json([
            'vehicles' => [
                'total' => (int) $vehicleStats['total'],
                'available' => (int) $vehicleStats['available'],
                'sold' => (int) $vehicleStats['sold'],
                'featured' => (int) $vehicleStats['featured'],
            ],
            'contacts' => [
                'unread' => $contactModel->getUnreadCount(),
            ],
            'evaluations' => [
                'pending' => $evaluationModel->getPendingCount(),
            ],
        ]);
    }

    private function json($data): void {
        header('Content-Type: application/json');
        echo json_encode($data);
    }
}
