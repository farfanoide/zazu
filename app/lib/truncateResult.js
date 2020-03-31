const truncate = (text, length) =>
  !text || text.length === 0 || text.length < length
    ? text
    : `${text.slice(0, Math.max(0, length))}... (${text.length - length} more bytes)`
const truncateResult = (result) => Object.assign({}, result, { preview: truncate(result.preview, 1024) })

module.exports = truncateResult
