import { readFileSync, writeFileSync } from "node:fs";

const jsPath = "public/assets/main-DLg1oGUN.js";
const cssPath = "public/assets/menu-DjKzWaJ3.css";

const pairs = [
  ["const l=i%8,c=new Float32Array", "const l=i%7,c=new Float32Array"],
  [
    'f.outlineBlur="13%",f.outlineColor=13421772,f.outlineWidth=.1,f.outlineOpacity=.07',
    'f.outlineBlur="0%",f.outlineColor=13421772,f.outlineWidth=0,f.outlineOpacity=0',
  ],
  [
    'g.outlineBlur="13%",g.outlineColor=10066329,g.outlineWidth=.05,g.outlineOpacity=.08',
    'g.outlineBlur="0%",g.outlineColor=10066329,g.outlineWidth=0,g.outlineOpacity=0',
  ],
  [
    's.outlineBlur="13%",s.outlineColor=16777215,s.outlineWidth=.1,s.outlineOpacity=.1,s.letterSpacing=.08,s.lineHeight=1',
    's.outlineBlur="5%",s.outlineColor=16777215,s.outlineWidth=.035,s.outlineOpacity=.07,s.letterSpacing=.08,s.lineHeight=1.55',
  ],
  [
    "`YUGC makes the UGC video\nyour brand can\nactually run.`",
    "`YUGC makes\nthe UGC video\nyour brand can\nactually run`",
  ],
  [
    "`Send the product.\nGet the UGC\nvideo.`",
    "`Send the product.\nGet the UGC video.`",
  ],
  [
    "`Start with what you sell.\nYUGC builds the UGC video\naround your product.`",
    "`Start with\nwhat you sell.`",
  ],
  [
    "`Tell YUGC the hook,\nthe tone, the offer.\nA creator-style ad\nfor your brand.`",
    "`Tell YUGC\nthe hook, the tone,\nthe offer.`",
  ],
  [
    "`YUGC finishes the UGC\nvideo for your brand.\nNative on the feed.\nReady to run.`",
    "`YUGC finishes\nthe UGC video\nfor your brand.`",
  ],
  [
    "`Meet YUGC.\nAI video\ngeneration in\nyour phone`",
    "`Meet YUGC.\nUGC videos\nfor your brand.`",
  ],
  [
    "`Brands need UGC.\nMost of it never looks\nlike a real post.`,`Brands need UGC.\nMost of it never looks\nlike a real post.`",
    "`Brands need UGC.\nMost of it never looks\nlike a real post.`,`YUGC makes\nthe UGC video\nyour brand can\nactually run`",
  ],
  ['"UGC videos for your brand"', "`UGC videos\nfor your brand`"],
];

const cssExtra = `
.moments h2 .line,.mainflow h2 .line{display:block;white-space:nowrap}
h2,.card__title{text-wrap:balance}
p,.card__text{text-wrap:pretty}
@media screen and (min-width:1025px){
.features{width:100%;left:0;transform:none;text-align:left}
.features .tag{margin-left:6vw}
.features h2{margin-left:6vw;font-size:clamp(40px,4.6vw,78px);line-height:1;white-space:nowrap}
.features p{max-width:28vw;margin:0 0 24px 6vw;text-align:left}
}
@media screen and (max-width:1024px){
.moments{max-width:92vw}
.moments h2{font-size:clamp(28px,7.2vw,36px)}
.features h2{font-size:clamp(32px,8vw,48px);white-space:nowrap}
.mainflow-mobile h2,.mainflow-mobile p{text-wrap:pretty}
}
.mainflow .tag{white-space:nowrap}
`;

let js = readFileSync(jsPath, "utf8");
let changed = false;
for (const [from, to] of pairs) {
  if (!js.includes(from)) continue;
  js = js.replaceAll(from, to);
  changed = true;
}
if (changed) {
  writeFileSync(jsPath, js);
  console.log("cleaned background type and the gallery ring");
} else {
  console.log("javascript already cleaned");
}

const cssPathMark = ".moments h2 .line";
let css = readFileSync(cssPath, "utf8");
if (!css.includes(cssPathMark)) {
  writeFileSync(cssPath, css + cssExtra);
  console.log("cleaned the type layout");
} else {
  console.log("stylesheet already cleaned");
}
