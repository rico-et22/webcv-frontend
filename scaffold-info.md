# Concept
Tytuł: „webCV – kreator stron WWW portfolio z asystentem AI”

Opis: Aplikacja webowa full-stack do generowania responsywnych stron internetowych portfolio, stworzona pod kątem m.in. specjalistów IT. Jej głównym celem jest maksymalne uproszczenie procesu budowy własnej wizytówki w sieci, stanowiąc alternatywę dla kodowania od zera wymagającego posiadania wiedzy z zakresu web developmentu czy opłacania zewnętrznych wykonawców.

Rozwiązanie opiera się na przyjaznym kreatorze (z opcjonalnym wsparciem analizy dokumentu CV przez AI), który po wypełnieniu formularza życiorysu użytkownika (m.in. imię i nazwisko, doświadczenie zawodowe, itd.) generuje paczkę ze statycznymi plikami strony portfolio (HTML, CSS, JS), gotowymi do natychmiastowego wdrożenia na hostingu. Fundamentem projektu jest zapewnienie użytkownikowi pełnej niezależności w wyborze hostingu - aplikacja eliminuje ryzyko tzw. vendor lock-in, nie narzucając swojej infrastruktury do hostowania stron portfolio, co dodatkowo chroni przed negatywnymi skutkami wymuszonych aktualizacji czy przyszłych zmian cenników, znanych z rozwiązań typu SaaS. webCV domyka cały proces od stworzenia po publikację, oferując również instrukcje przy wdrażaniu wygenerowanej strony na darmowe lub niskokosztowe serwery (np. GitHub Pages, FTP).

# Kluczowe funkcjonalności:
- Logowanie, rejestracja i reset hasła (mechanizm login/hasło).
- Formularz danych do wygenerowania strony portfolio, podzielony na etapy, z możliwością cofania się pomiędzy krokami bez utraty wprowadzonych danych; a także jego zapis do bazy danych w celu umożliwienia ich późniejszej edycji lub ponownego wygenerowania strony.
- Opcjonalne automatyczne uzupełnienie danych ww. formularza na podstawie analizy pliku CV w formacie PDF z wykorzystaniem modelu sztucznej inteligencji (Gemini).
- Generowanie przez backend aplikacji strony portfolio na podstawie danych wprowadzonych w formularzu. Generowana strona oparta jest o statyczne pliki HTML, CSS oraz JavaScript, umożliwiające hosting na dowolnym serwerze obsługującym strony statyczne. Do generowania strony zostanie użyty szablon zapewniający optymalizację pod wyszukiwarki (SEO), responsywność (RWD) i poprawne działanie na różnych rozdzielczościach ekranów (w tym Retina) i rodzajach urządzeń (smartfon, tablet, laptop, desktop).

# Unikalne cechy odróżniające webCV od konkurencji:
- Użycie analizatora CV AI nie będzie konieczne do wypełnienia formularza i wygenerowania strony, jest to tylko opcja. Użytkownik będzie mógł wygenerować stronę po samym ręcznym wypełnieniu danych generowanej strony, bez wrzucania PDF do analizy. To odróżnia webCV od konkurencji (np. Artfolio.tech, gdzie wrzucenie CV do analizy jest obowiązkowym krokiem przed przejściem do właściwego formularza danych strony).
- Wolność wyboru hostingu. To nie będzie SaaS, w którym będzie wymuszony hosting strony użytkownika na serwerach usługodawcy, po czasie wymagający płatności. Użytkownik sam będzie mógł wybrać swój hosting na którym postawi wygenerowaną stronę - generowane pliki strony będą statyczne (HTML, CSS, JS), w paczce ZIP, dostosowane go każdego współczesnego hostingu WWW. To również odróżnia webCV od konkurencji (Artfolio.tech wymusza ich infrastrukturę hostingową która może stać się płatna, Squarespace/Wix również działają w modelu SaaS).
- Zapewniona będzie przykładowa instrukcja uploadu plików na przykładowy hosting FTP. 

# Wstępny stack technologiczny:
Frontend: React + Typescript, Vite (SPA), HeroUI, react-hook-form, TanStack Router
Backend:
Core: NestJS + Typescript
Baza danych: Postgres na Supabase (na NestJS zarządzanie bazą z użyciem dedykowanych bibliotek Supabase)
Zarządzanie użytkownikami i autoryzacja przez usługę Supabase Auth zintegrowaną z samą bazą
Moduł analizy CV-PDF do formularza generowanej strony internetowej oparty o model z rodziny Google Gemini

# Key assumptions
- Font: Stack Sans Headline/Text (replace Inter)
- Theme: light only for now (simpler). use very light gray ’structured/paper’ background
- only Polish language (but i18next keys are nice to have)
- Color palette: base on gradient #1CB5E0-#000046
- Logo & lead image are in /src/assets

# Strona Główna / Landing Page
```
-------------------------------------
webCV logo        Zaloguj Zarejestruj
-------------------------------------
         Twoja wizytówka w sieci
           *z Twojego CV*
      (opis że to proste z AI)
    <Btn rozpocznij -> Zarejestruj>

         <IMAGE Lead>
Header should be GLOBAL - also in 404
```
# 404 Layout
```
===HEADER===

Nie znaleziono strony
<Btn powrót -> Home>
```
