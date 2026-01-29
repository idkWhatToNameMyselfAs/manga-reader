import axios from 'axios';

const baseUrl = "https://api.mangadex.org/manga";

export async function GET(request: Request) {
    try{
        // search params help to get limit and offset which loads specific number of tags
        // limit 0 offset 0 will load all tags
        const { searchParams } = new URL(request.url);
        const limit = searchParams.get('limit') || '0';
        const offset = searchParams.get('offset') || '0';
        const response = await axios.get(`${baseUrl}/tag`, {
            params: {
                limit,
                offset
            }
        })
        return Response.json(response.data, { status: 200 });
    }
    catch(e) {
        return Response.json({ error: "Failed to fetch manga tags" }, { status: 500 });
    }
};