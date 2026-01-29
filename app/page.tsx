/**
 * Home page component
 * Content:
 * - Header
 * - Search bar
 * - Genres checkbox list -> confirm button; seperate into different server's requests
 * - Return manga list based on search or genres
 * - When clicking on manga, go to manga page with chapters list
 * - Pagination
 */
// Import api routes and components
/**
 * Need:
 * CSS styling
 */
/**
 * Returned manga layout:
 * 4 columns grid
 * Each manga:
 * - Cover image
 * - Title
 * - Author
 * Click -> manga page
 * Bottom: pagination
 */
'use client';
import Header from './component/Header';
import {useState, useEffect} from 'react';
const HomePage = () => {
    const [showCheckbox, setShowCheckbox] = useState(false);
    const [tags, setTags] = useState<Array<{id: string, name: string}>>([]);
    const [showMangaList, setShowMangaList] = useState(false);

    // Automatically fetch tags while loading the page
    useEffect(() => {
        const fetchTags = async () => {
            const data = await displayTags();
            setTags(data);
        };
        fetchTags();
    }, []);

    const displayTags = async () => {
        try {
            const response = await fetch('/api/manga/tag?limit=0&offset=0');
            const data = await response.json();
            return data.data.map((tag: any) => ({
                id: tag.id,
                name: tag.attributes.name.en
            }));
        } catch (error) {
            console.error('Error fetching tags:', error);
            return [];
        }
    };

    return (
        <div className="bg-white min-h-screen min-w-full">
            <Header />
            <div>
                {/* Placeholder for genres checkbox list */}
                <button onClick={() => setShowCheckbox(!showCheckbox)}>Toggle Genres</button>
                {showCheckbox && (
                    <div>
                        <h3>MangaDex genres</h3>
                        <div className='max-h-96 overflow-y-auto columns-2 md:columns-3 lg:columns-4 gap-4'>
                            {
                                tags.map(tag => (
                                    <div key={tag.id} className='break-inside-avoid mb-2 flex items-center gap-2'>
                                        <input type="checkbox" id={tag.id} name={tag.name} value={tag.id} className='w-4 h-4 cursor-pointer'/>
                                        <label htmlFor={tag.id} className='cursor-pointer hover:text-blue-600 text-sm'>{tag.name}</label>
                                    </div>
                                ))
                            }
                        </div>
                        <h3>MangaDex Demographic</h3>
                        {
                            ["shounen", "shoujo", "josei", "seinen", "none"].map(demo => (
                                <div key={demo} className='break-inside-avoid mb-2 flex items-center gap-2'>
                                    <input type="checkbox" id={demo} name={demo} value={demo} className='w-4 h-4 cursor-pointer'/>
                                    <label htmlFor={demo} className='cursor-pointer hover:text-blue-600 text-sm'>{demo}</label>
                                </div>
                            ))
                        }
                        <h3>MangaDex Content Rating</h3>
                        {
                            ["safe", "suggestive", "erotica", "pornographic"].map(rating => (
                                <div key={rating}>
                                    <input type="checkbox" id={rating} name={rating} value={rating} />
                                    <label htmlFor={rating}>{rating}</label>
                                </div>
                            ))
                        }
                    </div>
                )}
            </div>
        </div>
    );
};
export default HomePage;