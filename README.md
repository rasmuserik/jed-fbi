# Noter JED (bibliografiske format).

Formålet med dette projekt er at undersøge JED-formatet (og FBI-api'et).

Plan for indhold er:

- [ ] Overblik og overvejelser om formatet og FBI-api'et
- [ ] Kig på konkrete data (repræsentativt for hvad der vises i DDB-CMS).
- [ ] Sammenligning og mapping til Schema.org
- [ ] Mapping til simpelt tag-baseret format


## Første blik på API og dataformatet

Det var let at hente token som beskrevet på https://openplatform.dbc.dk/v3/
(Til gengæld virkede curl-kommandoen fra https://fbi-api.dbc.dk/documentation ikke med mit client-id. Jeg fik fejlen `{"error":"server_error","error_description":"Server error: missing client 'grants'"}`, når jeg prøvede at hente token fra `https://login.bib.dk/oauth/token` i stedet for `https://auth.dbc.dk/oauth/token`).

https://fbi-api.dbc.dk/graphiql gør det let at udforske/eksperimentere med data.

Data rigere end hvad man man får ud af openplatform. <small>(Openplatform er simpel automatisk mapping fra DKABM til JSON-LD, – hvorimod JED er en kurateret mapping fra både MARC og DKABM, hvilket i mine øjne fungerer bedre).</small>

Umiddelbart ser der ud til at der er enkelte små forskelle mellem `https://danbib.dk/jed/mapping` og `https://fbi-api.dbc.dk/schema`, – eksempelvis `agencyId`, `gamePlatform` og `universes` under JED-manifestation. Måske kunne man tjekke automatisk at disse stemmer overens.

Et forbehold ved JED er, at det kan ændres løbende, og kun garanterer 3 måneders stabilitet af formatet. Jeg håber at stabilitets-perioden øges senere, og at der måske kommer en LTS version på et tidspunkt (eksempelvis for en delmængde af felterne), så man ved hvilke felter man kan regne med, og ikke skal tjekke for ændringer hvert kvartal. Rigtigt godt at der er veldokumenteret changelog for ændringer (https://fbi-api.dbc.dk/documentation#Changelog), hvilket var noget af det første jeg ledte efter.

<small>Mindre detalje/idé: måske kunne contributors[].roles[] uddybes. Eksempelvis i filmatisering af Harry Potter (`870970-basis:24229157`), er `roles` under `contributors` tom for J.K. Rowling, Steve Kloves, og John Seale, men informationer om deres roller ligger under "creatorsFromDescription" og måske er det også tilgængeligt via felt.</small>

<small>Mindre detalje: Måske kan `series[].members[].numberInSeries` bruges til at forbedre værkmatch. Eksempelvis er værkerne `work-of:870970-basis:27091423` og `work-of:870970-basis:28995938` er begge nummer 5 og ser umiddelbart ser begge ud til at være samme værk, – og lignende situation dukker op ved de øvrige værker i serien.</small>



## Overvejelser om formatet og FBI-api'et.


Når jeg kigger på `https://danbib.dk/jed/mapping`


## Bugs, roadblocks, etc.


```
curl --user "${CLIENT_ID}:${CLIENT_SECRET}" -X POST https://login.bib.dk/oauth/token -d "grant_type=password&username=@&password=@"
```

kommer fejlen:

```
{"error":"server_error","error_description":"Server error: missing client `grants`"}
```




Changelog over formatændringer er her: https://fbi-api.dbc.dk/documentation#Changelog

## Konkrete data

For at se hvilke felter der benyttes, laver jeg et udtræk af værk-poster ud 100.000 PID'er. PID'erne er udvalgt ud fra hvad der faktisk vises i DDB-CMS(fra webtrekk-statistik).

Jeg henter data ud via FBI-api'et.





Exploration of the JED-bibliographical format (and the FBI api).

Plan:

- [ ] Extract sample data (based on what is typically shown in DDB-CMS)
- [ ] 
- [ ] Mapping of JED to Schema.org
- 






