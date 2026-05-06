'use client';

import { useEffect, useState } from 'react';

type SiteContentResponse = {
  companyName: string;
  slogan: string;
  updatedAt: string;
  home: {
    title: string;
    subtitle: string;
    primaryAction: {
      label: string;
      href: string;
    };
  };
};

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api';

export default function Home() {
  const [data, setData] = useState<SiteContentResponse | null>(null);
  const [error, setError] = useState<string>('');

  async function fetchSiteContent() {
    try {
      setError('');
      const response = await fetch(`${apiBaseUrl}/public/site-content`);

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const payload = (await response.json()) as SiteContentResponse;
      setData(payload);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(`无法连接 server 接口：${message}`);
    }
  }

  useEffect(() => {
    void fetchSiteContent();
  }, []);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-start justify-center gap-8 p-8 md:p-16">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Company Website</p>
        <h1 className="text-3xl font-semibold text-zinc-900 md:text-4xl">前后端最小联调已完成</h1>
      </header>

      {error ? (
        <section className="w-full rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          <p className="font-medium">接口调用失败</p>
          <p className="mt-2 text-sm">{error}</p>
          <p className="mt-3 text-xs text-red-600">请先启动服务端：`npm run start:dev`（server）</p>
        </section>
      ) : null}

      {data ? (
        <section className="w-full space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-zinc-900">{data.companyName}</h2>
          <p className="text-zinc-600">{data.slogan}</p>
          <div className="rounded-lg bg-zinc-100 p-4">
            <p className="text-lg font-medium text-zinc-900">{data.home.title}</p>
            <p className="mt-2 text-zinc-600">{data.home.subtitle}</p>
          </div>
          <div className="text-sm text-zinc-500">
            <p>内容更新时间：{new Date(data.updatedAt).toLocaleString()}</p>
            <p>接口地址：{`${apiBaseUrl}/public/site-content`}</p>
          </div>
          <button
            type="button"
            className="w-fit rounded-md bg-zinc-900 px-3 py-1.5 text-sm text-white hover:bg-zinc-700"
            onClick={() => void fetchSiteContent()}
          >
            重新拉取最新内容
          </button>
        </section>
      ) : (
        <section className="rounded-xl border border-zinc-200 bg-white p-5 text-zinc-600">正在加载官网内容...</section>
      )}
    </main>
  );
}
