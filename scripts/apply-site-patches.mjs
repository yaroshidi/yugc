import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";

const patches = {"public/assets/main-DLg1oGUN.js":{"from":"d4c02f7ec9b4d1de882a5561a106186ccc42e26d41c9e8d5f1de3404d4df3595","to":"05397a165859766582198d0b9cc37493bc6a0cebcc5c687a5b660ed3dee14452","ops":[[5195,5195,"web"],[5196,5198,""],[5215,5215,"web"],[5216,5218,""],[6649,6707,""],[6743,6758,""],[6759,6768,""],[6807,6815,""],[6816,6856,""],[12416,12416,"web"],[12417,12419,""],[80015,80026,""],[80085,80096,""],[80441,80452,""],[80592,80603,""],[80912,80923,""],[89920,89931,""],[89990,90001,""],[90346,90357,""],[90497,90508,""],[90817,90828,""],[93719,93719,"web"],[93720,93722,""],[95659,95659,"await this.initGravityBalls(),this.onProgress(.3),await this.initGallery(),this.onProgress(.5),await this.initStaticBalls(),this.onProgress(.6),"],[95731,95732,"7"],[95782,95782,"),this.onProgress(.8"],[95851,95852,"9"],[95996,95999,"1"],[96014,96245,""],[97105,97128,""],[97148,97148,"new "],[97155,97155,"(t=>{this"],[97156,97156,"onInt"],[97157,97157,"oCompl"],[97158,97158,"te=t,thi"],[97159,97159,".intr"],[97160,97160,".p"],[97161,97163,"ay"],[97164,97164,")}"],[121860,121907,""],[122272,122291,""],[128126,128131,","],[128280,128347,""],[128695,128699,""],[128835,128902,""],[129119,129171,""]]},"public/assets/GravityBalls-D37pvzOo.js":{"from":"a8ec193ff0843029c22ff3448befa8c9ce820018ea8a7345da0666a767faa469","to":"c3e0c448b3478d3822480a69d1da4abc81eefad81a522b1d36762a15ead3adc3","ops":[[88523,88523,"web"],[88524,88526,""]]},"public/assets/menu-DjKzWaJ3.css":{"from":"ca7609eb9a7a0d3cac76fa005e5aa493a05b9b6c84b3324024b3b6eb27f19292","to":"3c9e076a4c2c87592d95029e1476e2b5a9b7ff3652b268b2900000e41f6e0de3","ops":[[78,78,"./"],[136,136,"./"]]},"public/index.html":{"from":"c6d63400af7b2aa53b7f163fe771774afe2f85a9a2f0e65fce74fb218553e63a","to":"fb85b1f0eec5b0cfd369f3b434d750d5539a8eebaf16d2c3cbefb59ffa7d3a4d","ops":[[1153,1157,""],[1942,3708,""],[3735,4106,""],[7614,7633,""],[7651,7651,"web"],[7652,7654,""],[7674,7676,"aut"],[7678,7678,"lay"],[7686,7693,""],[7874,7874,"web"],[7875,7877,""],[7950,7950,"auto"],[7951,7953,""],[7954,7955,""],[7956,7964,"y"],[8096,8096,"web"],[8097,8099,""],[8318,8318,"web"],[8319,8321,""],[8541,8541,"web"],[8542,8544,""],[8763,8763,"web"],[8764,8766,""],[8995,8998,""],[8999,9001,""],[15356,15356,"web"],[15357,15359,""],[15858,15858,"web"],[15859,15861,""],[16395,16395,"web"],[16396,16398,""],[16915,16915,"web"],[16916,16918,""],[22646,22646,"// Adding a class that is already present still notifies observers in\n          // this Chrome, so an unguarded add loops forever and the scene never\n          // reaches body.is-ready. The desktop content stays hidden.\n          "],[22714,22714,"{\n            "],[22746,22746,"\n          }"],[23240,23244,""],[23246,23258,"w"],[23259,23267,"k"],[23268,23433,""],[23443,23475,""],[23478,24125,""]]}};

for (const [path, patch] of Object.entries(patches)) {
  const text = readFileSync(path, "utf8");
  const hash = createHash("sha256").update(text).digest("hex");
  if (hash === patch.to) {
    console.log("already current", path);
    continue;
  }
  if (hash !== patch.from) {
    throw new Error(`unexpected ${path} hash ${hash}`);
  }
  let next = text;
  for (const [start, end, replacement] of [...patch.ops].sort((a, b) => b[0] - a[0])) {
    next = next.slice(0, start) + replacement + next.slice(end);
  }
  const after = createHash("sha256").update(next).digest("hex");
  if (after !== patch.to) throw new Error(`patch missed ${path}`);
  writeFileSync(path, next);
  console.log("patched", path);
}
