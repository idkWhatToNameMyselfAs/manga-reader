import * as fs from 'fs';
import * as path from 'path';

// To run, do npx tsx scripts/MDtags.ts
// In the future, add to package.json scripts section -> run automatically before build/when needed

async function fetchAndSaveTags() {
    try {
        console.log('Fetching tags from MangaDex API...');
        
        // Use the actual MangaDex API endpoint
        const response = await fetch('https://api.mangadex.org/manga/tag');
        const data = await response.json();
        
        // Create data directory in public folder for Next.js static file serving
        const dataDir = path.join(process.cwd(), 'public', 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        
        // Save to JSON file with pretty formatting
        const filePath = path.join(dataDir, 'MDtags.json');
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        
        console.log(`Successfully saved ${data.data.length} tags to public/data/MDtags.json`);
    } catch (error) {
        console.error('Error fetching tags:', error);
        process.exit(1); // Exit with failure code
    }
}

fetchAndSaveTags();