import importlib.util
from pathlib import Path

spec = importlib.util.spec_from_file_location(
    "v", Path(__file__).parent.parent / "scripts" / "validate_station_prices.py")
v = importlib.util.module_from_spec(spec); spec.loader.exec_module(v)
TEMPLATE = Path(__file__).parent.parent / "templates" / "station_prices_template.csv"


def test_template_has_no_errors():
    errs, warns = v.validate(TEMPLATE)
    assert errs == []
    assert any("example row" in w for w in warns)


def test_bad_rows_are_caught(tmp_path):
    f = tmp_path / "x.csv"
    f.write_text(",".join(v.COLUMNS) + "\n"
                 "2026-11-16,09:30,Fes,Afriquia,S1,addr,gasoil,16.70,,\n"
                 "2026-11-16,09:30,Rabat,Afriquia,S1,addr,gasoil,1670,,\n")
    errs, _ = v.validate(f)
    assert len(errs) == 2
