import helmet from 'helmet'

export const docsHelmet = helmet({
  crossOriginEmbedderPolicy: false,

  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],

      scriptSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],

      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        'cdn.jsdelivr.net',
        'fonts.googleapis.com',
        'unpkg.com'
      ],

      fontSrc: ["'self'", 'fonts.scalar.com', 'data:'],

      imgSrc: ["'self'", 'data:', 'cdn.jsdelivr.net'],

      connectSrc: ["'self'"]
    }
  }
})
