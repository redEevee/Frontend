function Header() {
    return (
        <header className="w-full h-16 bg-white shadow-md border-b border-gray-200 flex items-center px-6 sticky top-0 z-50">
            <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-semibold text-gray-900">Logo</h1>
                </div>
                <nav className="hidden md:flex items-center space-x-6">
                    <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">메뉴1</a>
                    <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">메뉴2</a>
                    <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">메뉴3</a>
                </nav>
                <div className="flex items-center space-x-3">
                    <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        시작하기
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Header;