import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { PageLayout } from "~/components/layout";
import CodeDisplay from "~/components/codedisplay";
import InputDisplay from "~/components/inputdisplay";
import { codeSampleShort } from "~/localdb/test";
import { useRef } from "react";

export default function Test() {
  const { isSignedIn } = useUser();
  const timerEl = useRef(null);

  return (
    <PageLayout>
      {!!isSignedIn &&
        <>
          <div className="flex w-full h-16 bg-slate-800 rounded-full px-12 items-center justify-center">
            <div ref={timerEl} id="time_display" className="text-white text-2xl"></div>
          </div>
          <div className="relative flex flex-wrap bg-slate-900 w-[64rem] h-[40rem] shadow-xl rounded-xl">
            <div key="text_prompt_display" id="text_display" className="text_display flex flex-col w-1/2 text-white
              text-xl px-12 py-2 tracking-tight font-extralight
              font-mono">
              <CodeDisplay codeBlock={codeSampleShort} />
            </div>
            <InputDisplay timerRef={timerEl} />
          </div>
          <div className="flex w-full h-16 bg-slate-800 rounded-full shadow-xl items-center px-12">
            <Link href="/" className="bg-orange-400 px-10 py-2 rounded-full">Home</Link>
          </div>
        </>
      }
    </PageLayout>
  );
}

