const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Updating admin credentials...')

  // Hash the new password
  const adminPassword = await bcrypt.hash('Milloo123', 10)

  // Try to update existing user with that email
  try {
    const admin = await prisma.user.update({
      where: { email: 'noungajoseph58@gmail.com' },
      data: {
        name: 'Admin User',
        password: adminPassword,
        isAdmin: true,
      },
    })
    console.log('✅ Admin credentials updated:', admin.email)
  } catch (e) {
    // If user doesn't exist, create it
    if (e.code === 'P2025') {
      const admin = await prisma.user.create({
        data: {
          email: 'noungajoseph58@gmail.com',
          name: 'Admin User',
          password: adminPassword,
          isAdmin: true,
        },
      })
      console.log('✅ Admin user created:', admin.email)
    } else {
      throw e
    }
  }

  console.log('✨ Update complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
