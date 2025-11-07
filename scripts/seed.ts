import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'

async function main() {
  console.log('🌱 Seeding database...')

  // Hash passwords
  const userPassword = await bcrypt.hash('password123', 10)
  const adminPassword = await bcrypt.hash('admin123', 10)

  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Demo User',
      password: userPassword,
      isAdmin: false,
    },
  })

  console.log('✅ Created demo user:', user.email)

  // Create demo admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      isAdmin: true,
    },
  })

  console.log('✅ Created demo admin:', admin.email)

  console.log('✨ Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
