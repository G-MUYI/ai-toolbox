"use client"
import { useState, useEffect, useRef } from "react"
import {
  RocketLaunchIcon, LockClosedIcon, BookOpenIcon, PhotoIcon,
  MagnifyingGlassIcon, UserCircleIcon, MoonIcon, SunIcon, ChevronDownIcon,
  ArrowRightCircleIcon, CheckCircleIcon, BoltIcon
} from "@heroicons/react/24/solid"

// 站点上线日，实际运营2天
const SITE_START_DATE = new Date("2025-07-10")

// 分类结构
const CATEGORY_TREE = [
  {
    name: "AI工具", key: "AI工具", icon: <RocketLaunchIcon className="w-5 h-5" />,
    children: [
      { name: "对话/聊天", key: "chat" },
      { name: "绘画/图片生成", key: "img" },
      { name: "写作/文案", key: "write" },
      { name: "PPT/演示", key: "ppt" },
      { name: "视频/配音", key: "media" },
      { name: "办公助手", key: "office" },
      { name: "数据/知识", key: "data" },
      { name: "代码/开发", key: "code" },
      { name: "营销/SEO", key: "seo" },
      { name: "AI搜索", key: "search" },
      { name: "效率/其他", key: "misc" }
    ]
  },
  { name: "小说", key: "小说", icon: <BookOpenIcon className="w-5 h-5" />, children: [] },
  { name: "图片", key: "图片", icon: <PhotoIcon className="w-5 h-5" />, children: [] },
  {
    name: "会员专区", key: "会员专区", icon: <LockClosedIcon className="w-5 h-5" />,
    children: [
      { name: "破局资料", key: "break" }
    ]
  },
  { name: "关于我们", key: "about", icon: <UserCircleIcon className="w-5 h-5" />, children: [] }
]

// 示例资源
const tools = [
  { name: "ChatGPT", description: "强大的AI对话工具", url: "#", category: "AI工具", subCategory: "chat" },
  { name: "Midjourney", description: "AI绘画生成平台", url: "#", category: "AI工具", subCategory: "img" },
  { name: "Notion AI", description: "AI助力写作/知识管理", url: "#", category: "AI工具", subCategory: "write" },
  { name: "AI PPT", description: "AI一键生成PPT", url: "#", category: "AI工具", subCategory: "ppt" },
  { name: "AiVoice", description: "AI配音合成工具", url: "#", category: "AI工具", subCategory: "media" },
  { name: "GitHub Copilot", description: "AI代码自动补全", url: "#", category: "AI工具", subCategory: "code" },
  { name: "SEO AI", description: "AI驱动SEO内容", url: "#", category: "AI工具", subCategory: "seo" },
  { name: "《折腰》by 蓬莱客", description: "经典古言小说", url: "#", category: "小说" },
  { name: "插画壁纸包", description: "精选AI插画壁纸", url: "#", category: "图片" },
  { name: "副业指南合集", description: "10本破局资料，会员专享", url: "#", category: "会员专区", subCategory: "break", isPremium: true }
]

// 网站大事件时间线
const TIMELINE = [
  { date: "2025-07-10", title: "AI极客工具箱 正式上线", icon: <BoltIcon className="w-4 h-4 text-blue-500" /> },
  { date: "2025-07-11", title: "会员专区资料开放，首批资源同步", icon: <CheckCircleIcon className="w-4 h-4 text-green-500" /> },
  { date: "2025-07-12", title: "支持AI工具主流细分分类与二级菜单交互", icon: <ArrowRightCircleIcon className="w-4 h-4 text-indigo-500" /> }
]

