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
// DATA ONLY TAKE FROM /PUBLIC/
'use client';
import Header from './component/Header';
import {useState, useEffect} from 'react';
import './css/home.css';
const HomePage = () => {
    const [showCheckbox, setShowCheckbox] = useState(false);
    const [showManga, setShowManga] = useState(false);
    const [tags, setTags] = useState<Array<{id: string, name: string}>>([]);

    // Automatically fetch tags while loading the page
    useEffect(() => {
        const fetchTags = async () => {
            const data = await displayTags();
            setTags(data);
        };
        fetchTags();
    }, []);

    const displayTags = async () => {
        try{
            const response = await fetch('data/MDtags.json');
            const data = await response.json();
            return data.data.map((tag:any) => ({
                id: tag.id,
                name: tag.attributes.name.en
            }));
        }
        catch(e){
            console.error('Error loading tags from local JSON:', e);
            return [];
        }
    };
    const handleFilterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const formValues = Object.fromEntries(formData.entries());
        console.log('Selected filters:', formValues);
        // Process selected filters and fetch manga list accordingly
        // Notes: tags uses UUID, demographic and contentRating use string values
        const includedTags: string[] = [];
        const contentRating: string[] = [];
        const publicationDemographic: string[] = [];
        for (const [key, value] of formData.entries()) {
            if (tags.find(tag => tag.id === value)) {
                includedTags.push(value.toString());
            } else if (["safe", "suggestive", "erotica", "  pornographic"].includes(value.toString())) {
                contentRating.push(value.toString());
            } else if (["shounen", "shoujo", "josei", "seinen", "none"].includes(value.toString())) {
                publicationDemographic.push(value.toString());
            }
        }
        // Fetch manga based on selected filters
        const fetchManga = async () => {
            try{
                const queryParams = new URLSearchParams();
                includedTags.forEach(tag => queryParams.append('includedTags', tag));
                contentRating.forEach(rating => queryParams.append('contentRating', rating));
                publicationDemographic.forEach(demo => queryParams.append('publicationDemographic', demo));
                queryParams.append('limit', '20');
                queryParams.append('offset', '0');
                const response = await fetch(`/api/manga/search?${queryParams.toString()}`);
                const data = await response.json();
                return data;
            }
            catch(e){
                console.error('Error fetching manga with filters:', e);
                return null;
            }
        };
        const data = fetchManga();
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
                    <form onSubmit={handleFilterSubmit}>
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
                        <button type="submit" className="border hover:cursor-pointer hover:underline">Confirm</button>
                    </form>
                )}
            </div>
            {showManga && (<div>
                {/* Manga list display component goes here */}
                {

                }

                <h2>Manga List (to be implemented)</h2>
            </div>
            )}
        </div>
    );
};
export default HomePage;