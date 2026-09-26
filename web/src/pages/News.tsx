import { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  FileText,
  Search,
  Sparkles,
  User,
  X,
} from "lucide-react";
import AppShell from "../components/AppShell";
import type { View } from "../App";

type NewsPageProps = {
  onNavigate: (view: View) => void;
};

const menuItems = [
  { label: "Ranking", icon: BarChart3, view: "dashboard" as const },
  { label: "Search", icon: Search, view: "search" as const },
  {
    label: "News",
    icon: FileText,
    view: "news" as const,
    active: true,
  },
  { label: "Profile", icon: User, view: "profile" as const },
];

type NewsItem = {
  ticker: string;
  company: string;
  date: string;
  title: string;
  excerpt: string;
  detail?: string;
  tags: string[];
  tagsTone: "red" | "amber" | "green" | "slate";
  score: number;
};

const NEWS_ITEMS: NewsItem[] = [
  {
    ticker: "MDAK",
    company: "Merkeda",
    date: "Sep 26, 2024",
    title:
      "Merkeda (MDAK) reports USD10.1 million net profit in 2026, a 7.43% surge from last year's loss",
    excerpt:
      "Merkeda (MDAK), the Indonesian asset manager, posted a stronger earnings mix while margins improved as operating cash conversion strengthened in the latest quarterly report.",
    tags: ["Annual Report", "Bullish", "Ref: IDX-FIN-2026-MDKA"],
    tagsTone: "green",
    score: 3,
  },
  {
    ticker: "GOTO",
    company: "GoTo Gojek Tokopedia",
    date: "Sep 26, 2024",
    title:
      "BEI removes Rp 50 floor price, opening trading range for PT GoTo Gojek Tokopedia Tbk (GOTO)",
    excerpt:
      "The Indonesia Stock Exchange announced the removal of the Rp 50 minimum price floor for all listed securities, effectively easing a six-month trading restriction.",
    tags: ["Regulation", "Neutral", "High Match", "Ref: IDX-2024-21"],
    tagsTone: "amber",
    score: 5,
  },
  {
    ticker: "WASK",
    company: "Waskita Karya",
    date: "Today • 08:30",
    title:
      "IDX Extends Trading Suspension for PT Waskita Karya Amid Coupon Default & Standstill",
    excerpt:
      "Exchange officials extended the suspension after the issuer failed to provide timely updates on bond restructuring and debt covenant negotiations.",
    tags: ["Critical Risk", "High Risk", "Suspension", "Ref: IDX-2023-02"],
    tagsTone: "red",
    score: 12,
  },
  {
    ticker: "KAEF",
    company: "Kimia Farma",
    date: "2 Days Ago • 14:15 WIB",
    title:
      "Special Audit initiated on Subsidiary Accounting Irregularities and Inventory Delta",
    excerpt:
      "Investigation launched following inventory valuation discrepancies and delayed disclosures tied to a subsidiary financial restatement and compliance review.",
    tags: ["Corporate Action", "Moderate Risk", "Ref: IDX-KAEF-2024"],
    tagsTone: "slate",
    score: 5,
  },
  {
    ticker: "BBAA",
    company: "Bank Central Asia",
    date: "Oct 12, 2024",
    title:
      "Bank Indonesia Adjusts Reserve Requirements; Liquidity Headroom Resilient",
    excerpt:
      "Macroprudential liquidity policy update demonstrates adequate tier-1 capital buffers and continued resilience in system funding conditions.",
    tags: ["Macro", "Risk - Low", "Ref: BI-IDX-CB-66"],
    tagsTone: "green",
    score: 19,
  },
];

const tagClassNames = {
  red: "border-[#f4d1cb] bg-[#fbeceb] text-[#b2382d]",
  amber: "border-[#f4dfb0] bg-[#fff6df] text-[#8a6300]",
  green: "border-[#cfe9d8] bg-[#edf8f0] text-[#177345]",
  slate: "border-[#dfe3ea] bg-[#f1f4f8] text-[#4b5563]",
};

type DraftDispatch = {
  ticker: string;
  company: string;
  date: string;
  title: string;
  excerpt: string;
  detail: string;
  tags: string;
};

const createDispatchInitialState: DraftDispatch = {
  ticker: "",
  company: "",
  date: "Today • 09:00",
  title: "",
  excerpt: "",
  detail: "",
  tags: "Market Update, Risk Monitor",
};

