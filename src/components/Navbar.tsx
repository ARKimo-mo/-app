import { Bell, ChevronDown, Gamepad2 } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "首页", to: "/" },
  { label: "职业探索", to: "/profile" },
  { label: "副本体验", to: "/task/ai_pm" },
  { label: "成长报告", to: "/report" }
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-blue-100/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5">
        <NavLink to="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-white shadow-lg shadow-blue-200">
            <Gamepad2 size={22} />
          </span>
          <span className="text-xl font-black tracking-tight text-ink">
            职前副本 <span className="text-gradient italic">AI</span>
          </span>
        </NavLink>

        <nav className="hidden items-center gap-10 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `relative py-7 text-sm font-semibold transition ${
                  isActive ? "text-primary" : "text-slate-600 hover:text-primary"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && <span className="absolute inset-x-1 bottom-0 h-1 rounded-full bg-primary" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Bell className="hidden text-slate-600 sm:block" size={20} />
          <div className="flex items-center gap-3 rounded-full bg-blue-50 px-2 py-1.5">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-blue-100 to-violet-100 text-lg">你</div>
            <span className="hidden text-sm font-medium text-slate-700 sm:inline">你好，未来的你</span>
            <ChevronDown className="hidden text-slate-500 sm:block" size={16} />
          </div>
        </div>
      </div>
    </header>
  );
}
