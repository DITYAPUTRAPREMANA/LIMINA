import { useMemo, useState } from "react";
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

const NEWS_TABS = [
  "Updated News",
  "Financial News",
  "Key Filings",
  "Buybacks",
  "Suspensions & UMA",
  "Indonesia IPOs",
] as const;

const FILTER_BUTTONS = [
  "Filter by tag",
  "Filter by ticker",
  "Filter by counterparty",
] as const;

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
  const [selectedItem, setSelectedItem] = useState<NewsItem | null>(null);
  const [activeTab, setActiveTab] =
    useState<(typeof NEWS_TABS)[number]>("Financial News");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    (typeof FILTER_BUTTONS)[number] | null
  >(null);
  const [page, setPage] = useState(1);

  const filteredNews = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return NEWS_ITEMS.filter((item) => {
      const matchesSearch =
        !query ||
        `${item.title} ${item.company} ${item.ticker} ${item.excerpt} ${item.tags.join(" ")}`
          .toLowerCase()
          .includes(query);

      const matchesTab =
        activeTab === "Financial News" ||
        item.title
          .toLowerCase()
          .includes(
            activeTab
              .toLowerCase()
              .replace(/&/g, "")
              .replace(/\s+/g, " ")
              .trim(),
          ) ||
        item.tags.some((tag) =>
          tag
            .toLowerCase()
            .includes(
              activeTab
                .toLowerCase()
                .replace(/&/g, "")
                .replace(/\s+/g, " ")
                .trim(),
            ),
        );

      const matchesFilter =
        !activeFilter ||
        (activeFilter === "Filter by tag" && item.tags.length > 0) ||
        (activeFilter === "Filter by ticker" && Boolean(item.ticker)) ||
        (activeFilter === "Filter by counterparty" && Boolean(item.company));

      return matchesSearch && matchesTab && matchesFilter;
    });
  }, [activeFilter, activeTab, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredNews.length / 5));

  const paginatedNews = filteredNews.slice((page - 1) * 5, page * 5);

  const navItems = menuItems.map((item) => ({
    ...item,
    onClick: () => {
      setSidebarOpen(false);
      onNavigate(item.view);
    },
  }));

  return (
    <>
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
          <div className="rounded-[22px] bg-[#f7f5f3] text-[#1d2430] shadow-[0_1px_0_rgba(15,23,42,0.04)] dark:bg-slate-900 dark:text-slate-100">
            <div className="px-5 pb-4 pt-4 sm:px-6">
              <div className="flex items-center justify-between gap-3">
                <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#7a7f87] dark:text-slate-400">
                  Surveillance &amp; Intelligence / Indonesia Financial News
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#d9d5d1] bg-white text-[#3d4756] shadow-sm transition hover:bg-[#f3f0ee] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    aria-label="Reset news filters"
                  >
                    <Sparkles className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <h1 className="text-[2.1rem] font-bold tracking-[-0.065em] text-[#1d2430] dark:text-slate-50 sm:text-[2.6rem]">
                  Indonesia Financial News
                </h1>
              </div>

              <nav className="mt-3 flex flex-wrap items-center gap-2 text-[12px] text-[#586476] dark:text-slate-300">
                {NEWS_TABS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setActiveTab(item);
                      setPage(1);
                    }}
                    className={`rounded-full px-2.5 py-1.5 transition ${item === activeTab ? "bg-[#ece7e3] text-[#1d2430] dark:bg-slate-700 dark:text-slate-100" : "hover:bg-[#ece7e3] dark:hover:bg-slate-700"}`}
                  >
                    {item}
                  </button>
                ))}
              </nav>
            </div>

            <div className="px-4 pb-4 pt-4 sm:px-5">
              <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-[#d9d5d1] bg-[#f0eeed] p-2 dark:border-slate-700 dark:bg-slate-800/80">
                {FILTER_BUTTONS.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => {
                      setActiveFilter((current) =>
                        current === filter ? null : filter,
                      );
                      setPage(1);
                    }}
                    className={`rounded-lg border px-2.5 py-2 text-[11px] transition ${activeFilter === filter ? "border-[#1d2430] bg-[#1d2430] text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900" : "border-[#d9d5d1] bg-white text-[#4f5b6a] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"}`}
                  >
                    {filter}
                  </button>
                ))}

                <div className="ml-auto flex min-w-55 items-center gap-2 rounded-lg border border-[#d9d5d1] bg-white px-3 py-2 text-[12px] text-[#6a7381] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <Search className="h-3.5 w-3.5" />
                  <input
                    aria-label="Search headlines"
                    value={searchTerm}
                    onChange={(event) => {
                      setSearchTerm(event.target.value);
                      setPage(1);
                    }}
                    placeholder="Search keywords, headlines, refs..."
                    className="w-full bg-transparent text-[12px] text-[#1d2430] placeholder:text-[#7a7f87] focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="mb-3 flex items-center justify-between border-b border-[#d9d5d1] pb-2 dark:border-slate-700">
                <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#7c838d] dark:text-slate-400">
                  This week
                </div>
                <button
                  type="button"
                  className="rounded-md border border-[#d9d5d1] bg-white px-2.5 py-1 text-[11px] font-medium text-[#566170] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  Oct 2024 / Q4 Calendar
                </button>
              </div>

              <div className="space-y-3">
                {paginatedNews.length > 0 ? (
                  paginatedNews.map((item) => (
                    <article
                      key={`${item.ticker}-${item.title}`}
                      className="flex gap-3 rounded-xl border border-[#d9d5d1] bg-[#fbfaf9] p-3 shadow-[0_1px_0_rgba(15,23,42,0.02)] dark:border-slate-700 dark:bg-slate-800/80"
                    >
                      <div className="flex min-w-27.5 items-start justify-between gap-3 pt-1">
                        <div className="flex items-center gap-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#e8e3df] text-[10px] font-bold text-[#1d2430] dark:bg-slate-700 dark:text-slate-100">
                            {item.ticker.slice(0, 2)}
                          </span>
                          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#1d2430] dark:text-slate-100">
                            {item.ticker}
                          </span>
                        </div>
                        <span className="rounded-full bg-[#f0efee] px-1.5 py-0.5 text-[10px] font-medium text-[#647084] dark:bg-slate-700 dark:text-slate-200">
                          {item.score}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex flex-wrap items-center gap-2 text-[11px] text-[#7a7f87] dark:text-slate-400">
                          <span>{item.date}</span>
                          <span className="h-1 w-1 rounded-full bg-[#b4b9c0]" />
                          <span>{item.company}</span>
                        </div>

                        <h3 className="text-[15px] font-semibold leading-snug text-[#1d2430] dark:text-slate-100 sm:text-[17px]">
                          {item.title}
                        </h3>

                        <p className="mt-2 text-[12px] leading-relaxed text-[#5a6674] dark:text-slate-300">
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

                      <div className="flex items-center gap-2 pt-2 text-[#5a6674] dark:text-slate-300">
                        <button
                          type="button"
                          aria-label={`Open ${item.ticker}`}
                          onClick={() => setSelectedItem(item)}
                          className="rounded-md border border-[#d9d5d1] bg-white p-2 hover:bg-[#f3f0ee] dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-700"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Open details for ${item.ticker}`}
                          onClick={() => setSelectedItem(item)}
                          className="rounded-md border border-[#d9d5d1] bg-white p-2 hover:bg-[#f3f0ee] dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-700"
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-[#d9d5d1] bg-[#fbfaf9] p-8 text-center text-sm text-[#5a6674] dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300">
                    No news matches your current filters.
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-[#d9d5d1] px-5 py-3 text-[12px] text-[#5c6777] dark:border-slate-700 dark:text-slate-300">
              <div>
                Showing {Math.min(filteredNews.length, paginatedNews.length)} of{" "}
                {filteredNews.length} Market Dispatches
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page === 1}
                  className="rounded-md border border-[#d9d5d1] bg-white p-2 text-[#8893a1] disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1,
                ).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    className={`rounded-md px-2.5 py-1.5 font-semibold ${page === pageNumber ? "bg-[#1d2430] text-white dark:bg-slate-100 dark:text-slate-900" : "border border-[#d9d5d1] bg-white text-[#3c4a5d] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"}`}
                  >
                    {pageNumber}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setPage((current) => Math.min(totalPages, current + 1))
                  }
                  disabled={page === totalPages}
                  className="rounded-md border border-[#d9d5d1] bg-white p-2 text-[#5c6777] disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
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
