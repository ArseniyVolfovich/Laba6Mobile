const fs = require('node:fs/promises');
const path = require('node:path');
const CleanCSS = require('clean-css');
const { minify: minifyHtml } = require('html-minifier-terser');
const { minify: minifyJavaScript } = require('terser');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'dist');

async function build() {
  await fs.mkdir(path.join(output, 'css'), { recursive: true });
  await fs.mkdir(path.join(output, 'js'), { recursive: true });

  // Читаемые исходники сохраняются; min.css содержит их минифицированную версию.
  const base = await fs.readFile(path.join(root, 'css/reset.css'), 'utf8');
  const styles = await fs.readFile(path.join(root, 'css/style.css'), 'utf8');
  const css = new CleanCSS({ level: 2 }).minify(base + '\n' + styles);
  if (css.errors.length) throw new Error(css.errors.join('\n'));
  await fs.writeFile(path.join(root, 'css/min.css'), css.styles);
  await fs.writeFile(path.join(output, 'css/style.css'), css.styles);

  const sourceJs = await fs.readFile(path.join(root, 'js/app.js'), 'utf8');
  const js = await minifyJavaScript(sourceJs);
  if (!js.code) throw new Error('Не удалось минифицировать JavaScript');
  await fs.writeFile(path.join(output, 'js/app.js'), js.code);

  const sourceHtml = await fs.readFile(path.join(root, 'index.html'), 'utf8');
  const html = await minifyHtml(
    sourceHtml
      .replace('  <link rel="stylesheet" href="css/reset.css">\n', ''),
    {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true
    }
  );
  await fs.writeFile(path.join(output, 'index.html'), html);
  await fs.cp(path.join(root, 'assets'), path.join(output, 'assets'), { recursive: true });

  const originalBytes = Buffer.byteLength(sourceHtml + base + styles + sourceJs);
  const builtBytes = Buffer.byteLength(html + css.styles + js.code);
  console.log('Готово: dist/index.html');
  for (const [name, source, compressed] of [
    ['index.html', sourceHtml, html],
    ['css/style.css (включая reset)', base + styles, css.styles],
    ['js/app.js', sourceJs, js.code]
  ]) {
    console.log(name + ': ' + Buffer.byteLength(source) + ' → ' + Buffer.byteLength(compressed) + ' байт');
  }
  console.log(
    'HTML/CSS/JS: ' + originalBytes + ' → ' + builtBytes +
    ' байт (−' + Math.round((1 - builtBytes / originalBytes) * 100) + '%)'
  );
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
