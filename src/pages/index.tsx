import { SignInButton, useUser } from "@clerk/nextjs";
import Head from "next/head";
import Link from "next/link";
import { PageLayout } from "~/components/layout";
import { api } from "~/utils/api";

export default function Home() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const { user, isSignedIn, isLoaded } = useUser();

  const test = "Did you know that the critically acclaimed MMORPG Final Fantasy XIV has a free trial, and includes the entirety of A Realm Reborn AND the award-winning Heavensward and Stormblood expansions up to level 70 with n restrictions on playtime? Sign up, and enjoy Eorzea today!"
  const testArr = test.split("");
  let group = 0;
  const testMap = testArr.map((el, idx) => {
    if (el === " ") {
      group++
      return <span key={idx} className="word_spacer">{el}</span>
    }
    return <span id={`${group}`} key={idx} className="">{el}</span>
  });

  interface WordChunk {
    [key: string]: string[]
  }

  function typingHandle(e: React.SyntheticEvent) {
    e.preventDefault();
     
    const target = e.target as HTMLInputElement;
    const inputSplit = target.value.split("");
    let inputGroup = 0;
    const wordGroup: WordChunk = {};
    console.log(wordGroup)
    let store: string[] = [];
    inputSplit.forEach((el, idx) => {
      if (el === " ") {
        console.log(store)
        wordGroup[inputGroup] = store;
        store = [];
        inputGroup++;
        console.log("space detected");
      } 
      el !== " " && store.push(el);
    })

    console.log(wordGroup)

    const displayChars = document.getElementsByClassName("display_char") as HTMLCollectionOf<HTMLSpanElement>;
    
    inputSplit.forEach((el, idx) => {
      if (el === displayChars[idx]?.innerText) {
        console.log("match")
      } else {
        console.log("wrong")
      }
    })
    
  }

  return (
    <PageLayout>
      {!isSignedIn &&
        <>
          <h1 className="front_title text-5xl font-semibold tracking-tight text-white sm:text-[5rem]">
            Speed<span className="text-rose-600">pasta</span>
          </h1>
          <div className="get_started flex flex-col gap-12 text-white text-3xl font-light items-center">
            <p>Test out your ability to churn out copypastas</p>
            <SignInButton>
              <button className="get_started w-64 h-28 bg-rose-500 rounded-3xl">Get Started</button>
            </SignInButton>
          </div>
        </>}
      {!!isSignedIn &&
        <>
          <div className="flex flex-col bg-slate-900 w-[64rem] h-[40rem]">
            <input
              id="input_display"
              className="w-full text-white break-normal text-4xl bg-slate-800 z-50 px-12 p-1
              font-light tracking-tight"
              onChange={typingHandle}
            />
            <div id="text_display" className="w-full text-white break-normal text-4xl px-12 py-2 tracking-tight font-light">
              {testMap}
            </div>
          </div>
        </>
      }
    </PageLayout>
  );
}
