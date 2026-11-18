# Data that could not be fetched (needs a person with a browser)

The build sandbox blocks these hosts, so none could be downloaded. Put downloads in
`data/raw/` (not committed) and tell Claude, or attach them to the chat.

| Priority | What | Where | Why |
|---|---|---|---|
| 1 | The CC follow-up report PDFs (all 9) and the 1 Jun 2026 note | <https://conseil-concurrence.ma> (listed in `data/reference/sources_manifest.csv`) | Verify the transcribed tables; chart values were read from labels |
| 1 | CC reports after Q4 2025 (Q1 and Q2 2026) if published | same | Extends the series to the March to May 2026 episode |
| 1 | Daily or weekly ARA diesel and gasoline quotations (Platts or a licensed/open proxy) | Own subscription, or EU Weekly Oil Bulletin history file <https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en> | Replaces the CC's fortnightly CIF with a daily cost series |
| 1 | Pump prices by date since 2015 (official revision notices or a price history) | Ministry of Energy Transition, press releases, or a site that archives them | The pump series is the target variable |
| 2 | Bank Al-Maghrib reference USD/MAD and EUR/MAD, daily | <https://www.bkam.ma> (Cours de change > Cours de référence) | Convert USD/t to MAD/L |
| 2 | EIA daily spot series (NY Harbor ULSD, Brent) | <https://www.eia.gov/dnav/pet/pet_pri_spt_s1_d.htm> | Direction check and long history |
| 2 | Finance-law text giving TIC per litre, current and past years | SGG / PLF 2026 PDF | Constants `TIC_GASOIL` and `TIC_SSP` are press-reported |
| 3 | Office des Changes monthly trade indicators (energy imports) | <https://www.oc.gov.ma> | Cross-check CC import values |
| 3 | Diesel and gasoline density (kg/L) used by Moroccan customs | Customs or Ministry | Unit conversion |
