import { SignInButton, useUser } from "@clerk/nextjs";
import Head from "next/head";
import Link from "next/link";
import { PageLayout } from "~/components/layout";
import { api } from "~/utils/api";
import { useRef, useState } from "react";
import CodeDisplay from "~/components/codedisplay";

const codeSample1 = [
  "function sum(a: number, b: number )",
  "{",
  "return a + b",
  "}",
  "var total: number = sum(10,20);",
  "var str: string = sum(10,20);"
]

const codeSample2 = [
  "function foo(bar)",
  "{",
  "for (let i = 0; i < fizz; i++) {",
  "buzz++",
  "}",
  "}",
  "return something",
]

const codeSample3 = [
  "function foo(bar) {",
  "function foo2(bar2) {",
  "function foo3(bar3) {",
  "for (const fizz of buzz) {",
  "const a: alpha = {",
  "item: jam",
  "}",
  "fizz.doSomething();",
  "}",
  "}",
  "}",
  "}",
]

export default function Home() {
  const { user, isSignedIn, isLoaded } = useUser();
  const [outputArr, setOutputArr] = useState<React.JSX.Element[]>([]);

  interface WordChunk {
    [key: string]: string[] 
  }

  function setCaret() {
    const el = document.getElementById("text_prompt_display");

    console.log(el);
  }

  function typingHandle(e: React.SyntheticEvent) {
    e.preventDefault();
    const target = e.target as HTMLInputElement;
    const lineSplit = target.value.split("\n");
    let strCount = 0;
    let indentDepth = 0;
    let inputGroup = 0;
    const wordGroup: WordChunk = {};
    let lineGroup: React.JSX.Element[] = [];
    const result: React.JSX.Element[] = []; 

    lineSplit.forEach((line, lineIdx) => {
      inputGroup = 0;
      const inputSplit = line.split("");
      if (indentDepth > 0) {
        for (let i = 0; i < indentDepth; i++) {
          lineGroup.push(<div key={`line${lineIdx}/spacer${i}`} className="inline-flex mx-4" />);
        }
      }

      inputSplit.forEach(inputChar => {
        function focusDiv(group: number) {
          return document.querySelectorAll(`[id='line${lineIdx}/group${group}'] span`)
        };
        if (!focusDiv) return;

        if (!wordGroup[inputGroup]) {
          wordGroup[inputGroup] = [];
        }

        switch(true) {
          case /\s/g.test(inputChar): 
            strCount = 0;
            if (wordGroup[inputGroup]!.length > 0) {
              inputGroup++;
            }
            lineGroup.push(<span key={`line${lineIdx}/group${inputGroup}/char${strCount}`}>{inputChar}</span>);
            break;
          case /\(|\)|\{|\}/g.test(inputChar):
            inputGroup++;
            strCount = 0;

            if (/\{/g.test(inputChar)) {
              indentDepth++;
            } else if (/\}/g.test(inputChar)) {
              inputGroup--;
              indentDepth--;
              lineGroup.shift();
            }

            if (inputChar === (focusDiv(inputGroup)[strCount] as HTMLSpanElement)?.innerText) {
              lineGroup.push(<span key={`line${lineIdx}/group${inputGroup}/char${strCount}`} className="text-green-500">{inputChar}</span>);
              inputGroup++;
            } else {
              lineGroup.push(<span key={`line${lineIdx}/group${inputGroup}/char${strCount}`} className="text-rose-500">{inputChar}</span>);
            }
            
            break;
          case inputChar === (focusDiv(inputGroup)[strCount] as HTMLSpanElement)?.innerText:
            wordGroup[inputGroup]!.push(inputChar);
            strCount++;
            lineGroup.push(<span key={`line${lineIdx}/group${inputGroup}/char${strCount}`} className="text-green-500">{inputChar}</span>);
            break;
          case inputChar !== (focusDiv(inputGroup)[strCount] as HTMLSpanElement)?.innerText: 
            wordGroup[inputGroup]!.push(inputChar);
            strCount++;
            lineGroup.push(<span key={`line${lineIdx}/group${inputGroup}/char${strCount}`} className="text-rose-500">{inputChar}</span>);
            break;
        }
      });
      const tmp = lineGroup.flat();
      lineGroup = [];
      result.push(<div key={`lineGroup${lineIdx}`} className="w-full h-7">{tmp}</div>);
    })
    setOutputArr(result);
  };

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
            <textarea
              id="input_display"
              key="input_display"
              className="w-1/2 text-white break-normal text-xl bg-transparent z-50 px-12 py-2
              font-light font-mono tracking-tight absolute left-1/2 text-transparent caret-white
              h-full resize-none"
              onChange={typingHandle} />
            <div id="text_input_display" className="text_display flex flex-col w-1/2 text-white
              break-normal text-xl px-12 py-2 tracking-tight font-light
              font-mono bg-slate-800">
              {outputArr}
            </div>
          </div>
        </>
      }
    </PageLayout>
  );
}
