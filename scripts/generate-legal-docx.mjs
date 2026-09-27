import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "legal");

const EMAIL = "kontakt@zainaty.com.pl";
const ADDRESS = "ul. Maratońska 87 lok. 3, 94-007 Łódź";

function p(text, options = {}) {
  return new Paragraph({
    spacing: { after: 200 },
    ...options,
    children: [
      new TextRun({
        text,
        font: "Calibri",
        size: 22,
      }),
    ],
  });
}

function heading(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { after: 300, before: 100 },
    children: [
      new TextRun({
        text,
        bold: true,
        font: "Calibri",
        size: 28,
      }),
    ],
  });
}

function blank() {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text: "", font: "Calibri", size: 22 })],
  });
}

async function writeDoc(filename, children) {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(path.join(outDir, filename), buffer);
  console.log(`Wrote ${filename}`);
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });

  await writeDoc("zalacznik-1-wzor-odstapienia.docx", [
    heading("Załącznik nr 1. Wzór formularza odstąpienia od umowy"),
    p(
      "Wzór z załącznika nr 2 do ustawy z 30 maja 2014 r. o prawach konsumenta, uzupełniony o umowę o dostarczenie treści cyfrowej. Formularz ten należy wypełnić i odesłać tylko w przypadku chęci odstąpienia od umowy. Jego użycie nie jest obowiązkowe.",
    ),
    blank(),
    p("Adresat:"),
    p("Karol Stępień Z AI Na Ty"),
    p(ADDRESS),
    p(`e-mail: ${EMAIL}`),
    blank(),
    p(
      "Ja/My(*) niniejszym informuję/informujemy(*) o moim/naszym odstąpieniu od umowy sprzedaży następujących rzeczy(*) umowy dostawy następujących rzeczy(*) umowy o dzieło polegającej na wykonaniu następujących rzeczy(*)/o świadczenie następującej usługi(*) / umowy o dostarczenie następującej treści cyfrowej(*):",
    ),
    p("......................................................................."),
    blank(),
    p("Data zawarcia umowy(*)/odbioru(*): ...................................."),
    p("Imię i nazwisko konsumenta(-ów): ...................................."),
    p("Adres konsumenta(-ów): ...................................."),
    p(
      "Podpis konsumenta(-ów) (tylko jeżeli formularz jest przesyłany w wersji papierowej): ....................................",
    ),
    p("Data: ...................................."),
    blank(),
    p("(*) Niepotrzebne skreślić."),
  ]);

  await writeDoc("zalacznik-2-tresc-email.docx", [
    heading("Załącznik nr 2. Gotowa treść wiadomości e-mail"),
    p(
      `Skopiuj poniższy tekst, uzupełnij i wyślij na ${EMAIL}. Możesz też napisać własnymi słowami, będzie to równie skuteczne. Pola z numerem zamówienia i powodem są pomocnicze, nie obowiązkowe.`,
    ),
    blank(),
    p(`Adresat: ${EMAIL}`),
    p("Temat: Odstąpienie od umowy"),
    blank(),
    p("Treść:"),
    blank(),
    p("Dzień dobry,"),
    blank(),
    p("odstępuję od umowy zawartej za pośrednictwem serwisu zainaty.com.pl."),
    blank(),
    p("Produkt: ...................................."),
    p("Data zakupu: ...................................."),
    p("Imię i nazwisko: ...................................."),
    p("Adres e-mail przypisany do konta: ...................................."),
    p("Numer zamówienia (jeśli go znasz): ...................................."),
    blank(),
    p("Proszę o zwrot zapłaconej kwoty."),
    blank(),
    p(
      "Powód rezygnacji (pole dobrowolne, możesz je usunąć): ....................................",
    ),
    blank(),
    p("Pozdrawiam"),
    p("...................................."),
    blank(),
    p(
      "Po otrzymaniu wiadomości niezwłocznie potwierdzimy jej przyjęcie i wskażemy termin zwrotu środków. Zwrot następuje nie później niż w terminie 14 dni.",
    ),
  ]);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
