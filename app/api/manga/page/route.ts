import axios from 'axios';

export async function GET(request: Request){
    const baseUrl = 'https://api.mangadex.org/at-home/server/';
    const { searchParams } = new URL(request.url);
    const chapterId = searchParams.get('chapterId');
    if (!chapterId) {
        return new Response(JSON.stringify({ error: 'Missing chapterId parameter' }), { status: 400 });
    }
    try {
        const response = await axios.get(`${baseUrl}${chapterId}`);
        const data = response.data;
        const imgServer = data.baseUrl;
        const imgData: string[] = data.chapter.data;
        const urls = imgData.map((fileName) => `${imgServer}/data/${data.chapter.hash}/${fileName}`); // Construct full image URLs by combining server URL, chapter hash, and file names from the chapter data
        return new Response(JSON.stringify({ urls }));
    }
    catch(e){
        console.error('Error fetching chapter server info:', e);
        return new Response(JSON.stringify({ error: 'Failed to fetch chapter server info' }), { status: 500 });
    }
}