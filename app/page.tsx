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
import './css/home.css';
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
        <div>
            <Header />
            <div className='ml-1 mr-1'>
                <button 
                    onClick={() => setShowCheckbox(!showCheckbox)}
                    className='border hover:cursor-pointer'
                    >Toggle Genres</button>
                {showCheckbox && (
                    <div>
                        <h3 className='genres_title'>MangaDex Demographic</h3>
                        <div className="genres_container">
                            {
                                ["shounen", "shoujo", "josei", "seinen", "none"].map(demo => (
                                    <div key={demo} className="checkbox_wrapper">
                                        <input type="checkbox" id={demo} name={demo} value={demo} />
                                        <label htmlFor={demo}>{demo}</label>
                                    </div>
                            ))
                        }
                        </div>
                        <h3 className='genres_title'>MangaDex Content Rating</h3>
                        <div className="genres_container">
                        {
                            ["safe", "suggestive", "erotica", "pornographic"].map(rating => (
                                <div key={rating} className="checkbox_wrapper">
                                    <input type="checkbox" id={rating} name={rating} value={rating} />
                                    <label htmlFor={rating}>{rating}</label>
                                </div>
                            ))
                        }
                        </div>
                        <h3 className='genres_title'>MangaDex genres</h3>
                        <div className="genres_container">
                            {
                                tags.map(tag => (
                                    <div key={tag.id} className="checkbox_wrapper">
                                        <input type="checkbox" id={tag.id} name={tag.name} value={tag.id} />
                                        <label htmlFor={tag.id}>{tag.name}</label>
                                    </div>
                                ))
                            }
                        </div>
                        <button>Confirm filter</button>
                    </div>
                )}
            </div>
        </div>
    );
};
export default HomePage;