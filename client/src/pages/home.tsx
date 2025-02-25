import { useState } from "react";
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
      prefix: "",
      source: ""
    }
  });

  const generateAppLink = (data: AppLinkParams) => {
    const params = new URLSearchParams();
    params.append("~campaign", data.campaign);
    if (data.feature) params.append("~feature", data.feature);
    if (data.pageType) params.append("page_type", data.pageType);
    if (data.pageId) params.append("page_id", data.pageId);
    if (data.initialInnerPage) params.append("initial_inner_page", data.initialInnerPage);
    return `${data.baseUrl}?${params.toString()}`;
  };

  const generateWebinarLink = (data: WebinarLinkParams) => {
    return `https://t.me/axevil_events_bot?start=web_${data.prefix}-${data.source}`;
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Link copied!",
      description: "The generated link has been copied to your clipboard."
    });
  };

  const currentForm = linkType === "app" ? appForm : webinarForm;
  const generatedLink = linkType === "app" 
    ? (appForm.formState.isValid ? generateAppLink(appForm.getValues()) : "") 
    : (webinarForm.formState.isValid ? generateWebinarLink(webinarForm.getValues()) : "");

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              UTM Link Generator
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
                        <FormLabel>Base URL</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select base URL" />
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
                          Campaign
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="w-4 h-4" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Campaign name to track the source (e.g., post_100823)</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., post_100823" />
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
                          Feature (Optional)
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="w-4 h-4" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Specific placement or feature (e.g., button_top)</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., button_top" />
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
                        <FormLabel>Page Type (Optional)</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select page type" />
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

                  {appForm.watch("pageType") && (
                    <FormField
                      control={appForm.control}
                      name="pageId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Page ID</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter page ID" />
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
                          <FormLabel>Initial Inner Page</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select inner page" />
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
                    name="prefix"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          Webinar Prefix
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="w-4 h-4" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Webinar identifier (e.g., uzum051023)</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., uzum051023" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={webinarForm.control}
                    name="source"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          Source
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="w-4 h-4" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Traffic source (e.g., tgmain)</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., tgmain" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            )}

            {generatedLink && (
              <div className="mt-6 space-y-2">
                <div className="font-medium">Generated Link:</div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-2 bg-muted rounded-md break-all">
                    {generatedLink}
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
