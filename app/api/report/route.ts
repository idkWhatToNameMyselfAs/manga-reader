import axios from 'axios';

export async function POST(request: Request){
    const {searchParams} = new URL(request.url);
    const baseUrl = 'https://api.mangadex.network/report';
    const url = searchParams.get('url');
    const success = searchParams.get('success');
    const cached = searchParams.get('cached');
    const bytes = searchParams.get('bytes');
    const duration = searchParams.get('duration');
    if(url?.includes('mangadex.org')) {
        return new Response(JSON.stringify({"Error":"No need to report Mangadex URLs for this baseUrl"}), { status: 400 });
    }
    try{
        await axios.post(baseUrl, {
            url,
            success,
            cached,
            bytes,
            duration
        });
        return new Response(JSON.stringify({ message: 'Report sent successfully' }), { status: 200 });
        }
    catch(e){
        console.error('Error sending report:', e);
        return new Response(JSON.stringify({ error: 'Failed to send report' }), { status: 500 });
    }

}