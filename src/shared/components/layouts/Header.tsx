import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {FaPaw, FaBars, FaTimes, FaSearch} from "react-icons/fa";
import {NAV_ITEMS} from "../../constants/navigation.ts";

function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const goToPage = (url: string) => {
        navigate(url);
    }

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
                    <button
                        className={`hidden md:block px-5 py-2 font-medium rounded-full transition-all duration-300 ${scrolled
                            ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:shadow-lg hover:shadow-purple-200'
                            : 'bg-white text-purple-600 hover:bg-opacity-90'}`}>
                        로그인
                    </button>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-2xl"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen
                            ? <FaTimes className={scrolled ? 'text-gray-900' : 'text-gray-900'}/>
                            : <FaBars className={scrolled ? 'text-gray-900' : 'text-gray-900'}/>}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg py-4 px-6 z-50">
                    <nav className="flex flex-col space-y-4">
                        <a href="#" className="text-gray-800 hover:text-purple-600 transition-colors font-medium">홈</a>
                        <a href="#"
                           className="text-gray-800 hover:text-purple-600 transition-colors font-medium">서비스</a>
                        <a href="#"
                           className="text-gray-800 hover:text-purple-600 transition-colors font-medium">커뮤니티</a>
                        <a href="#"
                           className="text-gray-800 hover:text-purple-600 transition-colors font-medium">고객지원</a>
                        <button
                            className="w-full mt-2 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full font-medium">
                            시작하기
                        </button>
                    </nav>
                </div>
            )}
        </header>
    );
}

export default Header;