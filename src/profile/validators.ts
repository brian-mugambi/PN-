export const MAX_POSTS = 100;
export const MAX_MESSAGES = 5;
export const MIN_MESSAGE = 10;
export const MAX_MESSAGE = 50;

export const MAX_REPLIES_PER_MESSAGE = 20;
export const MIN_REPLY = MIN_MESSAGE;
export const MAX_REPLY = MAX_MESSAGE;

export function normalizeUsername(v: string) { return v.trim().toLowerCase(); }
export function validUsername(v: string) { return /^[a-z0-9_]{3,24}$/.test(v); }
export function validMessage(v: string) {
  const n = [...v.trim()].length;
  return n >= MIN_MESSAGE && n <= MAX_MESSAGE;
}
export function validMediaUrl(v: string) {
  try { const u = new URL(v); return u.protocol === "https:" || u.protocol === "http:"; }
  catch { return false; }
}
export function mediaTypeFromUrl(v: string): "image"|"video" {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(v) ? "video" : "image";
}
export function detectContacts(text: string) {
  return {
    urls: text.match(/https?:\/\/[^\s<]+/gi) ?? [],
    emails: text.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi) ?? [],
    phones: text.match(/(?<!\w)\+?\d[\d\s().-]{7,}\d(?!\w)/g) ?? []
  };
}

export const USERNAME_MIN = 4;
export const USERNAME_MAX = 24;

export type NameCheck = {ok:true;value:string}|{ok:false;message:string};

const LEET:Record<string,string> = {"0":"o","1":"i","3":"e","4":"a","5":"s","7":"t","@":"a","$":"s","!":"i"};
const leetLetters = (v:string,one="i") => v.toLowerCase().replace(/[013457@$!]/g,c=>c==="1"?one:LEET[c]).replace(/[^a-z]/g,"");
const plainLetters = (v:string) => v.toLowerCase().replace(/[^a-z]/g,"");
const squashes = (v:string) => [leetLetters(v,"i"),leetLetters(v,"l"),plainLetters(v)];

const STAFF = "official|support|admin|administrator|staff|team|help|helpdesk|moderator|mod|security|verify|verified|care|service|hq|ceo|founder|owner";
const BRAND_SUB = ["profilenet","profilesnet","pnetwork"];
const BRAND_EXACT = new RegExp(`^(pn|(${STAFF})pn|pn(${STAFF}|app|net|network|profile|profiles)?)$`);

export function impersonatesBrand(v:string):boolean {
  return squashes(v).some(s=>s&&(BRAND_SUB.some(b=>s.includes(b))||BRAND_EXACT.test(s)));
}

const RESERVED = new Set(("admin administrator support help helpdesk staff team official moderator mod root system security service services info contact abuse report reports verify verified billing payments payment api www app login signin signup logout register settings dashboard profiles profile shop inbox messages message terms privacy legal about anonymous visitor visitors owner null undefined none test testing user users username name guest everyone anyone nobody home index static assets public portfolio digitalcv posts post blocked notifications feedback faq status blog news press careers jobs").split(" "));

const NON_NOUNS = new Set(("because whatever however whenever wherever whoever whichever anything nothing something everything anyone someone everyone nobody anybody somebody everybody maybe perhaps never always sometimes often really very just also only even still already almost quite rather too and but or nor so yet for the this that these those with from about after before above below under over into onto upon within without would could should might must shall will can may does did done doing have has had having been being are was were not nope yes yeah okay ok hello hey hi bye thanks please sorry here there where when which while since though although unless until whether then than them they their theirs what who whom whose how why you your yours yourself myself himself herself itself ourselves its his her hers our ours mine his she him we us me my our each every either neither both many much more most less least few several some any all none other another such same own else instead hence thus therefore moreover furthermore meanwhile otherwise besides anyway anyhow somehow somewhat somewhere nowhere anywhere everywhere forever ever once twice again away back down off out up via per like unlike near far beyond across along among around between behind beside during except inside outside toward towards throughout against despite whereas whereby wherein whatsoever whomever idk lol omg wow yolo blah etc").split(" "));

