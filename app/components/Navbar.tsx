import {Link} from "react-router";

const Navbar = () => {
    return (
        <nav className="navbar">
            <Link to="/">
                <p className="text-2xl font-bold text-gradient">RESUMIND</p>
            </Link>
            <div className="flex items-center gap-3">
                <Link
                    to="/match"
                    className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 rounded-full px-4 py-2 transition-colors"
                    id="nav-job-matcher"
                >
                    🎯 Job Matcher
                </Link>
                <Link to="/upload" className="primary-button w-fit" id="nav-upload">
                    Upload Resume
                </Link>
            </div>
        </nav>
    )
}
export default Navbar
