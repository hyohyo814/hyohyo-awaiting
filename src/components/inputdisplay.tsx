import { useRouter } from "next/router";
import React, { useRef, useState } from "react"; 
import useCountdown from "~/utils/customhooks";

interface Props {
  userRecord: number,
  setUserRecord: React.Dispatch<number> 
}

export default function InputDisplay({userRecord, setUserRecord}: Props) {
  const [outputArr, setOutputArr] = useState<React.JSX.Element[]>([]);
  const [complete, setComplete] = useState<boolean>(false);
  const [inProgress, setInProgress] = useState<boolean>(false);
  const [incorrCt, setIncorrCt] = useState<number>(0);
  const { timeleft, timerecord, timestart, timereset } = useCountdown();
  const inputRef = useRef(null);
  const router = useRouter();

  const timecheck = timerecord();
  const countdownTime = 30;

  function handleReload() {
    router.reload();
  }

  function typingHandle(e: React.SyntheticEvent) {
    e.preventDefault();
    const target = e.target as HTMLInputElement;
    const lineSplit = target.value.split("\n");
    let incorrectCount = 0;
    let strCount = 0;
    let indentDepth = 0;
    let inputGroup = 0;
    let lineGroup: React.JSX.Element[] = [];
    const result: React.JSX.Element[] = []; 

    // Get DOM elements
    const targetDiv = document.querySelector(`[id='text_display']`);
    const lineDivs = Array
    .from(targetDiv!
      .querySelectorAll('div'))
    .filter(node => node.parentNode === targetDiv);

    const inputEl = inputRef.current! as HTMLTextAreaElement;

    // Begin input checking
    lineSplit.forEach((line, lineIdx) => {
      inputGroup = 0;
      strCount = 0;
      const inputSplit = line.split("");

      // indentation formatting
      if (indentDepth > 0) {
        for (let i = 0; i < indentDepth; i++) {
          lineGroup.push(<div
            key={`line${lineIdx}/group${inputGroup}/char${strCount}/indent${i}`}
            className="inline-flex mx-4" />);
        }
      }

      // highlight active line
      for (let i = 0; i <= result.length; i++) {
        const lineEl = document.querySelector(`[id='lineGroup${i}']`);
        i === lineIdx
          ? lineEl?.setAttribute("class", "flex h-7 bg-slate-500/50")
          : lineEl?.setAttribute("class", "flex h-7")
      }

      // completion check
      if (lineIdx === lineDivs.length) {
        console.log("done")
        setComplete(true);
        inputEl.hidden = true;
        const timeUsed = countdownTime - timerecord(); 
        setUserRecord(timeUsed);
      }

      // Begin char checking
      let prev = "";
      inputSplit.forEach(inputChar => {
        const curr = inputChar;
        function focusDiv(group: number) {
          return document.querySelectorAll(`[id*='line${lineIdx}/group${group}']`)
        };
        if (!focusDiv) return;

        function lineAppend(input: string | null, type: string) {
          switch(type) {
            case "correct":
              lineGroup.push(<span
                id={`line${lineIdx}/group${inputGroup}/char${strCount}`}
                key={`line${lineIdx}/group${inputGroup}/char${strCount}`}
                className="text-green-500">{input}</span>);
              break;
            case "incorrect":
              incorrectCount++;
              lineGroup.push(<span
                id={`line${lineIdx}/group${inputGroup}/char${strCount}`}
                key={`line${lineIdx}/group${inputGroup}/char${strCount}`}
                className="text-rose-500">{input}</span>);
              break;
            case "spacer":
              lineGroup.push(<div
                id={`line${lineIdx}/group${inputGroup}/char${strCount}/spacer`}
                key={`line${lineIdx}/group${inputGroup}/char${strCount}/spacer`}
                className="mr-2" />);
              break;
            default:
              break;
          }
        }

        switch(true) {
          case /\s/g.test(inputChar): 
            if (!/\s/g.test(prev) && !/\(/g.test(prev)) {
              strCount = 0;
              inputGroup++;
              lineAppend(null, "spacer");
              strCount = 0;
              break;
            } else {
              break;
            }
          case /\(|\)|\{|\}/g.test(inputChar):
            if (!/\s/g.test(prev)) {
              inputGroup++;
              strCount = 0;
            }

            if (/\{/g.test(inputChar)) {
              indentDepth++;
            } else if (/\}/g.test(inputChar)) {
              inputGroup--;
              if (indentDepth > 0) {
                indentDepth--;
                lineGroup.shift();
              }
            }

            if (inputChar === (
              focusDiv(inputGroup)[strCount] as HTMLSpanElement)?.innerText
            ) {
              lineAppend(inputChar, "correct");
              inputGroup++;
            } else {
              lineAppend(inputChar, "incorrect");
            }
            break;
          case inputChar === (focusDiv(inputGroup)[strCount] as HTMLSpanElement)?.innerText:
            lineAppend(inputChar, "correct");
            strCount++;
            break;
          case inputChar !== (focusDiv(inputGroup)[strCount] as HTMLSpanElement)?.innerText: 
            lineAppend(inputChar, "incorrect");
            strCount++;
            break;
          default:
            break;
        }
        prev = curr;
      });
      const tmp = lineGroup.flat();
      lineGroup = [];
      result.push(<div id={`lineGroup${lineIdx}`} key={`lineGroup${lineIdx}`}>{tmp}</div>);
    })
    setIncorrCt(incorrectCount);
    setOutputArr(result);
  };

  function resetHandler(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!inputRef?.current) return;
    const inputEl = inputRef.current as HTMLInputElement;
    inputEl.hidden = true;
    inputEl.value = "";
    setUserRecord(0);
    setOutputArr([]);
    setComplete(false);
    setInProgress(false);
    setIncorrCt(0);
    timereset();
  }

  function startCycle(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!inputRef?.current) return;
    const inputEl = inputRef.current as HTMLInputElement;
    inputEl.hidden = false;
    inputEl.focus();
    setInProgress(true);
    timestart(countdownTime);
  } 

  // timeout condition
  if (inProgress === true && complete  === false && timecheck === 0) {
    return (<>
      <div className="flex flex-col w-1/2 text-white text-2xl
      justify-center items-center gap-12">
        Time Up!
        <button
        onClick={handleReload}
        className="h-12 w-40 text-black bg-orange-400 rounded-full">
          Retry
        </button>
      </div>
    </>);
  };

  return (<>
      <textarea
      hidden={true}
      id="input_display"
      ref={inputRef}
      key="input_display"
      spellCheck="false"
      autoComplete="off"
      placeholder="Input..." 
      className="w-1/2 text-white break-normal text-xl bg-transparent
      z-30 px-12 py-2 font-light font-mono tracking-tight absolute
      left-1/2 h-2/3 overflow-hidden resize-none text-transparent
      text-opacity-0 rounded-xl"
      onChange={typingHandle} />
      {complete === false && <>
        <div
        id="text_input_display"
        className="text_display flex flex-col w-1/2 text-white
        break-normal text-xl px-12 py-2 tracking-tight font-light
        font-mono bg-slate-800 whitespace-pre relative h-2/3 rounded-xl
        border">
        {outputArr}
        {inProgress === false && 
          <div className="w-full h-full
          flex items-center justify-center">
            <button
            onClick={startCycle}
            className="h-12 w-40 font-sans font-light text-black
            bg-orange-400 rounded-full z-50">
              Start
            </button>
          </div>}
      </div>
      {inProgress === true && <>
        <div className="flex flex-col w-full h-1/4 
        bg-black absolute bottom-0 self-end px-36
        font-light text-2xl text-white rounded-xl
        justify-center items-start
        border border-orange-200">
          <div className="">time remaining: {timeleft}</div>
          <div>incorrect: {incorrCt}</div>
          <button
          onClick={resetHandler}
          className="bg-white text-black w-24 rounded-full py-1 my-2">
            reset
          </button>
        </div>
      </>}
    </>}
    {complete === true && <>
      <div
      id="result_display"
      className="flex flex-col w-1/2 text-white text-2xl
      justify-center items-center gap-12">
        <span>Congratulations</span>
        <span className="font-light">You completed it in {userRecord} s!</span>
        <button
        onClick={resetHandler}
        className="h-12 w-40 text-black bg-orange-400 rounded-full">
          Retry
        </button>
      </div>
    </>}
  </>);
}
  