const CreateDispatchModal = ({
  isOpen,
  onClose,
  onCreate,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (draft: DraftDispatch) => void;
}) => {
  const [draft, setDraft] = useState<DraftDispatch>(createDispatchInitialState);

  if (!isOpen) return null;

  const updateField = (field: keyof DraftDispatch, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = () => {
    if (!draft.title.trim() || !draft.excerpt.trim()) return;
    onCreate(draft);
    setDraft(createDispatchInitialState);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-2xl rounded-2xl border border-[#d9d5d1] bg-[#f9f7f5] p-5 shadow-2xl">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#7a7f87]">
              Dispatch Studio
            </div>
            <h2 className="mt-1 text-2xl font-bold text-[#1d2430]">
              Create Market Dispatch
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#d9d5d1] bg-white p-2 text-[#526074] hover:bg-[#f3f0ed]"
            aria-label="Close create dispatch"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-[12px] font-medium text-[#425064]">
            Ticker
            <input
              value={draft.ticker}
              onChange={(event) =>
                updateField("ticker", event.target.value.toUpperCase())
              }
              placeholder="MDAK"
              className="w-full rounded-xl border border-[#d9d5d1] bg-white px-3 py-2.5 text-sm text-[#1d2430] placeholder:text-[#8a909a] focus:border-[#c5b9af] focus:outline-none"
            />
          </label>

          <label className="space-y-2 text-[12px] font-medium text-[#425064]">
            Company
            <input
              value={draft.company}
              onChange={(event) => updateField("company", event.target.value)}
              placeholder="Merkeda"
              className="w-full rounded-xl border border-[#d9d5d1] bg-white px-3 py-2.5 text-sm text-[#1d2430] placeholder:text-[#8a909a] focus:border-[#c5b9af] focus:outline-none"
            />
          </label>

          <label className="space-y-2 text-[12px] font-medium text-[#425064]">
            Date
            <input
              value={draft.date}
              onChange={(event) => updateField("date", event.target.value)}
              className="w-full rounded-xl border border-[#d9d5d1] bg-white px-3 py-2.5 text-sm text-[#1d2430] focus:border-[#c5b9af] focus:outline-none"
            />
          </label>

          <label className="space-y-2 text-[12px] font-medium text-[#425064]">
            Tags
            <input
              value={draft.tags}
              onChange={(event) => updateField("tags", event.target.value)}
              placeholder="Macro, Risk Monitor"
              className="w-full rounded-xl border border-[#d9d5d1] bg-white px-3 py-2.5 text-sm text-[#1d2430] placeholder:text-[#8a909a] focus:border-[#c5b9af] focus:outline-none"
            />
          </label>
        </div>

        <label className="mt-4 block space-y-2 text-[12px] font-medium text-[#425064]">
          Headline
          <input
            value={draft.title}
            onChange={(event) => updateField("title", event.target.value)}
            placeholder="Market note headline"
            className="w-full rounded-xl border border-[#d9d5d1] bg-white px-3 py-2.5 text-sm text-[#1d2430] placeholder:text-[#8a909a] focus:border-[#c5b9af] focus:outline-none"
          />
        </label>

        <label className="mt-4 block space-y-2 text-[12px] font-medium text-[#425064]">
          Short summary
          <textarea
            value={draft.excerpt}
            onChange={(event) => updateField("excerpt", event.target.value)}
            rows={3}
            placeholder="Write the summary that will appear in the list view..."
            className="w-full rounded-xl border border-[#d9d5d1] bg-white px-3 py-2.5 text-sm text-[#1d2430] placeholder:text-[#8a909a] focus:border-[#c5b9af] focus:outline-none"
          />
        </label>

        <label className="mt-4 block space-y-2 text-[12px] font-medium text-[#425064]">
          Full dispatch detail
          <textarea
            value={draft.detail}
            onChange={(event) => updateField("detail", event.target.value)}
            rows={5}
            placeholder="Write the full analysis or note to be shown when a user opens the detail modal..."
            className="w-full rounded-xl border border-[#d9d5d1] bg-white px-3 py-2.5 text-sm text-[#1d2430] placeholder:text-[#8a909a] focus:border-[#c5b9af] focus:outline-none"
          />
        </label>

        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#d9d5d1] bg-white px-4 py-2 text-sm font-semibold text-[#4c5868]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-xl bg-[#141821] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0f1320]"
          >
            Publish Dispatch
          </button>
        </div>
      </div>
    </div>
  );
};

const NewsDetailModal = ({
  item,
  onClose,
}: {
  item: NewsItem | null;
  onClose: () => void;
}) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[2px]">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[#d9d5d1] bg-[#faf8f6] p-5 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#7a7f87]">
              {item.ticker} / {item.company}
            </div>
            <h2 className="mt-2 text-2xl font-bold leading-tight text-[#1d2430]">
              {item.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#d9d5d1] bg-white p-2 text-[#526074] hover:bg-[#f3f0ed]"
            aria-label="Close news detail"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-2 text-[11px] text-[#7a7f87]">
          <span>{item.date}</span>
          <span className="h-1 w-1 rounded-full bg-[#b4b9c0]" />
          <span>{item.company}</span>
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className={`rounded-md border px-2.5 py-1 text-[10px] font-semibold ${tagClassNames[item.tagsTone]}`}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="rounded-xl border border-[#d9d5d1] bg-white p-4 text-[14px] leading-7 text-[#344154]">
          <p className="mb-3 text-[15px] font-semibold text-[#1d2430]">
            Summary
          </p>
          <p>{item.excerpt}</p>
        </div>

        <div className="mt-5 space-y-4 text-[14px] leading-7 text-[#334155]">
          {(item.detail ?? item.excerpt)
            .split(/\n+/)
            .filter(Boolean)
            .map((paragraph, index) => (
              <p key={`${item.title}-${index}`}>{paragraph}</p>
            ))}
        </div>
      </div>
    </div>
  );
};

const NewsPage = ({ onNavigate }: NewsPageProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newsItems, setNewsItems] = useState<NewsItem[]>(NEWS_ITEMS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<NewsItem | null>(null);

  const navItems = menuItems.map((item) => ({
    ...item,
    onClick: () => {
      setSidebarOpen(false);
      onNavigate(item.view);
    },
  }));

  const handleCreateDispatch = (draft: DraftDispatch) => {
    const nextTags = draft.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const nextDispatch: NewsItem = {
      ticker: draft.ticker || "NEW",
      company: draft.company || "Internal Source",
      date: draft.date || "Today • 09:00",
      title: draft.title.trim(),
      excerpt: draft.excerpt.trim(),
      detail: draft.detail.trim() || draft.excerpt.trim(),
      tags: nextTags.length ? nextTags : ["Dispatch"],
      tagsTone: "slate",
      score: 0,
    };

    setNewsItems((current) => [nextDispatch, ...current]);
  };

  return (
    <>
      <CreateDispatchModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateDispatch}
      />
      <NewsDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />

      <AppShell
        sidebarOpen={sidebarOpen}
        onSidebarOpen={() => setSidebarOpen(true)}
        onSidebarClose={() => setSidebarOpen(false)}
        navItems={navItems}
        onNavigate={onNavigate}
        currentView="news"
      >
        <div className="mx-auto max-w-295 pb-12">
          <div className="rounded-[22px] bg-[#f7f5f3] shadow-[0_1px_0_rgba(15,23,42,0.04)]">
            <div className="px-5 pb-4 pt-4 sm:px-6">
              <div className="flex items-center justify-between gap-3">
                <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#7a7f87]">
                  Surveillance &amp; Intelligence / Indonesia Financial News
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#d9d5d1] bg-white text-[#3d4756] shadow-sm"
                    aria-label="Open news tools"
                  >
                    <Sparkles className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="inline-flex items-center justify-center rounded-lg bg-[#141821] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f1320]"
                  >
                    Create Dispatch
                  </button>
                </div>
              </div>

              <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <h1 className="text-[2.1rem] font-bold tracking-[-0.065em] text-[#1d2430] sm:text-[2.6rem]">
                  Indonesia Financial News
                </h1>
              </div>

              <nav className="mt-3 flex flex-wrap items-center gap-2 text-[12px] text-[#586476]">
                {[
                  "Updated News",
                  "Financial News",
                  "Key Filings",
                  "Buybacks",
                  "Suspensions & UMA",
                  "Indonesia IPOs",
                ].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`rounded-full px-2.5 py-1.5 transition ${item === "Financial News" ? "bg-[#ece7e3] text-[#1d2430]" : "hover:bg-[#ece7e3]"}`}
                  >
                    {item}
                  </button>
                ))}
              </nav>
            </div>

            <div className="px-4 pb-4 pt-4 sm:px-5">
              <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-[#d9d5d1] bg-[#f0eeed] p-2">
                <button
                  type="button"
                  className="rounded-lg border border-[#d9d5d1] bg-white px-2.5 py-2 text-[11px] text-[#4f5b6a]"
                >
                  Filter by tag
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-[#d9d5d1] bg-white px-2.5 py-2 text-[11px] text-[#4f5b6a]"
                >
                  Filter by ticker
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-[#d9d5d1] bg-white px-2.5 py-2 text-[11px] text-[#4f5b6a]"
                >
                  Filter by counterparty
                </button>

                <div className="ml-auto flex min-w-55 items-center gap-2 rounded-lg border border-[#d9d5d1] bg-white px-3 py-2 text-[12px] text-[#6a7381]">
                  <Search className="h-3.5 w-3.5" />
                  <input
                    aria-label="Search headlines"
                    placeholder="Search keywords, headlines, refs..."
                    className="w-full bg-transparent text-[12px] text-[#1d2430] placeholder:text-[#7a7f87] focus:outline-none"
                  />
                </div>
              </div>

              <div className="mb-3 flex items-center justify-between border-b border-[#d9d5d1] pb-2">
                <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#7c838d]">
                  This week
                </div>
                <button
                  type="button"
                  className="rounded-md border border-[#d9d5d1] bg-white px-2.5 py-1 text-[11px] font-medium text-[#566170]"
                >
                  Oct 2024 / Q4 Calendar
                </button>
              </div>

              <div className="space-y-3">
                {newsItems.map((item) => (
                  <article
                    key={`${item.ticker}-${item.title}`}
                    className="flex gap-3 rounded-xl border border-[#d9d5d1] bg-[#fbfaf9] p-3 shadow-[0_1px_0_rgba(15,23,42,0.02)]"
                  >
                    <div className="flex min-w-27.5 items-start justify-between gap-3 pt-1">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#e8e3df] text-[10px] font-bold text-[#1d2430]">
                          {item.ticker.slice(0, 2)}
                        </span>
                        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#1d2430]">
                          {item.ticker}
                        </span>
                      </div>
                      <span className="rounded-full bg-[#f0efee] px-1.5 py-0.5 text-[10px] font-medium text-[#647084]">
                        {item.score}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2 text-[11px] text-[#7a7f87]">
                        <span>{item.date}</span>
                        <span className="h-1 w-1 rounded-full bg-[#b4b9c0]" />
                        <span>{item.company}</span>
                      </div>

                      <h3 className="text-[15px] font-semibold leading-snug text-[#1d2430] sm:text-[17px]">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-[12px] leading-relaxed text-[#5a6674]">
                        {item.excerpt}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`rounded-md border px-2 py-1 text-[10px] font-semibold ${tagClassNames[item.tagsTone]}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 text-[#5a6674]">
                      <button
                        type="button"
                        aria-label={`Open ${item.ticker}`}
                        onClick={() => setSelectedItem(item)}
                        className="rounded-md border border-[#d9d5d1] bg-white p-2 hover:bg-[#f3f0ee]"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Open details for ${item.ticker}`}
                        onClick={() => setSelectedItem(item)}
                        className="rounded-md border border-[#d9d5d1] bg-white p-2 hover:bg-[#f3f0ee]"
                      >
                        <FileText className="h-4 w-4" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-[#d9d5d1] px-5 py-3 text-[12px] text-[#5c6777]">
              <div>Showing 5 of 38 Market Dispatches</div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-md border border-[#d9d5d1] bg-white p-2 text-[#8893a1]"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  className="rounded-md bg-[#1d2430] px-2.5 py-1.5 font-semibold text-white"
                >
                  1
                </button>
                <button
                  type="button"
                  className="rounded-md border border-[#d9d5d1] bg-white px-2.5 py-1.5 font-semibold text-[#3c4a5d]"
                >
                  2
                </button>
                <button
                  type="button"
                  className="rounded-md border border-[#d9d5d1] bg-white px-2.5 py-1.5 font-semibold text-[#3c4a5d]"
                >
                  3
                </button>
                <button
                  type="button"
                  className="rounded-md border border-[#d9d5d1] bg-white px-2.5 py-1.5 font-semibold text-[#3c4a5d]"
                >
                  4
                </button>
                <button
                  type="button"
                  className="rounded-md border border-[#d9d5d1] bg-white p-2 text-[#5c6777]"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </AppShell>
    </>
  );
};

export default NewsPage;
