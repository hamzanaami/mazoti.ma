# Sources and reading list

Compiled 18 Nov 2026. Status tags:

- `[verified]`: the primary document or its abstract was opened and the fact checked.
- `[seen]`: found in search results (title, abstract or snippet seen); not read in full.
- `[secondary]`: press report of a primary source; check the primary before relying on it.
- `[from memory]`: classic reference I know but did not retrieve this session. Confirm authors,
  year and journal before citing.

Start with section 1 and section 4: they are what the first modelling phase needs.

## 1. Primary data sources (Morocco)

| Source | What it gives | Status | Link |
|---|---|---|---|
| Conseil de la concurrence, reporting Q4 2025 (9th follow-up report) | Quarterly CIF, purchase cost, cession price, pump price, gross and net margins for nine distributors; fortnightly change analysis | `[verified]` | <https://conseil-concurrence.ma/wp-content/uploads/2026/06/Reporting-du-4eme-trimestre-de-lannee-2025-relatif-au-suivi-des-engagements-pris-par-les-societes-de-distribution-en-gros-du-gasoil-et-dessence-FR.pdf> |
| CC reporting Q1 2025 (6th) | Same format, earlier quarter; gross margins 0.86–1.46 MAD/L gasoil and 1.66–2.11 SSP by company | `[seen]` | <https://conseil-concurrence.ma/wp-content/uploads/2025/07/Rapport-FR-Reporting-du-1er-trimestre-2025-24072025.pdf> |
| CC reporting Q4 2024 (5th) | Price structure for Q4 2024 (purchase cost 54%/46%, taxes 31%/38% of pump price for gasoil/SSP) | `[seen]` | <https://conseil-concurrence.ma/wp-content/uploads/2025/04/Rapport-Reporting-FR-N°4-2025.pdf> |
| CC site (all reports) | Index of follow-up reports; more recent ones may exist | `[seen]` | <https://conseil-concurrence.ma> |
| Bank Al-Maghrib, cours de référence | Official USD/MAD and EUR/MAD. Method changed on 2 Jan 2024: rates now based on interbank transactions, published at 16:15 instead of around 12:30 | `[secondary]` for the change | <https://www.bkam.ma> and <https://www.fnh.ma/article/actualite-financiere-maroc/bam-nouvelle-methodologie-calcul-cours-de-change-reference-dh> |
| Third-party BAM rate API (not official) | JSON of BAM rates, free tier 300 requests a month | `[seen]` | <https://allratestoday.com/blog/bank-al-maghrib-exchange-rate-api/> |
| Office des Changes, monthly foreign trade indicators | Energy import bill; "gas-oils et fuel-oils" imports (57.0 bn MAD in 2024) | `[secondary]` | <https://www.oc.gov.ma> |
| Finance law (loi de finances), TIC provisions | Legal TIC amounts per litre | `[to verify]` (not yet opened) | PLF 2026 text seen at <https://ecoactu.ma/wp-content/uploads/2025/10/corps-PLF2026-fr.pdf> |
| Ministry of Energy Transition, Direction des hydrocarbures | Statistics and stock data. Press says detailed stock statistics are not published | `[secondary]` | see Médias24, 5 Mar 2026 (below) |

