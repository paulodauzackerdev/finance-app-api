import { prisma } from '../../../prisma/prisma.js'

export class RefreshTokenRepository {
  async create({ userId, tokenHash, expiresAt }) {
    return prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt
      }
    })
  }

  async findByHash(tokenHash) {
    return prisma.refreshToken.findUnique({
      where: { tokenHash }
    })
  }

  async revoke(id) {
    const result = await prisma.refreshToken.updateMany({
      where: {
        id,
        revokedAt: null
      },
      data: { revokedAt: new Date() }
    })

    return result.count > 0
  }

  async revokeAllByUserId(userId) {
    await prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null
      },
      data: { revokedAt: new Date() }
    })
  }

  async deleteExpired() {
    return prisma.refreshToken.deleteMany({
      where: {
        OR: [{ expiresAt: { lt: new Date() } }, { revokedAt: { not: null } }]
      }
    })
  }
}
