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
  rotation: string;
  palette: StatementPalette;
};

export const statements: Statement[] = [
  {
    id: "expert",
    prefix: "Nie musisz być ",
    accent: "ekspertem",
    suffix: ", by korzystać z AI.",
    rotation: "-rotate-2 md:-rotate-[2.5deg]",
    palette: {
      icon: "text-[#ff4b12] dark:text-[#d7ff00]",
      accent: "text-[#ff4b12] dark:text-[#d7ff00]",
      underline: "bg-[#ff4b12] dark:bg-[#d7ff00]",
    },
  },
  {
    id: "first-step",
    prefix: "Z nami ",
    accent: "pierwszy krok",
    suffix: " jest prosty.",
    rotation: "rotate-2 md:rotate-[2.5deg]",
    palette: {
      icon: "text-[#1a4dff] dark:text-[#7d9bff]",
      accent: "text-[#1a4dff] dark:text-[#7d9bff]",
      underline: "bg-[#1a4dff] dark:bg-[#7d9bff]",
    },
  },
  {
    id: "everyone-starts",
    prefix: "Bo każdy ",
    accent: "kiedyś zaczynał",
    suffix: ".",
    rotation: "-rotate-2 md:-rotate-[2.5deg]",
    palette: {
      icon: "text-[#7c3aed] dark:text-[#a78bfa]",
      accent: "text-[#7c3aed] dark:text-[#a78bfa]",
      underline: "bg-[#7c3aed] dark:bg-[#a78bfa]",
    },
  },
];
