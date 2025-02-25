import { SiTelegram, SiYoutube, SiInstagram } from "react-icons/si";
import { Link2 } from "lucide-react";

export const LINK_TYPES = [
  { id: "app", label: "App Download" },
  { id: "webinar", label: "Webinar Registration" }
] as const;

export const BASE_URL_GROUPS = [
  {
    label: "Telegram",
    icon: SiTelegram,
    urls: [
      { url: "https://axevil.app.link/tgac", label: "Main Channel" },
      { url: "https://axevil.app.link/tgp", label: "Partner Channel" },
      { url: "https://axevil.app.link/tgmb", label: "Main Bot" },
      { url: "https://axevil.app.link/tgwb", label: "Webinar Bot" },
      { url: "https://axevil.app.link/tgx", label: "Integrations" }
    ]
  },
  {
    label: "YouTube",
    icon: SiYoutube,
    urls: [
      { url: "https://axevil.app.link/yt", label: "Corporate" },
      { url: "https://axevil.app.link/ytx", label: "Integrations" }
    ]
  },
  {
    label: "Instagram",
    icon: SiInstagram,
    urls: [
      { url: "https://axevil.app.link/igac", label: "Corporate" },
      { url: "https://axevil.app.link/igex", label: "Integrations" }
    ]
  },
  {
    label: "Other",
    icon: Link2,
    urls: [
      { url: "https://axevil.app.link/ntn", label: "Notion" },
      { url: "https://axevil.app.link/web", label: "Website" },
      { url: "https://axevil.app.link/eml", label: "Email" },
      { url: "https://axevil.app.link/pres", label: "Presentations" },
      { url: "https://axevil.app.link/event", label: "Events" },
      { url: "https://axevil.app.link/art", label: "PR Articles" }
    ]
  }
];
