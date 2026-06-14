"use client";

import Image from "next/image";
import { AlertTriangle, ArrowLeft, Bot, Brain, BriefcaseBusiness, Check, ChevronRight, Compass, Edit3, Heart, LoaderCircle, Share2, Sparkles, Target, Users, X } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo, useState, type ReactNode } from "react";
import type { AvatarProfile, UserProfileInput } from "@/lib/ai/types";

type Target = "home" | "recommend" | "skill" | "mission";
type Draft = {
  name:string; major:string; grade:string; city:string; targetRole:string; selfIntro:string; projects:string;
  interests:string[]; dislikes:string[]; workStyles:string[]; pressure:string; achievements:string[]; values:string[]; skills:string[]; tools:string[];
};

const cx=(...v:Array<string|false|undefined>)=>v.filter(Boolean).join(" ");
const options={
  interests:["分析问题","与人沟通","创意策划","设计产品","研究用户","处理数据","组织协调","写作表达"],
  dislikes:["重复机械","频繁加班","强销售性质","大量电话","频繁出差","规则模糊","长期独处","琐碎事务"],
  workStyles:["团队协作","独立负责","目标清晰","灵活自由","快速迭代","稳定节奏","数据驱动","创意开放"],
  achievements:["解决真实问题","作品被认可","推动团队达成目标","看到数据增长","掌握新能力","帮助他人成长"],
  values:["成长空间","工作意义","稳定保障","收入回报","自主决策","团队氛围","社会影响","生活平衡"],
  skills:["逻辑分析","用户洞察","沟通表达","数据分析","文案写作","设计审美","项目管理","编程能力"],
  tools:["Excel","PPT","Figma","Python","SQL","Notion","PS","剪映"],
};

const createDraft=(p:UserProfileInput):Draft=>({
  name:p.name,major:"市场营销",grade:"大三",city:p.city,targetRole:p.targetRole,
  selfIntro:"我喜欢拆解复杂问题，也愿意和不同的人沟通，希望做能产生真实影响的工作。",
  projects:p.resume,interests:["分析问题","设计产品","研究用户","与人沟通"],dislikes:["重复机械","强销售性质"],
  workStyles:["团队协作","目标清晰","数据驱动"],pressure:"可以接受阶段性高压，但希望目标和优先级明确",
  achievements:["解决真实问题","作品被认可","推动团队达成目标"],values:["成长空间","工作意义","团队氛围"],
  skills:["逻辑分析","用户洞察","沟通表达"],tools:["Excel","PPT","Figma","Notion"],
});

function Card({children,className=""}:{children:ReactNode;className?:string}){return <section className={cx("rounded-2xl border border-[#e8e9f4] bg-white p-4 shadow-[0_8px_28px_rgba(70,63,132,.055)]",className)}>{children}</section>}
function Title({children}:{children:ReactNode}){return <h2 className="mb-4 border-l-[3px] border-[#6257ed] pl-2 text-[13px] font-bold">{children}</h2>}
function Progress({value}:{value:number}){return <div className="h-1.5 overflow-hidden rounded-full bg-[#ececf4]"><div className="h-full rounded-full bg-[#6257ed]" style={{width:`${value}%`}}/></div>}
function Tag({children,green=false}:{children:ReactNode;green?:boolean}){return <span className={cx("inline-flex rounded-lg px-2 py-1 text-[9px] font-medium",green?"bg-emerald-50 text-emerald-600":"bg-[#f0eeff] text-[#6257ed]")}>{children}</span>}
function Button({children,onClick,ghost=false,disabled=false}:{children:ReactNode;onClick?:()=>void;ghost?:boolean;disabled?:boolean}){return <button disabled={disabled} onClick={onClick} className={cx("inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-xs font-semibold transition active:scale-[.98] disabled:opacity-50",ghost?"border border-[#dedff0] bg-white text-[#5d53e8] hover:bg-[#f7f6ff]":"bg-[#6257ed] text-white shadow-[0_8px_20px_rgba(98,87,237,.2)]")}>{children}</button>}
function Chips({values,selected,onChange}:{values:string[];selected:string[];onChange:(v:string[])=>void}){return <div className="flex flex-wrap gap-2">{values.map(value=>{const active=selected.includes(value);return <button key={value} onClick={()=>onChange(active?selected.filter(x=>x!==value):[...selected,value])} className={cx("rounded-xl border px-3 py-2 text-[10px] transition",active?"border-[#7b70f2] bg-[#f0eeff] font-semibold text-[#5d53e8]":"border-[#e5e6ef] text-[#69718b] hover:border-[#c9c5f7]")}>{active&&<Check size={11} className="mr-1 inline"/>}{value}</button>})}</div>}
function Ring({value}:{value:number}){return <div className="grid size-[82px] place-items-center rounded-full" style={{background:`conic-gradient(#6257ed ${value*3.6}deg,#ecebfa 0)`}}><div className="grid size-[64px] place-items-center rounded-full bg-white text-center"><span><b className="block text-xl">{value}</b><small className="text-[8px] text-[#7d849d]">匹配度</small></span></div></div>}

