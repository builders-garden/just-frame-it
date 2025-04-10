export const MESSAGE_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30; // 30 day

export const ALLOWED_VOTER_FIDS = [
  4461, 12, 142, 189, 472, 473, 1689, 4282, 4327, 5774, 14035, 16085, 16286,
  16405,
];

export const ALLOWED_PROGRESS_UPDATE_FIDS: Record<string, string> = {
  "4461": "Builders Garden",
  "16286": "Builders Garden",
  "479": "Atlas",
  "5395": "Atlas",
  "11528": "Atlas",
  "469678": "Atlas",
  "1575": "Megapot",
  "335604": "Megapot",
  "1008083": "Megapot",
  "2802": "Arrows",
  "7988": "Arrows",
  "483713": "Arrows",
  "9182": "Farcastle",
  "14862": "Farcastle",
  "5037": "Farcastle",
  "20701": "LivMore",
  "348971": "LivMore",
  "366713": "SecretApp",
};

export enum DemoDay {
  SPRINT_1 = "SPRINT_1",
  SPRINT_2 = "SPRINT_2",
  SPRINT_3 = "SPRINT_3",
  SPRINT_4 = "SPRINT_4",
}

function isDemoDayUnlocked(dateStr: string): boolean {
  const now = new Date();
  const demoDayDate = new Date(dateStr.split(",")[0] + ", 2025");
  const endDate = new Date(demoDayDate);
  endDate.setDate(endDate.getDate() + 3);
  return now >= demoDayDate && now <= endDate;
}

export const DEMO_DAY_DATES: Record<
  DemoDay,
  { date: string; isUnlocked: boolean }
> = {
  [DemoDay.SPRINT_1]: {
    date: "April 11th, 2025",
    isUnlocked: isDemoDayUnlocked("April 11th, 2025"),
  },
  [DemoDay.SPRINT_2]: {
    date: "April 25th, 2025",
    isUnlocked: isDemoDayUnlocked("April 25th, 2025"),
  },
  [DemoDay.SPRINT_3]: {
    date: "May 9th, 2025",
    isUnlocked: isDemoDayUnlocked("May 9th, 2025"),
  },
  [DemoDay.SPRINT_4]: {
    date: "May 23rd, 2025",
    isUnlocked: isDemoDayUnlocked("May 23rd, 2025"),
  },
};
