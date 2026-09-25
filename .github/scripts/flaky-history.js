// Adds Allure historical results for each flaky test to the job summary.
// Reads flaky-report/*.json (from smoke/regression jobs) and the generated allure-report.
const fs = require('fs');
const path = require('path');

const reportDir = process.argv[2] || 'allure-report';
const flakyDir = 'flaky-report';
const casesDir = path.join(reportDir, 'data', 'test-cases');

const flaky = fs.existsSync(flakyDir)
  ? fs
      .readdirSync(flakyDir)
      .filter((f) => f.endsWith('.json'))
      .flatMap((f) => JSON.parse(fs.readFileSync(path.join(flakyDir, f), 'utf8')).flaky)
  : [];
if (!flaky.length) {
  console.log('No flaky tests, skipping history');
  process.exit(0);
}

const cases = fs.existsSync(casesDir)
  ? fs.readdirSync(casesDir).map((f) => JSON.parse(fs.readFileSync(path.join(casesDir, f), 'utf8')))
  : [];

const lines = ['### Allure history of flaky tests', '', '| Test | Previous runs | Latest history |', '|---|---|---|'];
for (const t of flaky) {
  const title = t.name.split(' › ').pop();
  const c = cases.find((x) => x.name === title || (x.fullName || '').includes(title));
  const h = c && c.extra && c.extra.history;
  if (!h) {
    lines.push(`| ${t.name} | no history yet | — |`);
    continue;
  }
  const s = h.statistic || {};
  const items = (h.items || []).slice(0, 10).map((i) => i.status).join(', ') || '—';
  lines.push(
    `| ${t.name} | ${s.passed || 0} passed / ${s.failed || 0} failed / ${s.broken || 0} broken (of ${s.total || 0}) | ${items} |`,
  );
}
const out = lines.join('\n') + '\n';
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, out);
else console.log(out);
