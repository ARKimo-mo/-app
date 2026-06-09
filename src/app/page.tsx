"use client";

import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  ClipboardCheck,
  ExternalLink,
  FileText,
  GraduationCap,
  Map,
  Play,
  RefreshCcw,
  Search,
  Sparkles,
  Target,
  Trophy,
  UserRound,
  WandSparkles
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  addEvidence,
  createAvatar,
  evaluateProject,
  generateMatches,
  generateResume,
  learningResources as resourceSeeds,
  learningTasks as taskSeeds,
  projectDeliverables as deliverableSeeds,
  roleTitle,
  stageCopy
} from "@/lib/growth";
import { roles } from "@/lib/templates";
import type {
  CareerAvatar,
  CareerStage,
  GrowthEvidence,
  LearningResource,
  LearningTask,
  Profile,
  ProjectDeliverable,
  ProjectEvaluation,
  ResumeProject,
  RoleId,
  RoleMatch
} from "@/lib/types";

type AppPhase = "match" | "learn" | "project" | "result";

type SavedState = {
  profile: Profile;
  phase: AppPhase;
  matches: RoleMatch[];
  avatar: CareerAvatar | null;
  resources: LearningResource[];
  tasks: LearningTask[];
  deliverables: ProjectDeliverable[];
  evaluation: ProjectEvaluation | null;
  resume: ResumeProject | null;
};

const emptyProfile: Profile = {
  name: "林同学",
  mbti: "ENFJ",
  communication: 84,
  structure: 76,
  technical: 62,
  ambiguity: 78,
  pressure: 72,
  business: 82,
  resume: "校园 AI 求职助手项目，负责用户调研、需求分析、PRD 和原型设计；组织过校园活动并完成数据复盘。"
};

const questionnaire = [
  { key: "communication", label: "我愿意主动澄清需求并推动团队达成共识" },
  { key: "structure", label: "面对复杂问题，我会先拆解目标和约束" },
  { key: "technical", label: "我愿意理解 AI、数据与技术实现的基本原理" },
  { key: "ambiguity", label: "信息不完整时，我仍能尝试提出下一步方案" },
  { key: "business", label: "我习惯思考方案能给用户和业务带来什么价值" }
] as const;

const stageOrder: CareerStage[] = ["explorer", "learner", "intern", "candidate"];

function PixelAvatar({ avatar, name }: { avatar: CareerAvatar | null; name: string }) {
  const stage = avatar?.stage ?? "explorer";
  return (
    <div className={`career-avatar stage-${stage}`} title="点击能力与证据查看成长原因">
      <img src="/assets/career-character.png" alt={`${name || "AI"}的职业分身`} />
      <span className="avatar-name">{name.slice(0, 1) || "AI"}</span>
      <span className="avatar-prop prop-left" />
      <span className="avatar-prop prop-right" />
      {stage !== "explorer" && <span className="avatar-badge"><Sparkles size={12} /></span>}
    </div>
  );
}

