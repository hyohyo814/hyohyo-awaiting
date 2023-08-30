import { SignInButton, useUser } from "@clerk/nextjs";
import Head from "next/head";
import Link from "next/link";
import { PageLayout } from "~/components/layout";
import { api } from "~/utils/api";
import { useState } from "react";

function TestMap() {
  const test = "Did you know that the critically acclaimed MMORPG Final Fantasy XIV has a free trial, and includes the entirety of A Realm Reborn AND the award-winning Heavensward and Stormblood expansions up to level 70 with n restrictions on playtime? Sign up, and enjoy Eorzea today!"
  const testArr = test.split("");
  let group = 0;
  let divGroup: React.JSX.Element[] = [];
  const result: React.JSX.Element[] = [];
  testArr.forEach((el, idx) => {
    if (el === " ") {
      result.push(<div key={`group_display/${group}`} id={`word_group/${group}`} className="">{divGroup}</div>);
      group++;
      divGroup = [];
    } else {
      divGroup.push(<span id={`group/${group}`} key={`display/${idx}`} className="display_char">{el}</span>);
    }
  });

  return result;
}


export default function Home() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const { user, isSignedIn, isLoaded } = useUser();


  interface WordChunk {
    [key: string]: string[]
  }

  function typingHandle(e: React.SyntheticEvent) {
    e.preventDefault();
    const target = e.target as HTMLInputElement;
    const inputSplit = target.value.split("");
    let inputGroup = 0;
    let strCount = 0;
    let extraCount = 0;
    const wordGroup: WordChunk = {};

    inputSplit.forEach((el, idx) => {
      let displayChars = document.querySelectorAll(`[id='group/${inputGroup}']`);
      let divGroup = document.querySelector(`[id='word_group/${inputGroup}']`);
      const focus = displayChars[strCount] as HTMLSpanElement;
      if (!wordGroup[inputGroup]) {
        wordGroup[inputGroup] = [];
      };
      

      switch (true) { 
        case el === " ":
          if (strCount !== 0) {
            inputGroup++;
            strCount = 0;
            extraCount = 0;
          } else {
            console.log('spam')
            break;
          }
          break;
        case el === focus?.innerText:
          displayChars[strCount]?.removeAttribute("class");
          displayChars[strCount]?.setAttribute("class", "text-green-500");
          wordGroup[inputGroup]!.push(el);
          strCount++;
          break;
        case el !== focus?.innerText:
          displayChars[strCount]?.removeAttribute("class");
          displayChars[strCount]?.setAttribute("class", "text-rose-500");
          wordGroup[inputGroup]!.push(el);
          if (strCount < displayChars.length) {
            strCount++;
          } else {
            const tmp = extraCount + 1;
            extraCount++;
            const extraElement = `<span id='extra/${inputGroup}/${tmp}' class="text-rose-500">${el}</span>`;
            if (!!divGroup && !document.querySelector(`[id='extra/${inputGroup}/${tmp}']`)) {
              divGroup.insertAdjacentHTML("beforeend", extraElement);
            }
          };
          break;
        default:
          console.log('defaulted');
          break;
      }
    })
    console.log('strCount: ', strCount);
    console.log('extraCount: ', extraCount);
/*
    console.log(Object.keys(wordGroup).length)
    for (let i = 0; i <= inputGroup; i++) {
      let displayChars = document.querySelectorAll(`[id='group/${i}']`);
      displayChars.forEach((el, idx) => {
        if ((el as HTMLSpanElement)?.innerText === wordGroup[i]?.[idx]) {
          displayChars[idx]?.setAttribute("class", "text-green-500");
        } else if (!wordGroup[idx]) {
          displayChars[idx]?.setAttribute("class", "text-white");
        } else {
          displayChars[idx]?.setAttribute("class", "text-rose-500");
        }
      }) 
    }
*/
    
    /*
    inputSplit.forEach((el, idx) => {
      if (el === displayChars[idx]?.innerText) {
        console.log("match")
      } else {
        console.log("wrong")
      }
    })
    */
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
            <div id="text_display" className="flex flex-wrap w-full text-white
              break-normal text-4xl px-12 py-2 tracking-tight font-light
              gap-2">
              <TestMap />
            </div>
          </div>
        </>
      }
    </PageLayout>
  );
}
