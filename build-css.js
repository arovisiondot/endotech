const fs = require('fs');
const path = require('path');
const { compile } = require('@tailwindcss/node');
const { Scanner } = require('@tailwindcss/oxide');

async function buildCSS() {
  console.log('⚡ Compiling Tailwind CSS v4 utilities...');
  const globalsPath = path.resolve('src/app/globals.css');
  const css = fs.readFileSync(globalsPath, 'utf8');

  const compiler = await compile(css, {
    base: process.cwd(),
    from: globalsPath,
    onDependency: () => {}
  });

  const scanner = new Scanner({
    sources: [
      { base: process.cwd(), pattern: 'src/**/*.{ts,tsx,js,jsx}', negated: false },
      { base: process.cwd(), pattern: 'public/**/*.svg', negated: false }
    ]
  });

  const candidates = scanner.scan();
  console.log(`✓ Scanned ${candidates.length} candidate classes in src/`);

  const result = compiler.build(candidates);
  const outPath = path.resolve('src/app/tailwind-built.css');
  fs.writeFileSync(outPath, result);
  console.log(`✓ Built CSS written to ${outPath} (${(result.length / 1024).toFixed(1)} KB)`);
}

buildCSS().catch((err) => {
  console.error('Build CSS failed:', err);
  process.exit(1);
});

