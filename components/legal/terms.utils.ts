import { LEGAL_CONTACT_EMAIL, LEGAL_LAST_UPDATED, type LegalSection } from "./legal.utils";

export const termsContent = {
  label: "Prawo i regulacje",
  title: "Regulamin",
  description:
    "Zasady korzystania z serwisu Z AI na Ty oraz zasady świadczenia usług cyfrowych - kursów, e-booków i materiałów edukacyjnych.",
  lastUpdated: LEGAL_LAST_UPDATED,
  sections: [
    {
      id: "general",
      title: "1. Postanowienia ogólne",
      paragraphs: [
        "Niniejszy Regulamin określa zasady korzystania z serwisu internetowego dostępnego pod adresem zainaty.pl (dalej: „Serwis”) oraz zasady świadczenia usług drogą elektroniczną przez Z AI na Ty (dalej: „Usługodawca”).",
        "Korzystanie z Serwisu oznacza zapoznanie się z Regulaminem i jego akceptację. W przypadku braku akceptacji prosimy o rezygnację z korzystania z Serwisu.",
      ],
    },
    {
      id: "definitions",
      title: "2. Definicje",
      paragraphs: [
        "Na potrzeby Regulaminu przyjmuje się następujące znaczenia:",
      ],
      list: [
        "Użytkownik - każda osoba korzystająca z Serwisu,",
        "Konsument - Użytkownik będący konsumentem w rozumieniu przepisów prawa,",
        "Usługa - usługa świadczona drogą elektroniczną za pośrednictwem Serwisu,",
        "Produkt cyfrowy - kurs, e-book, materiał edukacyjny lub inna treść cyfrowa oferowana w Serwisie,",
        "Konto - indywidualny profil Użytkownika, jeżeli funkcja konta jest udostępniona.",
      ],
    },
    {
      id: "services",
      title: "3. Zakres usług",
      paragraphs: [
        "W ramach Serwisu Usługodawca może świadczyć m.in.:",
      ],
      list: [
        "udostępnianie treści edukacyjnych, artykułów i materiałów informacyjnych,",
        "możliwość zakupu produktów cyfrowych (kursów, e-booków),",
        "zapis do newslettera,",
        "możliwość kontaktu poprzez formularz,",
        "informacje o ofercie szkoleń indywidualnych i dla firm.",
      ],
    },
    {
      id: "newsletter",
      title: "4. Newsletter",
      paragraphs: [
        "Zapis do newslettera wymaga podania adresu e-mail oraz wyrażenia zgody na otrzymywanie informacji handlowych drogą elektroniczną.",
        "W każdej wiadomości newslettera znajduje się możliwość wypisania się z listy mailingowej. Wypisanie skutkuje zaprzestaniem wysyłki newslettera.",
      ],
    },
    {
      id: "orders",
      title: "5. Składanie zamówień i płatności",
      paragraphs: [
        "Informacje o produktach cyfrowych, cenach i sposobie dostępu do treści prezentowane są w Serwisie przed złożeniem zamówienia.",
        "Płatności realizowane są za pośrednictwem operatorów płatności wskazanych w procesie zakupu. Umowa zostaje zawarta z chwilą potwierdzenia płatności.",
        "Dostęp do produktu cyfrowego udzielany jest niezwłocznie po zaksięgowaniu płatności, w sposób wskazany w Serwisie (np. link do pobrania, dostęp do platformy kursowej).",
      ],
    },
    {
      id: "withdrawal",
      title: "6. Prawo odstąpienia od umowy",
      paragraphs: [
        "Konsument ma prawo odstąpić od umowy zawartej na odległość w terminie 14 dni bez podania przyczyny, z zastrzeżeniem wyjątków przewidzianych prawem.",
        "W przypadku produktów cyfrowych, które nie są dostarczane na nośniku materialnym, prawo odstąpienia nie przysługuje, jeżeli Usługodawca rozpoczął świadczenie za wyraźną zgodą Konsumenta, który został poinformowany o utracie prawa odstąpienia po rozpoczęciu świadczenia.",
      ],
    },
    {
      id: "copyright",
      title: "7. Prawa autorskie",
      paragraphs: [
        "Wszystkie treści publikowane w Serwisie, w tym kursy, e-booki, grafiki, teksty i materiały wideo, stanowią utwory chronione prawem autorskim i należą do Usługodawcy lub podmiotów, z którymi Usługodawca zawarł stosowne umowy.",
        "Zabronione jest kopiowanie, rozpowszechnianie, modyfikowanie lub udostępnianie treści w sposób wykraczający poza dozwolony użytek osobisty, chyba że Regulamin lub licencja produktu stanowi inaczej.",
      ],
    },
    {
      id: "liability",
      title: "8. Odpowiedzialność",
      paragraphs: [
        "Usługodawca dokłada starań, aby treści edukacyjne były aktualne, rzetelne i zrozumiałe, jednak nie gwarantuje osiągnięcia określonych rezultatów przez Użytkownika.",
        "Usługodawca nie ponosi odpowiedzialności za przerwy w działaniu Serwisu wynikające z przyczyn technicznych, siły wyższej lub działań osób trzecich, o ile przepisy bezwzględnie obowiązujące nie stanowią inaczej.",
      ],
    },
    {
      id: "complaints",
      title: "9. Reklamacje",
      paragraphs: [
        `Reklamacje dotyczące działania Serwisu lub świadczonych usług można składać na adres e-mail: ${LEGAL_CONTACT_EMAIL}. W zgłoszeniu warto podać opis problemu oraz dane umożliwiające identyfikację zamówienia lub konta.`,
        "Reklamacja zostanie rozpatrzona w terminie 14 dni od jej otrzymania. Odpowiedź zostanie przesłana na adres e-mail podany w zgłoszeniu.",
      ],
    },
    {
      id: "final",
      title: "10. Postanowienia końcowe",
      paragraphs: [
        "W sprawach nieuregulowanych Regulaminem zastosowanie mają przepisy prawa polskiego, w szczególności Kodeksu cywilnego, ustawy o prawach konsumenta oraz ustawy o świadczeniu usług drogą elektroniczną.",
        "Usługodawca zastrzega sobie prawo do zmiany Regulaminu z ważnych przyczyn. O zmianach Użytkownicy zostaną poinformowani w Serwisie.",
        `Regulamin obowiązuje od ${LEGAL_LAST_UPDATED}.`,
      ],
    },
  ] as const satisfies readonly LegalSection[],
};
