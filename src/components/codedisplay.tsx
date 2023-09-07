export default function CodeDisplay({codeBlock}: {codeBlock: string[]}) {
  const codeParse: string[][] = [];
  let group = 0;
  let indentDepth = 0;
  let lineGroup: React.JSX.Element[] = [];
  const htmlTransform: React.JSX.Element[] = [];
  
  // string for code sample
  for (const line of codeBlock) {
    const split = line.split("");
    codeParse.push(split);
  }

  codeParse.forEach((spread, line) => {
    let strCount = 0;
    spread.forEach((el, idx) => {
      if (lineGroup.length === 0 && group === 0) {
        for (let i = 0; i < indentDepth; i++) {
          lineGroup.push(<div
            id={`line${line}/indent${idx}`}
            key={`line${line}/indent${i}`}
            className="mx-3"/>);
        }
      }

      function lineAppend(char: string) {
        lineGroup.push(<span
            key={`line${line}/group${group}/char${strCount}`}
            id={`line${line}/group${group}/char${strCount}`}>
            {char}
          </span>); 
      }

      switch(true) {
        case /\s/g.test(el):
          lineGroup.push(<div
            key={`line${line}/group${group}`}
            id={`line${line}/group${group}`}
            className="mr-2">{el}</div>);
          group++;
          strCount = 0;
          break;
        case /\(|\)/g.test(el):
          group++;
          strCount = 0;
          if (/\(/g.test(el)) {
            lineAppend(el);
            group++;
          } else if (/\)/g.test(el)) {
            lineAppend(el);
            group++;
          }
          break;
        case /\{|\}/g.test(el):
          if (/\{/g.test(el)) {
            indentDepth++; 
            lineAppend(el);
          } else if (/\}/g.test(el)) {
            lineGroup.shift();
            lineAppend(el);
            indentDepth--; 
          }
          break;
        default:
          lineAppend(el);
          strCount++;
          if (idx === spread.length - 1) {
            group = 0;
          }
          break;
      }
    })

    htmlTransform.push(
      <div
        key={`line${line}`}
        id={`line${line}`}
        className="w-full h-6 flex">
        {lineGroup}
      </div>);
    lineGroup = [];
    group = 0;
  });

  return htmlTransform;
}

