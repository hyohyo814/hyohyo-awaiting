import { useState } from "react"; 

export default function InputDisplay() {
  const [outputArr, setOutputArr] = useState<React.JSX.Element[]>([]);

  function typingHandle(e: React.SyntheticEvent) {
    e.preventDefault();
    const target = e.target as HTMLInputElement;
    const lineSplit = target.value.split("\n");
    let strCount = 0;
    let indentDepth = 0;
    let inputGroup = 0;
    let cacheCount = 0;
    let lineGroup: React.JSX.Element[] = [];
    const result: React.JSX.Element[] = []; 

    lineSplit.forEach((line, lineIdx) => {
      inputGroup = 0;
      const inputSplit = line.split("");
      if (indentDepth > 0) {
        for (let i = 0; i < indentDepth; i++) {
          lineGroup.push(<div key={`line${lineIdx}/group${inputGroup}/char${strCount}`} className="inline-flex mx-4" />);
        }
      }

      for (let i = 0; i <= result.length; i++) {
        const lineEl = document.querySelector(`[id='lineGroup${i}']`);
        i === lineIdx
          ? lineEl?.setAttribute("class", "flex h-7 bg-slate-500/50")
          : lineEl?.setAttribute("class", "flex h-7")
      }

      let prev = "";
      inputSplit.forEach((inputChar, charIdx) => {
        let curr = inputChar;
        function focusDiv(group: number) {
          return document.querySelectorAll(`[id='line${lineIdx}/group${group}'] span`)
        };
        if (!focusDiv) return;

        switch(true) {
          case /\s/g.test(inputChar): 
            if (!/\s/g.test(prev)) {
              strCount = 0;
              inputGroup++;
              lineGroup.push(<span id={`line${lineIdx}/group${inputGroup}/char${strCount}/spacer`} key={`line${lineIdx}/group${inputGroup}/char${strCount}`}>{inputChar}</span>);
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
              indentDepth--;
              lineGroup.shift();
            }

            if (inputChar === (focusDiv(inputGroup)[strCount] as HTMLSpanElement)?.innerText) {
              lineGroup.push(<span id={`line${lineIdx}/group${inputGroup}/char${strCount}`} key={`line${lineIdx}/group${inputGroup}/char${strCount}`} className="text-green-500">{inputChar}</span>);
              inputGroup++;
            } else {
              lineGroup.push(<span id={`line${lineIdx}/group${inputGroup}/char${strCount}`} key={`line${lineIdx}/group${inputGroup}/char${strCount}`}className="text-rose-500">{inputChar}</span>);
            }
            
            break;
          case inputChar === (focusDiv(inputGroup)[strCount] as HTMLSpanElement)?.innerText:
            strCount++;
            cacheCount++;
            lineGroup.push(<span id={`line${lineIdx}/group${inputGroup}/char${strCount}`} key={`line${lineIdx}/group${inputGroup}/char${strCount}`} className="text-green-500">{inputChar}</span>);
            break;
          case inputChar !== (focusDiv(inputGroup)[strCount] as HTMLSpanElement)?.innerText: 
            strCount++;
            cacheCount++;
            lineGroup.push(<span id={`line${lineIdx}/group${inputGroup}/char${strCount}`} key={`line${lineIdx}/group${inputGroup}/char${strCount}`} className="text-rose-500">{inputChar}</span>);
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
    setOutputArr(result);
  };

  return (
    <>
      <textarea
        id="input_display"
        key="input_display"
        spellCheck="false"
        autoComplete="off"
        className="w-1/2 text-white break-normal text-xl bg-transparent z-50 px-12 py-2
        font-light font-mono tracking-tight absolute left-1/2
        h-full resize-none text-transparent text-opacity-0"
        onChange={typingHandle} />
      <div
        id="text_input_display"
        className="text_display flex flex-col w-1/2 text-white
        break-normal text-xl px-12 py-2 tracking-tight font-light
        font-mono bg-slate-800 whitespace-pre">
        {outputArr}
      </div>
    </>
  );
}