const MASH = new Set("qwerty qwertyui qwertyuiop asdf asdfg asdfgh asdfghj asdfghjkl zxcv zxcvb zxcvbn zxcvbnm qazwsx abcd abcde abcdef abcdefg hjkl uiop".split(" "));

function isMash(letters:string){
  return /(.)\1{3,}/.test(letters) || /^(.)\1*$/.test(letters) || MASH.has(letters);
}

const BRAND_MSG = "That name looks like Profile Network or its team. Names that imitate Profile Network aren't allowed. Use your own name or brand.";

export function checkUsername(raw:string):NameCheck {
  const v = raw.trim().toLowerCase();
  if(!v) return {ok:false,message:"Choose a username. It becomes your link and can't be changed later."};
  if(/\s/.test(v)) return {ok:false,message:"No spaces in a username. Use an underscore instead, like mary_jane."};
  const bad = [...new Set(v.replace(/[a-z0-9_]/g,"").split(""))];
  if(bad.length) return {ok:false,message:`${bad.slice(0,3).map(c=>`“${c}”`).join(" ")} can't be used. Use only letters, numbers and underscores.`};
  if(impersonatesBrand(v)) return {ok:false,message:BRAND_MSG};
  if(v.length<USERNAME_MIN) return {ok:false,message:`Too short. Use at least ${USERNAME_MIN} characters.`};
  if(v.length>USERNAME_MAX) return {ok:false,message:`Too long. Use ${USERNAME_MAX} characters or fewer.`};
  if(!/^[a-z]/.test(v)) return {ok:false,message:"Start with a letter, not a number or underscore."};
  if(v.includes("__")) return {ok:false,message:"Use only one underscore in a row."};
  if(v.endsWith("_")) return {ok:false,message:"Don't end with an underscore."};
  const letters = plainLetters(v);
  if(RESERVED.has(letters)) return {ok:false,message:`“${v}” is reserved for the app. Choose something that's yours.`};
  const parts = v.split(/[_\d]+/).filter(Boolean);
  if(NON_NOUNS.has(letters) || (parts.length>0&&parts.every(p=>NON_NOUNS.has(p))))
    return {ok:false,message:`“${v}” isn't a name. Use your own name, nickname or brand, like mary_designs.`};
  const leet = leetLetters(v);
  if(isMash(letters) || !/[aeiouy]/.test(leet)) return {ok:false,message:"That doesn't look like a real name. Use your own name, nickname or brand."};
  return {ok:true,value:v};
}

export function checkDisplayName(raw:string):NameCheck {
  const v = raw.trim().replace(/\s+/g," ");
  if(!v) return {ok:false,message:"Add a display name."};
  if(!/[a-z]/i.test(v)) return {ok:false,message:"Use at least one letter in your display name."};
  if([...v].length<2) return {ok:false,message:"Too short. Use at least 2 characters."};
  if(impersonatesBrand(v)) return {ok:false,message:BRAND_MSG};
  const words = v.toLowerCase().split(/[^a-z]+/).filter(Boolean);
  if(words.length>0&&words.every(w=>NON_NOUNS.has(w))) return {ok:false,message:`“${v}” isn't a name. Use your real name, nickname or brand.`};
  if(isMash(plainLetters(v))) return {ok:false,message:"That doesn't look like a real name. Use your own name, nickname or brand."};
  return {ok:true,value:v};
}

export function usernameSuggestions(base:string):string[] {
  const b = base.replace(/_+$/,"").slice(0,18);
  const r = (n:number)=>String(Math.floor(Math.random()*n)).padStart(String(n-1).length,"0");
  return [...new Set([`${b}_${r(100)}`,`${b}${r(1000)}`,`the_${b}`,`${b}_${new Date().getFullYear()}`])]
    .filter(s=>checkUsername(s).ok);
}
