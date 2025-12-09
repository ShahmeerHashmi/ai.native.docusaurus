async function run() {
  try {
    const siteDir = process.cwd();
    console.log(`[docusaurus] Building site at: ${siteDir}`);
    const core = await import('@docusaurus/core/lib/index.js');
    await core.build(siteDir);
    console.log('[docusaurus] Build completed successfully');
  } catch (err) {
    console.error('[docusaurus] Build failed:', err);
    process.exitCode = 1;
  }
}

run();
