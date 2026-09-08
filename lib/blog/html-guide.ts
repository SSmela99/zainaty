export type BlogHtmlGuideEntry = {
  tag: string;
  description: string;
  example: string;
};

export const blogHtmlGuideIntro =
  "Wklej gotowy HTML do pola treści. Poniżej znajdziesz dozwolone tagi i przykłady tego, jak będą wyglądać na stronie artykułu.";

export const blogHtmlGuideEntries: BlogHtmlGuideEntry[] = [
  {
    tag: "<blockquote>",
    description: "Wyróżniony wstęp lub cytat z limonkowym paskiem po lewej.",
    example:
      "<blockquote>Deepfake, phishing, wyłudzenia - zagrożenia w sieci ewoluują szybciej niż kiedykolwiek.</blockquote>",
  },
  {
    tag: "<h2>",
    description: "Główny nagłówek sekcji artykułu.",
    example: "<h2>Dlaczego bezpieczeństwo online jest ważniejsze niż kiedykolwiek?</h2>",
  },
  {
    tag: "<p>",
    description: "Zwykły akapit tekstu.",
    example:
      "<p>W 2025 roku cyberprzestępcy coraz częściej wykorzystują sztuczną inteligencję do tworzenia fałszywych wiadomości i głosów.</p>",
  },
  {
    tag: "<h3>",
    description: "Podtytuł sekcji, np. numerowany punkt poradnika.",
    example: "<h3>1. Silne hasła i menedżer haseł</h3>",
  },
  {
    tag: "<ul> + <li>",
    description: "Lista nienumerowana z limonkowymi kropkami.",
    example:
      "<ul><li>Tworzą poczucie pilności - „konto zostanie zablokowane za 2 godziny”.</li><li>Zawierają dziwne adresy nadawcy.</li></ul>",
  },
  {
    tag: "<ol> + <li>",
    description: "Lista numerowana.",
    example:
      "<ol><li>Włącz 2FA w banku i mailu.</li><li>Używaj menedżera haseł.</li></ol>",
  },
  {
    tag: "<strong>",
    description: "Pogrubienie ważnego fragmentu w akapicie.",
    example: "<p>Hasło <strong>123456</strong> to zaproszenie dla hakerów.</p>",
  },
  {
    tag: "<em>",
    description: "Kursywa - np. podkreślenie słowa lub cytatu w tekście.",
    example: "<p>To nie jest <em>opcjonalne</em> - to konieczność.</p>",
  },
  {
    tag: "<a>",
    description: "Link do zewnętrznej strony.",
    example: '<p>Więcej na <a href="https://example.com">stronie CERT</a>.</p>',
  },
  {
    tag: "<hr>",
    description: "Pozioma linia oddzielająca sekcje.",
    example: "<hr>",
  },
];

export const blogHtmlGuideFullExample = `<blockquote>Deepfake, phishing, wyłudzenia - zagrożenia w sieci ewoluują szybciej niż kiedykolwiek. Dowiedz się, jak się chronić bez paranoi i technicznych komplikacji.</blockquote>

<h2>Dlaczego bezpieczeństwo online jest ważniejsze niż kiedykolwiek?</h2>

<p>W 2025 roku cyberprzestępcy coraz częściej wykorzystują sztuczną inteligencję do tworzenia fałszywych wiadomości, głosów i nagrań wideo.</p>

<h3>1. Silne hasła i menedżer haseł</h3>

<p>Unikaj haseł w stylu <strong>123456</strong> czy <strong>haslo123</strong>. Używaj menedżera haseł, np. Bitwarden.</p>

<h3>2. Uwierzytelnianie dwuskładnikowe (2FA)</h3>

<p>Włącz je w banku, mailu i social mediach - to najprostsza bariera przed włamaniem.</p>

<h3>3. Jak rozpoznać phishing?</h3>

<ul>
  <li>Tworzą poczucie pilności - „konto zostanie zablokowane za 2 godziny”.</li>
  <li>Zawierają dziwne adresy nadawcy lub literówki w domenie.</li>
  <li>Proszą o kliknięcie w link lub podanie danych logowania.</li>
</ul>

<h3>Podsumowanie</h3>

<p>Bezpieczeństwo online to nawyki, nie jednorazowa akcja. Zacznij od haseł, 2FA i czujności na podejrzane wiadomości.</p>`;
