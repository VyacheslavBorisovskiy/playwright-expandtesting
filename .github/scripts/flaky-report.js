// Collects flaky tests (failed, then passed on retry) from the Playwright JSON report.
// Writes a job summary, ::warning annotations and flaky-report/flaky-<label>.json.
const fs = require('fs');
const os = require('os');
const path = require('path');

const file = process.argv[2] || 'playwright-json/results.json';
const label = process.argv[3] || 'tests';
const MAX_ERROR = 1500;

const setOutput = (k, v) =>
  process.env.GITHUB_OUTPUT && fs.appendFileSync(process.env.GITHUB_OUTPUT, `${k}=${v}\n`);

if (!fs.existsSync(file)) {
  console.log(`No JSON report at ${file}, skipping flaky check`);
  setOutput('has_flaky', 'false');
  process.exit(0);
}

const ANSI = new RegExp(String.fromCharCode(27) + '\\[[0-9;]*m', 'g');
const stripAnsi = (s = '') => s.replace(ANSI, '');
const rel = (p) => (p ? path.relative(process.cwd(), p) : p);
const secs = (ms) => `${(ms / 1000).toFixed(1)}s`;

const report = JSON.parse(fs.readFileSync(file, 'utf8'));
const flaky = [];

const collect = (spec, test, titles) => {
  const attempts = test.results.map((r) => ({
    retry: r.retry,
    status: r.status,
    duration: r.duration,
    error: r.error ? stripAnsi(r.error.stack || r.error.message || '').slice(0, MAX_ERROR) : null,
    attachments: (r.attachments || [])
      .filter((a) => a.path)
      .map((a) => ({ name: a.name, type: a.contentType, path: rel(a.path) })),
  }));
  const firstFailure = attempts.find((a) => a.status !== 'passed');
  const pick = (re) =>
    attempts.flatMap((a) => a.attachments.filter((x) => re.test(x.name) || re.test(x.type)));
  flaky.push({
    name: [...titles, spec.title].join(' › '),
    file: spec.file,
    line: spec.line,
    status: test.status,
    browser: test.projectName,
    attempts,
    error: firstFailure && firstFailure.error,
    totalDuration: attempts.reduce((s, a) => s + a.duration, 0),
    screenshots: pick(/screenshot|image\/png/i).map((a) => a.path),
    videos: pick(/video/i).map((a) => a.path),
    traces: pick(/trace/i).map((a) => a.path),
  });
};

const walk = (suite, titles) => {
  const p = suite.title && suite.title !== suite.file ? [...titles, suite.title] : titles;
  for (const spec of suite.specs || [])
    for (const test of spec.tests || []) if (test.status === 'flaky') collect(spec, test, p);
  for (const child of suite.suites || []) walk(child, p);
};
for (const suite of report.suites || []) walk(suite, []);

const environment = {
  baseUrl: process.env.BASE_URL || '(default from config)',
  ci: !!process.env.CI,
  os: `${os.type()} ${os.release()}`,
  node: process.version,
  runId: process.env.GITHUB_RUN_ID,
  branch: process.env.GITHUB_REF_NAME,
  commit: process.env.GITHUB_SHA,
  suite: label,
};

fs.mkdirSync('flaky-report', { recursive: true });
fs.writeFileSync(`flaky-report/flaky-${label}.json`, JSON.stringify({ environment, flaky }, null, 2));

const lines = [`### Flaky tests (${label}): ${flaky.length}`, ''];
if (!flaky.length) {
  lines.push('None');
} else {
  lines.push(
    `**Environment:** ${environment.os}, Node ${environment.node}, base URL \`${environment.baseUrl}\`, CI: ${environment.ci}`,
    '',
    `Screenshots, videos and traces are in the \`flaky-artifacts-${label}\` artifact. Open a trace with \`npx playwright show-trace <trace.zip>\`.`,
    '',
  );
  for (const t of flaky) {
    lines.push(
      `#### ${t.name}`,
      `- **Status:** ${t.status} · **Browser:** ${t.browser} · **Total duration:** ${secs(t.totalDuration)}`,
      `- **Location:** ${t.file}:${t.line}`,
      `- **Attempts:** ${t.attempts.map((a) => `#${a.retry} ${a.status} (${secs(a.duration)})`).join(' → ')}`,
      `- **Screenshot:** ${t.screenshots.map((p) => `\`${p}\``).join(', ') || '—'}`,
      `- **Video:** ${t.videos.map((p) => `\`${p}\``).join(', ') || '—'}`,
      `- **Trace (retry):** ${t.traces.map((p) => `\`${p}\``).join(', ') || '—'}`,
      '',
      '<details><summary>Error / stack trace of first failure</summary>',
      '',
      '```',
      t.error || '(no error captured)',
      '```',
      '</details>',
      '',
    );
    console.log(
      `::warning file=${t.file},line=${t.line}::Flaky test: ${t.name} [${t.browser}] failed ${t.attempts.filter((a) => a.status !== 'passed').length}x before passing`,
    );
  }
}

if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, lines.join('\n') + '\n');
} else {
  console.log(lines.join('\n'));
}
setOutput('has_flaky', flaky.length ? 'true' : 'false');
