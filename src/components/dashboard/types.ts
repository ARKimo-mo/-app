export type PageId = "dashboard" | "avatar" | "recommend" | "skill" | "mission" | "review" | "portfolio" | "learning" | "resume" | "interview" | "settings";

export type DemoActions = {
  navigate: (page: PageId) => void;
  notify: (message: string) => void;
  addGrowth: (value: number) => void;
};
