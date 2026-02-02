import axios from 'axios'

const baseUrl = "https://api.mangadex.org/manga";

export async function GET(request: Request) {
    try{
        const { searchParams } = new URL(request.url);
        // Get search query and other parameters, tags
        const limit = searchParams.get('limit') || '10';
        const offset = searchParams.get('offset') || '0';
        const includedTags = searchParams.getAll('includedTags');
        const contentRating = searchParams.getAll('contentRating');
        const publicationDemographic = searchParams.getAll('publicationDemographic');
        const availableTranslatedLanguage = searchParams.getAll('availableTranslatedLanguage') || ['en', 'vi'];
        const response = await axios.get(`${baseUrl}`, {
            params: {
                limit,
                offset,
                'includedTags[]': includedTags,
                'contentRating[]': contentRating,
                'publicationDemographic[]': publicationDemographic,
                'availableTranslatedLanguage[]': availableTranslatedLanguage,
                'includes[]': ['cover_art']
            }});
        return Response.json(response.data, { status: 200 });
        
    }
    catch(e){
        return Response.json({ error: "Failed to search manga" }, { status: 500 });
    }
}