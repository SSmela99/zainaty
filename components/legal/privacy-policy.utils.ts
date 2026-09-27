import {
  LEGAL_CONTACT_EMAIL,
  LEGAL_CONTACT_PHONE,
  LEGAL_LAST_UPDATED,
  LEGAL_SELLER_ADDRESS,
  PRIVACY_VERSION,
  SUPABASE_PROCESSING_REGION,
  type LegalSection,
} from "./legal.utils";

export const privacyPolicyContent = {
  label: "Prawo i prywatność",
  title: "Polityka prywatności i cookies",
  description:
    "Ten dokument realizuje obowiązek informacyjny wynikający z art. 13 rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679 z 27 kwietnia 2016 r. (RODO) oraz z art. 399 ustawy z 12 lipca 2024 r. Prawo komunikacji elektronicznej. Zgodnie z art. 12 ust. 1 RODO informacje podajemy w zwięzłej, przejrzystej i zrozumiałej formie, prostym językiem.",
  lastUpdated: `Wersja ${PRIVACY_VERSION}, obowiązuje od ${LEGAL_LAST_UPDATED}`,
  sections: [
    {
      id: "administrator",
      title: "1. Administrator danych osobowych",
      blocks: [
        {
          type: "paragraph",
          text: "Administratorem danych w rozumieniu art. 4 pkt 7 RODO jest Karol Stępień, prowadzący działalność gospodarczą pod nazwą Karol Stępień Z AI Na Ty, ul. Maratońska 87 lok. 3, 94-007 Łódź, NIP 7272900566, REGON 544717627, wpisany do Centralnej Ewidencji i Informacji o Działalności Gospodarczej.",
        },
        {
          type: "paragraph",
          text: "Kontakt w sprawach ochrony danych osobowych:",
        },
        {
          type: "list",
          items: [
            `e-mail: ${LEGAL_CONTACT_EMAIL}`,
            `telefon: ${LEGAL_CONTACT_PHONE}`,
            `adres korespondencyjny: ${LEGAL_SELLER_ADDRESS}`,
          ],
        },
        {
          type: "paragraph",
          text: "Administrator nie wyznaczył inspektora ochrony danych, ponieważ nie zachodzi żadna z przesłanek określonych w art. 37 ust. 1 RODO. We wszystkich sprawach dotyczących danych osobowych odpowiada bezpośrednio administrator.",
        },
        {
          type: "paragraph",
          text: "Polityka dotyczy serwisu zainaty.com.pl.",
        },
      ],
    },
    {
      id: "source",
      title: "2. Źródło danych",
      blocks: [
        {
          type: "paragraph",
          text: "Dane pozyskujemy bezpośrednio od Ciebie: przy zakładaniu konta, składaniu zamówienia, zapisie do newslettera, pobraniu materiału bezpłatnego, rezerwacji konsultacji oraz przez formularz kontaktowy.",
        },
        {
          type: "paragraph",
          text: "Dane o sposobie korzystania z serwisu zbieramy automatycznie za pomocą narzędzi opisanych w części dotyczącej plików cookies, po uzyskaniu Twojej zgody tam, gdzie jest ona wymagana.",
        },
        {
          type: "paragraph",
          text: "Nie nabywamy baz danych i nie pozyskujemy danych z rejestrów publicznych ani serwisów zewnętrznych.",
        },
        {
          type: "paragraph",
          text: "Serwis nie jest przeznaczony dla osób poniżej 18 roku życia. Nie przetwarzamy świadomie danych osób niepełnoletnich.",
        },
      ],
    },
    {
      id: "purposes",
      title: "3. Cele, zakres i podstawy prawne przetwarzania",
      blocks: [
        {
          type: "table",
          table: {
            headers: [
              "Cel przetwarzania",
              "Zakres danych",
              "Podstawa prawna",
              "Okres przechowywania",
            ],
            rows: [
              [
                "Prowadzenie konta i udostępnianie zakupionych materiałów",
                "adres e-mail, hasło w postaci zahaszowanej, historia zakupów",
                "art. 6 ust. 1 lit. b RODO, wykonanie umowy o świadczenie usługi drogą elektroniczną",
                "do usunięcia konta",
              ],
              [
                "Zapisywanie postępu w szkoleniach wideo",
                "identyfikator konta, identyfikator lekcji, moment zatrzymania odtwarzania",
                "art. 6 ust. 1 lit. b RODO",
                "do usunięcia konta",
              ],
              [
                "Zawarcie i wykonanie umowy sprzedaży oraz przyjęcie płatności",
                "imię i nazwisko, adres e-mail, dane do rachunku lub faktury, dane zamówienia",
                "art. 6 ust. 1 lit. b RODO",
                "przez czas wykonywania umowy",
              ],
              [
                "Prowadzenie dokumentacji podatkowej i księgowej",
                "dane z rachunku lub faktury, kwota, data transakcji",
                "art. 6 ust. 1 lit. c RODO w związku z art. 86 § 1 Ordynacji podatkowej",
                "5 lat od końca roku kalendarzowego, w którym upłynął termin płatności podatku",
              ],
              [
                "Rozpatrywanie reklamacji i oświadczeń o odstąpieniu od umowy",
                "dane zamówienia, treść zgłoszenia, korespondencja",
                "art. 6 ust. 1 lit. c RODO w związku z ustawą o prawach konsumenta",
                "do upływu okresu przedawnienia roszczeń",
              ],
              [
                "Ustalenie, dochodzenie i obrona roszczeń",
                "dane zamówienia i korespondencji",
                "art. 6 ust. 1 lit. f RODO, prawnie uzasadniony interes administratora polegający na ochronie jego praw",
                "do upływu okresu przedawnienia roszczeń, zgodnie z art. 118 kodeksu cywilnego",
              ],
              [
                "Wysyłka wiadomości transakcyjnych: potwierdzeń zamówień, potwierdzeń odstąpienia, resetu hasła, powiadomień z konta",
                "adres e-mail, dane zamówienia",
                "art. 6 ust. 1 lit. b oraz lit. c RODO",
                "przez czas wykonywania umowy oraz okresy wskazane wyżej",
              ],
              [
                "Wysłanie materiału bezpłatnego",
                "adres e-mail",
                "art. 6 ust. 1 lit. b RODO",
                "do wysłania materiału, a następnie przez okres przedawnienia roszczeń",
              ],
              [
                "Wysyłka newslettera",
                "adres e-mail, imię, jeżeli zostało podane",
                "art. 6 ust. 1 lit. a RODO oraz art. 398 ust. 1 Prawa komunikacji elektronicznej",
                "do wycofania zgody; dowód udzielenia zgody przechowujemy przez okres przedawnienia roszczeń",
              ],
              [
                "Obsługa korespondencji z formularza kontaktowego",
                "imię i nazwisko, adres e-mail, numer telefonu, jeżeli został podany, treść wiadomości",
                "art. 6 ust. 1 lit. b RODO (działania przed zawarciem umowy) albo art. 6 ust. 1 lit. f RODO (udzielenie odpowiedzi)",
                "12 miesięcy od zakończenia korespondencji",
              ],
              [
                "Rezerwacja bezpłatnej konsultacji",
                "imię, adres e-mail, numer telefonu, jeżeli został podany, wybrany termin",
                "art. 6 ust. 1 lit. b RODO",
                "12 miesięcy od terminu konsultacji",
              ],
              [
                "Weryfikacja i publikacja opinii",
                "imię lub inicjały autora, treść opinii, informacja o zakupie lub udziale w szkoleniu",
                "art. 6 ust. 1 lit. a RODO, zgoda autora na publikację",
                "do wycofania zgody",
              ],
              [
                "Statystyka ruchu w serwisie (Google Analytics 4)",
                "identyfikatory plików cookies, informacje o przeglądanych podstronach, przybliżona lokalizacja na poziomie miasta, typ urządzenia i przeglądarki",
                "art. 6 ust. 1 lit. a RODO oraz art. 399 Prawa komunikacji elektronicznej, zgoda",
                "14 miesięcy",
              ],
              [
                "Zbiorcza statystyka ruchu bez identyfikacji użytkowników (Cloudflare Web Analytics)",
                "dane techniczne żądania, bez plików cookies i bez identyfikatorów",
                "art. 6 ust. 1 lit. f RODO, prawnie uzasadniony interes administratora polegający na pomiarze obciążenia serwisu",
                "dane zagregowane",
              ],
              [
                "Odtwarzanie materiałów demonstracyjnych z serwisu YouTube",
                "identyfikatory plików cookies Google, adres IP, informacje o odtwarzaniu",
                "art. 6 ust. 1 lit. a RODO oraz art. 399 Prawa komunikacji elektronicznej, zgoda",
                "zgodnie z okresem życia plików wskazanym w części 11",
              ],
              [
                "Zapewnienie bezpieczeństwa serwisu i ochrona przed atakami",
                "adres IP, logi serwera, dane techniczne żądania",
                "art. 6 ust. 1 lit. f RODO, prawnie uzasadniony interes administratora polegający na ochronie serwisu",
                "12 miesięcy",
              ],
            ],
          },
        },
        {
          type: "paragraph",
          text: "Po upływie wskazanych okresów dane usuwamy albo poddajemy anonimizacji. Jeżeli ten sam zbiór danych podlega kilku podstawom prawnym, przechowujemy go przez najdłuższy z wymienionych okresów.",
        },
      ],
    },
    {
      id: "voluntary",
      title: "4. Dobrowolność podania danych",
      blocks: [
        {
          type: "paragraph",
          text: "Podanie danych jest dobrowolne, w części przypadków stanowi jednak warunek zawarcia i wykonania umowy:",
        },
        {
          type: "list",
          items: [
            "adres e-mail i hasło są warunkiem założenia konta, a konto jest warunkiem dostępu do zakupionych materiałów,",
            "dane do rachunku stanowią wymóg ustawowy wynikający z przepisów podatkowych,",
            "adres e-mail jest warunkiem otrzymania newslettera i materiału bezpłatnego,",
            "imię i adres e-mail są warunkiem rezerwacji konsultacji,",
            "numer telefonu w formularzu kontaktowym oraz przy rezerwacji konsultacji podajesz dobrowolnie. Bez niego również udzielimy odpowiedzi i zrealizujemy rezerwację.",
          ],
        },
        {
          type: "paragraph",
          text: "Konsekwencją niepodania danych wymaganych jest brak możliwości zawarcia umowy, rezerwacji terminu albo udzielenia odpowiedzi.",
        },
      ],
    },
    {
      id: "recipients",
      title: "5. Odbiorcy danych",
      blocks: [
        {
          type: "paragraph",
          text: "5.1 Podmioty przetwarzające dane na nasze zlecenie",
        },
        {
          type: "paragraph",
          text: "Powierzamy dane podmiotom przetwarzającym na podstawie umów zawartych zgodnie z art. 28 ust. 3 RODO. Podmioty te przetwarzają dane wyłącznie na nasze udokumentowane polecenie.",
        },
        {
          type: "table",
          table: {
            headers: ["Podmiot", "Zakres usługi", "Miejsce przetwarzania"],
            rows: [
              [
                "Cloudflare, Inc.",
                "hosting serwisu, sieć dostarczania treści, obsługa domeny, przekierowanie poczty przychodzącej, przechowywanie i odtwarzanie zakupionych materiałów wideo (Cloudflare Stream), ochrona przed atakami, zbiorcza statystyka ruchu",
                "USA, z serwerami rozmieszczonymi globalnie, w tym w Unii Europejskiej",
              ],
              [
                "Supabase, Inc.",
                "baza danych i przechowywanie plików",
                SUPABASE_PROCESSING_REGION,
              ],
              [
                "Brevo SAS (dawniej Sendinblue SAS)",
                "wysyłka wiadomości transakcyjnych",
                "Francja",
              ],
              [
                "UAB MailerLite",
                "wysyłka newslettera",
                "Litwa",
              ],
              [
                "Google Ireland Limited",
                "Google Analytics 4 oraz kalendarz rezerwacji konsultacji w ramach usługi Google Workspace",
                "Irlandia, z możliwym powierzeniem Google LLC w USA",
              ],
              [
                "Biuro rachunkowe",
                "prowadzenie dokumentacji księgowej",
                "Polska",
              ],
            ],
          },
        },
        {
          type: "paragraph",
          text: "5.2 Podmioty działające jako odrębni administratorzy",
        },
        {
          type: "paragraph",
          text: "Stripe Payments Europe, Limited (Irlandia) obsługuje płatności. Danych karty płatniczej nie pozyskujemy ani nie przechowujemy: przekazujesz je bezpośrednio operatorowi. Stripe przetwarza dane płatnicze jako odrębny administrator, między innymi w celu wykonania transakcji, przeciwdziałania oszustwom i wypełnienia obowiązków wynikających z przepisów o przeciwdziałaniu praniu pieniędzy, na zasadach opisanych w polityce prywatności dostępnej pod adresem stripe.com/privacy. Dane mogą być przekazywane do Stripe, Inc. w USA.",
        },
        {
          type: "paragraph",
          text: "Google Ireland Limited jako operator serwisu YouTube przetwarza dane osób, które uruchomią odtwarzacz materiałów demonstracyjnych, jako odrębny administrator, na zasadach opisanych w Polityce prywatności Google pod adresem policies.google.com/privacy. W zakresie samego zbierania i przekazania tych danych przez osadzony odtwarzacz jesteśmy z Google współadministratorami, zgodnie z wyrokiem Trybunału Sprawiedliwości UE w sprawie C-40/17 Fashion ID. Odtwarzacz uruchamia się wyłącznie po Twojej zgodzie. Wnioski dotyczące danych przetwarzanych przez YouTube możesz kierować zarówno do nas, jak i do Google.",
        },
        {
          type: "paragraph",
          text: "5.3 Organy publiczne",
        },
        {
          type: "paragraph",
          text: "Dane możemy udostępnić organom publicznym uprawnionym do ich żądania na podstawie przepisów prawa.",
        },
        {
          type: "paragraph",
          text: "Nie sprzedajemy danych osobowych i nie udostępniamy ich podmiotom trzecim w celach marketingowych.",
        },
      ],
    },
    {
      id: "transfers",
      title: "6. Przekazywanie danych poza Europejski Obszar Gospodarczy",
      blocks: [
        {
          type: "paragraph",
          text: "Cloudflare, Inc., Supabase, Inc., Stripe, Inc. oraz Google LLC mogą przetwarzać dane na terytorium Stanów Zjednoczonych.",
        },
        {
          type: "paragraph",
          text: "Wobec podmiotów certyfikowanych w ramach EU-US Data Privacy Framework podstawą transferu jest decyzja wykonawcza Komisji Europejskiej (UE) 2023/1795 z 10 lipca 2023 r. stwierdzająca odpowiedni stopień ochrony danych, wydana na podstawie art. 45 ust. 3 RODO. Aktualny wykaz certyfikowanych podmiotów znajduje się na stronie dataprivacyframework.gov.",
        },
        {
          type: "paragraph",
          text: "Niezależnie od tego umowy z każdym z tych podmiotów zawierają standardowe klauzule umowne przyjęte decyzją wykonawczą Komisji (UE) 2021/914. Stanowią one samodzielną podstawę transferu na podstawie art. 46 ust. 2 lit. c RODO wobec podmiotów nieobjętych certyfikacją oraz zabezpieczenie dodatkowe wobec pozostałych.",
        },
        {
          type: "paragraph",
          text: `Kopię zastosowanych zabezpieczeń udostępniamy na wniosek złożony na adres ${LEGAL_CONTACT_EMAIL}.`,
        },
      ],
    },
    {
      id: "rights",
      title: "7. Prawa osoby, której dane dotyczą",
      blocks: [
        {
          type: "paragraph",
          text: "Przysługują Ci następujące uprawnienia:",
        },
        {
          type: "list",
          items: [
            "prawo dostępu do danych i uzyskania ich kopii (art. 15 RODO),",
            "prawo do sprostowania danych nieprawidłowych oraz uzupełnienia niekompletnych (art. 16 RODO),",
            "prawo do usunięcia danych, zwane prawem do bycia zapomnianym (art. 17 RODO),",
            "prawo do ograniczenia przetwarzania (art. 18 RODO),",
            "prawo do przenoszenia danych przetwarzanych na podstawie zgody lub umowy, w ustrukturyzowanym, powszechnie używanym formacie nadającym się do odczytu maszynowego (art. 20 RODO),",
            "prawo sprzeciwu wobec przetwarzania opartego na prawnie uzasadnionym interesie administratora (art. 21 RODO),",
            "prawo do wycofania zgody w dowolnym momencie, bez wpływu na zgodność z prawem przetwarzania dokonanego przed jej wycofaniem (art. 7 ust. 3 RODO),",
            "prawo wniesienia skargi do organu nadzorczego (art. 77 RODO).",
          ],
        },
        {
          type: "paragraph",
          text: `Wnioski kierujesz na adres ${LEGAL_CONTACT_EMAIL}. Odpowiadamy bez zbędnej zwłoki, najpóźniej w terminie miesiąca od otrzymania wniosku, zgodnie z art. 12 ust. 3 RODO. W sprawach skomplikowanych termin możemy przedłużyć o kolejne dwa miesiące, informując Cię o tym wraz z podaniem przyczyn.`,
        },
        {
          type: "paragraph",
          text: "Realizacja uprawnień jest nieodpłatna, zgodnie z art. 12 ust. 5 RODO.",
        },
        {
          type: "paragraph",
          text: "Organem nadzorczym właściwym w sprawach ochrony danych osobowych jest:",
        },
        {
          type: "paragraph",
          text: "Prezes Urzędu Ochrony Danych Osobowych",
        },
        {
          type: "paragraph",
          text: "ul. Stawki 2, 00-193 Warszawa",
        },
        {
          type: "paragraph",
          text: "uodo.gov.pl",
        },
      ],
    },
    {
      id: "profiling",
      title: "8. Profilowanie i zautomatyzowane podejmowanie decyzji",
      blocks: [
        {
          type: "paragraph",
          text: "Nie podejmujemy decyzji opierających się wyłącznie na zautomatyzowanym przetwarzaniu, w tym profilowaniu, które wywoływałyby wobec Ciebie skutki prawne lub w podobny sposób istotnie na Ciebie wpływały, w rozumieniu art. 22 ust. 1 RODO.",
        },
        {
          type: "paragraph",
          text: "Nie różnicujemy cen na podstawie zachowania użytkownika, nie tworzymy profili zainteresowań w celach reklamowych i nie prowadzimy remarketingu. W Google Analytics nie korzystamy z funkcji Google Signals ani z reklamowych funkcji raportowania, a dane analityczne nie są łączone z kontami reklamowymi.",
        },
        {
          type: "paragraph",
          text: "Dane analityczne wykorzystujemy w postaci zagregowanej, w celu oceny popularności poszczególnych podstron i produktów.",
        },
      ],
    },
    {
      id: "security",
      title: "9. Bezpieczeństwo danych",
      blocks: [
        {
          type: "paragraph",
          text: "Stosujemy środki techniczne i organizacyjne odpowiadające ryzyku, zgodnie z art. 32 RODO: szyfrowanie transmisji protokołem TLS, przechowywanie haseł wyłącznie w postaci zahaszowanej, ograniczenie i kontrolę dostępu do paneli administracyjnych, ochronę przed atakami na poziomie sieci dostarczania treści oraz regularne kopie zapasowe.",
        },
        {
          type: "paragraph",
          text: "Naruszenie ochrony danych osobowych zgłaszamy Prezesowi Urzędu Ochrony Danych Osobowych w terminie 72 godzin od jego stwierdzenia, zgodnie z art. 33 ust. 1 RODO. Jeżeli naruszenie może powodować wysokie ryzyko naruszenia Twoich praw lub wolności, zawiadamiamy o nim również Ciebie, zgodnie z art. 34 RODO.",
        },
      ],
    },
    {
      id: "cookies-intro",
      title: "Polityka cookies",
      blocks: [
        {
          type: "paragraph",
          text: "Poniższe postanowienia dotyczą przechowywania informacji i uzyskiwania dostępu do informacji przechowywanej w Twoim urządzeniu końcowym.",
        },
      ],
    },
    {
      id: "cookies-basis",
      title: "10. Podstawa prawna i zasady ogólne",
      blocks: [
        {
          type: "paragraph",
          text: "Przechowywanie informacji i uzyskiwanie dostępu do informacji przechowywanej w Twoim urządzeniu końcowym reguluje art. 399 ustawy z 12 lipca 2024 r. Prawo komunikacji elektronicznej. Jeżeli dane pochodzące z plików cookies stanowią dane osobowe, stosujemy równolegle przepisy RODO.",
        },
        {
          type: "paragraph",
          text: "Zasady, którymi się kierujemy:",
        },
        {
          type: "list",
          items: [
            "pliki inne niż niezbędne uruchamiamy wyłącznie po uzyskaniu Twojej uprzedniej zgody; przed jej wyrażeniem skrypty Google Analytics i odtwarzacz YouTube nie są ładowane i nie wysyłają żadnych danych,",
            "zgodę zbieramy odrębnie dla każdej kategorii plików,",
            "żadna kategoria poza niezbędną nie jest zaznaczona domyślnie,",
            "przycisk odmowy zgody znajduje się na pierwszym ekranie okna zgody i jest tak samo widoczny jak przycisk akceptacji,",
            "zgodę możesz wycofać w dowolnym momencie, równie łatwo jak jej udzieliłeś,",
            "odmowa zgody nie ogranicza dostępu do zakupionych materiałów ani do żadnej funkcji serwisu poza odtwarzaniem materiałów demonstracyjnych z serwisu YouTube.",
          ],
        },
      ],
    },
    {
      id: "cookies-list",
      title: "11. Stosowane pliki cookies",
      blocks: [
        {
          type: "paragraph",
          text: "11.1 Pliki niezbędne, niewymagające zgody",
        },
        {
          type: "paragraph",
          text: "Stosujemy je na podstawie art. 399 Prawa komunikacji elektronicznej, ponieważ są konieczne do świadczenia usługi, której zażądałeś.",
        },
        {
          type: "table",
          table: {
            headers: [
              "Plik lub grupa plików",
              "Podmiot ustawiający",
              "Cel",
              "Czas przechowywania",
            ],
            rows: [
              [
                "pliki sesyjne i uwierzytelniające",
                "Supabase, Inc.",
                "utrzymanie sesji zalogowanego użytkownika, ochrona formularzy przed nadużyciem",
                "czas trwania sesji, nie dłużej niż 7 dni",
              ],
              [
                "__cf_bm, cf_clearance, _cfuvid",
                "Cloudflare, Inc.",
                "odróżnienie ruchu użytkowników od ruchu automatycznego, ochrona przed atakami, prawidłowe dostarczanie treści",
                "od 30 minut do 12 miesięcy",
              ],
              [
                "pliki odtwarzacza Cloudflare Stream",
                "Cloudflare, Inc.",
                "prawidłowe odtwarzanie zakupionych materiałów wideo",
                "czas trwania sesji",
              ],
              [
                "__stripe_mid, __stripe_sid",
                "Stripe Payments Europe, Limited",
                "przeprowadzenie transakcji i przeciwdziałanie oszustwom płatniczym",
                "od 30 minut do 12 miesięcy",
              ],
              [
                "plik preferencji zgód",
                "Karol Stępień Z AI Na Ty",
                "zapamiętanie Twojego wyboru dokonanego w oknie zgody",
                "12 miesięcy",
              ],
            ],
          },
        },
        {
          type: "paragraph",
          text: "Cloudflare Web Analytics, z którego korzystamy do zbiorczego pomiaru ruchu, nie zapisuje plików cookies w Twoim urządzeniu i nie tworzy identyfikatorów użytkowników. Opisujemy je wyłącznie dla przejrzystości.",
        },
        {
          type: "paragraph",
          text: "11.2 Pliki analityczne, wymagające zgody",
        },
        {
          type: "table",
          table: {
            headers: [
              "Plik",
              "Podmiot ustawiający",
              "Cel",
              "Czas przechowywania",
            ],
            rows: [
              [
                "_ga",
                "Google Ireland Limited (Google Analytics 4)",
                "rozróżnianie użytkowników na potrzeby statystyki",
                "do 24 miesięcy",
              ],
              [
                "_ga_<identyfikator>",
                "Google Ireland Limited (Google Analytics 4)",
                "utrzymanie stanu sesji na potrzeby statystyki",
                "do 24 miesięcy",
              ],
            ],
          },
        },
        {
          type: "paragraph",
          text: "Google Analytics 4 nie zapisuje adresów IP użytkowników. Okres przechowywania danych w panelu Google Analytics ustawiliśmy na 14 miesięcy.",
        },
        {
          type: "paragraph",
          text: "Z pomiaru Google Analytics możesz zrezygnować także niezależnie od naszego okna zgody, instalując dodatek do przeglądarki udostępniany przez Google pod adresem tools.google.com/dlpage/gaoptout.",
        },
        {
          type: "paragraph",
          text: "11.3 Pliki podmiotów trzecich, wymagające zgody",
        },
        {
          type: "table",
          table: {
            headers: [
              "Plik lub grupa plików",
              "Podmiot ustawiający",
              "Cel",
              "Czas przechowywania",
            ],
            rows: [
              [
                "VISITOR_INFO1_LIVE, YSC, VISITOR_PRIVACY_METADATA i pokrewne",
                "Google Ireland Limited (YouTube)",
                "odtwarzanie materiałów demonstracyjnych, zapamiętanie ustawień odtwarzacza, pomiar oglądalności po stronie Google",
                "od czasu trwania sesji do 6 miesięcy",
              ],
            ],
          },
        },
        {
          type: "paragraph",
          text: "Materiały demonstracyjne osadzamy w trybie ograniczonego przetwarzania danych, z wykorzystaniem domeny youtube-nocookie.com. Odtwarzacz nie ładuje się automatycznie. Zamiast niego wyświetlamy miniaturę, a odtwarzacz uruchamia się dopiero po Twoim kliknięciu i po wyrażeniu zgody na tę kategorię plików. Dopóki tego nie zrobisz, żadne dane nie trafiają do Google za pośrednictwem odtwarzacza.",
        },
        {
          type: "paragraph",
          text: "Zakupione szkolenia wideo odtwarzamy przez Cloudflare Stream, poza serwisem YouTube. Odmowa zgody na tę kategorię nie wpływa na dostęp do zakupionych materiałów.",
        },
      ],
    },
    {
      id: "cookies-manage",
      title: "12. Zarządzanie zgodami i plikami cookies",
      blocks: [
        {
          type: "paragraph",
          text: "Zgody zmienisz i wycofasz w dowolnym momencie pod linkiem „Ustawienia cookies\" dostępnym w stopce każdej podstrony serwisu.",
        },
        {
          type: "paragraph",
          text: "Możesz również ograniczyć lub wyłączyć obsługę plików cookies w ustawieniach przeglądarki. Zablokowanie plików niezbędnych uniemożliwi zalogowanie się na konto i przeprowadzenie płatności, a w konsekwencji korzystanie z zakupionych materiałów.",
        },
        {
          type: "paragraph",
          text: "Wycofanie zgody nie wpływa na zgodność z prawem przetwarzania dokonanego przed jej wycofaniem.",
        },
      ],
    },
    {
      id: "changes",
      title: "13. Zmiany polityki",
      blocks: [
        {
          type: "paragraph",
          text: "Politykę możemy zmienić w razie zmiany przepisów prawa, zakresu funkcjonalności serwisu albo listy podmiotów przetwarzających dane na nasze zlecenie.",
        },
        {
          type: "paragraph",
          text: "O istotnych zmianach informujemy z co najmniej 14-dniowym wyprzedzeniem, wiadomością na adres e-mail przypisany do konta oraz komunikatem w serwisie. Aktualna wersja dokumentu jest dostępna pod stałym adresem, wraz z numerem wersji i datą obowiązywania.",
        },
        {
          type: "paragraph",
          text: "Poprzednie wersje polityki udostępniamy na wniosek złożony na adres kontaktowy.",
        },
        {
          type: "paragraph",
          text: `Niniejsza polityka obowiązuje od ${LEGAL_LAST_UPDATED}.`,
        },
      ],
    },
  ] as const satisfies readonly LegalSection[],
};
