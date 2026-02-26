/**
 * This page displays manga chapter content
 * - Chapter content:
 *  - Image list
 *  - Chapter title (if available)
 *  - Manga title (for better user experience, but not necessary since we can click back to manga page to see it)
 * - Image list:
 *  - Display as a column list, each image in one row, and fit to screen width
 *  - Lazy load images for better performance
 * Pagination to navigate between chapters (previous and next chapter)
 * - Need to fetch chapter list from manga page to get the order of chapters, and determine previous and next chapter
 * - Display chapter title in pagination if available, otherwise display chapter number or "Chapter X"
 */


'use client';
import React, {useState, useEffect} from 'react';
import {useParams, useSearchParams} from 'next/navigation';
import Header from '@/app/component/Header';

const ChapterPage = () => {
    const params = useParams<{id: string}>();
    const searchParams = useSearchParams();
    const chapterId = params.id;
    const chapterTitle = searchParams.get('chapterTitle');
    const mangaTitle = searchParams.get('mangaTitle');
    const [chapterInfo, setChapterInfo] = useState<any>(null);
    const [imageList, setImageList] = useState<string[]>([]);
    // Call /api/manga/page to get chapter image list
    const fetchChapterInfo = async (chapterId: string) => {
        try{
            const response = await fetch(`/api/manga/page?chapterId=${chapterId}`);
            const data = await response.json();
            const urls = Array.isArray(data?.urls) ? data.urls : [];

            setChapterInfo({
                title: data?.attributes?.title || chapterTitle || "No Chapter Title",
                mangaTitle: mangaTitle || ''
            });
            setImageList(urls);
        }
        catch(e){
            console.error('Error fetching chapter info:', e);
            setImageList([]);
        }
    }
    useEffect(() => {
        // Get params -> chapterId -> fetch chapter info and image list
        if(chapterId){
            fetchChapterInfo(chapterId);
        }
    }, [chapterId, chapterTitle, mangaTitle])
    return (
        <div>
            <Header />
            {// Display chapter title and manga title if available
            chapterInfo && (
                <div>
                    <h1>{chapterInfo.title}</h1>
                    <h2>{chapterInfo.mangaTitle}</h2>
                </div>
            )}
            {// Display image list
            imageList.length > 0 ? (
                <div>
                    {imageList.map((imageUrl, index) => (
                        <img key={index} src={imageUrl} alt={`Page ${index + 1}`} style={{width: '100%', marginBottom: '20px'}} loading="lazy" />
                    ))}
                </div>
            ) : (

                <p>Loading chapter content...</p>
            )}
        </div>
    );
};

export default ChapterPage;