function GuideBanner({
  title,
  description,
  steps,
  active
}: {
  title: string;
  description: string;
  steps: string[];
  active: number;
}) {
  return (
    <div className="guide-banner">
      <div className="guide-copy">
        <span><Sparkles size={15} />AI 导师正在陪你完成</span>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
      <div className="guide-steps">
        {steps.map((step, index) => (
          <div className={index === active ? "active" : index < active ? "done" : ""} key={step}>
            <span>{index < active ? <Check size={14} /> : index + 1}</span>
            <strong>{step}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function GrowthRoute({ avatar, onSelect }: { avatar: CareerAvatar | null; onSelect: (phase: AppPhase) => void }) {
  const currentIndex = stageOrder.indexOf(avatar?.stage ?? "explorer");
  const phaseMap: Record<CareerStage, AppPhase> = {
    explorer: "match",
    learner: "learn",
    intern: "project",
    candidate: "result"
  };
  return (
    <div className="growth-route">
      {stageOrder.map((stage, index) => (
        <button
          key={stage}
          className={index === currentIndex ? "route-node active" : index < currentIndex ? "route-node done" : "route-node"}
          type="button"
          disabled={index > currentIndex}
          onClick={() => onSelect(phaseMap[stage])}
        >
          <span>{index < currentIndex ? <Check size={15} /> : index + 1}</span>
          <strong>{stageCopy[stage].title}</strong>
          <small>{stageCopy[stage].item}</small>
        </button>
      ))}
    </div>
  );
}

function MatchJourney({
  profile,
  matches,
  avatar,
  onAnalyze,
  onChoose
}: {
  profile: Profile;
  matches: RoleMatch[];
  avatar: CareerAvatar | null;
  onAnalyze: () => void;
  onChoose: (roleId: RoleId) => void;
}) {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const analysisLabel =
    progress < 25 ? "正在读取简历里的经历和技能" :
      progress < 50 ? "正在理解你的工作偏好" :
        progress < 75 ? "正在对照岗位能力模型" :
          progress < 100 ? "正在生成匹配证据与能力缺口" : "分析完成";

  useEffect(() => {
    if (!running) return;
    if (progress >= 100) {
      setRunning(false);
      onAnalyze();
      return;
    }
    const timer = window.setTimeout(() => setProgress((value) => Math.min(100, value + 4)), 80);
    return () => window.clearTimeout(timer);
  }, [running, progress, onAnalyze]);

  return (
    <section className="phase-panel">
      <div className="phase-heading">
        <div>
          <span className="eyebrow">第一阶段 · 岗位匹配</span>
          <h1>让分身替你探索职业方向</h1>
          <p>系统结合简历、问卷和 MBTI 推荐三个岗位。动画只是分析过程的可视化，最终判断来自画像与岗位能力模型。</p>
        </div>
        <button
          className="primary-button"
          type="button"
          onClick={() => {
            setProgress(0);
            setRunning(true);
          }}
        >
          <Play size={18} />
          {matches.length ? "重新试岗" : "开始试岗"}
        </button>
      </div>

      <GuideBanner
        title={matches.length ? "看懂推荐结果，再确认你愿意投入的方向" : "先建立画像，再让分身探索可能的岗位"}
        description={matches.length
          ? "匹配分数代表当前潜力，不等于已经胜任。请重点看推荐理由和能力缺口，然后选择一个目标岗位进入培养。"
          : "你提供的简历说明做过什么，短问卷说明喜欢怎样工作，MBTI只作为弱参考。系统会综合这些信息，而不是只靠性格标签推荐。"}
        steps={["完善个人画像", "分身探索岗位", "确认目标方向"]}
        active={matches.length ? 2 : running ? 1 : 0}
      />

      <div className="match-world">
        <div className="world-road" />
        <div className="world-avatar" style={{ left: `${8 + progress * 0.76}%` }}>
          <PixelAvatar avatar={avatar} name={profile.name} />
        </div>
        {roles.slice(0, 4).map((role, index) => (
          <div className={`role-building building-${index + 1}`} key={role.id}>
            <BriefcaseBusiness size={22} />
            <strong>{role.title}</strong>
            <span>{running ? (progress > index * 26 ? "分析中..." : "等待") : "岗位站"}</span>
          </div>
        ))}
        <div className="analysis-console">
          <span>画像分析进度</span>
          <strong>{running ? progress : matches.length ? 100 : 0}%</strong>
          <div><i style={{ width: `${running ? progress : matches.length ? 100 : 0}%` }} /></div>
          <small>{running ? analysisLabel : matches.length ? "已生成三个候选岗位" : "点击开始后，分身会依次探索岗位"}</small>
        </div>
      </div>

      {matches.length > 0 && !running && (
        <div className="match-results">
          {matches.map((match, index) => {
            const role = roles.find((item) => item.id === match.roleId)!;
            return (
              <article className={index === 0 ? "match-card best" : "match-card"} key={match.roleId}>
                <div className="rank">TOP {index + 1}</div>
                <div className="match-score">{match.score}<small>%</small></div>
                <h3>{role.title}</h3>
                <p>{match.reason}</p>
                <div className="gap-note"><Target size={15} />{match.gap}</div>
                <button type="button" onClick={() => onChoose(match.roleId)}>
                  {match.roleId === "ai-pm" ? "设为目标岗位" : "查看路线预览"}
                  <ChevronRight size={16} />
                </button>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function LearningWorkspace({
  resources,
  tasks,
  avatar,
  onRead,
  onTask,
  onProject,
  onSearch,
  resourceMode
}: {
  resources: LearningResource[];
  tasks: LearningTask[];
  avatar: CareerAvatar;
  onRead: (id: string) => void;
  onTask: (task: LearningTask) => void;
  onProject: () => void;
  onSearch: () => void;
  resourceMode: "fallback" | "live";
}) {
  const quizDone = tasks.filter((item) => item.kind === "quiz" && item.done).length;
  return (
    <section className="phase-panel">
      <div className="phase-heading">
        <div>
          <span className="eyebrow">第二阶段 · 岗位学习</span>
          <h1>AI 学习 Agent 已生成成长路线</h1>
          <p>公开资料用于建立理解，只有完成测验才会形成掌握证据并提升能力。</p>
        </div>
        <button className="agent-status" type="button" onClick={onSearch}>
          <Search size={18} /><span>Tavily 公开搜索</span><strong>{resourceMode === "live" ? "实时结果" : "演示数据"}</strong>
        </button>
      </div>

      <GuideBanner
        title="不是收藏课程，而是补齐目标岗位的能力缺口"
        description="第一步查看 Agent 找到的公开资料；第二步按计划学习；第三步通过测验证明已经掌握。仅阅读不会提高能力分。"
        steps={["查看资料来源", "完成学习任务", "通过能力测验"]}
        active={quizDone >= 2 ? 2 : resources.some((item) => item.read) || tasks.some((item) => item.done) ? 1 : 0}
      />

      <div className="learning-grid">
        <div className="work-section">
          <div className="section-heading"><BookOpen size={19} /><div><strong>公开学习资源</strong><span>保留来源与原始链接</span></div></div>
          <div className="resource-list">
            {resources.map((resource) => (
              <article key={resource.id}>
                <div className="resource-type">{resource.type}</div>
                <div>
                  <strong>{resource.title}</strong>
                  <p>{resource.summary}</p>
                  <a href={resource.url} target="_blank" rel="noreferrer">{resource.source}<ExternalLink size={13} /></a>
                </div>
                <button className={resource.read ? "icon-action complete" : "icon-action"} type="button" onClick={() => onRead(resource.id)} title="标记阅读">
                  {resource.read ? <Check size={18} /> : <BookOpen size={18} />}
                </button>
              </article>
            ))}
          </div>
        </div>

        <div className="work-section">
          <div className="section-heading"><Map size={19} /><div><strong>3 周学习计划</strong><span>针对 AI 产品经理能力缺口</span></div></div>
          <div className="task-list">
            {tasks.map((task) => (
              <button className={task.done ? "task-row done" : "task-row"} key={task.id} type="button" onClick={() => onTask(task)}>
                <span>W{task.week}</span>
                <div><strong>{task.title}</strong><small>{task.kind === "quiz" ? "通过后生成能力证据" : "完成后仅记录学习进度"}</small></div>
                {task.done ? <Check size={18} /> : <ArrowRight size={18} />}
              </button>
            ))}
          </div>
          <div className="learning-footer">
            <span>测验通过 {quizDone}/2</span>
            <button className="primary-button" type="button" disabled={quizDone < 2} onClick={onProject}>
              进入项目实战<ArrowRight size={17} />
            </button>
          </div>
        </div>
      </div>

      <CompetencyPanel avatar={avatar} />
    </section>
  );
}

function CompetencyPanel({ avatar }: { avatar: CareerAvatar }) {
  return (
    <div className="competency-panel">
      <div className="section-heading"><Target size={19} /><div><strong>距离 {roleTitle(avatar.targetRole)} 还有 {100 - avatar.currentFit}%</strong><span>每次变化都必须有学习或项目证据</span></div></div>
      <div className="competency-bars">
        {avatar.competencies.map((item) => (
          <div key={item.id}>
            <div><strong>{item.label}</strong><span>{item.current} / {item.target}</span></div>
            <div className="bar-track"><i style={{ width: `${item.current}%` }} /><b style={{ left: `${item.target}%` }} /></div>
          </div>
        ))}
      </div>
      <div className="evidence-timeline">
        {avatar.evidence.length ? avatar.evidence.slice(0, 5).map((item) => (
          <article key={item.id}>
            <span>+{item.delta}</span>
            <div><strong>{item.title}</strong><p>{item.detail}</p></div>
          </article>
        )) : <p className="empty-note">完成测验或提交项目后，这里会记录能力升级原因。</p>}
      </div>
    </div>
  );
}

function ProjectWorkspace({
  deliverables,
  evaluation,
  onChange,
  onSubmit,
  onEvaluate,
  onFinish
}: {
  deliverables: ProjectDeliverable[];
  evaluation: ProjectEvaluation | null;
  onChange: (id: string, content: string) => void;
  onSubmit: (id: string) => void;
  onEvaluate: () => void;
  onFinish: () => void;
}) {
  const submitted = deliverables.filter((item) => item.submitted).length;
  return (
    <section className="phase-panel">
      <div className="phase-heading">
        <div>
          <span className="eyebrow">第三阶段 · 项目实战</span>
          <h1>设计 AI 求职助手核心功能</h1>
          <p>AI 可以给反馈，但最终作品必须由你提交。只有真实交付物才会成为能力和简历证据。</p>
        </div>
        <div className="project-progress"><strong>{submitted}/5</strong><span>交付物</span></div>
      </div>

      <GuideBanner
        title="把学到的知识变成一份可验证的岗位作品"
        description="先逐项写出自己的判断并提交证据；AI 再按岗位标准评审；通过后才能进入简历生成。预填内容用于演示，你可以直接修改。"
        steps={["完成岗位作品包", "接受 AI 评审", "沉淀项目证据"]}
        active={evaluation?.passed ? 2 : submitted >= 4 ? 1 : 0}
      />

      <div className="project-layout">
        <nav className="deliverable-nav">
          {deliverables.map((item, index) => (
            <a href={`#${item.id}`} className={item.submitted ? "done" : ""} key={item.id}>
              <span>{item.submitted ? <Check size={14} /> : index + 1}</span>{item.title}
            </a>
          ))}
        </nav>
        <div className="deliverable-editor">
          {deliverables.map((item) => (
            <article id={item.id} key={item.id}>
              <div><span className="eyebrow">项目交付物</span><h3>{item.title}</h3><p>{item.prompt}</p></div>
              <textarea value={item.content} placeholder="写下你的判断、依据和方案。演示时可使用预填内容。" onChange={(event) => onChange(item.id, event.target.value)} />
              <button type="button" disabled={item.content.trim().length < 20} onClick={() => onSubmit(item.id)}>
                {item.submitted ? <><Check size={16} />已提交</> : <><ClipboardCheck size={16} />提交证据</>}
              </button>
            </article>
          ))}
        </div>
        <aside className="review-sidebar">
          <div className="section-heading"><WandSparkles size={19} /><div><strong>AI 项目评审</strong><span>按岗位量表给出证据反馈</span></div></div>
          {!evaluation ? (
            <>
              <p>完成至少 4 项交付物后，可以进行正式评审。</p>
              <button className="primary-button" type="button" disabled={submitted < 4} onClick={onEvaluate}>开始评审</button>
            </>
          ) : (
            <div className="evaluation">
              <div className="evaluation-score">{evaluation.score}<small>分</small></div>
              <strong>{evaluation.passed ? "项目评审通过" : "需要继续完善"}</strong>
              {evaluation.strengths.map((item) => <p className="positive" key={item}>+ {item}</p>)}
              {evaluation.improvements.map((item) => <p key={item}>· {item}</p>)}
              <button className="primary-button" type="button" disabled={!evaluation.passed} onClick={onFinish}>生成职业成果</button>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}

function ResultWorkspace({ avatar, resume, profile }: { avatar: CareerAvatar; resume: ResumeProject; profile: Profile }) {
  return (
    <section className="phase-panel">
      <GuideBanner
        title="你得到的不是一段包装文案，而是一条有证据的成长记录"
        description="系统对比初始准备度与当前能力，只引用你通过测验和项目评审形成的证据。没有验证过的项目数字会明确标记为待补充。"
        steps={["回看能力变化", "使用简历项目经历", "准备面试讲述"]}
        active={2}
      />
      <div className="result-hero">
        <div className="candidate-stage">
          <PixelAvatar avatar={avatar} name={profile.name} />
          <div><span>职业成长完成</span><strong>{profile.name} · {roleTitle(avatar.targetRole)}候选人</strong><small>已解锁：{avatar.unlockedItems.join("、")}</small></div>
        </div>
        <div className="fit-growth"><span>岗位匹配度</span><strong>{avatar.initialFit}% <ArrowRight size={22} /> {avatar.currentFit}%</strong><small>所有增长均来自测验与项目证据</small></div>
      </div>
      <div className="result-grid">
        <div className="resume-output">
          <div className="section-heading"><FileText size={19} /><div><strong>可写入简历的项目经历</strong><span>未验证数字不会自动编造</span></div></div>
          <h2>{resume.title}</h2>
          <p>{resume.summary}</p>
          <ul>{resume.bullets.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div className="interview-output">
          <div className="section-heading"><Trophy size={19} /><div><strong>面试讲述版</strong><span>从真实项目产物提炼</span></div></div>
          <blockquote>{resume.interviewStory}</blockquote>
          <div className="proof-list">
            {avatar.evidence.map((item) => <span key={item.id}>{item.title}</span>)}
          </div>
        </div>
      </div>
      <CompetencyPanel avatar={avatar} />
    </section>
  );
}

export default function Home() {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [phase, setPhase] = useState<AppPhase>("match");
  const [matches, setMatches] = useState<RoleMatch[]>([]);
  const [avatar, setAvatar] = useState<CareerAvatar | null>(null);
  const [resources, setResources] = useState<LearningResource[]>(resourceSeeds);
  const [tasks, setTasks] = useState<LearningTask[]>(taskSeeds);
  const [deliverables, setDeliverables] = useState<ProjectDeliverable[]>(deliverableSeeds);
  const [evaluation, setEvaluation] = useState<ProjectEvaluation | null>(null);
  const [resume, setResume] = useState<ResumeProject | null>(null);
  const [resourceMode, setResourceMode] = useState<"fallback" | "live">("fallback");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem("career-avatar-demo");
    if (raw) {
      try {
        const saved = JSON.parse(raw) as SavedState;
        setProfile(saved.profile);
        setPhase(saved.phase);
        setMatches(saved.matches);
        setAvatar(saved.avatar);
        setResources(saved.resources);
        setTasks(saved.tasks);
        setDeliverables(saved.deliverables);
        setEvaluation(saved.evaluation);
        setResume(saved.resume);
      } catch {
        window.localStorage.removeItem("career-avatar-demo");
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const state: SavedState = { profile, phase, matches, avatar, resources, tasks, deliverables, evaluation, resume };
    window.localStorage.setItem("career-avatar-demo", JSON.stringify(state));
  }, [hydrated, profile, phase, matches, avatar, resources, tasks, deliverables, evaluation, resume]);

  const milestones = useMemo(() => stageOrder.map((stage) => ({
    stage,
    unlocked: stageOrder.indexOf(stage) <= stageOrder.indexOf(avatar?.stage ?? "explorer")
  })), [avatar]);

  const evidence = (id: string, competency: GrowthEvidence["competency"], title: string, detail: string, delta: number, source: GrowthEvidence["source"]): GrowthEvidence => ({
    id, competency, title, detail, delta, source, createdAt: new Date().toISOString()
  });

  const analyze = () => {
    const nextMatches = generateMatches(profile);
    setMatches(nextMatches);
    setAvatar(createAvatar(profile, nextMatches));
  };

  const chooseRole = (roleId: RoleId) => {
    if (!avatar) return;
    if (roleId !== "ai-pm") return;
    setAvatar({
      ...avatar,
      stage: "learner",
      targetRole: roleId,
      unlockedItems: [...avatar.unlockedItems, "知识手册"]
    });
    setPhase("learn");
  };

  const completeTask = (task: LearningTask) => {
    if (task.done) return;
    setTasks((current) => current.map((item) => item.id === task.id ? { ...item, done: true } : item));
    if (task.kind === "quiz" && avatar) {
      const next = addEvidence(
        avatar,
        evidence(`quiz-${task.id}`, task.id === "l2" ? "knowledge" : "tools", `通过测验：${task.title}`, "测验结果证明已经掌握对应知识，而不仅是阅读过资料。", 7, "quiz")
      );
      setAvatar(next);
    }
  };

  const enterProject = () => {
    if (!avatar) return;
    setAvatar({ ...avatar, stage: "intern", unlockedItems: [...new Set([...avatar.unlockedItems, "企业工牌", "PRD夹板"])] });
    setDeliverables(deliverableSeeds.map((item, index) => ({
      ...item,
      content: [
        "目标用户是缺少职业信息与项目经历的应届生。核心痛点是不了解岗位真实要求、无法判断自身差距，也缺少可验证的项目证据。",
        "目标是帮助用户理解岗位、补齐能力并形成真实项目成果。核心场景包括岗位匹配、个性化学习、项目实战和成果沉淀。",
        "产品先解析简历与问卷形成画像，推荐岗位后生成能力缺口。用户确认方向，再由学习 Agent 搜集公开资料并生成计划，最终进入项目工作台。",
        "北极星指标为完成一个可评审岗位作品包的用户比例。过程指标包括学习计划完成率、测验通过率、项目提交率与复审提升幅度。",
        "最大的取舍是不让 AI 代替用户完成作品。AI 负责资料整理、反馈和评审，最终简历只使用用户实际提交的事实。"
      ][index],
      submitted: false
    })));
    setPhase("project");
  };

  const searchResources = async () => {
    try {
      const response = await fetch("/api/resources/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: "AI 产品经理 学习课程 产品实战 面试经验" })
      });
      const data = await response.json();
      if (Array.isArray(data.resources) && data.resources.length) {
        setResources(data.resources);
        setResourceMode(data.mode === "live" ? "live" : "fallback");
      }
    } catch {
      setResources(resourceSeeds);
      setResourceMode("fallback");
    }
  };

  const runEvaluation = async () => {
    if (!avatar) return;
    let result = evaluateProject(deliverables);
    try {
      const response = await fetch("/api/project/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deliverables })
      });
      const data = await response.json();
      if (data.evaluation) result = data.evaluation;
    } catch {
      // Keep the deterministic offline result for a stable demo.
    }
    setEvaluation(result);
    if (result.passed) {
      let next = addEvidence(avatar, evidence("project-core", "core", "完成 AI 产品方案", "需求、方案与指标形成完整产品链路。", 8, "review"));
      next = addEvidence(next, evidence("project-practice", "practice", "项目评审通过", `岗位作品包获得 ${result.score} 分评审。`, 18, "review"));
      next = addEvidence(next, evidence("project-communication", "communication", "形成结构化项目表达", "作品能够说明背景、行动、取舍与复盘。", 6, "deliverable"));
      setAvatar(next);
    }
  };

  const finish = async () => {
    if (!avatar || !evaluation) return;
    const candidate = { ...avatar, stage: "candidate" as const, unlockedItems: [...new Set([...avatar.unlockedItems, "项目作品集", "目标岗位徽章"])] };
    setAvatar(candidate);
    let nextResume = generateResume(deliverables, evaluation);
    try {
      const response = await fetch("/api/resume/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deliverables, evaluation })
      });
      const data = await response.json();
      if (data.resume) nextResume = data.resume;
    } catch {
      // Keep the evidence-bound offline result for a stable demo.
    }
    setResume(nextResume);
    setPhase("result");
  };

  const reset = () => {
    window.localStorage.removeItem("career-avatar-demo");
    setProfile(emptyProfile);
    setPhase("match");
    setMatches([]);
    setAvatar(null);
    setResources(resourceSeeds);
    setTasks(taskSeeds);
    setDeliverables(deliverableSeeds);
    setEvaluation(null);
    setResume(null);
  };

  return (
    <main>
      <header className="topbar">
        <div className="brand"><div className="brand-mark"><Sparkles size={20} /></div><div><strong>职跃 CareerCraft</strong><span>AI 职业成长数字分身</span></div></div>
        <div className="header-actions"><span>“陪你真正成长为适合岗位的人”</span><button className="ghost-button" type="button" onClick={reset}><RefreshCcw size={16} />重置演示</button></div>
      </header>

      <div className="app-layout">
        <aside className="career-sidebar">
          <div className="avatar-stage">
            <PixelAvatar avatar={avatar} name={profile.name} />
            <span>{stageCopy[avatar?.stage ?? "explorer"].title}</span>
            <strong>{profile.name}</strong>
            <small>目标：{roleTitle(avatar?.targetRole ?? null)}</small>
          </div>
          <GrowthRoute avatar={avatar} onSelect={setPhase} />
          <div className="sidebar-stats">
            <div><span>当前匹配度</span><strong>{avatar?.currentFit ?? "--"}%</strong></div>
            <div><span>成长证据</span><strong>{avatar?.evidence.length ?? 0}</strong></div>
            <div><span>解锁物品</span><strong>{avatar?.unlockedItems.length ?? 1}</strong></div>
          </div>
          <div className="unlocked-items">
            {(avatar?.unlockedItems ?? ["简历背包"]).map((item) => <span key={item}>{item}</span>)}
          </div>
        </aside>

        <section className="content-area">
          {phase === "match" && (
            <>
              <div className="profile-strip">
                <div className="profile-field"><UserRound size={16} /><input value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} /></div>
                <div className="profile-field"><span>MBTI</span><input value={profile.mbti} onChange={(event) => setProfile({ ...profile, mbti: event.target.value })} /></div>
                {questionnaire.map((item) => (
                  <label className="quick-score" key={item.key} title={item.label}>
                    <span>{item.label.slice(0, 5)}</span>
                    <input type="range" min="40" max="100" value={profile[item.key]} onChange={(event) => setProfile({ ...profile, [item.key]: Number(event.target.value) })} />
                  </label>
                ))}
                <label className="resume-input"><FileText size={16} /><textarea value={profile.resume} onChange={(event) => setProfile({ ...profile, resume: event.target.value })} /></label>
              </div>
              <MatchJourney profile={profile} matches={matches} avatar={avatar} onAnalyze={analyze} onChoose={chooseRole} />
            </>
          )}
          {phase === "learn" && avatar && (
            <LearningWorkspace
              resources={resources}
              tasks={tasks}
              avatar={avatar}
              onRead={(id) => setResources((current) => current.map((item) => item.id === id ? { ...item, read: !item.read } : item))}
              onTask={completeTask}
              onProject={enterProject}
              onSearch={searchResources}
              resourceMode={resourceMode}
            />
          )}
          {phase === "project" && avatar && (
            <ProjectWorkspace
              deliverables={deliverables}
              evaluation={evaluation}
              onChange={(id, content) => setDeliverables((current) => current.map((item) => item.id === id ? { ...item, content } : item))}
              onSubmit={(id) => setDeliverables((current) => current.map((item) => item.id === id ? { ...item, submitted: true } : item))}
              onEvaluate={runEvaluation}
              onFinish={finish}
            />
          )}
          {phase === "result" && avatar && resume && <ResultWorkspace avatar={avatar} resume={resume} profile={profile} />}
        </section>
      </div>
    </main>
  );
}
