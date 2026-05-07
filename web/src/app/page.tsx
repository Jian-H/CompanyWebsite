'use client';

import { useEffect, useState } from 'react';

type CmsItem = {
  id: number;
  sortOrder: number;
  isEnabled?: boolean;
};

type HomePageData = {
  setting: {
    siteName: string;
    logoText: string;
    contactText: string;
  } | null;
  hero: {
    title: string;
    highlight: string;
    subtitle: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
    backgroundImage: string;
  } | null;
  advantages: Array<CmsItem & { icon: string; title: string; description: string }>;
  products: Array<CmsItem & { name: string; description: string; coverImage: string; href: string }>;
  solutions: Array<CmsItem & { industry: string; description: string; coverImage: string; href: string }>;
  articles: Array<{
    id: number;
    title: string;
    category: string;
    summary: string;
    coverImage: string;
    publishedAt: string | null;
  }>;
};

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api';

const fallbackData: HomePageData = {
  setting: { siteName: 'AuroraTech', logoText: 'AuroraTech', contactText: '联系我们' },
  hero: {
    title: '科技驱动',
    highlight: '未来',
    subtitle: 'AuroraTech 致力于通过前沿技术与创新解决方案，为全球客户创造价值，推动行业进步，改变未来生活。',
    primaryLabel: '探索更多',
    primaryHref: '#products',
    secondaryLabel: '观看视频',
    secondaryHref: '#solutions',
    backgroundImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=80',
  },
  advantages: [
    { id: 1, icon: 'cluster', title: '技术领先', description: '持续投入研发，掌握核心技术引领行业发展', sortOrder: 1 },
    { id: 2, icon: 'layers', title: '解决方案', description: '提供全栈服务方案满足多样化业务需求', sortOrder: 2 },
    { id: 3, icon: 'shield', title: '安全可靠', description: '高标准安全体系保障数据与业务安全', sortOrder: 3 },
    { id: 4, icon: 'users', title: '专业团队', description: '经验丰富的专家团队为客户提供优质服务', sortOrder: 4 },
  ],
  products: [],
  solutions: [],
  articles: [],
};

const partners = ['500+ 企业客户', 'HUAWEI', 'Tencent', '字节跳动', '阿里云', 'China Mobile'];
const iconMap: Record<string, string> = {
  cluster: '✣',
  layers: '▰',
  shield: '◆',
  users: '●',
};