function toProfile(d:Draft):UserProfileInput{return {
  name:d.name,targetRole:d.targetRole,city:d.city,
  strengths:[`专业年级：${d.major}，${d.grade}`,`擅长能力：${d.skills.join("、")}`,`常用工具：${d.tools.join("、")}`,`自我总结：${d.selfIntro}`].join("\n"),
  preferences:[`喜欢的活动：${d.interests.join("、")}`,`不喜欢的工作：${d.dislikes.join("、")}`,`工作方式偏好：${d.workStyles.join("、")}`,`压力耐受：${d.pressure}`,`成就感来源：${d.achievements.join("、")}`,`职业价值观：${d.values.join("、")}`].join("\n"),
  resume:d.projects,
}}

export function V4AvatarPage({profile,avatar,loading,edit,openTrace,go}:{profile:UserProfileInput;avatar:AvatarProfile|null;loading:boolean;edit:()=>void;openTrace:()=>void;go:(p:Target)=>void}){
  const traits=avatar?.traits??[
    {name:"逻辑分析",score:88,evidence:["善于拆解复杂问题"]},{name:"用户思维",score:82,evidence:["关注真实需求和场景"]},
    {name:"学习成长",score:90,evidence:["主动积累并持续复盘"]},{name:"沟通表达",score:76,evidence:["偏好协作与及时反馈"]},{name:"执行落地",score:80,evidence:["重视目标和成果"]},
  ];
  const score=Math.round(traits.reduce((s,x)=>s+x.score,0)/traits.length);
  const roles=avatar?.recommendedRoles?.length?avatar.recommendedRoles:[
    {title:"AI 产品经理",score:92,reason:"产品思维与用户洞察匹配"},{title:"数据分析师",score:88,reason:"逻辑与数据敏感度匹配"},
    {title:"用户研究员",score:85,reason:"沟通和洞察能力匹配"},{title:"产品运营",score:80,reason:"执行与协作能力匹配"},
  ];
  return <div className="space-y-3">
    <div className="flex items-end justify-between"><div><button onClick={()=>go("home")} className="mb-4 inline-flex items-center gap-1 text-[10px] text-[#727b94]"><ArrowLeft size={13}/>返回首页</button><div className="flex items-center gap-2"><h1 className="text-[27px] font-bold">我的职业数字分身</h1><Tag green>{avatar?"已创建":"待完善"}</Tag></div><p className="mt-1 text-[11px] text-[#7d849d]">基于自我认知、经历证据和试岗反馈，形成关于你的职业使用说明书。</p></div><div className="flex gap-2"><Button ghost onClick={openTrace}><Bot size={14}/>查看 AI 依据</Button><Button ghost><Share2 size={14}/>分享分身</Button><Button onClick={edit}>{loading?<LoaderCircle size={14} className="animate-spin"/>:<Edit3 size={14}/>}编辑并更新</Button></div></div>
    <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(300px,.6fr)] gap-3">
      <Card className="relative min-h-[310px] overflow-hidden bg-[radial-gradient(circle_at_22%_50%,#eceaff,transparent_38%)] p-6"><div className="absolute bottom-[-20px] left-5 h-[300px] w-[280px]"><Image src="/assets/avatar-student-tablet.png" alt="职业数字分身" fill priority className="object-contain"/></div><div className="ml-[300px]"><h2 className="text-[22px] font-bold">{profile.name}的分身</h2><div className="mt-3 flex gap-2">{["探索者","逻辑思考型","持续成长型"].map(x=><Tag key={x}>{x}</Tag>)}</div><p className="mt-4 rounded-xl border border-[#e8e7f4] bg-white/80 p-4 text-[10px] leading-6 text-[#68718b]">{avatar?.summary??"我会结合你的经历、兴趣、价值观和压力偏好，陪你预演不同岗位，并通过真实试岗反馈持续校准判断。"}</p><div className="mt-4 grid grid-cols-[90px_1fr] gap-y-3 text-[10px]"><span className="text-[#9298ac]">目标方向</span><b>{profile.targetRole} · {profile.city}</b><span className="text-[#9298ac]">数据来源</span><b>自我评估 + 经历证据 + 试岗反馈</b><span className="text-[#9298ac]">更新方式</span><b>每次试岗与成长复盘后自动校准</b></div></div></Card>
      <Card className="p-5"><Title>分身画像摘要</Title><div className="flex items-center gap-4"><Ring value={score}/><div><b className="text-sm text-emerald-600">契合度较高</b><p className="mt-2 text-[9px] leading-5 text-[#7d849d]">画像信息较完整，可以进入岗位预演；继续补充真实反馈会更准确。</p></div></div><h3 className="mt-5 text-[10px] font-bold">职业关键词</h3><div className="mt-2 flex flex-wrap gap-2">{["产品思维","数据驱动","用户导向","逻辑清晰","持续学习"].map(x=><Tag key={x}>{x}</Tag>)}</div><div className="mt-5"><Button onClick={()=>go("recommend")}><Compass size={14}/>让分身开始试岗</Button></div></Card>
    </div>
    <div className="grid grid-cols-[1fr_1fr_330px] gap-3">
      <Card><Title>核心特质</Title>{traits.slice(0,5).map(x=><div className="mb-4" key={x.name}><div className="mb-1 flex justify-between text-[10px]"><span><Brain size={12} className="mr-2 inline text-[#6257ed]"/><b>{x.name}</b><small className="ml-2 text-[#9298ac]">{x.evidence[0]}</small></span><b>{x.score}</b></div><Progress value={x.score}/></div>)}</Card>
      <Card><Title>职业倾向与工作偏好</Title><div className="mb-4 flex flex-wrap gap-2">{["产品经理","数据分析师","用户研究员","产品运营"].map(x=><Tag key={x}>{x}</Tag>)}</div>{profile.preferences.split("\n").slice(0,5).map((x,i)=><p key={x} className="mb-2 flex gap-2 text-[9px] leading-5 text-[#69728c]">{i===0?<Heart size={13} className="mt-1 text-rose-400"/>:<Users size={13} className="mt-1 text-[#6257ed]"/>}{x}</p>)}</Card>
      <div className="space-y-3"><Card><Title>优势亮点</Title>{(avatar?.strengths??["逻辑严谨，擅长结构化思考","学习能力强，适应变化快","用户敏感度高，善于换位思考"]).slice(0,4).map(x=><p key={x} className="mb-2 flex gap-2 text-[9px] leading-5"><Check size={13} className="mt-1 text-emerald-500"/>{x}</p>)}</Card><Card><Title>潜在风险</Title>{(avatar?.risks??["高压变化中容易过度分析","数据能力需要真实项目验证","面对不确定性需要明确优先级"]).slice(0,4).map(x=><p key={x} className="mb-2 flex gap-2 text-[9px] leading-5"><AlertTriangle size={13} className="mt-1 text-orange-400"/>{x}</p>)}</Card></div>
    </div>
    <div className="grid grid-cols-[1fr_340px] gap-3"><Card><Title>值得优先试岗的方向</Title><div className="grid grid-cols-4 gap-3">{roles.slice(0,4).map((role,i)=><button onClick={()=>go("recommend")} key={role.title} className="rounded-xl border border-[#e8e9f3] p-3 text-left transition hover:-translate-y-0.5 hover:border-[#cbc7f7]"><span className={cx("grid size-9 place-items-center rounded-xl",i%2?"bg-blue-50 text-blue-500":"bg-violet-50 text-violet-500")}><BriefcaseBusiness size={17}/></span><b className="mt-3 block text-[11px]">{role.title}</b><p className="mt-1 min-h-8 text-[8px] leading-4 text-[#8a91a8]">{role.reason}</p><b className="mt-2 block text-emerald-500">{role.score}%</b></button>)}</div></Card><Card><Title>成长建议</Title>{(avatar?.suggestions??["继续提升数据分析与可视化能力","加强项目管理与资源协调经验","完成一次完整岗位试岗并复盘"]).slice(0,4).map((x,i)=><button onClick={()=>go(i===2?"mission":"skill")} key={x} className="mb-2 flex w-full items-center gap-3 rounded-xl bg-[#fafaff] p-3 text-left"><Target size={13} className="text-[#6257ed]"/><span className="flex-1 text-[9px]">{x}</span><ChevronRight size={12}/></button>)}</Card></div>
  </div>
}

