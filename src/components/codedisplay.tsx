export default function CodeDisplay({codeBlock}: {codeBlock: string[]}) {
  const codeParse: string[][] = [];
  let group = 0;
  let indentDepth = 0;
  let divGroup: React.JSX.Element[] = [];
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
      if (divGroup.length === 0 && group === 0) {
        for (let i = 0; i < indentDepth; i++) {
          lineGroup.push(<div
            id={`line${line}/indent${idx}`}
            key={`line${line}/indent${i}`}
            className="mx-3"/>);
        }
      }

      function lineAppend() {
        lineGroup.push(
          <div
            key={`line${line}/group${group}`}
            id={`line${line}/group${group}`}
            className="">
            {divGroup}
          </div>);
      }

      function divAppend(char: string) {
        divGroup.push(
          <span
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
            className="mr-2">{divGroup}</div>);
          divGroup = [];
          group++;
          strCount = 0;
          break;
        case /\(|\)/g.test(el):
          lineAppend();
          divGroup = [];
          group++;
          strCount = 0;
          if (/\(/g.test(el)) {
            divAppend(el);
            lineAppend();
            divGroup = [];
            group++;
          } else if (/\)/g.test(el)) {
            divAppend(el);
            lineAppend();
            divGroup = [];
            group++;
          }
          break;
        case /\{|\}/g.test(el):
          if (/\{/g.test(el)) {
            indentDepth++; 
            divAppend(el);
            lineAppend();
            divGroup = [];
          } else if (/\}/g.test(el)) {
            lineGroup.shift();
            divAppend(el);
            lineAppend();
            divGroup = [];
            indentDepth--; 
          }
          break;
        default:
          divAppend(el);
          strCount++;
          if (idx === spread.length - 1) {
            lineAppend();
            divGroup = [];
            group = 0;
          }
          break;
      }
    })

    htmlTransform.push(<div key={`line${line}`} id={`line${line}`} className="w-full h-8 flex">{lineGroup}</div>);
    lineGroup = [];
    group = 0;
  });

  return htmlTransform;
}