**Not found:** an official open dataset of pump prices (a citizen request on data.gov.ma asks
for one `[seen]`: <https://data.gov.ma/fr/feedback/mettre-disposition-en-open-data-les-prix-de-carburants-et-stations-services>).
We have to compile our own series.

## 2. Taxes and price structure

| Source | Use | Status |
|---|---|---|
| ecoactu.ma, "Flambée du gasoil…": TIC gasoil 2.42 MAD/L, SSP about 3.76; VAT 10% applies on TIC too. <https://ecoactu.ma/?p=255474> | TIC amounts used in `constants.py` | `[secondary]`, consistent with CC shares |
| Le360, "pourquoi le gouvernement rechigne à alléger la fiscalité": VAT 10% at import and again at the pump. <https://fr.le360.ma/economie/flambee-des-prix-a-la-pompe-pourquoi-le-gouvernement-rechigne-a-alleger-la-fiscalite-des-carburants_7NYEWTQCA5GWXAYZG56W7C6KMY/> | Tax mechanics | `[secondary]` |
| Hespress / Bladi on a minister's statement that TIC does not vary with prices. <https://fr.hespress.com/473224-473224.html> | TIC is fixed per litre | `[secondary]` |
| Médias24, parliamentary information mission report (2018). <https://medias24.com/2018/05/12/carburants-ce-que-dit-le-rapport-de-la-commission-parlementaire/> | Structure of prices, history after liberalisation | `[secondary]` |
| Bladi: price vs what the pre-2015 formula would give (April, about 2 MAD/L gap). <https://en.bladi.net/moroccan-fuel-prices-surge-above-pre-liberalization-levels,114050.html> | Legacy-formula benchmark idea | `[secondary]`; formula itself `[to verify]` |
| ESMAP, "A Phased Approach to Energy Subsidy Reform: Morocco Experience". <https://www.esmap.org/node/13180> | 2012–2015 reform sequence, indexation, liberalisation | `[seen]` |
| Bentour (2015), "On the removal of energy products subsidies in an importing oil country: impacts on prices in Morocco". <https://mpra.ub.uni-muenchen.de/63635/> | Pre-liberalisation structure | `[seen]` |

## 3. Market context and events

- 23 Nov 2023: CC settlements with nine distributors and their trade body, total 1,840,410,426 MAD,
  plus behavioural commitments. <https://fr.hespress.com/340704-340704.html> `[secondary]`
- CC follow-up coverage (margins, pass-through): Le360 on Q4 2025 margins
  <https://fr.le360.ma/economie/carburants-le-conseil-de-la-concurrence-devoile-les-marges-des-distributeurs_6RO2UICI45EC5FCANR3U7UO6VQ/>;
  North Africa Post on the March 2026 pass-through rates (diesel 69.5%, gasoline above 100%)
  <https://northafricapost.com/?p=95972>; TelQuel (AFP) on 1 Mar–16 May 2026
  <https://telquel.ma/instant-t/2026/06/02/carburants-la-pompe-marocaine-dans-le-sillage-des-marches-mondiaux_1991859/>. All `[secondary]`.
- Autumn 2026 prices: Le Matin on the 16 Nov 2026 revision
  <https://lematin.ma/economie/prix-des-carburants-lessence-baisse-de-50-centimes-et-le-gasoil-de-20/375828>;
  Le360 on gasoil above SSP
  <https://fr.le360.ma/economie/carburants-les-prix-repartent-a-la-baisse-des-lundi-le-gasoil-creuse-lecart-avec-lessence_SYNLY7ZWAVFEPITNTV6MWJRWI4/>. `[secondary]`
- Stocks and supply: Médias24, 5 Mar 2026
  <https://medias24.com/2026/03/05/produits-energetiques-disponibilite-stocks-importations-ce-que-lon-sait-sur-la-situation-du-maroc-1638429/>;
  Challenge.ma on stock days (47 gasoil, 49 SSP)
  <https://www.challenge.ma/energie-des-defis-strategiques-face-a-une-dependance-structurelle-322400/>. `[secondary]`

## 4. International price proxies (free)

The CC says Moroccan prices follow Platts refined-product quotations, with ARA as a main
reference. Platts is licensed, so we need free proxies and a calibration to the CC's CIF series.

| Source | Series | Caveat | Status |
|---|---|---|---|
| EIA spot prices | Brent, WTI, NY Harbor ULSD, RBOB, Gulf Coast, daily with free API | US hubs, not ARA; use mainly for direction and spread behaviour | `[verified]` page opened. <https://www.eia.gov/dnav/pet/pet_pri_spt_s1_d.htm> |
| FRED mirror of EIA | e.g. NY Harbor ULSD series | Same data | `[seen]` <https://fred.stlouisfed.org/data/MDFUELNYH> |
| EU Weekly Oil Bulletin | Weekly pump prices with and without taxes for all EU states since 2005; the older PDFs also showed Platts Rotterdam barge quotations | Confirm that the Rotterdam quotations are in the current history file | `[seen]` <https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en> |
| fuel-prices.eu | Convenient presentation of the Oil Bulletin | Third party; use the Commission files as the source | `[seen]` <https://www.fuel-prices.eu> |
| ICE gasoil and Brent futures | Closest free market price for diesel in Europe | Licence for historical data to check | `[to verify]` |
| Platts (S&P Global) | The reference itself | Paid licence; do not redistribute | n/a |

## 5. Prior art (Morocco)

- Mazote.ma, price comparator launched 2016 (about 780 stations at launch).
  <https://telquel.ma/2016/01/01/mazote-nouveau-comparateur-prix-carburants_1476165> `[seen]`.
  **Name very close to ours; check before we pick a domain or brand.**
- Mahatati, government app launched with the Groupement des pétroliers du Maroc (station prices).
  <https://fnh.ma/article/actualite-economique/le-gouvernement-lance-mahatati-l-application-de-comparaison-des-prix-du-carburant-en-temps-reel> `[seen]`.
  Whether it is still maintained is `[to verify]`.
- "Essence" app (crowdsourced prices, 2015). <https://www.wandaloo.com/autonews/marque/modele/l-application-essence_1er-comparateur-de-prix-de-carburants-au-maroc/1378.html> `[seen]`.
- None of these, as far as the search shows, explains pump price against purchase cost.

## 6. Academic: pass-through and asymmetry

| Reference | Why read it | Status |
|---|---|---|
| Borenstein, Cameron and Gilbert (1997), "Do Gasoline Prices Respond Asymmetrically to Crude Oil Price Changes?", QJE 112(1): 305–339. <https://www.nber.org/papers/w4138> | Template for our M2 and the stage-by-stage design | `[verified]` abstract |
| Meyer and von Cramon-Taubadel (2004), "Asymmetric Price Transmission: A Survey", J. Agricultural Economics 55(3): 581–611. <https://doi.org/10.1111/j.1477-9552.2004.tb00116.x> | Taxonomy of asymmetries and econometric methods | `[verified]` record |
| Eckert (2013), "Empirical Studies of Gasoline Retailing: A Guide to the Literature", J. Economic Surveys 27(1): 140–166 | Map of the whole literature | `[seen]` via IDEAS listing |
| Peltzman (2000), "Prices Rise Faster than They Fall", JPE 108(3): 466–502 | Cross-industry evidence on asymmetry | `[seen]` in a reference list |
| Bacon (1991), "Rockets and feathers", Energy Economics | Origin of the term (UK gasoline) | `[seen]` in a reference list |
| Cook and Fosten (2017), "Replicating Rockets and Feathers". <https://ueaeprints.uea.ac.uk/id/eprint/65763/1/Rockets_and_Feathers_06_11_17.pdf> | Replication check; how robust results are to data choices | `[seen]` |
| Asane-Otoo and Dannemann, "Rockets and Feathers Revisited: Asymmetric Retail Gasoline Pricing in the Era of Market Transparency". <https://iaee.org/en/publications/download-view.aspx?id=3904> | Temporal aggregation can distort conclusions: relevant to our fortnightly data | `[seen]` |
| Qiu and Zhang, "Rockets and Feathers in the Oil and Gasoline Markets: In-Depth Analysis of Three Asymmetries". <https://ageconsearch.umn.edu/record/344062/files/29388.pdf> | Regime (threshold) approach, M6 | `[seen]` |
| "Rockets and Feathers: Asymmetric Petroleum Product Pricing in Developing Countries" (review for regulators). <https://www.econbiz.de/Record/rockets-and-feathers-asymmetric-petroleum-product-pricing-in-developing-countries/10012574111> | Closest to our setting: regulators in import-dependent economies | `[seen]` |
| "La robustesse des tests de transmission asymétrique des prix en présence de changements structurels". <https://www.econbiz.de/Record/la-robustesse-des-tests-de-transmission-asym%C3%A9trique-des-prix-en-pr%C3%A9sence-de-changements-structurels/10008604344> | Asymmetry tests over-reject when there are breaks; informs section 5 of `02` | `[seen]` |
| Eckert (2002), "Retail price cycles and response asymmetry", Can. J. Economics 35(1). Eckert and West (2005), "Price uniformity and competition in a retail gasoline market", JEBO 56(2) | Price cycles and uniformity (our dispersion metrics) | `[seen]` in a reference list |
| OU Energy Institute survey of petroleum product price behaviour. <https://ou.edu/content/dam/price/energy%20institute/news/PetroProdPrices-Part1-9-11-2018.pdf> | Broad survey including causality direction | `[seen]` |
| Chatri, Maarouf and Ragbi (2016), exchange-rate pass-through to prices in Morocco, Global J. Management and Business Research | Morocco-specific pass-through background | `[seen]` |

## 7. Methods references

All `[from memory]`; verify before citing:

- Engle and Granger (1987), cointegration and error correction. Johansen (1991), system cointegration.
  Gregory and Hansen (1996), cointegration with a break.
- Granger and Lee (1989) and von Cramon-Taubadel and Loy (1996): asymmetric error correction.
  Enders and Siklos (2001): threshold cointegration.
- Shin, Yu and Greenwood-Nimmo (2014): nonlinear ARDL.
- Zivot and Andrews (1992): unit root with a break. Bai and Perron (1998, 2003): multiple breaks.
- Newey and West (1987): HAC standard errors.
- Maskin and Tirole (1988): Edgeworth price cycles.
- Hyndman and Athanasopoulos, *Forecasting: Principles and Practice* (free online): time series
  forecasting and evaluation, rolling-origin methods.
- Vovk et al. on conformal prediction (for nowcast intervals).

## 8. Gaps to close (research tasks)

1. Open the finance-law and customs texts for the exact TIC per product and effective dates.
2. Read the CC methodology section end to end: VAT treatment in the pass-through ratio, density
   used, whether fortnightly series are published, definition of purchase cost.
3. Reconstruct the legacy (pre-Dec 2015) price structure and its margins, for the "what the old
   formula would give" benchmark.
4. Find a free daily series close to Platts CIF Med/ARA for gasoil 10 ppm and gasoline 95
   (candidates: EU Oil Bulletin Rotterdam quotations, ICE futures).
5. Build the historical pump-price series since Dec 2015 and decide the reference city and brands.
6. Search French and Arabic academic literature for a Morocco-specific asymmetry study since 2016
   (the English search did not surface one).
7. Check the status of Mahatati and any station-price data the government publishes.
