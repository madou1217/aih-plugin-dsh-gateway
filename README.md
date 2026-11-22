# aih-plugin-dsh-gateway

DeepSeek Harness native plugin (Cordis patch) that exposes a single tool:

- `aih_gateway_health` — reads `http://127.0.0.1:9527/healthz` and returns its status text.

## Why

AIH launches DSH with its own gateway and account projection. This plugin gives
the harness a direct, read-only way to confirm the gateway it is talking to is
alive. It is a native DSH plugin, not an AIH process plugin.

## Install (AIH native resources)

```sh
aih native plugin install . --host deepseek
```

The installer copies the package under the DSH host home and writes a Cordis
patch at:

```text
~/.ai_home/managed-resources/native-plugin-patches/deepseek/aih-dsh-gateway.yml
```

## Enable / disable / remove

```sh
aih native plugin enable  aih-dsh-gateway --host deepseek
aih native plugin disable aih-dsh-gateway --host deepseek
aih native plugin remove  aih-dsh-gateway --host deepseek
```

## Version policy

- The package carries `version` in `package.json` and `agentPlugin`.
- `engines.deepseek` is deliberately wide (`>=0.0.0`): version is reported,
  not enforced. A missing or newer DSH is not a hard failure.

## Requirements

- DeepSeek Harness (`dsh`) installed and managed by AIH.
- Node.js 20+ (global fetch).
- No Electron, WebView, CDP, or browser automation.
