import { SiTelegram, SiYoutube, SiInstagram, SiWhatsapp } from "react-icons/si";
import { Link2, Mail, AppWindow } from "lucide-react";

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
      { value: "off", label: "Офлайн-мероприятия" }
    ]
  }
];