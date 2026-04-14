# @mindflow/plugin-api

Type definitions for MindFlow plugins.

## Usage

```ts
import type { MindFlowPluginEntrypoint } from "@mindflow/plugin-api";

const setup: MindFlowPluginEntrypoint = (api, plugin) => {
  api.logger.info(`${plugin.id} loaded`);
  return () => api.logger.info(`${plugin.id} unloaded`);
};

module.exports = setup;
```

For manifest fields and permissions, see:

- `docs/plugin-manifest.v1.md`
- `docs/plugin-open-strategy.md`