export default function Home() {
  const [data, setData] = useState<HomePageData>(fallbackData);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    async function loadHomePage() {
      try {
        const response = await fetch(`${apiBaseUrl}/public/home-page`);
        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }
        setData((await response.json()) as HomePageData);
        setIsFallback(false);
      } catch {
        setData(fallbackData);
        setIsFallback(true);
      }
    }

    void loadHomePage();
  }, []);

  const setting = data.setting ?? fallbackData.setting;
  const hero = data.hero ?? fallbackData.hero;
  const products = data.products.length > 0 ? data.products : fallbackData.products;
  const solutions = data.solutions.length > 0 ? data.solutions : fallbackData.solutions;
  const articles = data.articles;

  return (
    <main className="min-h-screen bg-[#f6f8ff] text-slate-950">
      <section className="mx-auto max-w-[1440px] px-5 py-5 md:px-8">
        <div className="overflow-hidden rounded-[24px] border border-white/80 bg-white shadow-[0_24px_80px_rgba(40,64,120,0.14)]">
          <header className="relative z-20 flex h-20 items-center justify-between px-6 md:px-10">
            <a className="flex items-center gap-3 font-semibold" href="#">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#6d5dfc] font-black text-white">A</span>
              <span>{setting?.logoText}</span>
            </a>
            <nav className="hidden items-center gap-10 text-sm font-medium text-slate-800 md:flex">
              {['首页', '产品', '解决方案', '案例展示', '服务支持', '关于我们', '新闻中心'].map((item) => (
                <a className="transition hover:text-[#5b57ff]" href="#" key={item}>{item}</a>
              ))}
            </nav>
            <div className="flex items-center gap-4">
              <span className="hidden text-xl md:block">⌕</span>
              <a className="rounded-lg bg-[#5b57ff] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200" href="#contact">
                {setting?.contactText}
              </a>
            </div>
          </header>

          <section className="relative min-h-[610px] px-7 pb-10 pt-14 md:px-12">
            <img
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-70"
              src={hero?.backgroundImage}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/75 to-white/20" />
            <div className="relative z-10 max-w-xl">
              <h1 className="text-5xl font-black leading-tight tracking-normal md:text-7xl">
                {hero?.title}
                <span className="ml-3 text-[#4f46e5]">{hero?.highlight}</span>
              </h1>
              <p className="mt-7 max-w-lg text-base leading-8 text-slate-700">{hero?.subtitle}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a className="rounded-xl bg-[#4f46e5] px-7 py-4 text-sm font-semibold text-white shadow-xl shadow-indigo-200" href={hero?.primaryHref}>
                  {hero?.primaryLabel}
                </a>
                <a className="rounded-xl bg-white/85 px-7 py-4 text-sm font-semibold text-slate-900 shadow-lg shadow-slate-200" href={hero?.secondaryHref}>
                  {hero?.secondaryLabel}
                </a>
              </div>
            </div>

            <div className="relative z-10 mt-24 grid grid-cols-2 items-center gap-4 rounded-xl border border-white/70 bg-white/75 px-5 py-5 text-sm font-semibold text-slate-500 shadow-xl backdrop-blur md:grid-cols-6">
              {partners.map((partner) => (
                <span className="text-center" key={partner}>{partner}</span>
              ))}
            </div>
          </section>

          <section className="bg-[#f8faff] px-7 py-14 md:px-12">
            <SectionTitle title="我们的核心优势" subtitle="以技术为核心，以创新为动力，助力企业与社会实现可持续发展" />
            <div className="mt-10 grid gap-5 md:grid-cols-4">
              {data.advantages.map((item) => (
                <article className="rounded-xl border border-slate-100 bg-white p-8 text-center shadow-sm" key={item.id}>
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-indigo-50 text-2xl text-[#4f46e5]">{iconMap[item.icon] ?? '◆'}</div>
                  <h3 className="mt-6 font-bold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-500">{item.description}</p>
                </article>
              ))}
            </div>
          </section>

          <ContentGrid id="products" title="核心产品" subtitle="打造高性能、可扩展的产品矩阵" items={products.map((item) => ({
            id: item.id,
            title: item.name,
            desc: item.description,
            image: item.coverImage,
            href: item.href,
          }))} />

          <ContentGrid id="solutions" title="行业解决方案" subtitle="深耕行业，提供具备价值的解决方案" items={solutions.map((item) => ({
            id: item.id,
            title: item.industry,
            desc: item.description,
            image: item.coverImage,
            href: item.href,
          }))} />

          <section className="bg-white px-7 py-14 md:px-12">
            <SectionTitle title="新闻与案例" subtitle="关注 AuroraTech 的最新动态与客户实践" />
            <div className="mt-9 grid gap-5 md:grid-cols-3">
              {articles.slice(0, 3).map((article) => (
                <article className="rounded-xl border border-slate-100 bg-[#fbfcff] p-5 shadow-sm" key={article.id}>
                  <span className="text-xs font-semibold text-[#4f46e5]">{article.category}</span>
                  <h3 className="mt-3 font-bold">{article.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-500">{article.summary}</p>
                </article>
              ))}
            </div>
          </section>

          <footer id="contact" className="flex flex-col gap-4 border-t border-slate-100 px-7 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between md:px-12">
            <span>© 2026 {setting?.siteName}. All rights reserved.</span>
            <span>{isFallback ? '当前使用本地降级内容' : '内容由 CMS 管理后台发布'}</span>
          </footer>
        </div>
      </section>
    </main>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-black tracking-normal">{title}</h2>
      <p className="mt-3 text-sm text-slate-500">{subtitle}</p>
    </div>
  );
}

function ContentGrid({
  id,
  title,
  subtitle,
  items,
}: {
  id: string;
  title: string;
  subtitle: string;
  items: Array<{ id: number; title: string; desc: string; image: string; href: string }>;
}) {
  return (
    <section className="bg-white px-7 py-14 md:px-12" id={id}>
      <div className="flex items-end justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black tracking-normal">{title}</h2>
          <p className="mt-3 text-sm text-slate-500">{subtitle}</p>
        </div>
        <a className="hidden text-sm font-semibold text-[#4f46e5] md:block" href="#">查看全部 →</a>
      </div>
      <div className="mt-9 grid gap-5 md:grid-cols-4">
        {items.map((item) => (
          <article className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl" key={item.id}>
            <img alt="" className="h-36 w-full object-cover" src={item.image} />
            <div className="p-5">
              <h3 className="font-bold">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{item.desc}</p>
              <a className="mt-4 inline-block text-sm font-semibold text-[#4f46e5]" href={item.href}>了解更多 →</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
