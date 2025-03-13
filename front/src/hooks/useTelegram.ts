import { useEffect, useState } from 'react';

export const useTelegram = () => {
  const [tg, setTg] = useState<any>(null);
  const [initData, setInitData] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import('@twa-dev/sdk').then((module) => {
        const WebApp = module.default;
        WebApp.ready();
        setTg(WebApp);
        setInitData(WebApp.initData);
      });
    }
  }, []);

  return { tg, initData };
}
