import { SiTelegram, SiYoutube, SiInstagram, SiWhatsapp } from "react-icons/si";
import { Link2, Mail, AppWindow, Smartphone, Bot, Users } from "lucide-react";

export const BASE_URL_GROUPS = [
  {
    label: "Telegram",
    icon: SiTelegram,
    urls: [
      { url: "https://axevil.app.link/tgac", label: "Венчурная Прожарка" },
      { url: "https://axevil.app.link/tgp", label: "Партнёрский канал" },
      { url: "https://axevil.app.link/tgmb", label: "Бот Клаудия" },
      { url: "https://axevil.app.link/tgwb", label: "Бот для вебинаров" },
      { url: "https://axevil.app.link/tgx", label: "Внешняя реклама в TG" }
    ]
  },
  {
    label: "YouTube",
    icon: SiYoutube,
    urls: [
      { url: "https://axevil.app.link/yt", label: "Ютуб-канал Axevil" },
      { url: "https://axevil.app.link/ytx", label: "Внешняя реклама на Youtube" }
    ]
  },
  {
    label: "Instagram",
    icon: SiInstagram,
    urls: [
      { url: "https://axevil.app.link/igac", label: "Инстаграм Axevil" },
      { url: "https://axevil.app.link/igex", label: "Внешняя реклама" }
    ]
  },
  {
    label: "WhatsApp",
    icon: SiWhatsapp,
    urls: [
      { url: "https://axevil.app.link/wa", label: "Рассылки в WA-канал Axevil" }
    ]
  },
  {
    label: "Остальное",
    icon: Link2,
    urls: [
      { url: "https://axevil.app.link/ntn", label: "Notion" },
      { url: "https://axevil.app.link/web", label: "Сайт" },
      { url: "https://axevil.app.link/eml", label: "Email-рассылка" },
      { url: "https://axevil.app.link/pres", label: "PDF материалы" },
      { url: "https://axevil.app.link/event", label: "Офлайн-мероприятия" },
      { url: "https://axevil.app.link/art", label: "PR-публикации" },
      { url: "https://axevil.app.link/ai", label: "Для Саши" },
      { url: "https://axevil.app.link/tc", label: "Для Тараса" }
    ]
  }
];

// Группы источников для telegram bot ссылок
export const TELEGRAM_SOURCE_GROUPS = [
  {
    label: "Telegram",
    icon: SiTelegram,
    sources: [
      { value: "tgmain", label: "Венчурная Прожарка" },
      { value: "tgpartners", label: "Партнёрский канал" },
      { value: "tgclaudia", label: "Бот Клаудия" },
      { value: "tgbot", label: "Бот для вебинаров" },
      { value: "tgpartnersbot", label: "Личный кабинет партнёра" },
      { value: "tdext", label: "Реклама в TG-каналах" },
      { value: "tdads", label: "Реклама в TG Ads" }
    ]
  },
  {
    label: "Email",
    icon: Mail,
    sources: [
      { value: "email", label: "Email-рассылка" }
    ]
  },
  {
    label: "Whatsapp",
    icon: SiWhatsapp,
    sources: [
      { value: "wa", label: "Рассылки в WA-канал Axevil" }
    ]
  },
  {
    label: "Приложение",
    icon: AppWindow,
    sources: [
      { value: "appnews", label: "Новость в приложении" },
      { value: "appstories", label: "Сторис в приложении" }
    ]
  },
  {
    label: "YouTube",
    icon: SiYoutube,
    sources: [
      { value: "ytmain", label: "Youtube-канал Axevil" },
      { value: "ytext", label: "Внешняя реклама на Youtube" }
    ]
  },
  {
    label: "Instagram",
    icon: SiInstagram,
    sources: [
      { value: "igmain", label: "Инста Axevil" },
      { value: "igext", label: "Внешняя реклама в Instagram" }
    ]
  },
  {
    label: "Прочее",
    icon: Link2,
    sources: [
      { value: "not", label: "Notion" },
      { value: "website", label: "Сайт Axevil" },
      { value: "pdf", label: "PDF-материалы" },
      { value: "off", label: "Офлайн-мероприятия" },
      { value: "manual", label: "Ручная UTM-метка" }
    ]
  }
];

// Типы ссылок для пошагового интерфейса
export const LINK_TYPES = [
  {
    id: "app",
    label: "На приложение",
    icon: Smartphone,
    description: "Ссылка, которая откроет приложение Axevil"
  },
  {
    id: "webinar_bot",
    label: "В бот вебинаров",
    icon: Bot,
    description: "Ссылка на бота для регистрации на вебинары"
  },
  {
    id: "partner_bot",
    label: "В ЛК партнёра",
    icon: Users,
    description: "Ссылка на личный кабинет партнёра"
  }
];

// Назначения для приложения
export const APP_DESTINATIONS = [
  { id: "home", label: "Главная страница" },
  { id: "portfolio", label: "Портфель" },
  { id: "idea_detail", label: "Детальная страница идеи", needsId: true },
  { id: "investment_detail", label: "Детальная страница инвестиции", needsId: true, hasSubPages: true },
  { id: "news_list", label: "Список новостей" },
  { id: "news_detail", label: "Детальная страница новости", needsId: true },
  { id: "ai_chat", label: "Чат с ИИ Клаудией" },
  { id: "profile", label: "Профиль" },
  { id: "referral", label: "Реферальная программа" }
];

// Подстраницы для детальной страницы инвестиции
export const INVESTMENT_SUB_PAGES = [
  { id: "updates", label: "Обновления" },
  { id: "rounds", label: "Раунды" },
  { id: "documents", label: "Документы" }
];

// Назначения для бота вебинаров
export const WEBINAR_BOT_DESTINATIONS = [
  { id: "invite", label: "Приглашение на вебинар" },
  { id: "application", label: "Оставить заявку" }
];

// Назначения для ЛК партнёра
export const PARTNER_BOT_DESTINATIONS = [
  { id: "home", label: "Главная" },
  { id: "webinars", label: "Вебинары (+ текст приглашения)" },
  { id: "report", label: "Партнёрский отчёт" },
  { id: "ideas_list", label: "Список идей" },
  { id: "idea_pitch", label: "Конкретная идея (питч)", needsIdeaName: true },
  { id: "idea_materials", label: "Материалы по идее", needsIdeaName: true },
  { id: "idea_booking", label: "Бронирование аллокации в идею", needsIdeaName: true },
  { id: "knowledge", label: "Центр знаний" },
  { id: "registration", label: "Регистрация в ЛК" },
  { id: "application", label: "Оставить заявку" }
];