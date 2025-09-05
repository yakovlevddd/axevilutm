import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Copy, Check, ChevronLeft, ChevronRight } from "lucide-react";
import {
  LINK_TYPES,
  APP_DESTINATIONS,
  INVESTMENT_SUB_PAGES,
  WEBINAR_BOT_DESTINATIONS,
  PARTNER_BOT_DESTINATIONS,
  TELEGRAM_SOURCE_GROUPS
} from "@/lib/constants";

type LinkType = "app" | "webinar_bot" | "partner_bot";
type Step = 1 | 2 | 3 | 4 | 5;

interface FormData {
  linkType: LinkType | null;
  destination: string | null;
  destinationId?: string;
  subPage?: string;
  ideaName?: string;
  utmCampaign: string;
  selectedSources: string[];
}

interface GeneratedLink {
  source: string;
  sourceLabel: string;
  url: string;
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [formData, setFormData] = useState<FormData>({
    linkType: null,
    destination: null,
    utmCampaign: "",
    selectedSources: []
  });
  const [generatedLinks, setGeneratedLinks] = useState<GeneratedLink[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { toast } = useToast();

  // Обработка клавиатурных сокращений для навигации
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd+← (назад) или Cmd+→ (вперёд)
      if (event.metaKey && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
        event.preventDefault();
        
        if (event.key === "ArrowLeft" && currentStep > 1) {
          // Назад: учитываем пропуск шага 4 для ботов
          if (currentStep === 5 && (formData.linkType === "webinar_bot" || formData.linkType === "partner_bot")) {
            setCurrentStep(3); // Для ботов с шага 5 сразу на шаг 3
          } else {
            goToPrevStep();
          }
        } else if (event.key === "ArrowRight" && currentStep < 5) {
          // Вперёд: проверяем возможность перехода
          if (canProceedFromStep(currentStep)) {
            // Для ботов пропускаем шаг 4
            if (currentStep === 3 && (formData.linkType === "webinar_bot" || formData.linkType === "partner_bot")) {
              if (formData.selectedSources.length > 0) {
                generateLinks(); // Генерируем ссылки и переходим на шаг 5
              }
            } else {
              goToNextStep();
            }
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [currentStep, formData]);

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const goToNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => (prev + 1) as Step);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  // Автоматический переход к следующему шагу
  const handleLinkTypeSelect = (linkType: LinkType) => {
    updateFormData({ linkType, destination: null, destinationId: "", subPage: "", ideaName: "" });
    setTimeout(() => goToNextStep(), 300); // Небольшая задержка для анимации
  };

  const handleDestinationSelect = (destination: string) => {
    updateFormData({ destination, destinationId: "", subPage: "", ideaName: "" });
    setTimeout(() => goToNextStep(), 300);
  };

  const canProceedFromStep = (step: Step): boolean => {
    switch (step) {
      case 1:
        return formData.linkType !== null;
      case 2:
        return formData.destination !== null;
      case 3:
        return formData.selectedSources.length > 0;
      case 4:
        // Для ботов вебинаров и ЛК партнёра UTM не нужен
        if (formData.linkType === "webinar_bot" || formData.linkType === "partner_bot") return true;
        return formData.utmCampaign.trim() !== "";
      case 5:
        return true;
      default:
        return false;
    }
  };

  const generateLinks = () => {
    if (!formData.linkType || !formData.destination) return;
    // Для ботов вебинаров и ЛК партнёра UTM не нужен
    if (formData.linkType !== "webinar_bot" && formData.linkType !== "partner_bot" && !formData.utmCampaign) return;

    const links: GeneratedLink[] = [];

    formData.selectedSources.forEach(sourceValue => {
      const sourceGroup = TELEGRAM_SOURCE_GROUPS.find(group => 
        group.sources.some(s => s.value === sourceValue)
      );
      const source = sourceGroup?.sources.find(s => s.value === sourceValue);
      
      if (source) {
        let url = "";
        
        switch (formData.linkType) {
          case "app":
            url = generateAppLink(sourceValue);
            break;
          case "webinar_bot":
            url = generateWebinarBotLink(sourceValue);
            break;
          case "partner_bot":
            url = generatePartnerBotLink(sourceValue);
            break;
        }

        links.push({
          source: sourceValue,
          sourceLabel: source.label,
          url
        });
      }
    });

    setGeneratedLinks(links);
    // Для ботов вебинаров и ЛК партнёра переходим сразу на шаг 5, для остальных - на следующий шаг
    if (formData.linkType === "webinar_bot" || formData.linkType === "partner_bot") {
      setTimeout(() => setCurrentStep(5), 300);
    } else {
      setTimeout(() => goToNextStep(), 300);
    }
  };

  const generateAppLink = (source: string): string => {
    // Определяем базовый URL на основе выбранного источника
    const sourceGroup = TELEGRAM_SOURCE_GROUPS.find(group => 
      group.sources.some(s => s.value === source)
    );
    const sourceConfig = sourceGroup?.sources.find(s => s.value === source);
    
    // Карта источников к URL
    const sourceUrlMap: { [key: string]: string } = {
      "tgmain": "https://axevil.app.link/tgac",
      "tgpartners": "https://axevil.app.link/tgp",
      "tgclaudia": "https://axevil.app.link/tgmb",
      "tgbot": "https://axevil.app.link/tgwb",
      "tgpartnersbot": "https://axevil.app.link/tgpb",
      "tdext": "https://axevil.app.link/tgx",
      "tdads": "https://axevil.app.link/tgads",
      "email": "https://axevil.app.link/eml",
      "wa": "https://axevil.app.link/wa",
      "appnews": "https://axevil.app.link/appnews",
      "appstories": "https://axevil.app.link/appstories",
      "ytmain": "https://axevil.app.link/yt",
      "ytext": "https://axevil.app.link/ytx",
      "igmain": "https://axevil.app.link/igac",
      "igext": "https://axevil.app.link/igex",
      "not": "https://axevil.app.link/ntn",
      "website": "https://axevil.app.link/web",
      "pdf": "https://axevil.app.link/pres",
      "off": "https://axevil.app.link/event",
      "manual": "https://axevil.app.link/web"
    };
    
    const baseUrl = sourceUrlMap[source] || "https://axevil.app.link/web";
    const params = [`~campaign=${formData.utmCampaign}`];

    // Добавляем параметры в зависимости от типа назначения (page_type)
    switch (formData.destination) {
      case "home":
        // Без дополнительных параметров
        break;
      case "portfolio":
        params.push("page_type=portfolio");
        if (formData.subPage) {
          params.push(`initial_inner_page=${formData.subPage}`);
        }
        break;
      case "idea_detail":
        params.push("page_type=idea");
        if (formData.destinationId) {
          params.push(`page_id=${formData.destinationId}`);
        }
        break;
      case "investment_detail":
        params.push("page_type=order");
        if (formData.destinationId) {
          params.push(`page_id=${formData.destinationId}`);
        }
        if (formData.subPage) {
          params.push(`initial_inner_page=${formData.subPage}`);
        }
        break;
      case "news_list":
        params.push("page_type=news");
        break;
      case "news_detail":
        params.push("page_type=news");
        if (formData.destinationId) {
          params.push(`page_id=${formData.destinationId}`);
        }
        break;
      case "ai_chat":
        params.push("page_type=assistant");
        break;
      case "profile":
        params.push("page_type=profile");
        break;
      case "referral":
        params.push("page_type=referral");
        break;
    }

    return `${baseUrl}?${params.join("&")}`;
  };

  const generateWebinarBotLink = (source: string): string => {
    const baseUrl = "https://t.me/axevil_events_bot";
    
    // Карта источников к сокращениям для ботов
    const sourceBotMap: { [key: string]: string } = {
      "tgmain": "tgac",
      "tgpartners": "tgp", 
      "tgclaudia": "tgmb",
      "tgbot": "tgwb",
      "tgpartnersbot": "tgpb",
      "tdext": "tgx",
      "tdads": "tgads",
      "email": "eml",
      "wa": "wa",
      "appnews": "appnews",
      "appstories": "appstories",
      "ytmain": "yt",
      "ytext": "ytx", 
      "igmain": "igac",
      "igext": "igex",
      "not": "ntn",
      "website": "web",
      "pdf": "pres",
      "off": "event",
      "manual": "web"
    };
    
    const sourceParam = sourceBotMap[source] || source;
    
    switch (formData.destination) {
      case "invite":
        return `${baseUrl}?start=web_${sourceParam}`;
      case "application":
        return `${baseUrl}?start=commit_${sourceParam}`;
      default:
        return baseUrl;
    }
  };

  const generatePartnerBotLink = (source: string): string => {
    const baseUrl = "https://t.me/axevil_partner_bot";
    
    // Карта источников к сокращениям для ботов (та же что и для вебинаров)
    const sourceBotMap: { [key: string]: string } = {
      "tgmain": "tgac",
      "tgpartners": "tgp", 
      "tgclaudia": "tgmb",
      "tgbot": "tgwb",
      "tgpartnersbot": "tgpb",
      "tdext": "tgx",
      "tdads": "tgads",
      "email": "eml",
      "wa": "wa",
      "appnews": "appnews",
      "appstories": "appstories",
      "ytmain": "yt",
      "ytext": "ytx", 
      "igmain": "igac",
      "igext": "igex",
      "not": "ntn",
      "website": "web",
      "pdf": "pres",
      "off": "event",
      "manual": "web"
    };
    
    const sourceParam = sourceBotMap[source] || source;
    
    switch (formData.destination) {
      case "menu":
        return `${baseUrl}?start=menu_${sourceParam}`;
      case "getinvite":
        return `${baseUrl}?start=getinvite_${sourceParam}`;
      case "clients":
        return `${baseUrl}?start=clients_${sourceParam}`;
      case "deals":
        return `${baseUrl}?start=deals_${sourceParam}`;
      case "d":
        const ideaParam = formData.ideaName ? `_${formData.ideaName}` : "";
        return `${baseUrl}?start=d_${sourceParam}${ideaParam}`;
      case "dpres":
        const ideaParam2 = formData.ideaName ? `_${formData.ideaName}` : "";
        return `${baseUrl}?start=dpres_${sourceParam}${ideaParam2}`;
      case "dcommit":
        const ideaParam3 = formData.ideaName ? `_${formData.ideaName}` : "";
        return `${baseUrl}?start=dcommit_${sourceParam}${ideaParam3}`;
      case "marketexplorer":
        return `${baseUrl}?start=marketexplorer_${sourceParam}`;
      case "knowledge":
        return `${baseUrl}?start=knowledge_${sourceParam}`;
      case "register":
        return `${baseUrl}?start=register_${sourceParam}`;
      case "commit":
        return `${baseUrl}?start=commit_${sourceParam}`;
      default:
        return baseUrl;
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    toast({
      title: "Ссылка скопирована!",
      description: "Сгенерированная ссылка скопирована в буфер обмена.",
    });
  };

  const copyAllLinks = async () => {
    const allLinksText = generatedLinks
      .map(link => `${link.sourceLabel}\n${link.url}`)
      .join('\n\n');
    
    await navigator.clipboard.writeText(allLinksText);
    toast({
      title: "Все ссылки скопированы!",
      description: "Все сгенерированные ссылки скопированы в буфер обмена.",
    });
  };

  const validateUtmCampaign = (value: string): boolean => {
    if (formData.linkType === "webinar_bot") {
      // Для бота вебинаров фиксированный список
      const webinarTags = ["tgmain", "tgpartners", "email", "wa", "ytmain", "igmain", "website"];
      return webinarTags.includes(value);
    }
    // Для остальных случаев любой валидный UTM
    return /^[a-zA-Z0-9_-]+$/.test(value);
  };

  const getValidationError = (): string | null => {
    if (!formData.utmCampaign.trim()) {
      return "UTM метка обязательна";
    }
    if (!validateUtmCampaign(formData.utmCampaign)) {
      if (formData.linkType === "webinar_bot") {
        return "Для бота вебинаров используйте одну из меток: tgmain, tgpartners, email, wa, ytmain, igmain, website";
      }
      return "UTM метка может содержать только латинские буквы, цифры, дефис и подчёркивание";
    }
    return null;
  };

  const toggleSource = (sourceValue: string) => {
    const newSelectedSources = formData.selectedSources.includes(sourceValue)
      ? formData.selectedSources.filter(s => s !== sourceValue)
      : [...formData.selectedSources, sourceValue];
    
    setFormData(prev => ({
      ...prev,
      selectedSources: newSelectedSources
    }));

    // Убираем автоматический переход - оставляем возможность мультивыбора для всех типов ссылок
    // Пользователь сам решает когда переходить дальше через кнопку
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold">Шаг 1: Какую ссылку нужно создать?</h2>
        <p className="text-sm text-muted-foreground">Выберите тип ссылки, которую хотите сгенерировать</p>
      </div>
      
      <div className="grid gap-3 md:grid-cols-3">
        {LINK_TYPES.map((type) => (
          <Card 
            key={type.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              formData.linkType === type.id 
                ? "ring-2 ring-primary bg-primary/5" 
                : "hover:bg-accent/50"
            }`}
            onClick={() => handleLinkTypeSelect(type.id as LinkType)}
          >
            <CardContent className="p-4 text-center space-y-3">
              <type.icon className="w-8 h-8 mx-auto text-primary" />
              <div>
                <h3 className="font-semibold text-base">{type.label}</h3>
                <p className="text-xs text-muted-foreground">{type.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => {
    if (!formData.linkType) return null;

    let destinations: any[] = [];
    let title = "";

    switch (formData.linkType) {
      case "app":
        destinations = APP_DESTINATIONS;
        title = "Куда ведёт ссылка в приложении?";
        break;
      case "webinar_bot":
        destinations = WEBINAR_BOT_DESTINATIONS;
        title = "Куда ведёт ссылка в боте вебинаров?";
        break;
      case "partner_bot":
        destinations = PARTNER_BOT_DESTINATIONS;
        title = "На какой раздел ЛК партнёра ведёт ссылка?";
        break;
    }

    const selectedDestination = destinations.find(d => d.id === formData.destination);

  return (
      <div className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold">Шаг 2: {title}</h2>
          <p className="text-sm text-muted-foreground">Выберите куда должна вести ваша ссылка</p>
        </div>

        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          {destinations.map((dest) => (
            <Card 
              key={dest.id}
              className={`cursor-pointer transition-all hover:shadow-sm ${
                formData.destination === dest.id 
                  ? "ring-2 ring-primary bg-primary/5" 
                  : "hover:bg-accent/30"
              }`}
              onClick={() => {
                const needsExtraInfo = dest.needsId || dest.needsIdeaName || dest.hasSubPages;
                if (needsExtraInfo) {
                  updateFormData({ 
                    destination: dest.id,
                    destinationId: "",
                    subPage: "",
                    ideaName: ""
                  });
                } else {
                  handleDestinationSelect(dest.id);
                }
              }}
            >
              <CardContent className="p-3">
                <div className="space-y-1">
                  <span className="text-sm font-medium">{dest.label}</span>
                  {(dest.needsId || dest.needsIdeaName || dest.hasSubPages) && (
                    <Badge variant="outline" className="text-xs">
                      {dest.needsId ? "Нужен ID" : dest.needsIdeaName ? "Нужно название" : "Есть подстраницы"}
                    </Badge>
                  )}
                                  </div>
              </CardContent>
            </Card>
                                  ))}
                                </div>

        {selectedDestination && (
          <div className="space-y-3 mt-4 p-3 bg-accent/30 rounded-lg">
            {selectedDestination.needsId && (
              <div className="space-y-2">
                <Label htmlFor="destinationId">
                  ID {formData.destination?.includes("idea") ? "идеи" : 
                      formData.destination?.includes("news") ? "новости" : "инвестиции"}
                </Label>
                            <Input
                  id="destinationId"
                  value={formData.destinationId || ""}
                  onChange={(e) => updateFormData({ destinationId: e.target.value })}
                  placeholder="Введите ID"
                />
              </div>
            )}

            {selectedDestination.needsIdeaName && (
              <div className="space-y-2">
                <Label htmlFor="ideaName">
                  Название идеи
                </Label>
                            <Input
                  id="ideaName"
                  value={formData.ideaName || ""}
                  onChange={(e) => updateFormData({ 
                    ideaName: e.target.value.replace(/\s+/g, "-") 
                  })}
                  placeholder="Например: Scale-AI"
                />
                <p className="text-sm text-muted-foreground">
                  Пробелы автоматически заменяются на дефис
                </p>
              </div>
            )}

            {selectedDestination.hasSubPages && (
              <div className="space-y-2">
                <Label>Выберите вкладку</Label>
                            <Select
                  value={formData.subPage || ""} 
                  onValueChange={(value) => updateFormData({ subPage: value })}
                            >
                                <SelectTrigger>
                    <SelectValue placeholder="Выберите вкладку портфеля" />
                                </SelectTrigger>
                              <SelectContent>
                    {INVESTMENT_SUB_PAGES.map((page) => (
                      <SelectItem key={page.id} value={page.id}>
                        {page.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
              </div>
            )}
            
            <Button 
              onClick={() => handleDestinationSelect(formData.destination!)}
              className="w-full mt-3"
              size="sm"
            >
              Продолжить
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold">Шаг 3: Где планируется размещать / публиковать ссылку?</h2>
        <p className="text-sm text-muted-foreground">Выберите источники (можно несколько)</p>
      </div>

      <div className="space-y-6">
        {TELEGRAM_SOURCE_GROUPS.map((group) => (
          <div key={group.label} className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b">
              <group.icon className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">{group.label}</h3>
            </div>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {group.sources.map((source) => (
                <Card 
                  key={source.value}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    formData.selectedSources.includes(source.value)
                      ? "ring-2 ring-primary bg-primary/5 shadow-md" 
                      : "hover:bg-accent/50"
                  }`}
                  onClick={() => toggleSource(source.value)}
                >
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-center">{source.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Добавляем отступ снизу для фиксированной кнопки */}
      <div className="h-20"></div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold">Шаг 4: Укажите метку для отслеживания в аналитике</h2>
        <p className="text-sm text-muted-foreground">Введите UTM метку для идентификации кампании</p>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="utm">UTM метка</Label>
          <Input
            id="utm"
            value={formData.utmCampaign}
            onChange={(e) => updateFormData({ utmCampaign: e.target.value })}
            placeholder={
              formData.linkType === "webinar_bot" 
                ? "Используйте: tgmain, tgpartners, email, wa, ytmain, igmain, website"
                : "Например: post_100823"
            }
          />
          {getValidationError() && (
            <p className="text-sm text-destructive">{getValidationError()}</p>
          )}
          <p className="text-sm text-muted-foreground">
            {formData.linkType === "webinar_bot" 
              ? "Для бота вебинаров доступны только фиксированные метки"
              : "Метка поможет определить конкретный пост или материал, где размещена ссылка"
            }
          </p>
        </div>

        {/* Кнопка теперь фиксированная внизу экрана */}
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold">Шаг 5: Готовые ссылки</h2>
        <p className="text-sm text-muted-foreground">Ваши ссылки готовы! Скопируйте нужные или все сразу</p>
      </div>

      <div className="flex justify-center gap-3 mb-3">
        <Button onClick={copyAllLinks} size="sm">
          <Copy className="w-3 h-3 mr-2" />
          Скопировать все ссылки
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            setCurrentStep(1);
            setFormData({
              linkType: null,
              destination: null,
              utmCampaign: "",
              selectedSources: []
            });
            setGeneratedLinks([]);
          }}
        >
          Начать заново
        </Button>
      </div>

      <div className="space-y-3">
        {generatedLinks.map((link, index) => (
          <Card key={index}>
            <CardContent className="p-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{link.sourceLabel}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(link.url, index)}
                  >
                    {copiedIndex === index ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <code className="block p-2 bg-muted rounded text-xs break-all">
                  {link.url}
                </code>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent text-center">
              Генератор ссылок с UTM метками
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Прогресс */}
            <div className="flex items-center justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      currentStep >= step
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step}
                  </div>
                  {step < 5 && (
                    <div
                      className={`w-6 h-0.5 mx-1 ${
                        currentStep > step ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Контент шага */}
            <div className="min-h-[300px]">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && formData.linkType !== "webinar_bot" && formData.linkType !== "partner_bot" && renderStep4()}
              {currentStep === 5 && renderStep5()}
            </div>

            {/* Навигация */}
            {currentStep > 1 && currentStep < 5 && !(currentStep === 4 && (formData.linkType === "webinar_bot" || formData.linkType === "partner_bot")) && (
              <div className="flex justify-start pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPrevStep}
                >
                  <ChevronLeft className="w-3 h-3 mr-1" />
                  Назад
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Фиксированная кнопка для генерации/продолжения */}
        {currentStep === 3 && formData.selectedSources.length >= 1 && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10">
            <Button 
              onClick={(formData.linkType === "webinar_bot" || formData.linkType === "partner_bot") ? generateLinks : goToNextStep}
              size="lg"
              className="shadow-lg"
            >
              {(formData.linkType === "webinar_bot" || formData.linkType === "partner_bot")
                ? `Сгенерировать ссылки (${formData.selectedSources.length})`
                : `Продолжить с выбранными источниками (${formData.selectedSources.length})`
              }
            </Button>
          </div>
        )}

        {/* Фиксированная кнопка для шага 4 (UTM) */}
        {currentStep === 4 && !getValidationError() && formData.utmCampaign.trim() && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10">
            <Button 
              onClick={generateLinks}
              size="lg"
              className="shadow-lg"
            >
              Сгенерировать ссылки ({formData.selectedSources.length})
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}