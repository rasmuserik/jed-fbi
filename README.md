Stikprøve af bibliografiske datas brug af JED-formatet, – samt noter

# Noter om JED (bibliografiske format).

Jeg har kigge lidt på JED-formatet, og her er nogle noter om dette:

1. Generelt indtryk
2. Små idéer/forslag til forbedringer
3. Stikprøve med bibliografiske data for at se hvilke felter der benyttes praksis

## Generelt indtryk

JED-formatet er et stort fremskridt.  Data rigere end hvad man man får ud af openplatform<small>(simpel/direkte mapping fra DKABM til JSON-LD)</small>.  https://fbi-api.dbc.dk/ gør det let at udforske/eksperimentere med data.

Formatet ser ud til at være under udvikling, – med kun 3 måneders garanteret stabilitet fra deprecation notice til ting fjernes. Changelog for ændringer(https://fbi-api.dbc.dk/documentation#Changelog) er heldigvis let at finde.

Jeg bemærker at der er små forskelle mellem `https://danbib.dk/jed/mapping` og `https://fbi-api.dbc.dk/schema` stemmer overens. Der er er små forskelle, eksempelvis `agencyId`, `gamePlatform` og `universes`.

Alt i alt er det et godt dataformat, som er let at gå til. 
Tror at det er godt med et nyt format, som virker til at bygge på / mappe fra både MARC og DKABM, – og samtidigt er let at bruge.

## Små idéer/forslag til forbedringer

- Måske burde `edition.edition` være `null` i stedet for tom streng, hvis der ikke er nogle data, – for at være konsistent med resten af formatet.
- Det ville være rart hvis dokumentationen kunne læses, uden at man skal finde token (Docs/Voyager/Schema på fbi-api.dbc.dk). Da dette er det bedste sted at læse om JED-formatet.
- Automatisk tjek af forskelle mellem `https://danbib.dk/jed/mapping` og `https://fbi-api.dbc.dk/schema`.
- Det vil være rart med øget stabilitets-perioden eller en LTS-version (evt. for en delmængde af felterne), så man ikke skal tjekke for ændringer hvert kvartal. Gætter på at dette kommer automatisk, når Next går i luften, ifht. DDB-CMS typiske udviklingskadance.
- Måske kan `creatorsFromDescription` bruges til at uddybe metadata i `contributors[].roles[]` Eksempelvis i filmatisering af Harry Potter (`870970-basis:24229157`), er `roles` under `contributors` tom for J.K. Rowling, Steve Kloves, og John Seale, men informationer om deres roller ligger under "creatorsFromDescription".
- Måske kan `series[].members[].numberInSeries` bruges til at forbedre værkmatch. Eksempelvis er værkerne `work-of:870970-basis:27091423` og `work-of:870970-basis:28995938` er begge nummer 5 og ser umiddelbart ser begge ud til at være samme værk, – og lignende situation dukker op ved de øvrige værker i serien.
- Curl-kommandoen fra https://fbi-api.dbc.dk/documentation virkede ikke med mit client-id. Jeg fik fejlen `{"error":"server_error","error_description":"Server error: missing client 'grants'"}`.  I stedet hentede jeg bare token som beskrevet på https://openplatform.dbc.dk/v3/.  Forskellen var om token blev hentet fra `https://login.bib.dk/oauth/token` eller `https://auth.dbc.dk/oauth/token`, så måske skal dette ændres i dokumentationen.

## Stikprøve med bibliografiske data for at se hvilke felter der benyttes praksis

Herunder er en hurtig oversigt over hvor ofte forskellige dele af JED-formatet bliver brugt i praksis, baseret på en stikprøve.  Oversigten er nyttig ifht. hvilke data man skal tage højde for.

Det kunne være interessant have værktøj, der gør det muligt at udforske brugen af formatet i flere detaljer, hvis der er interesse for dette.
Jeg nåede ikke at få alle detaljer er med (eksempelvis mangler detaljer om ophav/person, access, etc.), og det kunne også være rart med statistik over de mest populære værdier(nøgleorde, materialetype, forfatter, ...), og på et større statistisk grundlag. Jeg har lyst til, at lave et mere brugervenligt værktøj, hvor man kan gå på opdagelse i statistikken over hvilke data der forekommer i praksis, – hvis der er interesse for det?

<!-- på ca. 738.000 poster (heraf 426K katalog-poster og 170K basisposter). Stikprøven er fundet ved at hente værker og relaterede poster til 80K tilfældige PID'er, der blev vist i DDB-CMS i november 2023.-->

- 100% workType
- 100% materialTypes
- 100% source
- 100% ownerWork
- 100% pid
- 100% recordCreationDate
- 100% fictionNonfiction
- 100% titles.full, title.main
    - 18.5% titles.original
    - 14.8% titles.alternative
    - 1.4% titles.standard
    - <0.5% titles.* øvrige
- 100% audience.childrenOrAdults
    - 25.5% audience.primaryTarget
    - 15.3% audience.ages
    - 15.3% audience.generalAudience
    - 6.4% audience.librayRecommendation
    - 5.2% audience.schoolUse
    - 3.5% audience.lix
    - 1.1% audience.let
- 99.9% cover.detail/thumbnail (default-forside eller faktisk forside)
    - 15.4% `cover.detail_NNNN` med faktisk forside
- 99.0% edition, heraf
    - 100% edition.summary – sammenfatter nedenstående
    - 99% edition.publicationYear.year
        - 2.2% edition.publicationYear.frequency
        - 0.6% edition.publicationYear.endYear
    - edition.edition (tom streng i stedet for null hvis ingen data)
    - 1.1% edition.contributors:
    - 0.5% edition.note
- 98.0% languages.main, heraf
    - 24.7% languages.original
    - 3.9% languages.notes
    - 2.2% languages.subtitles
    - 0.9% languages.spoken
    - 0.5% languages.abstract
    - 0.5% languages.parallel
- 93.9% creators, heraf
    - 74.1% creators.roles
- 85.8% physicalDescription, heraf
    - 100% summary
    - 84.6% extent
    - 83.6% numberOfPages
    - 40.4% additionalDescription
    - 14.4% size
    - 11.5% numberOfUnits
    - 9.4% playingTime
    - 3.2% technicalInformation
    - 2.7% accompanyingMaterial
    - 0.4% requirements
    - 0% textVsIllustrations
- 81.5% publisher
- 76.8% classifications (primært DK5, men også UDC)
- 75.0% identifiers
- 64.0% subjects.all
- 61.3% genreAndForm
- 58.3% catalogueCodes.otherCatalogue
- 57.5% catalogueCodes.nationalBibliography
- 57.1% subjects.dbcVerified
- 54.9% abstract
- 50.7% notes
- relations.*
    - 48.8% hasReview
    - 23.6% hasCreatorDescription
    - 16.7% isReviewOf
    - 11.4% isPartOfManifestation
    - 4.4% hasAdaptation
    - 3.6% hasReusedReview
    - 1.8% isReusedReviewOf
    - 1.3% hasAnalysis
    - 0.6% hasSoundtrack, isAdaptionOf
    - <0.2%: continuedIn, continues, discussedIn, discusses, hasDescriptionFromPublisher, hasManuscript, hasTrack, isAnalysisOf, isDescriptionFromPublisherOf, isManuscriptOf, isPartOfAlbum, isSoundtrackOfGame, isSoundtrackOfMovie
- 42.1% creatorsFromDescription
- 40.3% shelfmark
- 36.3% contributors, heraf:
    - 59.2% contributors.roles
- 30.1% series
- 28.6% latestPrinting, heraf
    - 100%: summary, publicationYear, printing
    - 0.9%: publisher
- 23.0% dateFirstEdition
- 15.7% tableOfContents
- 14.9% workYear
- 11.7% hostPublication, heraf:
    - >90%: .summary, .issn, .issue, .title, .year.display .year.year
    - <0.1%: .creator, .edition, .notes, .pages, .publisher, .series, .year.endYear, .year.frequency
- 5.9% relatedPublications
- 5.4% review.reviewByLibrarians
- 3.2% universes
- 2.8% review.rating
- 2.7% volume
- 2.3% manifestationParts
