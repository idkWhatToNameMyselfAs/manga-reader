import axios from "axios";

const baseUrl = "https://api.mangadex.org/manga";

export async function GET(request: Request){
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
        return Response.json({ error: "id parameter is required" }, { status: 400 });
    }
    const response = await axios.get(`${baseUrl}/${id}/feed`, {
        params: {
            translatedLanguage: ['en', 'vi'],
            order: { chapter: 'asc' },
            limit: 100
        }
    });
    return Response.json(response.data);
}