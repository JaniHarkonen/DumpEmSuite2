export default function ScraperTab() {
  return (
    <div>
      <h3>Scraper configuration</h3>
      <form>
        <div>Scraper info</div>
        <button>Change scraper</button>
        <div>
        <span>Target: </span><input /><button>...</button>
        <span>Output: </span><input /><button>...</button>
        </div>
      </form>
      <h3>Results</h3>
      Scraper status; results
    </div>
  );
}
