/**
 * Header component
 * - Home link (search bar goes to home page)
 * - Site title
 * - Navigation links (e.g., Genres, Popular, New Releases)? TBD
 */

const Header = () => {
    return (
        <header>
            <h1>Manga API Loader</h1>
            <nav>
                <ul>
                    <li><a href="/">Home</a></li>
                </ul>
            </nav>
        </header>
    );
};
export default Header;