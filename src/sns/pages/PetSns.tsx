import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaDog,
    FaCat,
    FaHeart,
    FaWalking,
    FaBaby,
    FaStar, FaEllipsisH, FaComment, FaShare, FaBookmark
} from 'react-icons/fa';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

interface Post {
    id: number;
    username: string;
    userImage: string;
    image: string;
    caption: string;
    likes: number;
    comments: number;
    timestamp: string;
    tags: string[];
}

function PetSns() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    const categories = [
        { name: "강아지", icon: <FaDog />, image: "/images/friends.jpg" },
        { name: "고양이", icon: <FaCat />, image: "/images/share.jpg" },
        { name: "개냥이", icon: <FaHeart />, image: "/images/like.jpg" }, // '사랑스러운 반려동물' 느낌
        { name: "산책", icon: <FaWalking />, image: "/images/walk.jpg" }, // 산책, 걷기
        { name: "아기고양이", icon: <FaBaby />, image: "/images/calendar.jpg" }, // 아기 냥이
        { name: "재롱", icon: <FaStar />, image: "/images/management.jpg" }, // 귀여운 재롱
    ];

    // 샘플 데이터 생성
    useEffect(() => {
        // 실제 앱에서는 API에서 데이터를 가져오게 됩니다
        const samplePosts: Post[] = [
            {
                id: 1,
                username: '멍멍이와함께',
                userImage: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`,
                image: `https://source.unsplash.com/800x1000/?dog,pet/${Math.random()}`,
                caption: '오늘 공원에서 산책하는 우리 댕댕이 너무 귀엽죠? 🐶 #강아지 #산책 #행복한하루',
                likes: 1243,
                comments: 42,
                timestamp: '2시간 전',
                tags: ['강아지', '산책', '행복한하루']
            },
            {
                id: 2,
                username: '고양이집사',
                userImage: `https://randomuser.me/api/portraits/women/${Math.floor(Math.random() * 100)}.jpg`,
                image: `https://source.unsplash.com/800x1000/?cat,pet/${Math.random()}`,
                caption: '창가에서 일광욕 중인 우리 냥이 😻 #고양이 #일광욕 #집냥이',
                likes: 2567,
                comments: 89,
                timestamp: '4시간 전',
                tags: ['고양이', '일광욕', '집냥이']
            },
            {
                id: 3,
                username: '햄스터마스터',
                userImage: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`,
                image: `https://source.unsplash.com/800x1000/?hamster,pet/${Math.random()}`,
                caption: '햄스터 휠 위에서 열심히 뛰는 중! 귀여워 죽겠어요 🐹 #햄스터 #귀염둥이 #소동물',
                likes: 876,
                comments: 23,
                timestamp: '6시간 전',
                tags: ['햄스터', '귀염둥이', '소동물']
            },
            {
                id: 4,
                username: '토끼사랑',
                userImage: `https://randomuser.me/api/portraits/women/${Math.floor(Math.random() * 100)}.jpg`,
                image: `https://source.unsplash.com/800x1000/?rabbit,pet/${Math.random()}`,
                caption: '당근을 먹는 우리 토끼 🐰 너무 행복해 보이죠? #토끼 #당근 #반려동물',
                likes: 1532,
                comments: 56,
                timestamp: '12시간 전',
                tags: ['토끼', '당근', '반려동물']
            },
            {
                id: 5,
                username: '앵무새친구',
                userImage: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`,
                image: `https://source.unsplash.com/800x1000/?parrot,bird/${Math.random()}`,
                caption: '오늘도 수다쟁이 앵무새와 대화 중 🦜 말을 너무 잘해요! #앵무새 #반려조 #수다쟁이',
                likes: 943,
                comments: 31,
                timestamp: '1일 전',
                tags: ['앵무새', '반려조', '수다쟁이']
            },
        ];

        setPosts(samplePosts);
        setLoading(false);
    }, []);

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        if (newDirection === 1) {
            setCurrentIndex(prevIndex => 
                prevIndex === posts.length - 1 ? 0 : prevIndex + 1
            );
        } else {
            setCurrentIndex(prevIndex => 
                prevIndex === 0 ? posts.length - 1 : prevIndex - 1
            );
        }
    };

    const variants = {
        enter: (direction: number) => {
            return {
                x: direction > 0 ? 1000 : -1000,
                opacity: 0
            };
        },
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => {
            return {
                zIndex: 0,
                x: direction < 0 ? 1000 : -1000,
                opacity: 0
            };
        }
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };

    const formatNumber = (num: number): string => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        } else {
            return num.toString();
        }
    };

    if (loading) {
        return (
            <div className="pt-24 h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="pt-28 pb-28 min-h-screen bg-violet-500">
            <div className="max-w-1/2 mx-auto relative h-[calc(100vh-8rem)]">
                <div className="relative w-full h-full overflow-hidden">
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                            }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={1}
                            onDragEnd={(e, { offset, velocity }) => {
                                const swipe = swipePower(offset.x, velocity.x);
                                if (swipe < -swipeConfidenceThreshold) {
                                    paginate(1);
                                } else if (swipe > swipeConfidenceThreshold) {
                                    paginate(-1);
                                }
                            }}
                            className="absolute w-full h-full"
                        >
                            {posts[currentIndex] && (
                                <div className="w-full h-full bg-white rounded-lg overflow-hidden shadow-lg flex flex-col">
                                    {/* 헤더 */}
                                    <div className="p-4 flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-500 p-0.5">
                                                <img
                                                    src={posts[currentIndex].userImage}
                                                    alt={posts[currentIndex].username}
                                                    className="w-full h-full object-cover rounded-full"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800">{posts[currentIndex].username}</h3>
                                                <p className="text-xs text-gray-500">{posts[currentIndex].timestamp}</p>
                                            </div>
                                        </div>
                                        <button className="text-gray-500 hover:text-gray-700">
                                            <FaEllipsisH />
                                        </button>
                                    </div>
                                    
                                    {/* 이미지 */}
                                    <div className="flex-1 relative overflow-hidden flex items-center justify-center">
                                        {/*<img */}
                                        {/*    src={posts[currentIndex].image} */}
                                        {/*    alt="Post"*/}
                                        {/*    className="w-full h-full object-cover"*/}
                                        {/*/>*/}
                                        이미지
                                        
                                        {/* 좌우 화살표 */}
                                        <button 
                                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 text-gray-800 hover:bg-opacity-70 transition-all"
                                            onClick={() => paginate(-1)}
                                        >
                                            <MdKeyboardArrowLeft size={24} />
                                        </button>
                                        <button 
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 text-gray-800 hover:bg-opacity-70 transition-all"
                                            onClick={() => paginate(1)}
                                        >
                                            <MdKeyboardArrowRight size={24} />
                                        </button>
                                    </div>
                                    
                                    {/* 액션 버튼 */}
                                    <div className="p-4 ">
                                        <div className="flex justify-between mb-3">
                                            <div className="flex space-x-4">
                                                <button className="text-red-500 hover:text-red-600 transition-colors">
                                                    <FaHeart size={24} />
                                                </button>
                                                <button className="text-blue-500 hover:text-blue-600 transition-colors">
                                                    <FaComment size={24} />
                                                </button>
                                                <button className="text-green-500 hover:text-green-600 transition-colors">
                                                    <FaShare size={24} />
                                                </button>
                                            </div>
                                            <button className="text-gray-700 hover:text-gray-900 transition-colors">
                                                <FaBookmark size={24} />
                                            </button>
                                        </div>
                                        
                                        {/* 좋아요 수 */}
                                        <p className="font-semibold text-gray-800 mb-1">
                                            좋아요 {formatNumber(posts[currentIndex].likes)}개
                                        </p>
                                        
                                        {/* 캡션 */}
                                        <p className="text-gray-800 mb-2">
                                            <span className="font-semibold">{posts[currentIndex].username}</span> {posts[currentIndex].caption}
                                        </p>
                                        
                                        {/* 태그 */}
                                        <div className="flex flex-wrap gap-1 mb-2">
                                            {posts[currentIndex].tags.map((tag, index) => (
                                                <span key={index} className="text-blue-500 text-sm">#{tag}</span>
                                            ))}
                                        </div>
                                        
                                        {/* 댓글 수 */}
                                        <p className="text-gray-500 text-sm">
                                            댓글 {posts[currentIndex].comments}개 모두 보기
                                        </p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
                
                {/* 페이지 인디케이터 */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                    {posts.map((_, index) => (
                        <div 
                            key={index} 
                            className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-purple-600' : 'bg-gray-300'}`}
                            onClick={() => {
                                setDirection(index > currentIndex ? 1 : -1);
                                setCurrentIndex(index);
                            }}
                        />
                    ))}
                </div>

            </div>

            <section className="py-16 pt-36 bg-violet-500">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
                        카테고리
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categories.map((cat, idx) => (
                            <div
                                key={idx}
                                className="relative cursor-pointer group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                            >
                                {/* 배경 이미지 */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                    style={{ backgroundImage: `url(${cat.image})` }}
                                ></div>

                                {/* 오버레이 */}
                                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-20 transition-colors duration-300"></div>

                                {/* 텍스트 & 아이콘 */}
                                <div className="relative z-10 flex flex-col items-center justify-center h-64 text-white text-center p-4">
                                    <div className="text-4xl mb-4">{cat.icon}</div>
                                    <h3 className="text-xl font-semibold">{cat.name}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


        </div>
    );
}

export default PetSns;