import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, Check, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { LINK_TYPES, BASE_URL_GROUPS } from "@/lib/constants";
import { AppLinkParams, WebinarLinkParams, appLinkSchema, webinarLinkSchema, pageTypes, innerPageTypes } from "@shared/schema";

export default function Home() {
  const [linkType, setLinkType] = useState<"app" | "webinar">("app");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const appForm = useForm<AppLinkParams>({
    resolver: zodResolver(appLinkSchema),
    defaultValues: {
      baseUrl: BASE_URL_GROUPS[0].urls[0].url,
      campaign: "",
    }
  });

  const webinarForm = useForm<WebinarLinkParams>({
    resolver: zodResolver(webinarLinkSchema),
    defaultValues: {
      utmTag: ""
    }
  });

  const generateAppLink = (data: AppLinkParams) => {
    if (!data.campaign) return "";
    const params = new URLSearchParams();
    params.append("~campaign", data.campaign);
    if (data.feature) params.append("~feature", data.feature);
    if (data.pageType) params.append("page_type", data.pageType);
    if (data.pageId && ["idea", "news", "order"].includes(data.pageType || "")) params.append("page_id", data.pageId);
    if (data.initialInnerPage) params.append("initial_inner_page", data.initialInnerPage);
    return `${data.baseUrl}?${params.toString()}`;
  };

  const generateWebinarLink = (data: WebinarLinkParams) => {
    if (!data.utmTag) return "";
    return `https://t.me/the_axevil_bot?start=${data.utmTag}`;
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Ссылка скопирована!",
      description: "Сгенерированная ссылка скопирована в буфер обмена."
    });
  };

  // Подписываемся на изменения формы для автоматической генерации ссылки
  const currentForm = linkType === "app" ? appForm : webinarForm;
  const generatedLink = linkType === "app" 
    ? generateAppLink(appForm.watch())
    : generateWebinarLink(webinarForm.watch());

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Генератор UTM-ссылок
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup
              defaultValue="app"
              onValueChange={(value) => setLinkType(value as "app" | "webinar")}
              className="flex space-x-4"
            >
              {LINK_TYPES.map(type => (
                <div key={type.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={type.id} id={type.id} />
                  <label htmlFor={type.id} className="font-medium cursor-pointer">
                    {type.label}
                  </label>
                </div>
              ))}
            </RadioGroup>

            {linkType === "app" ? (
              <Form {...appForm}>
                <form className="space-y-4">
                  <FormField
                    control={appForm.control}
                    name="baseUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Где публикуется ссылка</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите площадку" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {BASE_URL_GROUPS.map(group => (
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
                          Кампания
                          <HelpCircle className="w-4 h-4 text-muted-foreground" />
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Помогает определить, в какой именно единице контента размещена ссылка. Например, для Telegram это может быть дата или название поста (post_100823 или post_champions_1008)</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Например: post_100823" />
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
                          Дополнительный параметр (необязательно)
                          <HelpCircle className="w-4 h-4 text-muted-foreground" />
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Позволяет более точно определить место размещения ссылки. Например, в одной PDF презентации есть две кнопки, тогда здесь можно указать пояснение в виде page1 или last_page</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Например: button_top" />
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
                        <FormLabel>Тип страницы (необязательно)</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите тип страницы" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {pageTypes.map(type => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  {appForm.watch("pageType") && ["idea", "news", "order"].includes(appForm.watch("pageType")) && (
                    <FormField
                      control={appForm.control}
                      name="pageId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ID страницы</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Введите ID страницы" />
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
                          <FormLabel>Начальная вкладка</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите вкладку" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {innerPageTypes.map(type => (
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
            ) : (
              <Form {...webinarForm}>
                <form className="space-y-4">
                  <FormField
                    control={webinarForm.control}
                    name="utmTag"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          UTM-метка
                          <HelpCircle className="w-4 h-4 text-muted-foreground" />
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>UTM-метка для отслеживания источника трафика. Указывается английскими буквами без специальных символов и пробелов. Допускается использование цифр и знака дефис ( - )</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Например: webinar_post_100823" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            )}

            <div className="space-y-2">
              <div className="font-medium">Сгенерированная ссылка:</div>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 bg-muted rounded-md break-all">
                  {generatedLink || "Заполните необходимые поля для генерации ссылки"}
                </code>
                {generatedLink && (
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
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}