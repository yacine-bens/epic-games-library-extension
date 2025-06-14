import { defineConfig, UserManifest } from 'wxt';

const perBrowserManifest: Record<string, Record<number, UserManifest>> = ({
  chrome: {
    3: {
      permissions: [
        'storage',
      ],
      host_permissions: [
        'https://*.epicgames.com/*',
      ],
      commands: {
        toggleDialog: {
          description: 'Toggle the dialog',
          suggested_key: {
            default: 'Alt+G',
            mac: 'Command+G',
          },
        },
      },
    },
  },
  firefox: {
    2: {
      permissions: [
        'storage',
        'https://*.epicgames.com/*',
      ],
      commands: {
        toggleDialog: {
          description: 'Toggle the dialog',
          suggested_key: {
            default: 'Alt+G',
            mac: 'Command+G',
          },
        },
      },
    },
  },
});

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-react'],
  manifest: ({ browser, manifestVersion }) => ({
    name: 'Epic Games Library Extension',
    description: 'Show library of owned games in Epic Games Store.',
    version: '0.1.1',
    ...perBrowserManifest[browser][manifestVersion],
  }),
});
