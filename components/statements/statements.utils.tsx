type StatementPalette = {
  icon: string;
  accent: string;
  underline: string;
};

type Statement = {
  id: string;
  prefix: string;
  accent: string;
  suffix: string;
  palette: StatementPalette;
};

export const statements: Statement[] = [
  {
    id: "expert",
    prefix: "Nie musisz być ",
    accent: "ekspertem",
    suffix: ", by korzystać z AI.",
    palette: {
      icon: "text-[#f24a00] dark:text-[#daff02]",
      accent: "text-[#f24a00] dark:text-[#daff02]",
      underline: "bg-[#f24a00] dark:bg-[#daff02]",
    },
  },
  {
    id: "first-step",
    prefix: "Z nami ",
    accent: "pierwszy krok",
    suffix: " jest prosty.",
    palette: {
      icon: "text-[#0033ff] dark:text-[#6688ff]",
      accent: "text-[#0033ff] dark:text-[#6688ff]",
      underline: "bg-[#0033ff] dark:bg-[#6688ff]",
    },
  },
  {
    id: "everyone-starts",
    prefix: "Bo każdy ",
    accent: "kiedyś zaczynał",
    suffix: ".",
    palette: {
      icon: "text-[#6b1cb1] dark:text-[#b57ae0]",
      accent: "text-[#6b1cb1] dark:text-[#b57ae0]",
      underline: "bg-[#6b1cb1] dark:bg-[#b57ae0]",
    },
  },
];
