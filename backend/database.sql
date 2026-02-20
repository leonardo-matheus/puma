-- Schema MySQL para Puma Multimarcas
-- Banco de dados: if0_41206978_puma
-- Host: sql101.infinityfree.com

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Tabela de usuários administrativos
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(36) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) DEFAULT 'admin',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de veículos
CREATE TABLE IF NOT EXISTS `vehicles` (
  `id` VARCHAR(36) NOT NULL,
  `brand` VARCHAR(100) NOT NULL,
  `model` VARCHAR(100) NOT NULL,
  `version` VARCHAR(100) DEFAULT NULL,
  `year` INT NOT NULL,
  `year_model` INT DEFAULT NULL,
  `price` DECIMAL(12,2) NOT NULL,
  `mileage` INT NOT NULL,
  `fuel` VARCHAR(50) NOT NULL,
  `transmission` VARCHAR(50) NOT NULL,
  `body_type` VARCHAR(50) DEFAULT NULL,
  `color` VARCHAR(50) DEFAULT NULL,
  `doors` INT DEFAULT NULL,
  `plate` VARCHAR(10) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `condition` VARCHAR(20) DEFAULT 'used',
  `featured` TINYINT(1) DEFAULT 0,
  `sold` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_brand` (`brand`),
  INDEX `idx_featured` (`featured`),
  INDEX `idx_sold` (`sold`),
  INDEX `idx_price` (`price`),
  INDEX `idx_year` (`year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de imagens dos veículos
CREATE TABLE IF NOT EXISTS `vehicle_images` (
  `id` VARCHAR(36) NOT NULL,
  `url` VARCHAR(500) NOT NULL,
  `order` INT DEFAULT 0,
  `vehicle_id` VARCHAR(36) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_vehicle` (`vehicle_id`),
  CONSTRAINT `fk_vehicle_images_vehicle` FOREIGN KEY (`vehicle_id`)
    REFERENCES `vehicles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de opcionais dos veículos
CREATE TABLE IF NOT EXISTS `vehicle_optionals` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `vehicle_id` VARCHAR(36) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_vehicle` (`vehicle_id`),
  CONSTRAINT `fk_vehicle_optionals_vehicle` FOREIGN KEY (`vehicle_id`)
    REFERENCES `vehicles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de contatos
CREATE TABLE IF NOT EXISTS `contacts` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `message` TEXT NOT NULL,
  `vehicle_id` VARCHAR(36) DEFAULT NULL,
  `read` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_read` (`read`),
  INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de avaliações de veículos
CREATE TABLE IF NOT EXISTS `evaluations` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `brand` VARCHAR(100) NOT NULL,
  `model` VARCHAR(100) NOT NULL,
  `year` INT NOT NULL,
  `mileage` INT NOT NULL,
  `description` TEXT DEFAULT NULL,
  `status` VARCHAR(20) DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de configurações da empresa
CREATE TABLE IF NOT EXISTS `settings` (
  `id` VARCHAR(36) NOT NULL DEFAULT 'settings',
  `company_name` VARCHAR(255) DEFAULT 'Puma Multimarcas',
  `description` TEXT DEFAULT 'Revendedora de confiança de Carros de Matão e região',
  `email` VARCHAR(255) DEFAULT 'pumamultimarcas@yahoo.com',
  `phone` VARCHAR(20) DEFAULT '(16) 2016-2615',
  `whatsapp` VARCHAR(20) DEFAULT '(16) 99253-7016',
  `address` VARCHAR(500) DEFAULT 'Av. Rincão, 471 – Jardim Buscardi, Matão – SP, 15991-210',
  `working_hours` VARCHAR(255) DEFAULT 'Segunda a Sexta: 09:00 às 18:00 | Sábado: 09:00 às 13:00',
  `facebook` VARCHAR(255) DEFAULT 'https://www.facebook.com/PumaMultimarcas',
  `instagram` VARCHAR(255) DEFAULT 'https://www.instagram.com/puma_multimarcas_',
  `logo_url` VARCHAR(500) DEFAULT NULL,
  `banner_url` VARCHAR(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de vendedores
CREATE TABLE IF NOT EXISTS `sellers` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `whatsapp` VARCHAR(20) NOT NULL,
  `active` TINYINT(1) DEFAULT 1,
  `order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_active` (`active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de banners
CREATE TABLE IF NOT EXISTS `banners` (
  `id` VARCHAR(36) NOT NULL,
  `title` VARCHAR(255) DEFAULT NULL,
  `subtitle` VARCHAR(255) DEFAULT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `link` VARCHAR(500) DEFAULT NULL,
  `active` TINYINT(1) DEFAULT 1,
  `order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_active` (`active`),
  INDEX `idx_order` (`order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- Inserir configurações padrão
INSERT INTO `settings` (`id`) VALUES ('settings')
ON DUPLICATE KEY UPDATE `id` = 'settings';

-- Inserir usuário admin padrão (senha: admin123)
INSERT INTO `users` (`id`, `email`, `password`, `name`, `role`) VALUES
(UUID(), 'admin@puma.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4aGqVQN2o3VFm6Uy', 'Administrador', 'admin')
ON DUPLICATE KEY UPDATE `email` = 'admin@puma.com';
