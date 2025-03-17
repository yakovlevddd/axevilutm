import { SiTelegram, SiYoutube, SiInstagram } from "react-icons/si";
import { Link2 } from "lucide-react";

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