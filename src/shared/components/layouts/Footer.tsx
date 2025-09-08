function Footer() {
    return (
        <footer className="w-full bg-gray-900 text-white py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">회사</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">회사소개</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">채용정보</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">투자정보</a></li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">제품</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">서비스</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">기능</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">요금제</a></li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">지원</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">고객센터</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">문의하기</a></li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">소셜</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">Facebook</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">Instagram</a>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; 2024 Company Name. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer;