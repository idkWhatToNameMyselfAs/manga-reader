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
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {useParams, useSearchParams} from 'next/navigation';
import Header from '@/app/component/Header';
import Link from 'next/link';

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
            // Assuming returned chapter list is sorted. Need more testing in this regard
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
    const description = mangaInfo?.attributes?.description?.en
        || mangaInfo?.attributes?.description?.vi
        || mangaInfo?.attributes?.description?.['ja-ro']
        || 'No translated description';
    return(
        <div>
            <Header />
            <div className="container mx-auto p-4">
                {showManga && mangaInfo ? (
                    <div className="flex flex-col items-center">
                        <div className="flex flex-col md:flex-row gap-6 items-start w-full">
                            <div className="w-full md:w-1/3 flex justify-center md:justify-start">
                                {getCoverUrl() && (
                                    <img
                                        src={getCoverUrl() ?? ''}
                                        alt={mangaInfo.attributes.title.en}
                                        className="w-64 h-auto rounded"
                                    />
                                )}
                            </div>
                            <div className="w-full md:w-2/3">
                                <h1 className="text-2xl font-bold mb-4">{mangaInfo.attributes.title.en || mangaInfo.attributes.title.vi || mangaInfo.attributes.title['ja-ro'] || 'No translated title'}</h1>
                                <ReactMarkdown
                                    className="mb-4"
                                    remarkPlugins={[remarkGfm]} // Support GitHub Flavored Markdown for better formatting
                                    components={{
                                        p: (props) => <p className="mb-3 leading-relaxed" {...props} />,
                                        ul: (props) => <ul className="mb-3 list-disc list-inside space-y-1" {...props} />,
                                        ol: (props) => <ol className="mb-3 list-decimal list-inside space-y-1" {...props} />,
                                        li: (props) => <li className="leading-relaxed" {...props} />,
                                        a: (props) => <a className="underline" {...props} />,
                                        strong: (props) => <strong className="font-semibold" {...props} />,
                                        code: (props) => <code className="rounded bg-neutral-100 px-1 py-0.5 text-sm" {...props} />,
                                        blockquote: (props) => <blockquote className="border-l-4 border-neutral-300 pl-3 italic" {...props} />,
                                    }}
                                >
                                    {description}
                                </ReactMarkdown>
                            </div>
                        </div>
                        <div className="mb-4 mt-8">
                            <h2 className="text-xl font-semibold mb-2">Tags:</h2>
                            <ul className="grid grid-cols-6 gap-2">
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
                                        <Link href={`/chapter/${chapter.id}${mangaInfo.attributes.title.en || mangaInfo.attributes.title.vi ? `?mangaTitle=${encodeURIComponent(mangaInfo.attributes.title.en || mangaInfo.attributes.title.vi)}` : ''}`} key={chapter.id}>
                                            <li>{
                                                chapter.attributes.volume ? `Vol. ${chapter.attributes.volume} ` : ''
                                            }{
                                                chapter.attributes.chapter ? `Ch. ${chapter.attributes.chapter} ` : ''
                                            }{
                                            chapter.attributes.title || 'No title'}</li>
                                        </Link>
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
        </div>
    );
}
export default MangaPage;