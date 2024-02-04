# Train controller
DV1677 JavaScript-baserade webbramverk.

## Installera och kör igång

## Säkerhetsgranskning och Åtgärder
Under granskning av koden kom vi fram till att det fanns ett antal säkerhetsbrister. Dessa är listade nedan tillsammans med åtgärder som vidtagits för att åtgärda dem.

### Identifierade Sårbarheter:

#### 1. debug (Allvarlighetsgrad: hög):
- **Inefficient Regular Expression Complexity vulnerability.** - [Detaljer](https://github.com/advisories/GHSA-9vvw-cc9w-f27h)
- **Regular Expression Denial of Service.** - [Detaljer](https://github.com/advisories/GHSA-gxpj-cx7g-858c)

#### 2. fresh (Allvarlighetsgrad: hög):
- **Regular Expression Denial of Service.** - [Detaljer](https://github.com/advisories/GHSA-gxpj-cx7g-858c)

#### 3. mime (Severity: moderate):
- **Regular Expression Denial of Service when MIME lookup performed on untrusted user input.** - [Detaljer](https://github.com/advisories/GHSA-wrvr-8mpx-r7pp)

#### 4. ms (Severity: moderate):
- **Vercel ms Inefficient Regular Expression Complexity vulnerability.** - [Detaljer](https://github.com/advisories/GHSA-w9mr-4mfr-499f)

#### 5. node-fetch (Severity: high):
- **Vulnerable to Exposure of Sensitive Information to an Unauthorized Actor.** - [Detaljer](https://github.com/advisories/GHSA-r683-j2x4-v87g)

#### 6. qs (Severity: high):
- **Prototype Pollution Protection Bypass.** - [Detaljer](https://github.com/advisories/GHSA-gqgv-6jq5-jjj9)
- **Vulnerable to Prototype Pollution.** - [Detaljer](https://github.com/advisories/GHSA-hrpp-h998-j3pp)

#### 7. semver (Severity: moderate):
- **Vulnerable to Regular Expression Denial of Service.** - [Detaljer](https://github.com/advisories/GHSA-c2qf-rxjj-qqgw)

### Åtgärder:
Alla identifierade sårbarheter åtgärdades med hjälp av kommandot `npm audit fix`. Efterföljande kontroller med `npm audit` efter åtgärderna rapporterade noll sårbarheter. Vi ser till att hålla våra paket uppdaterade och regelbundet kontrollerade för att upprätthålla säkerheten och integriteten i vår applikation.

## Val av ramverk
Vi har valt att använda React, framför allt av taktiska skäl. Det är störst, vi märker att arbetsgivare ofta efterfrågar React och det finns ett stort community-stöd vilket gör att det finns massor av färdiga komponenter och möjlighet att alltid hitta svar på sina frågor. Dessutom har vi använt det lite (med betoning på lite) tidigare. Vue och Angular upplever vi som bökiga, och valet stod därför mellan React och Svelte. Vi var båda sugna på Svelte då det verkar väldigt trevligt att jobba med. Vi gillar också att det kompilerar till javascript-kod vilket ger små och snabba applikationer. I slutändan kände vi dock att det behöver växa en del innan vi satsar på det. Vi vill skapa så bra förutsättningar som möjligt att landa första jobbet!
