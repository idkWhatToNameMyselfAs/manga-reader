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

import React, {useState, useEffect} from 'react';
import {useParams, useSearchParams} from 'next/navigation';
import Header from '@/app/component/Header';

const ChapterPage = () => {
    const params = useParams<{id: string}>();
    const [searchParams] = useSearchParams();
    const chapterId = params.id;
    const [chapterInfo, setChapterInfo] = useState<any>(null);
    const [imageList, setImageList] = useState<string[]>([]);
    // Call /api/manga/page to get chapter image list
    const fetchChapterInfo = async (chapterId: string) => {
        try{
            const response = await fetch(`/api/manga/page/id=${chapterId}`);
            const data = await response.json();
            setChapterInfo(data.chapterInfo);
            setImageList(data.imageList);
        }
        catch(e){
            console.error('Error fetching chapter info:', e);
        }
    }
    useEffect(() => {
        
    })
};

export default ChapterPage;