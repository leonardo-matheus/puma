# Puma Multimarcas - Site de Revenda de Veículos

Site moderno e profissional para a Puma Multimarcas, desenvolvido com Next.js 14, TypeScript e Tailwind CSS.

## Tecnologias Utilizadas

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Prisma** - ORM para banco de dados
- **SQLite** - Banco de dados (desenvolvimento)
- **Framer Motion** - Animações
- **React Hook Form** - Formulários
- **Zod** - Validação
- **Lucide React** - Ícones

## Funcionalidades

### Site Público
- Home com destaque de veículos e features
- Listagem de veículos com filtros avançados
- Página de detalhes do veículo com galeria
- Página Sobre Nós
- Formulário de Avaliação de veículos
- Formulário de Contato
- Página de Localização com mapa
- Sistema de Favoritos
- Design responsivo e moderno
- Animações fluidas

### Painel Administrativo
- Dashboard com estatísticas
- CRUD completo de veículos
- Gestão de imagens e opcionais
- Visualização de contatos recebidos
- Visualização de avaliações solicitadas
- Configurações do sistema
- Autenticação segura com JWT

## Instalação

1. Clone o repositório e entre na pasta do projeto:
```bash
cd puma
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o banco de dados:
```bash
npx prisma db push
```

4. Popule o banco com dados iniciais:
```bash
npm run db:seed
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

6. Acesse:
- Site: http://localhost:3000
- Admin: http://localhost:3000/admin

## Credenciais de Acesso (Admin)

- **Email:** admin@puma.com
- **Senha:** admin123

## Estrutura do Projeto

```
puma/
├── prisma/
│   ├── schema.prisma    # Schema do banco de dados
│   └── seed.ts          # Script de seed
├── public/
│   └── images/          # Imagens estáticas
├── src/
│   ├── app/             # Páginas (App Router)
│   │   ├── admin/       # Painel administrativo
│   │   ├── api/         # API Routes
│   │   ├── carros/      # Páginas de veículos
│   │   └── ...          # Outras páginas
│   ├── components/      # Componentes React
│   │   ├── ui/          # Componentes base (Button, Input, etc)
│   │   └── layout/      # Header, Footer
│   ├── lib/             # Utilitários e configurações
│   └── types/           # Tipos TypeScript
└── ...
```

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run start` - Inicia servidor de produção
- `npm run db:push` - Sincroniza schema com banco
- `npm run db:seed` - Popula banco com dados iniciais
- `npm run db:studio` - Abre Prisma Studio

## Paleta de Cores

- **Primary (Amarelo/Dourado):** #eab308
- **Dark (Fundo):** #0f172a - #1e293b
- **Text:** #f8fafc (claro) - #64748b (escuro)

## Customização

### Informações da Empresa
Edite o arquivo `prisma/seed.ts` para atualizar:
- Nome da empresa
- Endereço
- Telefones
- Redes sociais
- Horário de funcionamento

### Cores
Edite o arquivo `tailwind.config.ts` para personalizar a paleta.

### Logo
Substitua a logo no componente `Header.tsx` e `Footer.tsx`.

## Deploy

### Vercel (Recomendado)
1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Variáveis de Ambiente (Produção)
```env
DATABASE_URL="sua-url-de-banco-producao"
JWT_SECRET="uma-chave-secreta-muito-forte"
NEXT_PUBLIC_SITE_URL="https://seu-dominio.com"
```

## Suporte

Para dúvidas ou sugestões, entre em contato.

---

Desenvolvido com ❤️ para Puma Multimarcas
