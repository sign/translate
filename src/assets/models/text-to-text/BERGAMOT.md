# Clone repo

```bash
git clone https://github.com/mozilla/firefox-translations-training.git
cd firefox-translations-training
```

# Edit Makefile (TODO automate)

- Set SHARED_ROOT to data directory
- Set NUM_GPUS = 4 or however many the machine has

# TODO edit `configs/config.prod.yml`, and change: (TODO automate)

- train a `word level` vocab for SignWriting, and force it (https://github.com/google/sentencepiece)
- `src` and `trg` to `spoken` and `signed`
- `train`, `devtest` and `test` datasets
- `mono-src` and `mono-trg`

# Perform installation and updates

```bash
make conda
make snakemake
make git-modules
```

# Dry run

```bash
export PATH=$(conda info --base)/bin/:$PATH
make dry-run
```
