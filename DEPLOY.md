# Guia de Deploy - Puma Multimarcas

## Estrutura do Projeto

```
puma/
├── frontend/           # SPA React + Vite
│   ├── src/            # Codigo fonte
│   ├── package.json
│   └── vite.config.ts
│
└── backend/            # API PHP
    ├── api/            # Codigo da API
    ├── uploads/        # Imagens
    └── database.sql    # Schema MySQL
```

## Configuracao do Banco de Dados

1. Acesse o painel do MySQL (phpMyAdmin ou similar)
2. Importe o arquivo `backend/database.sql`
3. As credenciais ja estao configuradas em `backend/api/config/database.php`:
   - Host: `sql101.infinityfree.com`
   - Database: `if0_41206978_puma`
   - User: `if0_41206978`
   - Password: `yiERMV936cmVm4U`

## Deploy do Backend (PHP)

1. Conecte via FTP:
   - Host: `ftpupload.net`
   - User: `if0_41206978`
   - Password: `yiERMV936cmVm4U`

2. Faca upload da pasta `backend/api/` para `htdocs/api/`
3. Faca upload da pasta `backend/uploads/` para `htdocs/uploads/`
4. Certifique-se de que a pasta `uploads` tem permissao de escrita (chmod 755)

## Deploy do Frontend (React)

1. Instale as dependencias:
```bash
cd frontend
npm install
```

2. Gere o build de producao:
```bash
npm run build
```

3. Faca upload do conteudo da pasta `frontend/dist/` para `htdocs/`

## Estrutura Final no Servidor

```
htdocs/
├── index.html          # Frontend SPA
├── assets/             # CSS/JS compilados
├── api/                # Backend PHP
│   ├── index.php
│   ├── .htaccess
│   ├── config/
│   ├── controllers/
│   ├── models/
│   └── middleware/
├── uploads/            # Imagens
│   ├── vehicles/
│   └── banners/
└── .htaccess           # Rewrite rules
```

## Configuracao do .htaccess (Raiz)

Crie o arquivo `htdocs/.htaccess` com o seguinte conteudo:

```apache
RewriteEngine On
RewriteBase /

# API routes
RewriteRule ^api/(.*)$ api/index.php [QSA,L]

# Uploads - acesso direto
RewriteCond %{REQUEST_URI} ^/uploads/
RewriteRule ^uploads/(.*)$ uploads/$1 [L]

# SPA fallback
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteCond %{REQUEST_URI} !^/uploads/
RewriteRule ^(.*)$ index.html [L]
```

## Testando

1. Acesse `pumamultimarcas.great-site.net`
2. O site deve carregar normalmente
3. Acesse `pumamultimarcas.great-site.net/admin/login`
4. Login: `admin@puma.com` / Senha: `admin123`

## Endpoints da API

| Metodo | Endpoint                  | Descricao              |
|--------|---------------------------|------------------------|
| GET    | /api/vehicles             | Listar veiculos        |
| GET    | /api/vehicles/{id}        | Detalhes do veiculo    |
| POST   | /api/vehicles             | Criar veiculo (admin)  |
| PUT    | /api/vehicles/{id}        | Atualizar veiculo      |
| DELETE | /api/vehicles/{id}        | Excluir veiculo        |
| GET    | /api/banners              | Listar banners         |
| POST   | /api/contacts             | Enviar contato         |
| POST   | /api/evaluations          | Enviar avaliacao       |
| GET    | /api/settings             | Obter configuracoes    |
| POST   | /api/auth/login           | Login                  |
| GET    | /api/auth/me              | Usuario atual          |
| GET    | /api/stats                | Estatisticas (admin)   |

## Desenvolvimento Local

### Backend
```bash
cd backend/api
php -S localhost:8000
```

### Frontend
```bash
cd frontend
npm run dev
```

O frontend em modo dev usa proxy para `/api` apontando para `localhost:8000`.
