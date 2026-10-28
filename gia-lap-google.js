// Giả lập Google Apps Script + Trang tính để chạy thử đồng bộ trên máy, dùng đúng đoạn mã gsCode trong index.html.
// Chạy: node sao-cho-be/gia-lap-google.js sao-cho-be/index.html  (cổng 8766; xem dữ liệu ở http://localhost:8766/dump)
const fs = require('fs'), http = require('http');
const html = fs.readFileSync(process.argv[2], 'utf8');
const code = html.match(/<script type="text\/plain" id="gsCode">([\s\S]*?)<\/script>/)[1];
const sheets = {};
function Sheet(name) {
  const rows = [];
  const rng = (r, c, nr, nc) => ({
    getValues: () => Array.from({ length: nr }, (_, i) => Array.from({ length: nc }, (_, j) => (rows[r - 1 + i] || [])[c - 1 + j] ?? '')),
    setValues: v => v.forEach((row, i) => { rows[r - 1 + i] = rows[r - 1 + i] || []; row.forEach((x, j) => rows[r - 1 + i][c - 1 + j] = x instanceof Date ? x.toISOString() : x); }),
    setNumberFormat() {},
  });
  return { rows, getLastRow: () => rows.length, getRange: (r, c, nr, nc) => typeof r === 'string' ? rng(1, 1, 0, 0) : rng(r, c, nr, nc),
    appendRow: v => rows.push(v), setFrozenRows() {} };
}
const SpreadsheetApp = { getActiveSpreadsheet: () => ({ getSheetByName: n => sheets[n], insertSheet: n => (sheets[n] = Sheet(n)) }) };
const LockService = { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) };
const ContentService = { MimeType: { JSON: 'json' }, createTextOutput: t => ({ t, setMimeType() { return this; } }) };
const api = new Function('SpreadsheetApp', 'LockService', 'ContentService', code + '; return { doGet, doPost };')(SpreadsheetApp, LockService, ContentService);
http.createServer((req, res) => {
  let body = '';
  req.on('data', d => body += d).on('end', () => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.url === '/dump') { res.end(JSON.stringify(Object.fromEntries(Object.entries(sheets).map(([k, v]) => [k, v.rows])), null, 1)); return; }
    const out = req.method === 'POST' ? api.doPost({ postData: { contents: body } }) : api.doGet();
    res.setHeader('Content-Type', 'application/json'); res.end(out.t);
  });
}).listen(8766, () => console.log('mock on 8766'));
