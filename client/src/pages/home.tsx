import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, Check, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { BASE_URL_GROUPS } from "@/lib/constants";
import {
  AppLinkParams,
  WebinarLinkParams,
  TelegramLinkParams,
  appLinkSchema,
  webinarLinkSchema,
  telegramLinkSchema,
  pageTypes,
  innerPageTypes,
  telegramBots,
  webinarBotScenarios,
  partnerBotScenarios,
} from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [linkType, setLinkType] = useState<"app" | "telegram">("app");
  const { toast } = useToast();

  const appForm = useForm<AppLinkParams>({
    resolver: zodResolver(appLinkSchema),
    defaultValues: {
      baseUrl: BASE_URL_GROUPS[0].urls[0].url,
      campaign: "",
    },
  });

  const telegramForm = useForm<TelegramLinkParams>({
    resolver: zodResolver(telegramLinkSchema),
    defaultValues: {
      botType: "axevil_events_bot",
      scenario: "web_",
      postfix: "",
    },
  });

  // Для обратной совместимости
  const webinarForm = useForm<WebinarLinkParams>({
    resolver: zodResolver(webinarLinkSchema),
    defaultValues: {
      postfix: "",
    },
  });

  // Отслеживаем изменение типа бота для обновления доступных сценариев
  const selectedBotType = telegramForm.watch("botType");
  
  useEffect(() => {
    // Сбрасываем сценарий при смене бота
    if (selectedBotType === "axevil_events_bot") {
      telegramForm.setValue("scenario", "web_");
    } else if (selectedBotType === "axevil_partner_bot") {
      telegramForm.setValue("scenario", "partnerinfo_");
    } else if (selectedBotType === "the_axevil_bot") {
      telegramForm.setValue("scenario", "");
    }
  }, [selectedBotType, telegramForm]);

  const generateAppLink = (data: AppLinkParams) => {
    if (!data.campaign) return "";
    const params = [] as string[];
    params.push(`~campaign=${data.campaign}`);
    if (data.feature) params.push(`~feature=${data.feature}`);
    if (data.pageType) params.push(`page_type=${data.pageType}`);
    if (data.pageId) params.push(`page_id=${data.pageId}`);
    if (data.initialInnerPage)
      params.push(`initial_inner_page=${data.initialInnerPage}`);
    return `${data.baseUrl}?${params.join("&")}`;
  };

  const generateTelegramLink = (data: TelegramLinkParams) => {
    const baseUrl = `https://t.me/${data.botType}`;
    
    // Для бота Клаудия не используем сценарий
    if (data.botType === "the_axevil_bot") {
      return `${baseUrl}?start=${data.postfix}`;
    }
    
    // Для остальных ботов добавляем сценарий
    return `${baseUrl}?start=${data.scenario}${data.postfix}`;
  };

  // Для обратной совместимости
  const generateWebinarLink = (data: WebinarLinkParams) => {
    return `https://t.me/axevil_events_bot?start=web_${data.postfix}`;
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Ссылка скопирована!",
      description: "Сгенерированная ссылка скопирована в буфер обмена.",
    });
  };

  const generatedLink =
    linkType === "app"
      ? generateAppLink(appForm.watch())
      : generateTelegramLink(telegramForm.watch());

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Генератор ссылок с UTM метками
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              value={linkType}
              onValueChange={(v) => setLinkType(v as "app" | "telegram")}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="app">Ссылка на приложение</TabsTrigger>
                <TabsTrigger value="telegram">Ссылка на Telegram-бот</TabsTrigger>
              </TabsList>

              <TabsContent value="app">
                <Form {...appForm}>
                  <form className="space-y-4">
                    <FormField
                      control={appForm.control}
                      name="baseUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Где публикуем ссылку</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите площадку" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {BASE_URL_GROUPS.map((group) => (
                                <div key={group.label}>
                                  <div className="flex items-center px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                                    <group.icon className="w-4 h-4 mr-2" />
                                    {group.label}
                                  </div>
                                  {group.urls.map(({ url, label }) => (
                                    <SelectItem key={url} value={url}>
                                      {label}
                                    </SelectItem>
                                  ))}
                                </div>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={appForm.control}
                      name="campaign"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            Тег источника
                            <TooltipProvider>
                              <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    Помогает определить, в какой именно единице
                                    контента размещена ссылка. Например, для
                                    Telegram это может быть дата или название
                                    поста (aichampions100825)
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Например: post_100823"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={appForm.control}
                      name="feature"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            Дополнительный параметр отслеживания (необязательно)
                            <TooltipProvider>
                              <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    Позволяет более точно определить место
                                    размещения ссылки. Например, если в одной
                                    PDF презентации есть две кнопки, то можно
                                    использовать разные ссылки для разных
                                    кнопок, отличающиеся дополнительным
                                    парамтером (например page1 или last_page)
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Например: button_top"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={appForm.control}
                      name="pageType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Какая страница открывается по ссылке (необязательно)
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите тип страницы" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {pageTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    {appForm.watch("pageType") &&
                      ["idea", "news", "order"].includes(
                        appForm.watch("pageType"),
                      ) && (
                        <FormField
                          control={appForm.control}
                          name="pageId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ID идеи / новости / ордера</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Введите ID страницы"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                    {appForm.watch("pageType") === "portfolio" && (
                      <FormField
                        control={appForm.control}
                        name="initialInnerPage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Вкладка портфеля</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Выберите вкладку" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {innerPageTypes.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    )}
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="telegram">
                <Form {...telegramForm}>
                  <form className="space-y-4">
                    <FormField
                      control={telegramForm.control}
                      name="botType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Бот</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите бота" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="axevil_events_bot">
                                Бот для вебинаров (@axevil_events_bot)
                              </SelectItem>
                              <SelectItem value="axevil_partner_bot">
                                ЛК для партнёров (@axevil_partner_bot)
                              </SelectItem>
                              <SelectItem value="the_axevil_bot">
                                Клаудия (@the_axevil_bot)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    {selectedBotType !== "the_axevil_bot" && (
                      <FormField
                        control={telegramForm.control}
                        name="scenario"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Что происходит при переходе по ссылке</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Выберите сценарий" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {selectedBotType === "axevil_events_bot" ? (
                                  <>
                                    <SelectItem value="web_">
                                      Регистрация на вебинар
                                    </SelectItem>
                                    <SelectItem value="webrec_">
                                      Получить запись вебинара
                                    </SelectItem>
                                    <SelectItem value="commit_">
                                      Оставить заявку на консультацию
                                    </SelectItem>
                                  </>
                                ) : (
                                  <>
                                    <SelectItem value="partnerinfo_">
                                      Получить партнёрский отчёт
                                    </SelectItem>
                                    <SelectItem value="getinvite_">
                                      Сгенерировать приглашение на вебинар
                                    </SelectItem>
                                    <SelectItem value="getpitch_">
                                      Получить сообщение-питч
                                    </SelectItem>
                                    <SelectItem value="commit_">
                                      Оставить заявку на консультацию
                                    </SelectItem>
                                    <SelectItem value="newpartner_">
                                      Стать партнёром
                                    </SelectItem>
                                  </>
                                )}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={telegramForm.control}
                      name="postfix"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Тег источника (UTM-campaign)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Например: tgmain" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 space-y-2">
              <div className="font-medium">Итоговая ссылка:</div>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 bg-muted rounded-md break-all">
                  {generatedLink ||
                    "Заполните необходимые поля для создания ссылки"}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(generatedLink)}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
