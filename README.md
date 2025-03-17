# Деплой на Cloudflare Pages

## Предварительные требования
- Аккаунт на Cloudflare
- Установленный Node.js (рекомендуется версия 18)
- Git репозиторий с вашим проектом

## Шаги для деплоя

### 1. Подготовка проекта
Убедитесь, что в вашем проекте есть следующие файлы:
- `wrangler.toml` - конфигурация для Cloudflare Pages
- `client/public/_redirects` - настройка перенаправлений для SPA
- `.node-version` - указание версии Node.js

### 2. Деплой через Cloudflare Dashboard
1. Войдите в свой аккаунт Cloudflare
2. Перейдите в раздел "Pages"
3. Нажмите "Create a project"
4. Выберите "Connect to Git"
5. Подключите свой репозиторий GitHub/GitLab/Bitbucket
6. Выберите репозиторий с проектом
7. Настройте параметры сборки:
   - Build command: `npm run build`
   - Build output directory: `dist/public`
   - Node.js version: 18
8. Нажмите "Save and Deploy"

### 3. Деплой через Wrangler CLI
Альтернативно, вы можете использовать Wrangler CLI:

```bash
# Установка Wrangler
npm install -g wrangler

# Логин в Cloudflare
wrangler login

# Деплой проекта
wrangler pages publish dist/public --project-name=ваш-проект
```

## Проверка деплоя
После успешного деплоя вы получите URL вида `https://ваш-проект.pages.dev` 