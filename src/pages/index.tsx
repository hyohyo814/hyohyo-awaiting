import { SignInButton, useUser } from "@clerk/nextjs";
import Head from "next/head";
import Link from "next/link";
import { PageLayout } from "~/components/layout";
import { api } from "~/utils/api";
import CodeDisplay from "~/components/codedisplay";
import InputDisplay from "~/components/inputdisplay";
import { codeSample3 } from "~/localdb/test";

export default function Home() {
  const { user, isSignedIn, isLoaded } = useUser();

  return (
    <PageLayout>
      {!isSignedIn &&
        <>
          <h1 className="front_title text-5xl font-semibold tracking-tight text-white sm:text-[5rem]">
            Speed<span className="text-rose-600">pasta</span>
          </h1>
          <div className="get_started flex flex-col gap-12 text-white text-3xl font-light items-center">
            <p>Test out your ability with code blocks</p>
            <SignInButton>
              <button className="get_started w-64 h-28 bg-rose-500 rounded-3xl">Get Started</button>
            </SignInButton>
          </div>
        </>}
      {!!isSignedIn &&
        <>
          <div className="relative flex flex-wrap bg-slate-900 w-[64rem] h-[40rem]">
            <div key="text_prompt_display" id="text_display" className="text_display flex flex-col w-1/2 text-white
              text-xl px-12 py-2 tracking-tight font-extralight
              font-mono">
              <CodeDisplay codeBlock={codeSample3} />
            </div>
            <InputDisplay />
          </div>
        </>
      }
    </PageLayout>
  );
}
