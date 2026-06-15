import { LEGAL_CONTACT_EMAIL, LEGAL_LAST_UPDATED, type LegalSection } from "./legal.utils";

export const privacyPolicyContent = {
  label: "Prawo i prywatność",
  title: "Polityka prywatności",
  description:
    "Dbamy o Twoje dane tak samo poważnie, jak o to, by technologia była zrozumiała. Poniżej wyjaśniamy, co zbieramy, po co to robimy i jakie masz prawa.",
  lastUpdated: LEGAL_LAST_UPDATED,
  sections: [
    {
      id: "administrator",
      title: "1. Administrator danych",
      paragraphs: [
        `Administratorem danych osobowych przetwarzanych w serwisie zainaty.pl (dalej: „Serwis”) jest Z AI na Ty. W sprawach związanych z ochroną danych osobowych możesz się z nami skontaktować pod adresem e-mail: ${LEGAL_CONTACT_EMAIL}.`,
      ],
    },
    {
      id: "scope",
      title: "2. Zakres zbieranych danych",
      paragraphs: [
        "W zależności od tego, z jakich funkcji Serwisu korzystasz, możemy przetwarzać następujące kategorie danych:",
      ],
      list: [
        "adres e-mail — przy zapisie do newslettera lub formularzach na stronie,",
        "imię i nazwisko, numer telefonu oraz treść wiadomości — przy wysłaniu formularza kontaktowego,",
        "dane techniczne — adres IP, typ przeglądarki, system operacyjny, data i czas wizyty,",
        "dane z plików cookies — zgodnie z ustawieniami Twojej przeglądarki i wyrażonymi zgodami.",
      ],
    },
    {
      id: "purposes",
      title: "3. Cele i podstawy przetwarzania",
      paragraphs: [
        "Dane przetwarzamy wyłącznie w konkretnych celach i na podstawie właściwych przepisów RODO:",
      ],
      list: [
        "wysyłka newslettera i informacji o nowościach — na podstawie Twojej zgody (art. 6 ust. 1 lit. a RODO),",
        "obsługa zapytań przesłanych przez formularz kontaktowy — na podstawie naszego prawnie uzasadnionego interesu polegającego na udzieleniu odpowiedzi (art. 6 ust. 1 lit. f RODO) lub podjęciu działań przed zawarciem umowy (art. 6 ust. 1 lit. b RODO),",
        "realizacja umowy o świadczenie usług cyfrowych (np. zakup kursu lub e-booka) — na podstawie umowy (art. 6 ust. 1 lit. b RODO),",
        "zapewnienie bezpieczeństwa i poprawnego działania Serwisu — na podstawie prawnie uzasadnionego interesu (art. 6 ust. 1 lit. f RODO),",
        "analityka ruchu w Serwisie — na podstawie zgody lub prawnie uzasadnionego interesu, w zależności od użytych narzędzi.",
      ],
    },
    {
      id: "recipients",
      title: "4. Odbiorcy danych",
      paragraphs: [
        "Twoje dane mogą być przekazywane podmiotom wspierającym nas w prowadzeniu Serwisu, wyłącznie w zakresie niezbędnym do realizacji wskazanych celów. Mogą to być m.in.:",
      ],
      list: [
        "MailerLite — obsługa listy mailingowej i wysyłki newslettera,",
        "dostawca hostingu i infrastruktury technicznej Serwisu,",
        "dostawcy narzędzi analitycznych — jeżeli są aktywnie wykorzystywani,",
        "operatorzy płatności — w przypadku zakupu produktów cyfrowych.",
      ],
    },
    {
      id: "retention",
      title: "5. Okres przechowywania danych",
      paragraphs: [
        "Dane przechowujemy tylko tak długo, jak jest to potrzebne:",
      ],
      list: [
        "dane newslettera — do momentu wycofania zgody lub wypisania się z listy,",
        "dane z formularza kontaktowego — przez czas niezbędny do udzielenia odpowiedzi i ewentualnej dalszej korespondencji, nie dłużej niż 3 lata,",
        "dane związane z umową — przez okres wymagany przepisami prawa, w tym przepisami podatkowymi i rachunkowymi,",
        "dane techniczne i logi — przez okres niezbędny do zapewnienia bezpieczeństwa Serwisu.",
      ],
    },
    {
      id: "rights",
      title: "6. Twoje prawa",
      paragraphs: [
        "Przysługują Ci następujące prawa:",
      ],
      list: [
        "prawo dostępu do danych i otrzymania ich kopii,",
        "prawo do sprostowania (poprawiania) danych,",
        "prawo do usunięcia danych („prawo do bycia zapomnianym”),",
        "prawo do ograniczenia przetwarzania,",
        "prawo do przenoszenia danych,",
        "prawo do wycofania zgody w dowolnym momencie — bez wpływu na zgodność z prawem przetwarzania sprzed wycofania,",
        "prawo wniesienia sprzeciwu wobec przetwarzania danych,",
        "prawo wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych.",
      ],
    },
    {
      id: "cookies",
      title: "7. Pliki cookies",
      paragraphs: [
        "Serwis może wykorzystywać pliki cookies w celu zapewnienia prawidłowego działania strony, zapamiętywania preferencji (np. motywu jasnego/ciemnego) oraz — po wyrażeniu zgody — analizy ruchu.",
        "Możesz zarządzać cookies w ustawieniach swojej przeglądarki. Wyłączenie niektórych plików cookies może wpłynąć na działanie Serwisu.",
      ],
    },
    {
      id: "security",
      title: "8. Bezpieczeństwo danych",
      paragraphs: [
        "Stosujemy środki techniczne i organizacyjne odpowiednie do ryzyka naruszenia praw osób, których dane dotyczą. Obejmują one m.in. szyfrowane połączenia (HTTPS), ograniczony dostęp do danych oraz współpracę wyłącznie z zaufanymi dostawcami usług.",
      ],
    },
    {
      id: "changes",
      title: "9. Zmiany polityki",
      paragraphs: [
        "Polityka prywatności może być aktualizowana, gdy zmienią się przepisy prawa, funkcjonalności Serwisu lub sposób przetwarzania danych. O istotnych zmianach poinformujemy w Serwisie.",
        `Ostatnia aktualizacja: ${LEGAL_LAST_UPDATED}.`,
      ],
    },
  ] as const satisfies readonly LegalSection[],
};
