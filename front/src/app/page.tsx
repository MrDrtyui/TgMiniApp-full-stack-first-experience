"use client"

import { useEffect, useState } from 'react';
import { useTelegram } from '../hooks/useTelegram'

export default function Home() {

  const { tg, initData } = useTelegram();
  const [data, setData] = useState<{
    id: string;
    telegramId: bigint | null;
    firstName: string;
    username: string | null;
  }>({
    id: "",
    telegramId: null,
    firstName: "load",
    username: null,
  });

  const [count, setCount] = useState(0);


  useEffect(() => {
    if (!tg) return;
    tg.ready();
  }, [tg]);

  useEffect(() => {
    fetch(`apiusers?initData=${initData}`)
      .then((res) => res.json())
      .then((data) => setData(data));
  }, [initData]); // теперь useEffect сработает при изменении initData

  return (
    <div className=" items-center flex justify-center">
      {data ? data.firstName : 'loading'}
      <h1> hello</h1>
      <button onClick={() => setCount(count + 1)}>{count}</button>
    </div >
  );
}
