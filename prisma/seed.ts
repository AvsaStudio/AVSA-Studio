import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding AVSA Studio database...");

  // ─── Services ──────────────────────────────────────────────────────────────

  const services = await Promise.all([
    prisma.service.upsert({
      where: { id: "svc_portrait" },
      update: {},
      create: {
        id: "svc_portrait",
        title: "Portrait Session",
        description:
          "A one-hour portrait session capturing your authentic self. Ideal for headshots, personal branding, or milestone moments. Includes 20 edited digital images delivered via private online gallery.",
        duration: 60,
        price: 45000, // $450
        depositAmount: 15000, // $150
        isActive: true,
      },
    }),
    prisma.service.upsert({
      where: { id: "svc_editorial" },
      update: {},
      create: {
        id: "svc_editorial",
        title: "Editorial Session",
        description:
          "A two-hour creative editorial session for artists, creatives, and visionaries. We build a concept together — mood, location, wardrobe — and create something genuinely cinematic. Includes 40 edited images.",
        duration: 120,
        price: 80000, // $800
        depositAmount: 25000, // $250
        isActive: true,
      },
    }),
    prisma.service.upsert({
      where: { id: "svc_event" },
      update: {},
      create: {
        id: "svc_event",
        title: "Event Coverage",
        description:
          "Up to four hours of documentary-style event photography. Perfect for intimate gatherings, launches, celebrations, and everything in between. Includes 100+ edited images.",
        duration: 240,
        price: 120000, // $1,200
        depositAmount: 40000, // $400
        isActive: true,
      },
    }),
    prisma.service.upsert({
      where: { id: "svc_mini" },
      update: {},
      create: {
        id: "svc_mini",
        title: "Mini Session",
        description:
          "A focused 30-minute session for a quick refresh, seasonal portraits, or when you just need a few stunning images. Includes 10 edited digital images.",
        duration: 30,
        price: 20000, // $200
        depositAmount: 5000, // $50
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ Created ${services.length} services`);

  // ─── Availability Slots ─────────────────────────────────────────────────────

  // Generate slots for the next 4 weeks
  const today = new Date();
  const slots = [];

  for (let i = 1; i <= 28; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    // Skip Sundays (0) and Mondays (1)
    if (date.getDay() === 0 || date.getDay() === 1) continue;

    const timeSlots = [
      { startTime: "09:00", endTime: "10:00" },
      { startTime: "11:00", endTime: "12:00" },
      { startTime: "14:00", endTime: "15:00" },
      { startTime: "16:00", endTime: "17:00" },
    ];

    for (const slot of timeSlots) {
      slots.push({
        date: new Date(date.toDateString()), // Normalize to midnight
        startTime: slot.startTime,
        endTime: slot.endTime,
        isBooked: false,
      });
    }
  }

  // Clear existing future slots before re-seeding
  await prisma.availabilitySlot.deleteMany({
    where: { date: { gte: today }, isBooked: false },
  });

  await prisma.availabilitySlot.createMany({ data: slots });
  console.log(`✅ Created ${slots.length} availability slots`);

  // ─── Admin User ─────────────────────────────────────────────────────────────

  const bcrypt = await import("bcryptjs");
  const adminPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@avsa.studio" },
    update: {},
    create: {
      name: "AVSA Admin",
      email: "admin@avsa.studio",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });

  console.log(`✅ Admin user: ${admin.email}`);
  console.log("🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
