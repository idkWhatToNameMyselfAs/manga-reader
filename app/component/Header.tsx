/**
 * Header component
 * - Home link (search bar goes to home page)
 * - Site title
 * - Navigation links (e.g., Genres, Popular, New Releases)? TBD
 */

import Link from "next/link";
const Header = () => {
    return (
        <div className="flex items-center bg-gray-200 p-4 justify-between">
            <div className="flex-1 text-left">
                <Link href="/" className="text-lg font-semibold">Home</Link>
            </div>
            <div><h1 className="flex-1 text-2xl font-bold">Manga API Loader</h1></div>
            <div className="flex-1"></div>
        </div>
    );
};
export default Header;