import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {FaPaw, FaBars, FaTimes, FaSearch, FaUser, FaSignOutAlt} from "react-icons/fa";
import {NAV_ITEMS} from "../../constants/navigation.ts";
import {useAuth} from "../../../account/hooks";

function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();

    const goToPage = (url: string) => {
        navigate(url);
    }

    const handleLogout = async () => {
        try {
            await logout();
            setUserMenuOpen(false);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = () => {
            setUserMenuOpen(false);
        };

        if (userMenuOpen) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [userMenuOpen]);

    return (
        <header
            className={`h-16 w-full fixed top-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-white shadow-lg backdrop-blur-lg bg-opacity-90'
                : 'bg-transparent'}`}
        >
            <div className="flex items-center justify-between w-full max-w-7xl mx-auto h-full px-6">
                <div className="flex items-center space-x-2">
                    <div className="flex items-center cursor-pointer">
                        <FaPaw className={`text-2xl ${scrolled ? 'text-purple-600' : 'text-white'}`}/>
                        <h1 onClick={() => goToPage("/")}
                            className={`text-xl font-bold ml-2  ${scrolled ? 'text-gray-900' : 'text-white'}`}>MyRealPet</h1>
                    </div>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                    {NAV_ITEMS.map((item, index) => (
                        <a key={index} onClick={() => goToPage(item.path)}
                           className={`font-medium transition-colors hover:text-purple-500 cursor-pointer ${scrolled ? 'text-gray-700' : 'text-white'}`}>{item.name}</a>
                    ))}
                </nav>

                <div className="flex items-center space-x-4">
                    <button
                        className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                        <FaSearch className="text-sm"/>
                    </button>

                    {isAuthenticated ? (
                        <div className="relative hidden md:block">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setUserMenuOpen(!userMenuOpen);
                                }}
                                className={`flex items-center space-x-2 px-4 py-2 font-medium rounded-full transition-all duration-300 ${scrolled
                                    ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:shadow-lg hover:shadow-purple-200'
                                    : 'bg-white text-purple-600 hover:bg-opacity-90'}`}>
                                <FaUser className="text-sm"/>
                                <span>{user?.username}</span>
                            </button>

                            {userMenuOpen && (
                                <div
                                    onClick={(e) => e.stopPropagation()}
                                    className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                                        <FaSignOutAlt />
                                        <span>로그아웃</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={() => navigate('/login')}
                            className={`hidden md:block px-5 py-2 font-medium rounded-full transition-all duration-300 ${scrolled
                                ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:shadow-lg hover:shadow-purple-200'
                                : 'bg-white text-purple-600 hover:bg-opacity-90'}`}>
                            로그인
                        </button>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-2xl"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen
                            ? <FaTimes className={scrolled ? 'text-gray-900' : 'text-white'}/>
                            : <FaBars className={scrolled ? 'text-gray-900' : 'text-white'}/>}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg py-4 px-6 z-50">
                    <nav className="flex flex-col space-y-4">
                        {NAV_ITEMS.map((item, index) => (
                            <a key={index} onClick={() => goToPage(item.path)}
                               className="text-gray-800 hover:text-purple-600 transition-colors font-medium cursor-pointer">{item.name}</a>
                        ))}

                        {isAuthenticated ? (
                            <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                                <div className="flex items-center space-x-2 py-2">
                                    <FaUser className="text-purple-600"/>
                                    <span className="text-gray-800 font-medium">{user?.username}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full py-2 bg-red-500 text-white rounded-full font-medium flex items-center justify-center space-x-2">
                                    <FaSignOutAlt />
                                    <span>로그아웃</span>
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full mt-2 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full font-medium">
                                시작하기
                            </button>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}

export default Header;