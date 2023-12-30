# Noter om JED (bibliografiske format).

## Generelle Noter

Data rigere end hvad man man får ud af openplatform. <small>(Openplatform er simpel automatisk mapping fra DKABM til JSON-LD, – hvorimod JED er en kurateret mapping fra både MARC og DKABM, hvilket i mine øjne fungerer bedre).</small>

Umiddelbart ser der ud til at der er enkelte små forskelle mellem `https://danbib.dk/jed/mapping` og `https://fbi-api.dbc.dk/schema`, – eksempelvis `agencyId`, `gamePlatform` og `universes` under JED-manifestation. Måske kunne man tjekke automatisk at disse stemmer overens.

Det var let at hente token som beskrevet på https://openplatform.dbc.dk/v3/
(Til gengæld virkede curl-kommandoen fra https://fbi-api.dbc.dk/documentation ikke med mit client-id. Jeg fik fejlen `{"error":"server_error","error_description":"Server error: missing client 'grants'"}`, når jeg prøvede at hente token fra `https://login.bib.dk/oauth/token` i stedet for `https://auth.dbc.dk/oauth/token`).

https://fbi-api.dbc.dk/graphiql gør det let at udforske/eksperimentere med data.

Et forbehold ved JED er, at det kan ændres løbende, og kun garanterer 3 måneders stabilitet af formatet. Jeg håber at stabilitets-perioden øges senere, og at der måske kommer en LTS version på et tidspunkt (eksempelvis for en delmængde af felterne), så man ved hvilke felter man kan regne med, og ikke skal tjekke for ændringer hvert kvartal. Rigtigt godt at der er veldokumenteret changelog for ændringer (https://fbi-api.dbc.dk/documentation#Changelog), hvilket var noget af det første jeg ledte efter.

## Undersøgelse af konkrete data


Herunder er en oversigt over hvor ofte forskellige dele af JED-formatet bliver brugt i praktiske data. Baseret på stikprøve på ca. 738.000 poster (heraf 426K katalog-poster og 170K basisposter). Stikprøven er fundet ved at hente værker og relaterede poster til 80K tilfældige PID'er, der blev vist i DDB-CMS i november 2023.

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



## Mindre detaljer/idéer

Måske kunne contributors[].roles[] uddybes. Eksempelvis i filmatisering af Harry Potter (`870970-basis:24229157`), er `roles` under `contributors` tom for J.K. Rowling, Steve Kloves, og John Seale, men informationer om deres roller ligger under "creatorsFromDescription" og måske er det også tilgængeligt via felt.

Mindre detalje: Måske kan `series[].members[].numberInSeries` bruges til at forbedre værkmatch. Eksempelvis er værkerne `work-of:870970-basis:27091423` og `work-of:870970-basis:28995938` er begge nummer 5 og ser umiddelbart ser begge ud til at være samme værk, – og lignende situation dukker op ved de øvrige værker i serien.
