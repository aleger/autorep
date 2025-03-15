import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const data = [
    { bioguide_id: 'R000618', url: 'https://www.ricketts.senate.gov/contact/share-your-opinion/', state: 'NE', name: 'Ricketts, Pete' },
    { bioguide_id: 'F000463', url: 'https://www.fischer.senate.gov/public/?p=email-deb', state: 'NE', name: 'Fischer, Deb' }
    // Add more as needed
];

async function main() {
    for (const item of data) {
        await prisma.congressForm.upsert({
            where: { bioguide_id: item.bioguide_id },
            update: { url: item.url },
            create: item
        });
    }
    console.log('Data seeded successfully');
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());