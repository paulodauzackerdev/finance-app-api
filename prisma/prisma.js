import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
    errorFormat: 'pretty'
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// ─── Cleanup periódico de refresh tokens expirados/revogados ───

const CLEANUP_INTERVAL = 60 * 60 * 1000 // 1 hora

let cleanupTimer

export function startTokenCleanup() {
  if (cleanupTimer) return

  cleanupTimer = setInterval(async () => {
    try {
      const { count } = await prisma.refreshToken.deleteMany({
        where: {
          OR: [{ expiresAt: { lt: new Date() } }, { revokedAt: { not: null } }]
        }
      })
      if (count > 0) {
        console.log(
          `[Cleanup] ${count} refresh token(s) expirado(s) removido(s)`
        )
      }
    } catch (error) {
      console.error('[Cleanup] Erro ao limpar refresh tokens:', error.message)
    }
  }, CLEANUP_INTERVAL)

  // Não impede o Node de encerrar
  if (cleanupTimer.unref) {
    cleanupTimer.unref()
  }
}

export function stopTokenCleanup() {
  if (cleanupTimer) {
    clearInterval(cleanupTimer)
    cleanupTimer = null
  }
}
