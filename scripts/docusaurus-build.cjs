const { build } = require('@docusaurus/core');

(async () => {
  try {
    const siteDir = process.cwd();
    console.log(`[docusaurus] Building site at: ${siteDir}`);
    await build(siteDir);
    console.log('[docusaurus] Build completed successfully');
  } catch (err) {
    console.error('[docusaurus] Build failed:', err);
    process.exit(1);
  }
})();
