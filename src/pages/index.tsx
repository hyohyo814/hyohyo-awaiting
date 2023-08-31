import { SignInButton, useUser } from "@clerk/nextjs";
import Head from "next/head";
import Link from "next/link";
import { PageLayout } from "~/components/layout";
import { api } from "~/utils/api";
import { useRef, useState } from "react";

function TestCode() {
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
    "fizz.doSomething();",
    "}",
    "}",
    "}",
    "}",
  ]

  const codeParse: string[][] = [];
  
  // string for code sample
  for (const line of codeSample3) {
    const split = line.split("");
    codeParse.push(split);
  }

  let group = 0;
  let divGroup: React.JSX.Element[] = [];
  let lineGroup: React.JSX.Element[] = [];
  const htmlTransform: React.JSX.Element[] = [];
  
  let indentDepth = 0;

  codeParse.forEach((spread, line) => {
    let strCount = 0;
    spread.forEach((el, idx) => {
      if (divGroup.length === 0 && group === 0) {
        for (let i = 0; i < indentDepth; i++) {
          lineGroup.push(<div id={`line${line}/indent${idx}`} key={`line${line}/indent${i}`} className="mx-3"/>);
        }
      }

      switch(true) {
        case el === " ":
          lineGroup.push(<div key={`line${line}/group${group}`} id={`line${line}/group${group}`} className="mr-2">{divGroup}</div>);
          divGroup = [];
          group++;
          strCount = 0;
          break;
        case /\(|\)/g.test(el):
          lineGroup.push(<div key={`line${line}/group${group}`} id={`line${line}/group${group}`} className="">{divGroup}</div>);
          divGroup = [];
          group++;
          strCount = 0;
          if (/\(/g.test(el)) {
            divGroup.push(<span key={`line${line}/group${group}/char${strCount}`} id={`line${line}/group${group}/char${strCount}`}>{el}</span>); 
            lineGroup.push(<div key={`line${line}/group${group}`} id={`line${line}/group${group}`} className="">{divGroup}</div>);
            divGroup = [];
            group++;
          } else if (/\)/g.test(el)) {
            divGroup.push(<span key={`line${line}/group${group}/char${strCount}`} id={`line${line}/group${group}/char${strCount}`}>{el}</span>); 
            lineGroup.push(<div key={`line${line}/group${group}`} id={`line${line}/group${group}`} className="">{divGroup}</div>);
            divGroup = [];
            group++;
          }
          break;
        case /\{|\}/g.test(el):
          if (/\{/g.test(el)) {
            indentDepth++; 
            divGroup.push(<span key={`line${line}/group${group}/char${strCount}`} id={`line${line}/group${group}/char${strCount}`}>{el}</span>); 
            lineGroup.push(<div key={`line${line}/group${group}`} id={`line${line}/group${group}`} className="">{divGroup}</div>);
            divGroup = [];
          } else if (/\}/g.test(el)) {
            lineGroup.shift();
            divGroup.push(<span key={`line${line}/group${group}/char${strCount}`} id={`line${line}/group${group}/char${strCount}`}>{el}</span>); 
            lineGroup.push(<div key={`line${line}/group${group}`} id={`line${line}/group${group}`} className="">{divGroup}</div>);
            divGroup = [];
            indentDepth--; 
          }
          break;
        default:
          divGroup.push(<span key={`line${line}/group${group}/char${strCount}`} id={`line${line}/group${group}/char${strCount}`}>{el}</span>);
          strCount++;
          if (idx === spread.length - 1) {
            lineGroup.push(<div key={`line${line}/group${group}`} id={`line${line}/group${group}`}>{divGroup}</div>);
            divGroup = [];
            group = 0;
          }
          break;
      }

    })
     
    htmlTransform.push(<div key={`line${line}`} id={`line${line}`} className="w-full flex">{lineGroup}</div>);
    lineGroup = [];
    group = 0;
  })

  return htmlTransform;
}

export default function Home() {
  const { user, isSignedIn, isLoaded } = useUser();
  const [outputArr, setOutputArr] = useState<React.JSX.Element[]>([]);

  interface WordChunk {
    [key: string]: string[] 
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
      console.log(lineIdx, inputGroup)
      const inputSplit = line.split("");
      if (indentDepth > 0) {
        for (let i = 0; i < indentDepth; i++) {
          lineGroup.push(<div className="inline-flex mx-4" />);
        }
      }

      inputSplit.forEach(inputChar => {
        function focusDiv(group: number){ return document.querySelectorAll(`[id='line${lineIdx}/group${group}'] span`)};
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
            lineGroup.push(<span>{inputChar}</span>);
            break;
          case /\(|\)|\{|\}/g.test(inputChar):
            if (inputGroup > 0) {
              inputGroup++;
            }
            strCount = 0;

            if (/\{/g.test(inputChar)) {
              indentDepth++;
            } else if (/\}/g.test(inputChar)) {
              indentDepth--;
              lineGroup.shift();
            }

            if (inputChar === (focusDiv(inputGroup)[strCount] as HTMLSpanElement)?.innerText) {
              lineGroup.push(<span className="text-green-500">{inputChar}</span>);
              inputGroup++;
            } else {
              console.log(inputGroup)
              console.log(focusDiv(inputGroup));
              lineGroup.push(<span id={`line${lineIdx}/group${inputGroup}`} className="text-rose-500">{inputChar}</span>);
            }
            
            break;
          case inputChar === (focusDiv(inputGroup)[strCount] as HTMLSpanElement)?.innerText:
            wordGroup[inputGroup]!.push(inputChar);
            strCount++;
            lineGroup.push(<span className="text-green-500">{inputChar}</span>);
            break;
          case inputChar !== (focusDiv(inputGroup)[strCount] as HTMLSpanElement)?.innerText: 
            console.log(focusDiv(inputGroup))
            wordGroup[inputGroup]!.push(inputChar);
            strCount++;
            lineGroup.push(<span className="text-rose-500">{inputChar}</span>);
            break;
        }
      });

      const tmp = lineGroup.flat();
      lineGroup = [];
      result.push(<div className="w-full">{tmp}</div>);
    })
    setOutputArr(result);
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
            <textarea
              id="input_display"
              className="w-full text-white break-normal text-4xl bg-slate-800 z-50 px-12 p-1
              font-light tracking-tight"
              onChange={typingHandle}
            />
            <div id="text_display" className="text_display flex flex-wrap w-full text-white
              break-normal text-2xl px-12 py-2 tracking-tight font-extralight
              ">
              <TestCode />
            </div>
            <div id="text_display" className="text_display flex flex-wrap w-full text-white
              break-normal text-2xl px-12 py-2 tracking-tight font-light
              font-mono">
              {outputArr}
            </div>
          </div>
        </>
      }
    </PageLayout>
  );
}
