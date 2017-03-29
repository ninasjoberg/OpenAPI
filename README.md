# OpenAPI

Nina Sjöberg
Kurs: JavaScript 2, Nackademin ht 16 - vt17

Länk till appen/sidan: http://openapi.surge.sh/

Denna applikation ger dig den viktigaste informationen du behöver på morgonen när du vaknar, allt på ett ställe. Du kan kolla vädret efter sökning på 'location' eller få väder baserat på din nuvarande position. Du får även en slumpad senaste nyhet från New Yourk times, vill du se fler nyheter kan du trycka på 'update news'. Jag vaknar ofta till en antal pushnotiser med nyheter om skjutningar och terrordåd, jag går sen också ofta in och kollar dagens väder i någon av mina väderappar. Detta gör en inte alltid på så gott humör, därför visar min app även en sektion med "dagens katt" för att du ska ha en chans till att starta dagen med ett gott humör. 

Till denna applikation har använts:

Vanilla JavaScript
Fetch - för requests till api-erna
Bootstrap för css
Design pattern: Revealing Module patter

Dessa api:er har använts:

openweathermap - för att få ut info om vädret: http://openweathermap.org/api
The New Yourk Times api -  för att få ut nyheter: https://developer.nytimes.com/
imgur - för att hämta ut biler på katter: https://api.imgur.com/


Jag hade många planer och ideer inför denna uppgift, men jag hade svårt att hitta api:er som var användbara för ändamålet. Jag bestämde mig därför sen att använda Smhi:s api för att ta ut väder och sedan ge aktivitetstips baserade på vädret. Jag hade då hoppats att kunna anväda yelp's api eller google places, men insåg sedan att båda dessa bara gick att använda server-side. Smhi:s api var inte heller särskilt pasande frö upgiften då det bara gick att hämta hem ett reguest med all info. Så jag tänkte om igen, bestämde mig frö att använda openweathermap's api där man kan få ut mer indformation och ställa mer specifika requests. Sen kollade jag helt enkelt på vilka api:er det fanns att tillgå som passade denna upgift, jag hittade times api och iden till min slutgiltiga produkt kom till. Tyvärr så kan openweathermap inte anropas över https (om man inte betalar massa pengar), det grå därför inte att använda denna app i gh-pages. Se ist. länk till sidan ovan. 

