const isNumeric = (value) =>
  ['string', 'number'].includes(typeof value) &&
  !isNaN(parseFloat(value)) &&
  isFinite(value)

const parseIntOrDefault = (str, defaultVal) => {
  return isNumeric(str) ? parseInt(str, 10) : defaultVal
}

const port = parseIntOrDefault(process.env.PPROF_PORT, 9393)
const maxCpuProfileSeconds = parseIntOrDefault(
  process.env.PPROF_MAX_SECONDS,
  60
)

require('./dist').createPprofServer(port, maxCpuProfileSeconds)
