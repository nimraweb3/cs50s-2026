# Trade Performance Analyzer

#### Video Demo: 

#### Description:

This is a command-line Python tool that reads your trading history (exported as a CSV or HTML file from platforms like MT5, cTrader, Binance, or TradingView) and turns it into a clean, visual HTML report showing how you're actually performing as a trader.

Instead of manually calculating win rate, profit factor, or checking which setups work best, you just run one command and get a full report you can open in your browser.

## What it does

- Reads your trade history file (CSV or HTML)
- Calculates key stats: win rate, profit factor, expectancy, average R:R, max drawdown, win/loss streaks
- Breaks down your performance by:
  - Trading session (Asia, London, NY)
  - Symbol/instrument (e.g. NAS100, XAUUSD)
  - Day of week
  - Month
  - Setup/strategy (based on whatever you wrote in the comment/notes field of each trade)
- Generates one HTML report with charts and tables — no internet needed to view it

## How to use it

1. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

2. Run the analyzer on your trade history file:
   ```
   python analyzer.py --input your_file.csv
   ```
   or with an HTML file:
   ```
   python analyzer.py --input your_file.html
   ```

3. The report opens automatically in your browser. You can also find it saved at `output/report.html`.

4. Don't have your own data yet? Try it with the included sample:
   ```
   python analyzer.py --input sample_data/sample_trades.csv
   ```

## Project structure

```
trade-analyzer/
├── analyzer.py                # run this — the main command-line program
├── trade_analyzer/
│   ├── parser.py               # reads and cleans up the CSV/HTML file
│   ├── metrics.py              # calculates win rate, drawdown, streaks, etc.
│   ├── charts.py               # builds the charts
│   ├── report.py               # puts it all together into one HTML file
│   └── templates/               # the HTML/CSS design of the report
├── sample_data/                 # example trade files to test with
└── requirements.txt
```

## What I built this with

- **Python** — the whole program
- **pandas** — reading and organizing the trade data
- **BeautifulSoup** — reading data out of HTML file exports
- **Plotly** — the charts in the report
- **Jinja2** — filling in the HTML report template with the calculated data
