import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import logo from "@/assets/productivity-assistant-logo.png";
import { generateEmail, generateResearch } from "@/lib/workplace-ai.functions";
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { DefaultChatTransport } from "ai";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Clipboard,
  Copy,
  FileSearch,
  Home,
  Lightbulb,
  Mail,
  Menu,
  MessageSquareText,
  RefreshCw,
  Send,
  ShieldCheck,
  Target,
  WandSparkles,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

type View = "overview" | "email" | "research" | "chat";
type Tone = "Formal" | "Friendly" | "Persuasive";

const chatTransport = new DefaultChatTransport({ api: "/api/chat" });

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Create polished emails, research faster, and get practical workplace support with AI.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "A focused AI workspace for email, research, and everyday professional tasks.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const navItems: { id: View; label: string; icon: typeof Home }[] = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "email", label: "Email Generator", icon: Mail },
  { id: "research", label: "Research Assistant", icon: FileSearch },
  { id: "chat", label: "Workplace Chat", icon: MessageSquareText },
];

const featureMeta = {
  email: {
    eyebrow: "Smart writing",
    title: "Smart Email Generator",
    description: "Turn a few clear details into a polished email you can edit and send.",
  },
  research: {
    eyebrow: "Faster understanding",
    title: "AI Research Assistant",
    description: "Distill dense material into useful findings and practical next steps.",
  },
  chat: {
    eyebrow: "On-demand support",
    title: "AI Workplace Chat",
    description:
      "Think through plans, decisions, writing, and everyday work with a focused assistant.",
  },
};

