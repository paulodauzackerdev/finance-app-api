export const ok = (res, body) => {
  return res.status(200).json(body)
}

export const created = (res, body) => {
  return res.status(201).json(body)
}

export const noContent = (res) => {
  return res.status(204).end()
}

export const badRequest = (res, message) => {
  return res.status(400).json({
    error: message
  })
}

export const unauthorized = (res, message) => {
  return res.status(401).json({
    error: message
  })
}

export const forbidden = (res, message) => {
  return res.status(403).json({
    error: message
  })
}

export const notFound = (res, message) => {
  return res.status(404).json({
    error: message
  })
}

export const conflict = (res, message) => {
  return res.status(409).json({
    error: message
  })
}

export const internalServerError = (res, message = 'Internal server error') => {
  return res.status(500).json({
    error: message
  })
}
