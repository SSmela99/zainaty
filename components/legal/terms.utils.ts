import {
  LEGAL_CONTACT_EMAIL,
  LEGAL_CONTACT_PHONE,
  LEGAL_LAST_UPDATED,
  LEGAL_SELLER_ADDRESS,
  TERMS_VERSION,
  type LegalDownload,
  type LegalSection,
} from "./legal.utils";

export const termsContent = {
  label: "Prawo i regulacje",
  title: "Regulamin serwisu Z AI na Ty",
  description:
    "Ten regulamin określa zasady korzystania z serwisu zainaty.com.pl oraz zawierania umów sprzedaży produktów cyfrowych. Napisaliśmy go prostym językiem, bo dokument, którego nie da się zrozumieć, nikogo nie chroni. Jeżeli coś budzi Twoje wątpliwości, napisz na kontakt@zainaty.com.pl.",
  lastUpdated: `Wersja ${TERMS_VERSION}, obowiązuje od ${LEGAL_LAST_UPDATED}`,
  downloads: [
    {
      label: "Załącznik nr 1 — wzór formularza odstąpienia (DOCX)",
      href: "/legal/zalacznik-1-wzor-odstapienia.docx",
      description:
        "Ustawowy wzór formularza odstąpienia od umowy. Użycie nie jest obowiązkowe.",
    },
    {
      label: "Załącznik nr 2 — gotowa treść wiadomości e-mail (DOCX)",
      href: "/legal/zalacznik-2-tresc-email.docx",
      description:
        "Tekst do skopiowania i wysłania na kontakt@zainaty.com.pl w razie odstąpienia od umowy.",
    },
  ] as const satisfies readonly LegalDownload[],
  sections: [
    {
      id: "seller",
      title: "§ 1. Sprzedawca",
      blocks: [
        {
          type: "paragraph",
          text: "1. Właścicielem serwisu i sprzedawcą jest Karol Stępień, prowadzący działalność gospodarczą pod nazwą Karol Stępień Z AI Na Ty, ul. Maratońska 87 lok. 3, 94-007 Łódź, NIP 7272900566, REGON 544717627, wpisany do Centralnej Ewidencji i Informacji o Działalności Gospodarczej prowadzonej przez ministra właściwego do spraw gospodarki.",
        },
        {
          type: "paragraph",
          text: "2. Dane kontaktowe:",
        },
        {
          type: "list",
          items: [
            `e-mail: ${LEGAL_CONTACT_EMAIL}`,
            `telefon: ${LEGAL_CONTACT_PHONE}`,
            `adres do korespondencji, reklamacji i oświadczeń o odstąpieniu: ${LEGAL_SELLER_ADDRESS}`,
          ],
        },
        {
          type: "paragraph",
          text: "3. Koszt połączenia telefonicznego odpowiada zwykłej opłacie według taryfy operatora Klienta.",
        },
        {
          type: "paragraph",
          text: "4. Odpowiadamy w dni robocze, zwykle w ciągu jednego dnia roboczego.",
        },
        {
          type: "paragraph",
          text: "5. Regulamin udostępniamy nieodpłatnie przed zawarciem umowy, w formie umożliwiającej jego pobranie, odtwarzanie i utrwalenie, zgodnie z art. 8 ust. 1 ustawy o świadczeniu usług drogą elektroniczną. Wersję do pobrania znajdziesz na dole tej strony oraz w stopce serwisu.",
        },
      ],
    },
    {
      id: "definitions",
      title: "§ 2. Definicje i zakres zastosowania",
      blocks: [
        {
          type: "paragraph",
          text: "1. Konsument to osoba fizyczna dokonująca ze Sprzedawcą czynności prawnej niezwiązanej bezpośrednio z jej działalnością gospodarczą lub zawodową (art. 22¹ kodeksu cywilnego).",
        },
        {
          type: "paragraph",
          text: "2. Przedsiębiorca na prawach konsumenta to osoba fizyczna zawierająca umowę bezpośrednio związaną z jej działalnością gospodarczą, gdy z treści tej umowy wynika, że nie ma ona dla niej charakteru zawodowego, wynikającego w szczególności z przedmiotu wykonywanej działalności ujawnionego w CEIDG (art. 7aa ustawy o prawach konsumenta). Osobie takiej przysługują uprawnienia dotyczące odstąpienia od umowy, braku zgodności produktu z umową oraz niedozwolonych postanowień umownych. Każde postanowienie tego regulaminu odnoszące się do Konsumenta stosuje się również do niej.",
        },
        {
          type: "paragraph",
          text: "3. Klient to każda osoba zawierająca umowę ze Sprzedawcą.",
        },
        {
          type: "paragraph",
          text: "4. Produkt cyfrowy to e-book, szkolenie wideo albo pakiet szkoleń dostarczany bez nośnika materialnego.",
        },
        {
          type: "paragraph",
          text: "5. Konto to usługa świadczona drogą elektroniczną, w ramach której Klient otrzymuje dostęp do zakupionych materiałów.",
        },
        {
          type: "paragraph",
          text: "6. Umowy zawieramy wyłącznie z osobami pełnoletnimi posiadającymi pełną zdolność do czynności prawnych i realizujemy je na terytorium Rzeczypospolitej Polskiej.",
        },
        {
          type: "paragraph",
          text: "7. Szkolenia dla firm, szkół i instytucji publicznych realizujemy poza serwisem, na podstawie odrębnej umowy. Ten regulamin ich nie obejmuje.",
        },
      ],
    },
    {
      id: "products",
      title: "§ 3. Przedmiot sprzedaży",
      blocks: [
        {
          type: "paragraph",
          text: "1. W serwisie sprzedajemy produkty cyfrowe:",
        },
        {
          type: "list",
          items: [
            "e-booki w formacie PDF, dostępne do pobrania na Koncie Klienta,",
            "szkolenia wideo odtwarzane w serwisie po zalogowaniu,",
            "pakiety szkoleń, czyli zestawy powyższych produktów objęte jedną ceną.",
          ],
        },
        {
          type: "paragraph",
          text: "2. Na stronie każdego produktu podajemy jego opis, adresata, zakres tematyczny, orientacyjny czas potrzebny na przerobienie materiału, format oraz cenę.",
        },
        {
          type: "paragraph",
          text: "3. Wszystkie produkty sprzedajemy jednorazowo. Nie prowadzimy sprzedaży subskrypcyjnej ani płatności cyklicznych.",
        },
        {
          type: "paragraph",
          text: "4. Produkty mają charakter edukacyjny. Nie stanowią porady prawnej, podatkowej, medycznej ani inwestycyjnej. Sprzedawca nie gwarantuje osiągnięcia przez Klienta konkretnych rezultatów zawodowych ani finansowych.",
        },
      ],
    },
    {
      id: "prices",
      title: "§ 4. Ceny i promocje",
      blocks: [
        {
          type: "paragraph",
          text: "1. Ceny podajemy w złotych polskich.",
        },
        {
          type: "paragraph",
          text: "2. Sprzedawca korzysta ze zwolnienia z podatku VAT na podstawie art. 113 ust. 1 i ust. 9 ustawy o podatku od towarów i usług. Cena widoczna przy produkcie jest ceną końcową. Nie doliczamy do niej podatku ani żadnych dodatkowych opłat.",
        },
        {
          type: "paragraph",
          text: "3. Nie ponosisz kosztów dostawy, ponieważ produkty dostarczamy drogą elektroniczną.",
        },
        {
          type: "paragraph",
          text: "4. Przy każdej informacji o obniżeniu ceny podajemy obok ceny obniżonej najniższą cenę produktu obowiązującą w okresie 30 dni przed wprowadzeniem obniżki, zgodnie z art. 4 ust. 2 ustawy o informowaniu o cenach towarów i usług. Jeżeli produkt jest oferowany krócej niż 30 dni, podajemy najniższą cenę od dnia rozpoczęcia jego sprzedaży.",
        },
        {
          type: "paragraph",
          text: "5. Wiążąca jest cena widoczna przy produkcie w chwili składania zamówienia. Późniejsza zmiana ceny nie wpływa na zamówienia już złożone.",
        },
        {
          type: "paragraph",
          text: "6. Kody rabatowe wprowadzasz przed dokonaniem płatności. Warunki i termin ważności kodu podajemy przy jego udostępnieniu. Kody nie łączą się ze sobą, chyba że wyraźnie wskażemy inaczej.",
        },
        {
          type: "paragraph",
          text: `7. Do każdego zamówienia wystawiamy rachunek na dane podane przy zakupie. Na Twoje żądanie wystawimy fakturę bez VAT. Korektę danych zgłosisz na ${LEGAL_CONTACT_EMAIL}.`,
        },
      ],
    },
    {
      id: "technical",
      title: "§ 5. Wymagania techniczne",
      blocks: [
        {
          type: "paragraph",
          text: "1. Do korzystania z serwisu potrzebujesz urządzenia z dostępem do internetu, aktualnej wersji przeglądarki (Chrome, Firefox, Safari, Edge) z obsługą JavaScript i plików cookies oraz aktywnego adresu e-mail.",
        },
        {
          type: "paragraph",
          text: "2. E-booki dostarczamy w formacie PDF. Otworzysz je dowolnym czytnikiem PDF na komputerze, tablecie, telefonie i czytniku e-booków. Pliki nie są zabezpieczone mechanizmami DRM i nie ograniczamy liczby urządzeń, na których je otworzysz.",
        },
        {
          type: "paragraph",
          text: "3. Szkolenia wideo odtwarzamy w przeglądarce z wykorzystaniem usługi Cloudflare Stream. Zalecamy łącze o przepustowości co najmniej 5 Mb/s dla jakości HD. Materiałów wideo nie udostępniamy do pobrania.",
        },
        {
          type: "paragraph",
          text: "4. Materiały demonstracyjne udostępniamy za pośrednictwem odtwarzacza YouTube. Odtwarzacz ładuje się dopiero po Twoim kliknięciu i po wyrażeniu zgody na pliki cookies podmiotów trzecich. Szczegóły opisujemy w Polityce prywatności i cookies.",
        },
        {
          type: "paragraph",
          text: "5. Produkty nie wymagają instalacji dodatkowego oprogramowania i nie współpracują z żadnym sprzętem ani oprogramowaniem poza przeglądarką internetową i czytnikiem PDF. Jest to informacja o funkcjonalności, kompatybilności i interoperacyjności treści cyfrowych, o której mowa w art. 12 ust. 1 ustawy o prawach konsumenta.",
        },
        {
          type: "paragraph",
          text: "6. Korzystanie z usług świadczonych drogą elektroniczną wiąże się ze zwykłym ryzykiem związanym z korzystaniem z internetu. Zalecamy aktualne oprogramowanie oraz program antywirusowy.",
        },
        {
          type: "paragraph",
          text: "7. Zakazane jest dostarczanie przez Klienta treści o charakterze bezprawnym, w tym w formularzu kontaktowym, w danych Konta, w opiniach oraz w korespondencji ze Sprzedawcą.",
        },
      ],
    },
    {
      id: "electronic-services",
      title: "§ 6. Usługi świadczone drogą elektroniczną",
      blocks: [
        {
          type: "paragraph",
          text: "W serwisie świadczymy nieodpłatnie następujące usługi:",
        },
        {
          type: "paragraph",
          text: "1. Przeglądanie serwisu. Umowa zostaje zawarta z chwilą wejścia na stronę i rozwiązana z chwilą jej opuszczenia.",
        },
        {
          type: "paragraph",
          text: "2. Konto. Umowa zostaje zawarta z chwilą założenia Konta, na czas nieoznaczony. Możesz ją rozwiązać w każdej chwili, usuwając Konto na zasadach z § 7.",
        },
        {
          type: "paragraph",
          text: "3. Newsletter. Umowa zostaje zawarta z chwilą potwierdzenia zapisu, na czas nieoznaczony. Możesz ją rozwiązać w każdej chwili, wypisując się na zasadach z § 15.",
        },
        {
          type: "paragraph",
          text: "4. Formularz kontaktowy. Umowa zostaje zawarta z chwilą wysłania formularza i rozwiązana z chwilą udzielenia odpowiedzi.",
        },
        {
          type: "paragraph",
          text: "5. Rezerwacja konsultacji. Umowa zostaje zawarta z chwilą dokonania rezerwacji i rozwiązana z chwilą odbycia albo odwołania konsultacji.",
        },
        {
          type: "paragraph",
          text: "6. Materiały bezpłatne. Umowa zostaje zawarta z chwilą podania adresu e-mail w formularzu materiału i wykonana z chwilą jego wysłania.",
        },
        {
          type: "paragraph",
          text: "Reklamacje dotyczące tych usług rozpatrujemy w trybie opisanym w § 12.",
        },
      ],
    },
    {
      id: "account",
      title: "§ 7. Konto",
      blocks: [
        {
          type: "paragraph",
          text: "1. Założenie Konta jest warunkiem zakupu, ponieważ zakupione materiały udostępniamy właśnie na Koncie.",
        },
        {
          type: "paragraph",
          text: "2. Konto zakładasz podczas zakupu albo odrębnie, podając adres e-mail i hasło.",
        },
        {
          type: "paragraph",
          text: "3. W ramach Konta zapisujemy Twój postęp w szkoleniach wideo, czyli informację o obejrzanych lekcjach i miejscu zatrzymania odtwarzania. Służy to wyłącznie wznowieniu nauki od właściwego momentu.",
        },
        {
          type: "paragraph",
          text: "4. Odpowiadasz za zachowanie hasła w poufności. W razie podejrzenia, że osoba trzecia uzyskała dostęp do Konta, powiadom nas niezwłocznie.",
        },
        {
          type: "paragraph",
          text: `5. Konto możesz usunąć w każdej chwili, bez podania przyczyny, korzystając z opcji w panelu albo pisząc na ${LEGAL_CONTACT_EMAIL}.`,
        },
        {
          type: "paragraph",
          text: "6. Uwaga: usunięcie Konta powoduje utratę dostępu do zakupionych materiałów. Przed potwierdzeniem usunięcia wyświetlamy ostrzeżenie o tym skutku. Pobierz wcześniej pliki PDF, które chcesz zachować. Materiałów wideo nie da się pobrać, więc po usunięciu Konta nie przywrócimy do nich dostępu.",
        },
        {
          type: "paragraph",
          text: "7. Konto możemy zablokować, jeżeli Klient udostępnia dane logowania osobom trzecim albo rozpowszechnia zakupione materiały. Przed zablokowaniem wysyłamy wezwanie na adres e-mail przypisany do Konta i wyznaczamy 14 dni na ustosunkowanie się. Blokada nie pozbawia Klienta prawa do reklamacji ani do zwrotu ceny za produkty, z których nie mógł skorzystać.",
        },
      ],
    },
    {
      id: "order",
      title: "§ 8. Zamówienie i zawarcie umowy",
      blocks: [
        {
          type: "paragraph",
          text: "1. Wybierasz produkt i przechodzisz do zamówienia.",
        },
        {
          type: "paragraph",
          text: "2. Możesz wprowadzić kod rabatowy. Po jego zastosowaniu widzisz cenę końcową.",
        },
        {
          type: "paragraph",
          text: "3. Podajesz dane niezbędne do zawarcia umowy i wystawienia rachunku oraz zakładasz Konto albo logujesz się na istniejące.",
        },
        {
          type: "paragraph",
          text: "4. Zaznaczasz oświadczenie o zapoznaniu się z regulaminem i polityką prywatności.",
        },
        {
          type: "paragraph",
          text: "5. Przed złożeniem zamówienia wyświetlamy podsumowanie: przedmiot zamówienia, cenę łączną i informację, że umowa ma charakter jednorazowy. Na tym etapie możesz poprawić każdy błąd we wprowadzonych danych, wracając do poprzedniego kroku przyciskiem w formularzu albo w przeglądarce.",
        },
        {
          type: "paragraph",
          text: "6. Klikasz przycisk „Zamawiam z obowiązkiem zapłaty\" i przechodzisz do płatności.",
        },
        {
          type: "paragraph",
          text: "7. Umowę uważa się za zawartą z chwilą potwierdzenia dokonania płatności przez operatora płatności.",
        },
        {
          type: "paragraph",
          text: "8. Niezwłocznie po zawarciu umowy przesyłamy na Twój adres e-mail potwierdzenie zawarcia umowy na trwałym nośniku, zgodnie z art. 21 ust. 1 ustawy o prawach konsumenta. Zawiera ono treść umowy, niniejszy regulamin w pliku do pobrania, pouczenie o prawie odstąpienia oraz oba załączniki do regulaminu.",
        },
        {
          type: "paragraph",
          text: "9. Umowę zawieramy w języku polskim. Treść umowy utrwalamy w potwierdzeniu, o którym mowa w ust. 8, oraz w historii zamówień na Koncie.",
        },
        {
          type: "paragraph",
          text: "10. Sprzedawca nie stosuje kodeksów dobrych praktyk w rozumieniu ustawy o przeciwdziałaniu nieuczciwym praktykom rynkowym.",
        },
      ],
    },
    {
      id: "payments",
      title: "§ 9. Płatności",
      blocks: [
        {
          type: "paragraph",
          text: "1. Płatności obsługuje Stripe Payments Europe, Limited z siedzibą w Irlandii.",
        },
        {
          type: "paragraph",
          text: "2. Akceptujemy karty płatnicze oraz pozostałe metody udostępnione przez operatora w procesie zakupu.",
        },
        {
          type: "paragraph",
          text: "3. Danych karty płatniczej nie pozyskujemy ani nie przechowujemy. Przekazujesz je bezpośrednio operatorowi płatności.",
        },
        {
          type: "paragraph",
          text: "4. W razie niepowodzenia płatności umowa nie dochodzi do skutku. Możesz złożyć zamówienie ponownie.",
        },
      ],
    },
    {
      id: "delivery",
      title: "§ 10. Dostarczenie produktu i czas dostępu",
      blocks: [
        {
          type: "paragraph",
          text: "1. Materiały udostępniamy na Koncie niezwłocznie po potwierdzeniu płatności, nie później niż w ciągu 24 godzin. Jeżeli po tym czasie produkt nie jest widoczny na Koncie, powiadom nas.",
        },
        {
          type: "paragraph",
          text: "2. Chwilą dostarczenia produktu cyfrowego jest moment udostępnienia materiałów na Koncie Klienta.",
        },
        {
          type: "paragraph",
          text: "3. Dostęp do zakupionych materiałów jest bezterminowy. Nie ograniczamy go w czasie i nie pobieramy za jego utrzymanie żadnych opłat.",
        },
        {
          type: "paragraph",
          text: "4. Aktualizacje i poprawki materiałów udostępniamy na Koncie nieodpłatnie. Nie zobowiązujemy się do określonej częstotliwości aktualizacji. Informujemy o aktualizacjach niezbędnych do zachowania zgodności produktu z umową.",
        },
        {
          type: "paragraph",
          text: "5. Sprzedawca może zakończyć udostępnianie serwisu, w szczególności w razie zakończenia działalności gospodarczej. W takim przypadku:",
        },
        {
          type: "list",
          items: [
            "informuje o tym na adres e-mail przypisany do Konta co najmniej 90 dni przed zakończeniem,",
            "w tym okresie udostępnia wszystkie zakupione przez Klienta materiały, w tym wideo, w formie umożliwiającej ich pobranie i trwałe zachowanie.",
          ],
        },
        {
          type: "paragraph",
          text: "6. Planowane przerwy techniczne wykonujemy poza godzinami największego ruchu. O przerwach dłuższych niż godzina informujemy w serwisie z wyprzedzeniem.",
        },
      ],
    },
    {
      id: "withdrawal",
      title: "§ 11. Odstąpienie od umowy",
      blocks: [
        {
          type: "paragraph",
          text: "1. Masz 14 dni na odstąpienie od każdej umowy zawartej w serwisie, licząc od dnia jej zawarcia. Nie musisz podawać przyczyny. Zwracamy całą zapłaconą kwotę.",
        },
        {
          type: "paragraph",
          text: "2. Art. 38 ust. 1 pkt 13 ustawy o prawach konsumenta pozwala sprzedawcom treści cyfrowych wyłączyć prawo odstąpienia z chwilą rozpoczęcia świadczenia. Sprzedawca świadomie z tego wyłączenia nie korzysta. Prawo odstąpienia przysługuje Ci także wtedy, gdy pobrałeś pliki, obejrzałeś część szkolenia albo przerobiłeś cały materiał.",
        },
        {
          type: "paragraph",
          text: `3. Najprostszą drogą jest wysłanie wiadomości e-mail na adres ${LEGAL_CONTACT_EMAIL}. Gotową treść do skopiowania znajdziesz w załączniku nr 2.`,
        },
        {
          type: "paragraph",
          text: "4. Oświadczenie możesz złożyć w dowolny sposób i będzie ono tak samo skuteczne. Możesz skorzystać z ustawowego wzoru formularza, który stanowi załącznik nr 1, ale nie jest to obowiązkowe. Możesz też odpowiedzieć na wiadomość potwierdzającą zakup, użyć formularza kontaktowego w serwisie albo wysłać list na adres Sprzedawcy. Wystarczy, aby z treści wynikała Twoja wola odstąpienia oraz dane pozwalające ustalić, którego zamówienia dotyczy.",
        },
        {
          type: "paragraph",
          text: "5. We wzorze wiadomości pytamy o powód rezygnacji. Odpowiedź jest całkowicie dobrowolna i nie wpływa na rozpatrzenie sprawy. Możesz pozostawić to pole puste.",
        },
        {
          type: "paragraph",
          text: "6. Do zachowania terminu wystarczy wysłanie oświadczenia przed jego upływem.",
        },
        {
          type: "paragraph",
          text: "7. Potwierdzenie otrzymania oświadczenia przesyłamy niezwłocznie na trwałym nośniku, czyli wiadomością e-mail, zgodnie z art. 30 ust. 4 ustawy o prawach konsumenta. Potwierdzenie zawiera informację o terminie zwrotu środków.",
        },
        {
          type: "paragraph",
          text: "8. Zwrotu płatności dokonujemy niezwłocznie, nie później niż w terminie 14 dni od otrzymania oświadczenia, przy użyciu takiego samego sposobu zapłaty, jakiego użyłeś, chyba że wyraźnie zgodzisz się na inny sposób, który nie wiąże się dla Ciebie z żadnymi kosztami (art. 32 ustawy o prawach konsumenta).",
        },
        {
          type: "paragraph",
          text: "9. W razie odstąpienia od umowy uważa się ją za niezawartą. Z tą chwilą tracisz dostęp do materiałów na Koncie i, zgodnie z art. 34 ust. 1a ustawy o prawach konsumenta, jesteś zobowiązany zaprzestać korzystania z treści cyfrowych i udostępniania ich osobom trzecim. Prosimy również o usunięcie pobranych plików.",
        },
        {
          type: "paragraph",
          text: "10. Prawo odstąpienia na zasadach określonych w tym paragrafie przysługuje Konsumentom oraz Przedsiębiorcom na prawach konsumenta.",
        },
      ],
    },
    {
      id: "complaints",
      title: "§ 12. Reklamacje i brak zgodności z umową",
      blocks: [
        {
          type: "paragraph",
          text: "1. Sprzedawca odpowiada wobec Konsumenta za zgodność produktu cyfrowego z umową na zasadach określonych w rozdziale 5b ustawy o prawach konsumenta.",
        },
        {
          type: "paragraph",
          text: "2. Produkt jest zgodny z umową, gdy odpowiada opisowi zamieszczonemu na stronie produktu pod względem zawartości, formatu, objętości i funkcjonalności oraz nadaje się do celu, do którego zwykle służy materiał tego rodzaju.",
        },
        {
          type: "paragraph",
          text: "3. Sprzedawca odpowiada za brak zgodności istniejący w chwili dostarczenia i ujawniony w ciągu 2 lat od tej chwili. Domniemywa się, że brak zgodności, który ujawnił się przed upływem roku od dostarczenia, istniał w chwili dostarczenia (art. 43k ust. 1 ustawy o prawach konsumenta).",
        },
        {
          type: "paragraph",
          text: `4. Reklamację zgłoś na adres ${LEGAL_CONTACT_EMAIL} albo pisemnie na adres Sprzedawcy. Opisz, na czym polega problem, i wskaż, czego oczekujesz. Nie wymagamy żadnego formularza ani szczególnej formy zgłoszenia.`,
        },
        {
          type: "paragraph",
          text: "5. Odpowiedź na reklamację przesyłamy w terminie 14 dni od jej otrzymania. Brak odpowiedzi w tym terminie oznacza, że reklamację uznaliśmy (art. 7a ustawy o prawach konsumenta).",
        },
        {
          type: "paragraph",
          text: "6. Jeżeli produkt jest niezgodny z umową, możesz żądać doprowadzenia go do zgodności. Sprzedawca dokonuje tego w rozsądnym czasie, bez nadmiernych niedogodności i bez kosztów po stronie Konsumenta.",
        },
        {
          type: "paragraph",
          text: "7. Możesz złożyć oświadczenie o obniżeniu ceny albo o odstąpieniu od umowy, gdy:",
        },
        {
          type: "list",
          items: [
            "doprowadzenie do zgodności jest niemożliwe albo wymagałoby nadmiernych kosztów,",
            "Sprzedawca nie doprowadził produktu do zgodności w rozsądnym czasie lub zrobił to z nadmiernymi niedogodnościami,",
            "brak zgodności występuje nadal mimo próby doprowadzenia do zgodności,",
            "brak zgodności jest na tyle istotny, że uzasadnia natychmiastowe obniżenie ceny albo odstąpienie od umowy,",
            "z oświadczenia Sprzedawcy lub z okoliczności wynika, że nie doprowadzi on produktu do zgodności w rozsądnym czasie lub bez nadmiernych niedogodności.",
          ],
        },
        {
          type: "paragraph",
          text: "8. Nie możesz odstąpić od umowy, jeżeli brak zgodności jest nieistotny. Domniemywa się, że brak zgodności jest istotny.",
        },
        {
          type: "paragraph",
          text: "9. Zwrotu ceny z tytułu obniżenia ceny albo odstąpienia dokonujemy niezwłocznie, nie później niż w terminie 14 dni od otrzymania oświadczenia.",
        },
        {
          type: "paragraph",
          text: "10. Roszczenia z tytułu braku zgodności przedawniają się na zasadach ogólnych określonych w kodeksie cywilnym.",
        },
        {
          type: "paragraph",
          text: "11. Reklamacje dotyczące usług świadczonych drogą elektroniczną rozpatrujemy w tym samym trybie i terminie.",
        },
      ],
    },
    {
      id: "reviews",
      title: "§ 13. Opinie o produktach",
      blocks: [
        {
          type: "paragraph",
          text: "1. W serwisie publikujemy opinie osób, które kupiły produkt w serwisie albo uczestniczyły w szkoleniu prowadzonym przez Sprzedawcę. Przy każdej opinii wskazujemy, jakiego produktu lub szkolenia dotyczy.",
        },
        {
          type: "paragraph",
          text: "2. Weryfikujemy każdą opinię przed publikacją: porównujemy dane autora z historią zamówień w serwisie albo z listą uczestników szkolenia. Opinii, których pochodzenia nie potwierdzimy, nie publikujemy.",
        },
        {
          type: "paragraph",
          text: "3. Nie zamawiamy, nie kupujemy ani nie wynagradzamy opinii w żadnej formie. Nie usuwamy opinii negatywnych, chyba że naruszają prawo, zawierają treści obraźliwe albo dane osobowe osób trzecich.",
        },
        {
          type: "paragraph",
          text: "4. Informacja ta stanowi wykonanie obowiązku określonego w art. 6 ust. 4 pkt 7 ustawy o przeciwdziałaniu nieuczciwym praktykom rynkowym.",
        },
      ],
    },
    {
      id: "copyright",
      title: "§ 14. Prawa autorskie i licencja",
      blocks: [
        {
          type: "paragraph",
          text: "1. Materiały udostępniane w serwisie, w tym e-booki, szkolenia wideo, grafiki oraz teksty publikowane na blogu, są utworami w rozumieniu ustawy o prawie autorskim i prawach pokrewnych i podlegają ochronie prawnej.",
        },
        {
          type: "paragraph",
          text: "2. Z chwilą zawarcia umowy Klient uzyskuje licencję niewyłączną, udzieloną na czas nieoznaczony, uprawniającą do korzystania z materiałów na własny użytek, w tym w wykonywanej przez siebie pracy zawodowej i w prowadzonej działalności gospodarczej.",
        },
        {
          type: "paragraph",
          text: "3. Licencja obejmuje: zapoznawanie się z materiałami, pobieranie plików PDF na własne urządzenia, sporządzanie wydruków na własny użytek, sporządzanie notatek oraz nieograniczone stosowanie zdobytej wiedzy we własnej pracy.",
        },
        {
          type: "paragraph",
          text: "4. Licencja nie obejmuje: odsprzedaży materiałów, ich udostępniania osobom trzecim, rozpowszechniania w jakiejkolwiek formie, publikowania w internecie, wykorzystywania jako materiałów szkoleniowych we własnej działalności szkoleniowej ani wykorzystywania do trenowania modeli sztucznej inteligencji.",
        },
        {
          type: "paragraph",
          text: "5. Jedna licencja przysługuje jednej osobie. W sprawie licencji dla zespołów skontaktuj się ze Sprzedawcą.",
        },
        {
          type: "paragraph",
          text: "6. Postanowienia tego paragrafu nie ograniczają dozwolonego użytku osobistego ani prawa cytatu, przysługujących na podstawie ustawy o prawie autorskim i prawach pokrewnych.",
        },
        {
          type: "paragraph",
          text: "7. Odpowiedzialność za naruszenie praw autorskich następuje na zasadach ogólnych. Sprzedawca nie zastrzega kar umownych.",
        },
      ],
    },
    {
      id: "newsletter",
      title: "§ 15. Newsletter i materiały bezpłatne",
      blocks: [
        {
          type: "paragraph",
          text: "1. Newsletter jest nieodpłatny i dobrowolny. Zapis wymaga podania adresu e-mail oraz potwierdzenia zapisu przez kliknięcie w link w wiadomości weryfikacyjnej. Bez tego potwierdzenia nie wysyłamy żadnych treści.",
        },
        {
          type: "paragraph",
          text: "2. Podstawą wysyłki jest Twoja zgoda, o której mowa w art. 398 ust. 1 ustawy Prawo komunikacji elektronicznej.",
        },
        {
          type: "paragraph",
          text: `3. Z newslettera zrezygnujesz w każdej chwili, klikając link w stopce dowolnej wiadomości albo pisząc na ${LEGAL_CONTACT_EMAIL}. Rezygnacja jest natychmiastowa i nieodpłatna.`,
        },
        {
          type: "paragraph",
          text: "4. Materiały bezpłatne wysyłamy na adres e-mail podany w formularzu materiału. Zapis do newslettera jest przy tym odrębny i dobrowolny: wyrażasz na niego zgodę osobnym, niezaznaczonym domyślnie polem. Materiał otrzymasz także bez zapisu.",
        },
        {
          type: "paragraph",
          text: "5. Do materiałów bezpłatnych stosujemy zasady zgodności z umową i reklamacji w zakresie wynikającym z przepisów o treściach cyfrowych.",
        },
        {
          type: "paragraph",
          text: "6. Zapis do newslettera nie jest warunkiem zakupu produktu, otrzymania materiału bezpłatnego ani zawarcia jakiejkolwiek innej umowy.",
        },
      ],
    },
    {
      id: "consultation",
      title: "§ 16. Bezpłatna konsultacja",
      blocks: [
        {
          type: "paragraph",
          text: "1. Konsultacja trwa 15 minut, odbywa się zdalnie i jest nieodpłatna.",
        },
        {
          type: "paragraph",
          text: "2. Termin rezerwujesz w kalendarzu dostępnym w serwisie, podając imię i adres e-mail. Podanie numeru telefonu jest dobrowolne.",
        },
        {
          type: "paragraph",
          text: "3. Konsultacja służy omówieniu Twoich potrzeb i dobraniu materiałów. Nie stanowi szkolenia ani porady specjalistycznej.",
        },
        {
          type: "paragraph",
          text: `4. Termin możesz odwołać albo zmienić w każdej chwili, odpowiadając na wiadomość z potwierdzeniem rezerwacji albo pisząc na ${LEGAL_CONTACT_EMAIL}. Nie wiąże się to z żadnymi opłatami ani konsekwencjami.`,
        },
        {
          type: "paragraph",
          text: "5. Jeżeli Sprzedawca nie będzie mógł zrealizować rezerwacji, poinformuje o tym drogą elektroniczną i zaproponuje inny termin.",
        },
      ],
    },
    {
      id: "personal-data",
      title: "§ 17. Dane osobowe",
      blocks: [
        {
          type: "paragraph",
          text: "1. Administratorem danych osobowych jest Karol Stępień, prowadzący działalność gospodarczą pod nazwą Karol Stępień Z AI Na Ty, z danymi wskazanymi w § 1.",
        },
        {
          type: "paragraph",
          text: "2. Cele i podstawy prawne przetwarzania, okresy przechowywania, odbiorców danych, informacje o przekazywaniu danych poza Europejski Obszar Gospodarczy oraz przysługujące Ci uprawnienia opisujemy w Polityce prywatności i cookies.",
        },
        {
          type: "paragraph",
          text: "3. Zasady stosowania plików cookies opisujemy w tym samym dokumencie oraz w panelu dostępnym pod linkiem „Ustawienia cookies\" w stopce serwisu.",
        },
      ],
    },
    {
      id: "disputes",
      title: "§ 18. Pozasądowe rozwiązywanie sporów",
      blocks: [
        {
          type: "paragraph",
          text: "1. W pierwszej kolejności zachęcamy do kontaktu bezpośredniego. Większość spraw da się rozwiązać drogą korespondencji.",
        },
        {
          type: "paragraph",
          text: "2. Konsument może skorzystać z bezpłatnej pomocy:",
        },
        {
          type: "list",
          items: [
            "miejskiego lub powiatowego rzecznika konsumentów, właściwego dla miejsca zamieszkania,",
            "wojewódzkiego inspektora Inspekcji Handlowej, który prowadzi postępowania mediacyjne, oraz stałych polubownych sądów konsumenckich przy wojewódzkich inspektoratach,",
            "organizacji społecznych zajmujących się ochroną konsumentów, w tym Federacji Konsumentów i Stowarzyszenia Konsumentów Polskich,",
            "infolinii konsumenckiej pod numerem 801 440 220 oraz porad e-mailowych pod adresem porady@dlakonsumentow.pl.",
          ],
        },
        {
          type: "paragraph",
          text: "3. Wykaz podmiotów uprawnionych do pozasądowego rozwiązywania sporów konsumenckich prowadzi Prezes Urzędu Ochrony Konkurencji i Konsumentów. Aktualne informacje dla konsumentów znajdziesz na stronach uokik.gov.pl oraz prawakonsumenta.uokik.gov.pl.",
        },
        {
          type: "paragraph",
          text: "4. Skorzystanie z pozasądowych trybów jest dobrowolne dla obu stron i nie zamyka drogi sądowej.",
        },
        {
          type: "paragraph",
          text: "5. Spory z Konsumentem rozstrzyga sąd właściwy według przepisów kodeksu postępowania cywilnego. Sprzedawca nie zastrzega właściwości sądu według swojej siedziby.",
        },
        {
          type: "paragraph",
          text: "6. Spory z przedsiębiorcami niebędącymi Przedsiębiorcami na prawach konsumenta rozstrzyga sąd właściwy miejscowo dla siedziby Sprzedawcy.",
        },
      ],
    },
    {
      id: "changes",
      title: "§ 19. Zmiana regulaminu",
      blocks: [
        {
          type: "paragraph",
          text: "1. Sprzedawca może zmienić regulamin z ważnych przyczyn, którymi są: zmiana powszechnie obowiązujących przepisów prawa, zmiana zakresu lub sposobu świadczenia usług, wprowadzenie nowych usług lub produktów, zmiana danych Sprzedawcy, zmiana podmiotów, z których usług Sprzedawca korzysta, oraz konieczność usunięcia niejasności lub błędów w treści regulaminu.",
        },
        {
          type: "paragraph",
          text: "2. O zmianie informujemy co najmniej 14 dni przed jej wejściem w życie, wysyłając wiadomość na adres e-mail przypisany do Konta oraz publikując informację w serwisie.",
        },
        {
          type: "paragraph",
          text: "3. Jeżeli nie akceptujesz zmiany, możesz w tym okresie usunąć Konto. Zachowujesz wówczas dostęp do zakupionych materiałów przez okres umożliwiający ich pobranie, o którym poinformujemy odrębnie.",
        },
        {
          type: "paragraph",
          text: "4. Zamówienia złożone przed wejściem zmiany w życie realizujemy na dotychczasowych zasadach. Zmiana regulaminu nie działa wstecz.",
        },
        {
          type: "paragraph",
          text: "5. Archiwalne wersje regulaminu udostępniamy na żądanie złożone na adres kontaktowy.",
        },
      ],
    },
    {
      id: "final",
      title: "§ 20. Postanowienia końcowe",
      blocks: [
        {
          type: "paragraph",
          text: "1. W sprawach nieuregulowanych stosuje się prawo polskie, w szczególności kodeks cywilny, ustawę o prawach konsumenta, ustawę o świadczeniu usług drogą elektroniczną oraz ustawę o prawie autorskim i prawach pokrewnych.",
        },
        {
          type: "paragraph",
          text: "2. Wybór prawa polskiego nie pozbawia Konsumenta ochrony przyznanej mu przez bezwzględnie obowiązujące przepisy prawa państwa jego zwykłego pobytu.",
        },
        {
          type: "paragraph",
          text: "3. Żadne postanowienie tego regulaminu nie ogranicza uprawnień Konsumenta wynikających z przepisów prawa. W razie sprzeczności pierwszeństwo mają przepisy.",
        },
        {
          type: "paragraph",
          text: "4. Jeżeli którekolwiek postanowienie okaże się nieważne lub bezskuteczne, pozostałe postanowienia zachowują moc.",
        },
        {
          type: "paragraph",
          text: `5. Regulamin obowiązuje od ${LEGAL_LAST_UPDATED}.`,
        },
      ],
    },
  ] as const satisfies readonly LegalSection[],
};
