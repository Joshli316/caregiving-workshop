const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  use: { baseURL: 'http://localhost:3742' },
  webServer: {
    command: 'npx serve . -p 3742 -s',
    port: 3742,
    reuseExistingServer: false,
  },
});
