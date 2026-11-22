// AIH gateway health tool for DeepSeek Harness.
//
// This plugin registers one model-facing tool. It deliberately has no imports:
// DSH loads this file by absolute file:// URL, and bare package imports would
// depend on the plugin's own node_modules. The tool calls the loopback AIH
// health endpoint and returns a short plain-text status.

export const name = 'aih-dsh-gateway'

export const inject = ['tools']

function normalizeBaseUrl(value) {
  const raw = String(value || '').trim()
  return (raw || 'http://127.0.0.1:9527').replace(/\/+$/, '')
}

export function apply(ctx, config = {}) {
  if (config && config.enabled === false) return
  const baseUrl = normalizeBaseUrl(config && config.baseUrl)
  ctx.tools.register({
    name: 'aih_gateway_health',
    description: 'Read the local AIH gateway health endpoint (/healthz) and return its status text.',
    parameters: {},
    output: {
      schema: { type: 'string' },
      render: (_args, value) => [{ type: 'text', text: value }],
    },
    async execute() {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 3000)
      try {
        const response = await fetch(baseUrl + '/healthz', { signal: controller.signal })
        const body = (await response.text()).slice(0, 400)
        return 'HTTP ' + response.status + (body ? ' ' + body : '')
      } catch (error) {
        return 'AIH gateway unreachable at ' + baseUrl + ': ' + (error && error.message ? error.message : String(error))
      } finally {
        clearTimeout(timer)
      }
    },
  })
}
