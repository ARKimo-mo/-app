import { learningPath } from "../data/mockReport";

export default function Timeline() {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {learningPath.map((item, index) => (
        <div key={item.week} className="relative rounded-3xl border border-blue-100 bg-white p-5">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-blue-100 text-sm font-black text-primary">{index + 1}</span>
          <p className="mt-4 text-sm font-black text-slate-500">{item.week}</p>
          <h4 className="mt-1 text-base font-black text-ink">{item.title}</h4>
          <div className="mt-3 space-y-1 text-sm leading-6 text-slate-600">
            {item.items.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
          <p className="mt-4 rounded-full bg-blue-50 px-3 py-2 text-center text-xs font-bold text-primary">{item.action}</p>
        </div>
      ))}
    </div>
  );
}
