import { useState, useEffect } from "react";

export default function useCountdown() {
  const [timeleft, setTimeleft] = useState(0);

  useEffect(() => {
    if (timeleft <= 0) return;

    const timeout = setTimeout(() => {
      setTimeleft(timeleft - 1);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [timeleft])

  function timestart(seconds: number) {
    setTimeleft(seconds);
  }

  function timereset() {
    setTimeleft(0);
  }

  function timerecord() {
    return timeleft;
  }

  return { timeleft, timestart, timerecord, timereset };
}

