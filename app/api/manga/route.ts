import axios from 'axios';

const baseUrl = "https://api.mangadex.org/manga";

export async function GET(request: Request){
    try{
        const { searchParams } = new URL(request.url);
        // Get manga ID from query parameters
        const mangaId = searchParams.get('mangaId');
        if (!mangaId) {
            return Response.json({ error: "mangaId parameter is required" }, { status: 400 });
        }
        const response = await axios.get(`${baseUrl}/${mangaId}`, {
            params: {
                includes: ["author", "artist", "cover_art", "tag", "creator"]
            }
        });
        return Response.json(response.data);
    }
    
    catch(e){
        return Response.json({ error: "Failed to get manga chapters" }, { status: 500 });
    }
}