export default function Home() {
  const [dark, setDark] = useState(false)
  const [selectedCat, setSelectedCat] = useState<string | null>("AI工具")
  const [selectedSubCat, setSelectedSubCat] = useState<string | null>(null)
  const [hoverMenu, setHoverMenu] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [days, setDays] = useState<number>(0)
  const [aboutPage, setAboutPage] = useState(false)
  const hoverTimer = useRef<NodeJS.Timeout | null>(null)

  // 实时刷新运营天数
  useEffect(() => {
    function updateDays() {
      setDays(Math.max(1, Math.floor((Date.now() - SITE_START_DATE.getTime()) / 86400000) + 1))
    }
    updateDays()
    const timer = setInterval(updateDays, 1000 * 60 * 10)
    return () => clearInterval(timer)
  }, [])

  // 工具筛选
  const filteredTools = tools.filter(tool => {
    if (aboutPage) return false
    let matchCat =
      (selectedCat === null) ||
      (tool.category === selectedCat && (!selectedSubCat || tool.subCategory === selectedSubCat))
    if (selectedCat && !CATEGORY_TREE.find(c => c.key === selectedCat)?.children.length) {
      matchCat = tool.category === selectedCat
    }
    const searchMatch =
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.description.toLowerCase().includes(search.toLowerCase())
    return matchCat && searchMatch
  })

  // 样式变量
  const mainBg = dark ? "bg-[#181c22]" : "bg-gray-50"
  const navBg = dark ? "bg-[#232834] border-b border-[#343948]" : "bg-white/90 border-b border-gray-200"
  const cardBg = dark ? "bg-[#262a31] hover:bg-[#232a36]" : "bg-white hover:bg-blue-50"
  const textSecondary = dark ? "text-gray-300" : "text-gray-600"
  const tagBg = dark ? "bg-[#282c33] text-blue-200" : "bg-blue-100 text-blue-700"
  const premiumBg = dark ? "bg-yellow-600/80 text-yellow-200" : "bg-yellow-300 text-yellow-800"
  const searchBg = dark ? "bg-[#23242a] border-[#33353a] text-white" : "bg-gray-100 border-gray-300 text-gray-900"

  return (
    <div className={`min-h-screen flex flex-col ${mainBg} transition-colors duration-200`}>
      {/* 顶部导航 */}
      <header className={`sticky top-0 z-30 w-full ${navBg} transition-all`}>
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-4 md:px-8">
          {/* LOGO */}
          <div className="flex items-center gap-2 font-bold text-2xl text-blue-500 cursor-pointer"
            onClick={() => { setAboutPage(false); setSelectedCat("AI工具"); setSelectedSubCat(null); }}>
            <RocketLaunchIcon className="w-7 h-7" />
            <span>AI极客工具箱</span>
          </div>
          {/* 分类Tab+二级菜单 */}
          <nav className="flex items-center gap-1 ml-8">
            {CATEGORY_TREE.map(cat => (
              <div
                key={cat.key}
                className="relative"
                onMouseEnter={() => {
                  if (hoverTimer.current) clearTimeout(hoverTimer.current)
                  setHoverMenu(cat.key)
                }}
                onMouseLeave={() => {
                  if (hoverTimer.current) clearTimeout(hoverTimer.current)
                  hoverTimer.current = setTimeout(() => setHoverMenu(null), 300)
                }}
              >
                <button
                  className={`
                    px-4 py-2 rounded-full font-medium text-sm flex items-center gap-1 transition
                    ${selectedCat === cat.key && !selectedSubCat && !aboutPage ? "bg-blue-600 text-white" : dark ? "text-gray-300 hover:text-blue-200" : "text-gray-600 hover:text-blue-700"}
                  `}
                  onClick={() => {
                    if (cat.key === "about") {
                      setAboutPage(true)
                      setSelectedCat(null)
                      setSelectedSubCat(null)
                      setHoverMenu(null)
                    } else {
                      setAboutPage(false)
                      setSelectedCat(cat.key)
                      setSelectedSubCat(null)
                      setHoverMenu(null)
                    }
                  }}
                >
                  {cat.icon}
                  {cat.name}
                  {cat.children.length > 0 && (
                    <ChevronDownIcon className="w-4 h-4 ml-1" />
                  )}
                </button>
                {/* 二级菜单，悬停且有缓冲 */}
                {cat.children.length > 0 && hoverMenu === cat.key && !aboutPage && (
                  <div
                    className={`absolute left-0 top-full mt-2 min-w-[170px] rounded-xl shadow-lg ${dark ? "bg-[#232834]" : "bg-white"} z-50 border border-gray-100`}
                    onMouseEnter={() => {
                      if (hoverTimer.current) clearTimeout(hoverTimer.current)
                      setHoverMenu(cat.key)
                    }}
                    onMouseLeave={() => {
                      if (hoverTimer.current) clearTimeout(hoverTimer.current)
                      hoverTimer.current = setTimeout(() => setHoverMenu(null), 300)
                    }}
                  >
                    {cat.children.map(sub => (
                      <button
                        key={sub.key}
                        onClick={() => {
                          setAboutPage(false)
                          setSelectedCat(cat.key)
                          setSelectedSubCat(sub.key)
                          setHoverMenu(null)
                        }}
                        className={`
                          block px-5 py-2 w-full text-left rounded-xl font-normal text-sm
                          ${selectedCat === cat.key && selectedSubCat === sub.key && !aboutPage
                            ? "bg-blue-600 text-white"
                            : dark
                              ? "text-gray-200 hover:bg-[#252d3c]"
                              : "text-gray-700 hover:bg-blue-50"}
                        `}
                      >{sub.name}</button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          {/* 搜索/登录/会员/暗色 */}
          <div className="flex items-center gap-2 ml-auto">
            {!aboutPage && (
              <div className="relative hidden md:block">
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className={`pl-9 pr-3 py-1.5 rounded-full text-sm outline-none border ${searchBg} placeholder-gray-400 w-40 focus:ring-2 focus:ring-blue-400`}
                  placeholder="搜索"
                />
                <MagnifyingGlassIcon className="w-4 h-4 absolute left-2 top-2 text-gray-400" />
              </div>
            )}
            <button className="px-4 py-1.5 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 text-sm flex items-center">
              <UserCircleIcon className="w-4 h-4 mr-1" /> 登录
            </button>
            {/* 会员开通按钮 */}
            <button className="px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500 via-blue-600 to-purple-500 text-white font-semibold hover:opacity-80 text-sm ml-2 shadow transition">
              <LockClosedIcon className="w-4 h-4 mr-1" /> 开通会员
            </button>
            <button
              onClick={() => setDark(!dark)}
              className="ml-1 rounded-full p-2 border border-transparent hover:border-blue-500 transition"
              aria-label="切换暗色模式"
            >
              {dark ? <SunIcon className="w-5 h-5 text-yellow-200" /> : <MoonIcon className="w-5 h-5 text-gray-700" />}
            </button>
          </div>
        </div>
      </header>

      {/* Hero区 */}
      <section className={`w-full flex flex-col items-center justify-center py-14 md:py-20 relative overflow-visible`}>
        {/* 标题/副标题/搜索框 */}
        <div className="z-10 relative w-full flex flex-col items-center">
          <h1 className="font-extrabold text-4xl md:text-6xl mb-3 text-white text-center drop-shadow tracking-tight leading-tight">
            AI极客工具箱
          </h1>
          <p className="mb-4 text-center text-base md:text-lg font-medium text-blue-100">
            收录AI工具、主流细分分类、会员资料、小说、图片等极客精选资源，一站式导航，随心探索！
          </p>
          {!aboutPage && (
            <div className="w-full flex justify-center mt-1">
              <div className="relative w-full max-w-xs">
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9 pr-3 py-2 rounded-full text-sm outline-none border bg-white/90 border-blue-300 placeholder-gray-400 w-full shadow"
                  placeholder="搜索AI工具/分类/关键词"
                />
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-2 top-2 text-blue-500" />
              </div>
            </div>
          )}
        </div>
        {/* 局部渐变色背景装饰，仅在亮色模式显示 */}
        {!dark && (
          <div
            className="absolute w-full max-w-2xl h-28 md:h-40 left-1/2 -translate-x-1/2 top-[90%] rounded-3xl blur-[44px] pointer-events-none z-0"
            style={{
              background: "linear-gradient(90deg, #60a5fa 0%, #a78bfa 60%, #fff 100%)",
              opacity: 0.7,
            }}
          />
        )}
        {/* 运营天数实时 */}
        <div className="mt-8 text-sm text-blue-100 bg-black/20 px-4 py-1.5 rounded-full shadow backdrop-blur">
          <span>本站已稳定运营</span>
          <span className="mx-2 font-bold text-white">{days}</span>
          <span>天</span>
        </div>
      </section>

      {/* 关于我们页面 */}
      {aboutPage ? (
        <section className="w-full max-w-2xl mx-auto px-4 pb-12 pt-2 animate-fade-in">
          <div className="bg-white/90 dark:bg-[#232834] rounded-3xl shadow-lg p-8 mb-8 border border-blue-100">
            <h2 className="font-bold text-2xl mb-3 text-blue-600 flex items-center gap-2">
              <UserCircleIcon className="w-6 h-6" /> 关于我们
            </h2>
            <p className="text-base text-gray-700 dark:text-gray-200 leading-relaxed mb-5">
              <b>AI极客工具箱</b> 致力于为极客群体和AI爱好者整合和筛选优质的AI工具导航、会员资料、精品小说与图片等资源。
              我们以极简高效为理念，帮助你高效找到适合自己的AI产品与资料，不断追踪行业最新动态，持续丰富和优化导航内容。<br /><br />
              欢迎你的宝贵建议和内容合作，本站支持自助提交工具与资源。<br />
              <span className="font-semibold text-blue-500">—— 做你的AI探索捷径！</span>
            </p>
            <div className="text-sm text-gray-400 dark:text-gray-400 mb-2">
              联系方式：极客站长 · <span className="font-mono">contact@aigeek.com</span>
            </div>
          </div>
          {/* 网站大事件时间线 */}
          <div>
            <h3 className="text-lg font-bold mb-3 text-blue-600 flex items-center gap-2">
              <BoltIcon className="w-5 h-5" /> 网站大事件
            </h3>
            <ol className="relative border-l-2 border-blue-200 pl-6 pb-6">
              {TIMELINE.map((item, idx) => (
                <li key={idx} className="mb-6 ml-2">
                  <span className="absolute -left-4 flex items-center justify-center w-8 h-8 rounded-full bg-white shadow border border-blue-300">
                    {item.icon}
                  </span>
                  <div className="pl-3">
                    <span className="block text-xs text-gray-400">{item.date}</span>
                    <span className="block text-base font-medium">{item.title}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : (
        // 工具卡片区
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 pb-12">
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredTools.length === 0 ? (
              <div className="col-span-full text-center text-gray-400 py-12">未找到相关资源</div>
            ) : (
              filteredTools.map((tool, idx) => (
                <li
                  key={idx}
                  className={`
                    ${cardBg} rounded-3xl shadow-lg p-6 flex flex-col gap-3 relative
                    border border-transparent hover:border-blue-500 hover:shadow-2xl hover:-translate-y-1 transition
                  `}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-800/30">
                      {CATEGORY_TREE.find(c => c.key === tool.category)?.icon || <RocketLaunchIcon className="w-5 h-5" />}
                    </div>
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-base font-bold hover:underline ${dark ? "text-blue-200" : "text-blue-700"}`}
                    >
                      {tool.name}
                    </a>
                    {tool.isPremium && (
                      <span className={`flex items-center gap-1 absolute top-4 right-4 ${premiumBg} text-xs px-2 py-0.5 rounded-full font-bold`}>
                        <LockClosedIcon className="w-4 h-4 inline" />
                        会员
                      </span>
                    )}
                  </div>
                  <p className={`text-xs ${textSecondary}`}>{tool.description}</p>
                  <span className={`mt-auto self-start text-xs px-2 py-0.5 rounded-full ${tagBg}`}>
                    {tool.subCategory
                      ? CATEGORY_TREE.find(c => c.key === tool.category)?.children.find(sub => sub.key === tool.subCategory)?.name || tool.subCategory
                      : tool.category}
                  </span>
                </li>
              ))
            )}
          </ul>
        </main>
      )}

      {/* 底部栏 */}
      <footer className={`text-center text-xs py-8 mt-8 ${dark ? "text-gray-500" : "text-gray-400"}`}>
        © {new Date().getFullYear()} AI极客工具箱 · 仅供学习交流
      </footer>
      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 0.4s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px);}
          to { opacity: 1; transform: none;}
        }
      `}</style>
    </div>
  )
}
