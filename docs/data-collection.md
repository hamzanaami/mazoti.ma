# Collecting station prices (Casablanca and Rabat)

Goal: a trustworthy fortnightly series of pump prices by brand and city. Why it matters is in
`docs/theory/03-data-analysis-methods.md` (sections 1, 6, 7).

## What to record

One row per station, product and visit. Template: `templates/station_prices_template.csv`.

| Column | Rule |
|---|---|
| `date`, `time` | `YYYY-MM-DD`, `HH:MM` (24 h), when you read the pump |
| `city` | `Casablanca` or `Rabat` |
| `brand` | Afriquia, Petrom, Shell, TotalEnergies, Winxo, Ziz, or Other |
| `station_name`, `address` | Same station name every visit; address once is enough |
| `product` | `gasoil` or `ssp95` |
| `price_mad_per_l` | Dot decimal, 2 decimals, e.g. `16.70` |
| `photo_file` | Optional, photo of the price board (best evidence) |
| `notes` | Optional (promo, price board unclear, etc.) |

## When

- Prices are revised on the 1st and 16th. Read **the day after** each revision (stations can lag),
  and ideally also just **before** to capture the old price.
- Keep the **same stations** each time, 1 to 2 per brand and city, so changes are comparable.
- Record both products at each station.

## Checking your file

```bash
python3 scripts/validate_station_prices.py data/raw/station_prices.csv
```

Errors (wrong format, impossible price) must be fixed. Warnings (duplicates, jumps above 2.5 MAD,
a spread above 1 MAD between brands the same day, readings before 08:00 on a revision day) are
prompts to double-check. Put your file in `data/raw/`; it is git-ignored on purpose.

## Using the data

Station readings feed the dispersion and synchronisation metrics and serve as a second source for
the national series. They do not give purchase costs or margins; those come from Competition Council
reports and cost proxies (`docs/sources.md`).
