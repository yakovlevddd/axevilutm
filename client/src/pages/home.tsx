import { useState } from "react";
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
  appLinkSchema,
  webinarLinkSchema,
  pageTypes,
  innerPageTypes,
} from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [linkType, setLinkType] = useState<"app" | "webinar">("app");
  const { toast } = useToast();

  const appForm = useForm<AppLinkParams>({
    resolver: zodResolver(appLinkSchema),
    defaultValues: {
      baseUrl: BASE_URL_GROUPS[0].urls[0].url,
      campaign: "",
    },
  });

  const webinarForm = useForm<WebinarLinkParams>({
    resolver: zodResolver(webinarLinkSchema),
    defaultValues: {
      postfix: "",
    },
  });

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
      : generateWebinarLink(webinarForm.watch());

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
              onValueChange={(v) => setLinkType(v as "app" | "webinar")}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="app">Ссылка на приложение</TabsTrigger>
                <TabsTrigger value="webinar">Ссылка на вебинар</TabsTrigger>
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

              <TabsContent value="webinar">
                <Form {...webinarForm}>
                  <form className="space-y-4">
                    <FormField
                      control={webinarForm.control}
                      name="postfix"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Тег источника</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Например: tg-main" />
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
