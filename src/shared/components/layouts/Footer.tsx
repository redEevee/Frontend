import { FaPaw, FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";

function Footer() {
    return (
        <footer className="w-full bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 mt-auto relative overflow-hidden">
            {/* 장식적인 요소 */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-blue-500"></div>
            <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-purple-600 opacity-10"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-blue-500 opacity-10"></div>
            
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* 상단 섹션 */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 pb-8 border-b border-gray-700">
                    <div className="flex items-center mb-6 md:mb-0">
                        <FaPaw className="text-3xl text-purple-500 mr-2" />
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">MyRealPet</h2>
                    </div>
                    
                    <div className="flex flex-wrap gap-4">
                        <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 hover:bg-purple-600 transition-colors duration-300">
                            <FaFacebookF className="text-white" />
                        </a>
                        <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 hover:bg-purple-600 transition-colors duration-300">
                            <FaTwitter className="text-white" />
                        </a>
                        <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 hover:bg-purple-600 transition-colors duration-300">
                            <FaInstagram className="text-white" />
                        </a>
                        <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 hover:bg-purple-600 transition-colors duration-300">
                            <FaYoutube className="text-white" />
                        </a>
                    </div>
                </div>
                
                {/* 메인 링크 섹션 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    <div>
                        <h3 className="text-lg font-semibold mb-6 flex items-center">
                            <span className="w-6 h-0.5 bg-purple-500 mr-2"></span>
                            회사 소개
                        </h3>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            MyRealPet은 반려동물과 보호자를 위한 최고의 소셜 네트워크 및 관리 플랫폼입니다. 우리는 모든 반려동물이 행복하고 건강한 삶을 살 수 있도록 돕기 위해 최선을 다하고 있습니다.
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-start">
                                <MdLocationOn className="text-purple-500 text-xl mt-1 mr-3" />
                                <span className="text-gray-400">서울특별시 강남구 테헤란로 123</span>
                            </div>
                            <div className="flex items-center">
                                <MdPhone className="text-purple-500 text-xl mr-3" />
                                <span className="text-gray-400">02-123-4567</span>
                            </div>
                            <div className="flex items-center">
                                <MdEmail className="text-purple-500 text-xl mr-3" />
                                <span className="text-gray-400">contact@MyRealPet.com</span>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="text-lg font-semibold mb-6 flex items-center">
                            <span className="w-6 h-0.5 bg-purple-500 mr-2"></span>
                            서비스
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2"></span>
                                    펫 SNS
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2"></span>
                                    건강 관리
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2"></span>
                                    일정 관리
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2"></span>
                                    커뮤니티
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2"></span>
                                    전문가 상담
                                </a>
                            </li>
                        </ul>
                    </div>
                    
                    <div>
                        <h3 className="text-lg font-semibold mb-6 flex items-center">
                            <span className="w-6 h-0.5 bg-purple-500 mr-2"></span>
                            지원
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2"></span>
                                    고객센터
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2"></span>
                                    자주 묻는 질문
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2"></span>
                                    이용 가이드
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2"></span>
                                    문의하기
                                </a>
                            </li>
                        </ul>
                    </div>
                    
                    <div>
                        <h3 className="text-lg font-semibold mb-6 flex items-center">
                            <span className="w-6 h-0.5 bg-purple-500 mr-2"></span>
                            뉴스레터
                        </h3>
                        <p className="text-gray-400 mb-4">
                            최신 소식과 반려동물 케어 팁을 받아보세요.
                        </p>
                        <div className="flex">
                            <input 
                                type="email" 
                                placeholder="이메일 주소" 
                                className="bg-gray-800 text-gray-200 px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
                            />
                            <button className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 rounded-r-lg hover:opacity-90 transition-opacity">
                                구독
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* 하단 저작권 섹션 */}
                <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm mb-4 md:mb-0">
                        &copy; 2025 MyRealPet. 모든 권리 보유.
                    </p>
                    <div className="flex space-x-6">
                        <a href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">개인정보처리방침</a>
                        <a href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">이용약관</a>
                        <a href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">쿠키 정책</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;