function Index() {
  const [view, setView] = useState<View>("overview");
  const [mobileOpen, setMobileOpen] = useState(false);

  const selectView = (next: View) => {
    setView(next);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[264px_minmax(0,1fr)]">
        <aside className="hidden bg-sidebar text-sidebar-foreground lg:flex lg:flex-col">
          <Sidebar active={view} onSelect={selectView} />
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur md:px-8 lg:px-10">
            <div className="flex min-w-0 items-center gap-3">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button
                    aria-label="Open navigation"
                    className="lg:hidden"
                    size="icon"
                    variant="outline"
                  >
                    <Menu />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  className="w-[290px] border-sidebar-border bg-sidebar p-0 text-sidebar-foreground"
                  side="left"
                >
                  <SheetHeader className="sr-only">
                    <SheetTitle>Workspace navigation</SheetTitle>
                    <SheetDescription>Choose a productivity tool.</SheetDescription>
                  </SheetHeader>
                  <Sidebar active={view} onSelect={selectView} />
                </SheetContent>
              </Sheet>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold uppercase text-muted-foreground">
                  AI workspace
                </p>
                <p className="truncate text-sm font-semibold">
                  {view === "overview" ? "Productivity hub" : featureMeta[view].title}
                </p>
              </div>
            </div>
            <Badge className="hidden items-center gap-1.5 sm:flex" variant="secondary">
              <span className="size-1.5 rounded-full bg-success" /> AI ready
            </Badge>
          </header>

          <main className="mx-auto w-full max-w-[1500px] px-4 py-6 md:px-8 md:py-9 lg:px-10">
            {view === "overview" ? (
              <Overview onSelect={selectView} />
            ) : (
              <section className="page-enter">
                <PageHeading {...featureMeta[view]} />
                {view === "email" && <EmailGenerator />}
                {view === "research" && <ResearchAssistant />}
                {view === "chat" && <WorkplaceChat />}
              </section>
            )}
            <ResponsibleAI />
          </main>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ active, onSelect }: { active: View; onSelect: (view: View) => void }) {
  return (
    <div className="flex h-full min-h-screen flex-col p-4">
      <div className="flex items-center gap-3 px-2 py-3">
        <img
          alt="AI Workplace Productivity Assistant"
          className="size-10 rounded-md bg-sidebar-accent object-contain p-1"
          src={logo}
        />
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-sidebar-muted">AI Workplace</p>
          <p className="truncate text-sm font-bold">Productivity Assistant</p>
        </div>
      </div>

      <nav aria-label="Workspace" className="mt-7 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const selected = active === item.id;
          return (
            <Button
              className={cn(
                "h-11 w-full justify-start px-3 text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                selected && "bg-sidebar-accent text-sidebar-accent-foreground",
              )}
              key={item.id}
              onClick={() => onSelect(item.id)}
              variant="ghost"
            >
              <Icon />
              {item.label}
            </Button>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-sidebar-border px-2 pt-4">
        <div className="flex items-start gap-2.5 text-xs leading-5 text-sidebar-muted">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-sidebar-primary" />
          <p>Review important details before using AI output professionally.</p>
        </div>
      </div>
    </div>
  );
}

function Overview({ onSelect }: { onSelect: (view: View) => void }) {
  const tools = [
    {
      id: "email" as const,
      icon: Mail,
      label: "Write an email",
      copy: "Create a polished message from your goal and key points.",
      action: "Start writing",
    },
    {
      id: "research" as const,
      icon: FileSearch,
      label: "Analyze content",
      copy: "Summarize source material and surface actionable insights.",
      action: "Start research",
    },
    {
      id: "chat" as const,
      icon: MessageSquareText,
      label: "Ask the assistant",
      copy: "Work through a question, plan, or workplace challenge.",
      action: "Open chat",
    },
  ];

  return (
    <section className="page-enter">
      <div className="subtle-grid relative overflow-hidden border-b pb-10 pt-3 md:pb-14 md:pt-6">
        <div className="max-w-3xl">
          <Badge variant="secondary">Your focused workbench</Badge>
          <h1 className="mt-5 font-display text-3xl font-bold leading-tight md:text-5xl">
            Move important work forward.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
            Draft clearer communication, turn information into decisions, and get practical support
            without leaving your workspace.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Card
              className="group rounded-lg shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              key={tool.id}
            >
              <CardHeader>
                <div className="mb-3 flex size-10 items-center justify-center rounded-md bg-secondary text-primary">
                  <Icon />
                </div>
                <CardTitle className="text-lg">{tool.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="min-h-12 text-sm leading-6 text-muted-foreground">{tool.copy}</p>
                <Button className="mt-6 px-0" onClick={() => onSelect(tool.id)} variant="link">
                  {tool.action} <ArrowRight />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-10 grid gap-6 border-t pt-8 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="text-sm font-semibold">A simple workflow for better output</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {["Add useful context", "Generate with AI", "Review and refine"].map((step, index) => (
              <div className="flex items-center gap-3 text-sm text-muted-foreground" key={step}>
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-primary">
                  {index + 1}
                </span>
                {step}
              </div>
            ))}
          </div>
        </div>
        <div className="border-l-0 md:border-l md:pl-6">
          <p className="text-sm font-semibold">Built for focused work</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Your inputs shape every result. The assistant does not rely on canned workplace
            responses.
          </p>
        </div>
      </div>
    </section>
  );
}

function PageHeading({
  eyebrow,
  title,
  description,
}: (typeof featureMeta)[keyof typeof featureMeta]) {
  return (
    <div className="mb-7 max-w-3xl">
      <p className="text-xs font-bold uppercase text-primary">{eyebrow}</p>
      <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">{title}</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base">{description}</p>
    </div>
  );
}

function EmailGenerator() {
  const createEmail = useServerFn(generateEmail);
  const [form, setForm] = useState({
    recipient: "",
    purpose: "",
    keyPoints: "",
    tone: "Formal" as Tone,
  });
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const canGenerate = form.recipient.trim() && form.purpose.trim() && form.keyPoints.trim();

  const submit = async () => {
    if (!canGenerate) return;
    setError("");
    setLoading(true);
    try {
      const result = await createEmail({ data: form });
      setOutput(result.text);
    } catch (cause) {
      setError(getErrorMessage(cause));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(320px,0.8fr)_minmax(0,1.2fr)]">
      <Card className="rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Email brief</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <Field label="Recipient or context" htmlFor="recipient">
            <Input
              id="recipient"
              onChange={(event) => setForm({ ...form, recipient: event.target.value })}
              placeholder="e.g. Project sponsor after a delayed milestone"
              value={form.recipient}
            />
          </Field>
          <Field label="Purpose" htmlFor="purpose">
            <Input
              id="purpose"
              onChange={(event) => setForm({ ...form, purpose: event.target.value })}
              placeholder="e.g. Share an updated delivery plan"
              value={form.purpose}
            />
          </Field>
          <Field label="Key points" htmlFor="key-points">
            <Textarea
              className="min-h-32 resize-y"
              id="key-points"
              onChange={(event) => setForm({ ...form, keyPoints: event.target.value })}
              placeholder="Add the facts, dates, requests, and outcome you need…"
              value={form.keyPoints}
            />
          </Field>
          <Field label="Tone" htmlFor="tone">
            <Select onValueChange={(tone: Tone) => setForm({ ...form, tone })} value={form.tone}>
              <SelectTrigger id="tone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Formal">Formal</SelectItem>
                <SelectItem value="Friendly">Friendly</SelectItem>
                <SelectItem value="Persuasive">Persuasive</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Button className="w-full" disabled={!canGenerate || loading} onClick={submit}>
            {loading ? (
              <>
                <RefreshCw className="animate-spin" /> Writing email…
              </>
            ) : (
              <>
                <WandSparkles /> Generate email
              </>
            )}
          </Button>
          {error && <InlineError message={error} />}
        </CardContent>
      </Card>

      <OutputPanel
        actions={
          output ? (
            <>
              <Button
                onClick={async () => {
                  await navigator.clipboard.writeText(output);
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 1500);
                }}
                size="sm"
                variant="outline"
              >
                {copied ? <Check /> : <Copy />} {copied ? "Copied" : "Copy"}
              </Button>
              <Button disabled={loading} onClick={submit} size="sm" variant="outline">
                <RefreshCw /> Regenerate
              </Button>
            </>
          ) : null
        }
        emptyIcon={<Mail />}
        emptyText="Complete the email brief to create your first draft."
        loading={loading}
        title="Generated email"
      >
        {output && (
          <Textarea
            aria-label="Generated email"
            className="min-h-[420px] resize-y border-0 bg-panel p-5 leading-7 shadow-none focus-visible:ring-1"
            onChange={(event) => setOutput(event.target.value)}
            value={output}
          />
        )}
      </OutputPanel>
    </div>
  );
}

function ResearchAssistant() {
  const runResearch = useServerFn(generateResearch);
  const [source, setSource] = useState("");
  const [result, setResult] = useState({ summary: "", insights: "", recommendations: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const hasResult = Boolean(result.summary || result.insights || result.recommendations);

  const submit = async () => {
    if (!source.trim()) return;
    setError("");
    setLoading(true);
    try {
      setResult(await runResearch({ data: { source } }));
    } catch (cause) {
      setError(getErrorMessage(cause));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(320px,0.75fr)_minmax(0,1.25fr)]">
      <Card className="h-fit rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Research source</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="source">Topic, article text, or website URL</Label>
            <Textarea
              className="mt-2 min-h-64 resize-y"
              id="source"
              onChange={(event) => setSource(event.target.value)}
              placeholder="Paste an article, enter a topic, or add a URL…"
              value={source}
            />
          </div>
          <Button className="w-full" disabled={!source.trim() || loading} onClick={submit}>
            {loading ? (
              <>
                <RefreshCw className="animate-spin" /> Analyzing…
              </>
            ) : (
              <>
                <FileSearch /> Analyze content
              </>
            )}
          </Button>
          {error && <InlineError message={error} />}
        </CardContent>
      </Card>

      <OutputPanel
        actions={
          hasResult ? (
            <>
              <Button
                onClick={() =>
                  navigator.clipboard.writeText(
                    `${result.summary}\n\n${result.insights}\n\n${result.recommendations}`,
                  )
                }
                size="sm"
                variant="outline"
              >
                <Copy /> Copy all
              </Button>
              <Button disabled={loading} onClick={submit} size="sm" variant="outline">
                <RefreshCw /> Regenerate
              </Button>
            </>
          ) : null
        }
        emptyIcon={<FileSearch />}
        emptyText="Add source material to reveal the essentials and next steps."
        loading={loading}
        title="Research output"
      >
        {hasResult && (
          <div className="space-y-4">
            <ResearchSection
              icon={<Clipboard />}
              label="Summary"
              onChange={(summary) => setResult({ ...result, summary })}
              value={result.summary}
            />
            <ResearchSection
              icon={<Lightbulb />}
              label="Key insights"
              onChange={(insights) => setResult({ ...result, insights })}
              value={result.insights}
            />
            <ResearchSection
              icon={<Target />}
              label="Recommendations"
              onChange={(recommendations) => setResult({ ...result, recommendations })}
              value={result.recommendations}
            />
          </div>
        )}
      </OutputPanel>
    </div>
  );
}

function ResearchSection({
  icon,
  label,
  value,
  onChange,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <section className="rounded-md border bg-panel p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-panel-foreground">
          <span className="text-primary">{icon}</span>
          {label}
        </h3>
        <Button
          aria-label={`Copy ${label}`}
          onClick={() => navigator.clipboard.writeText(value)}
          size="icon-sm"
          variant="ghost"
        >
          <Copy />
        </Button>
      </div>
      <Textarea
        aria-label={label}
        className="min-h-32 resize-y border-0 bg-transparent p-0 leading-6 shadow-none focus-visible:ring-0"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </section>
  );
}

function WorkplaceChat() {
  const { messages, sendMessage, status, error, stop, regenerate } = useChat({
    id: "workplace-assistant",
    transport: chatTransport,
  });
  const busy = status === "submitted" || status === "streaming";
  const suggestions = [
    "Turn my meeting notes into an action plan",
    "Help me prepare for a difficult stakeholder conversation",
    "Create a concise agenda for a project kickoff",
  ];

  return (
    <Card className="flex h-[min(720px,calc(100vh-190px))] min-h-[560px] flex-col overflow-hidden rounded-lg shadow-sm">
      <div className="flex items-center justify-between border-b px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <img
            alt="Workplace assistant"
            className="size-9 rounded-md bg-secondary object-contain p-1"
            src={logo}
          />
          <div>
            <p className="text-sm font-semibold">Workplace Assistant</p>
            <p className="text-xs text-muted-foreground">Ready to help you think and create</p>
          </div>
        </div>
        <Badge variant="secondary">
          <span className="mr-1.5 inline-block size-1.5 rounded-full bg-success" />
          Online
        </Badge>
      </div>

      <Conversation className="min-h-0 bg-card">
        <ConversationContent className="mx-auto w-full max-w-4xl gap-6 px-4 py-7 md:px-8">
          {messages.length === 0 ? (
            <ConversationEmptyState className="min-h-80">
              <img
                alt="AI Workplace Productivity Assistant"
                className="size-16 rounded-lg bg-secondary object-contain p-2"
                src={logo}
              />
              <div className="mt-2 max-w-lg">
                <h2 className="text-lg font-semibold">What are you working on?</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Ask for help with planning, communication, analysis, or a workplace decision.
                </p>
              </div>
              <div className="mt-4 grid w-full max-w-xl gap-2 sm:grid-cols-3">
                {suggestions.map((suggestion) => (
                  <Button
                    className="h-auto min-h-20 whitespace-normal px-3 py-3 text-left text-xs leading-5"
                    disabled={busy}
                    key={suggestion}
                    onClick={() => sendMessage({ text: suggestion })}
                    variant="outline"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </ConversationEmptyState>
          ) : (
            messages.map((message) => {
              const text = message.parts
                .filter((part) => part.type === "text")
                .map((part) => part.text)
                .join("");
              return (
                <Message from={message.role} key={message.id}>
                  <MessageContent className="group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground">
                    {message.parts.map((part, index) =>
                      part.type === "text" ? (
                        <MessageResponse key={`${message.id}-${index}`}>
                          {part.text}
                        </MessageResponse>
                      ) : null,
                    )}
                  </MessageContent>
                  {message.role === "assistant" && text && (
                    <MessageActions>
                      <MessageAction
                        label="Copy response"
                        onClick={() => navigator.clipboard.writeText(text)}
                        tooltip="Copy"
                      >
                        <Copy />
                      </MessageAction>
                      <MessageAction
                        label="Regenerate response"
                        onClick={() => regenerate()}
                        tooltip="Regenerate"
                      >
                        <RefreshCw />
                      </MessageAction>
                    </MessageActions>
                  )}
                </Message>
              );
            })
          )}
          {status === "submitted" && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shimmer>Thinking through your request…</Shimmer>
            </div>
          )}
          {error && <InlineError message={getErrorMessage(error)} />}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t bg-background p-3 md:p-4">
        <PromptInput
          className="mx-auto max-w-4xl"
          onSubmit={async ({ text }) => {
            if (text.trim()) await sendMessage({ text: text.trim() });
          }}
        >
          <PromptInputTextarea
            disabled={busy}
            placeholder="Ask a workplace question or describe a task…"
          />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit
              disabled={!busy && status === "error"}
              onStop={stop}
              status={status}
            />
          </PromptInputFooter>
        </PromptInput>
        <p className="mx-auto mt-2 max-w-4xl text-center text-[11px] text-muted-foreground">
          AI can make mistakes. Review important information.
        </p>
      </div>
    </Card>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={htmlFor}>{label}</Label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function OutputPanel({
  title,
  loading,
  emptyIcon,
  emptyText,
  actions,
  children,
}: {
  title: string;
  loading: boolean;
  emptyIcon: ReactNode;
  emptyText: string;
  actions: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card className="min-h-[520px] rounded-lg shadow-sm">
      <CardHeader className="flex-row items-center justify-between gap-4 space-y-0 border-b">
        <CardTitle className="text-base">{title}</CardTitle>
        <div className="flex flex-wrap justify-end gap-2">{actions}</div>
      </CardHeader>
      <CardContent className="p-5 md:p-6">
        {loading ? (
          <div className="flex min-h-[380px] flex-col items-center justify-center gap-4 text-center">
            <div className="flex size-12 items-center justify-center rounded-md bg-secondary text-primary">
              <WandSparkles className="animate-pulse" />
            </div>
            <Shimmer>Creating a thoughtful result…</Shimmer>
          </div>
        ) : children ? (
          children
        ) : (
          <div className="flex min-h-[380px] flex-col items-center justify-center text-center">
            <div className="flex size-12 items-center justify-center rounded-md bg-secondary text-primary">
              {emptyIcon}
            </div>
            <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">{emptyText}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function InlineError({ message }: { message: string }) {
  return (
    <Alert variant="destructive">
      <AlertTriangle />
      <AlertTitle>Something went wrong</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

function ResponsibleAI() {
  return (
    <footer className="mt-10 flex items-start gap-2 border-t py-6 text-xs leading-5 text-muted-foreground">
      <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
      <p>
        <span className="font-semibold text-foreground">Responsible AI:</span> AI outputs may
        contain errors or omissions. Review and verify important details before professional use.
      </p>
    </footer>
  );
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "The request could not be completed. Please review your input and try again.";
}