export function V4Onboarding({profile,finish,close,loading}:{profile:UserProfileInput;finish:(p:UserProfileInput)=>void;close:()=>void;loading:boolean}){
  const [step,setStep]=useState(0);const [draft,setDraft]=useState(()=>createDraft(profile));const preview=useMemo(()=>toProfile(draft),[draft]);
  const setList=(key:keyof Draft,value:string[])=>setDraft(x=>({...x,[key]:value}));
  const steps=["认识你","经历证据","兴趣偏好","压力与价值观","能力与确认"];
  return <motion.div initial={{opacity:0}} animate={{opacity:1}} className="fixed inset-0 z-[90] grid place-items-center bg-[#171a2d]/45 p-5 backdrop-blur-sm" onClick={close}><div onClick={e=>e.stopPropagation()} className="max-h-[92vh] w-full max-w-[900px] overflow-hidden rounded-2xl bg-white shadow-2xl"><header className="flex items-center justify-between border-b border-[#ececf4] px-6 py-4"><div><h2 className="text-lg font-bold">训练你的职业数字分身</h2><p className="mt-1 text-[10px] text-[#7d849d]">尽可能真实地总结自己。信息越多维，岗位预演和报告越准确。</p></div><button onClick={close}><X size={18}/></button></header><div className="grid grid-cols-[180px_1fr]"><aside className="border-r border-[#ececf4] bg-[#fafaff] p-4">{steps.map((x,i)=><div key={x} className={cx("mb-2 flex items-center gap-3 rounded-xl p-3 text-[10px]",step===i?"bg-[#efedff] font-semibold text-[#6257ed]":i<step?"text-emerald-600":"text-[#8a91aa]")}><span className="grid size-6 place-items-center rounded-full bg-[#e9eaf1]">{i<step?<Check size={12}/>:i+1}</span>{x}</div>)}</aside><main className="max-h-[68vh] overflow-y-auto p-6">
    {step===0&&<div><Title>基本背景与自我介绍</Title><div className="grid grid-cols-2 gap-3">{[["name","你的称呼"],["major","专业"],["grade","年级"],["city","目标城市"],["targetRole","正在考虑的岗位"]].map(([k,l])=><label key={k} className={k==="targetRole"?"col-span-2 text-[10px]":"text-[10px]"}>{l}<input value={draft[k as keyof Draft] as string} onChange={e=>setDraft({...draft,[k]:e.target.value})} className="mt-1 h-10 w-full rounded-xl border border-[#e3e5ef] px-3 outline-none focus:border-[#8177ff]"/></label>)}</div><label className="mt-4 block text-[10px]">请用自己的话介绍你自己<textarea value={draft.selfIntro} onChange={e=>setDraft({...draft,selfIntro:e.target.value})} className="mt-1 min-h-28 w-full rounded-xl border border-[#e3e5ef] p-3 leading-6" placeholder="性格、关注的问题、喜欢的活动、希望成为怎样的人，以及你对工作的期待。"/></label></div>}
    {step===1&&<div><Title>经历与行为证据</Title><p className="mb-3 text-[10px] leading-5 text-[#7d849d]">写清你做过什么、如何做、结果如何，以及其中最有成就感和最不喜欢的部分。</p><textarea value={draft.projects} onChange={e=>setDraft({...draft,projects:e.target.value})} className="min-h-[300px] w-full rounded-xl border border-[#e3e5ef] p-4 text-xs leading-6" placeholder="项目、课程作业、社团、比赛、实习、志愿活动都可以。"/></div>}
    {step===2&&<div className="space-y-5"><div><Title>喜欢做的事</Title><Chips values={options.interests} selected={draft.interests} onChange={v=>setList("interests",v)}/></div><div><Title>不喜欢的工作内容</Title><Chips values={options.dislikes} selected={draft.dislikes} onChange={v=>setList("dislikes",v)}/></div><div><Title>希望的工作方式</Title><Chips values={options.workStyles} selected={draft.workStyles} onChange={v=>setList("workStyles",v)}/></div></div>}
    {step===3&&<div className="space-y-5"><div><Title>压力耐受与压力来源</Title><textarea value={draft.pressure} onChange={e=>setDraft({...draft,pressure:e.target.value})} className="min-h-24 w-full rounded-xl border border-[#e3e5ef] p-3" placeholder="什么节奏可以接受？什么场景最容易让你有压力？"/></div><div><Title>成就感来源</Title><Chips values={options.achievements} selected={draft.achievements} onChange={v=>setList("achievements",v)}/></div><div><Title>职业价值观</Title><Chips values={options.values} selected={draft.values} onChange={v=>setList("values",v)}/></div></div>}
    {step===4&&<div className="space-y-5"><div><Title>擅长或正在形成的能力</Title><Chips values={options.skills} selected={draft.skills} onChange={v=>setList("skills",v)}/></div><div><Title>会使用的工具</Title><Chips values={options.tools} selected={draft.tools} onChange={v=>setList("tools",v)}/></div><Card className="bg-[#fafaff]"><Title>即将交给 AI 的自我信息</Title>{[preview.strengths,preview.preferences,preview.resume].map((x,i)=><p key={i} className="mb-2 whitespace-pre-line rounded-xl bg-white p-3 text-[9px] leading-5">{x}</p>)}</Card></div>}
  </main></div><footer className="flex items-center justify-between border-t border-[#ececf4] px-6 py-4"><span className="text-[10px] text-[#8a91aa]">第 {step+1} 步，共 {steps.length} 步</span><div className="flex gap-2"><Button ghost onClick={()=>step===0?close():setStep(x=>x-1)}>返回</Button>{step<4?<Button onClick={()=>setStep(x=>x+1)}>下一步<ChevronRight size={13}/></Button>:<Button disabled={loading} onClick={()=>finish(preview)}>{loading?<LoaderCircle size={14} className="animate-spin"/>:<Sparkles size={14}/>}生成我的分身报告</Button>}</div></footer></div></motion.div>
}
