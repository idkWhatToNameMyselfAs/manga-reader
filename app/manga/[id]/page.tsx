/**
 * 
 * Manga info display page
 * - Manga info:
 *  - Cover image
 * - Title
 * - Author
 * - Description
 * - Tags
 * - Chapters list
 */
'use client';
import React, {useState, useEffect} from 'react';
import {useParams, useSearchParams} from 'next/navigation';

const MangaPage = () => {
    // Fetch manga info from Mangadex API
    const params = useParams<{id: string}>();
    const searchParams = useSearchParams();
    const coverFileName = searchParams.get('cover');
    const [mangaInfo, setMangaInfo] = useState<any>(null);
    const [showManga, setShowManga] = useState(false);
    const [chapters, setChapters] = useState<any[]>([]);

    const fetchMangaInfo = async (mangaId: string) => {
        try{
            const response = await fetch(`/api/manga?mangaId=${mangaId}`);
            const data = await response.json();
            const chaptersData = await fetchMangaChapters(mangaId); // Fetch chapters but not display yet, just for preloading
            setChapters(chaptersData);
            setMangaInfo(data.data);
            setShowManga(true);
        }
        catch(e){
            console.error('Error fetching manga info:', e);
        }
    }
    const fetchMangaChapters = async (mangaId: string) => {
        try{
            const response = await fetch(`/api/manga/chapter?id=${mangaId}`);
            const data = await response.json();
            return data.data;
            // ADD CHAPTER SORTING LATER
        }
        catch(e){
            console.error('Error fetching manga chapters:', e);
            return [];
        }
    }
    useEffect(() => {
        if (!params?.id) return;
        fetchMangaInfo(params.id);
    }, [params?.id]);
    const getCoverUrl = () => {
        if (!coverFileName) return null;
        return `https://uploads.mangadex.org/covers/${params.id}/${coverFileName}`;
    };
    return(
        <div className="container mx-auto p-4">
            {showManga && mangaInfo ? (
                <div className="flex flex-col items-center">
                    <h1 className="text-2xl font-bold mb-4">{mangaInfo.attributes.title.en || mangaInfo.attributes.title.vi || mangaInfo.attributes.title['ja-ro'] || 'No translated title'}</h1>
                    {getCoverUrl() && <img src={getCoverUrl() ?? ''} alt={mangaInfo.attributes.title.en} className="w-64 h-auto mb-4" />}
                    <p className="mb-4">{mangaInfo.attributes.description.en || mangaInfo.attributes.description.vi || mangaInfo.attributes.description['ja-ro'] || 'No translated description'}</p>
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold mb-2">Tags:</h2>
                        <ul className="list-disc list-inside">
                            {mangaInfo.attributes.tags.map((tag: any) => (
                                <li key={tag.id}>{tag.attributes.name.en || tag.attributes.name.vi || tag.attributes.name['ja-ro'] || 'No translated tag name'}</li>
                            ))}
                        </ul>
                    </div>
                    {chapters.length > 0 && (
                        <div className="w-full">
                            <h2 className="text-xl font-semibold mb-2">Chapters:</h2>
                            <ul className="list-disc list-inside">
                                {chapters.map((chapter) => (
                                    <li key={chapter.id}>{chapter.attributes.title || 'No title'}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ) : (
                <div className="min-h-[60vh] flex items-center justify-center">
                    <p>Loading manga information...</p>
                </div>
            )}
        </div>
    );
}
export default MangaPage;