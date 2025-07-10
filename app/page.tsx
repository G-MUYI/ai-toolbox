"use client"
import { useState } from "react"
import { RocketLaunchIcon, LockClosedIcon, BookOpenIcon, PhotoIcon, FireIcon, MagnifyingGlassIcon, UserCircleIcon, MoonIcon, SunIcon } from "@heroicons/react/24/solid"

type Tool = {
  name: string
  description: string
  url: string
  category: string
  isPremium?: boolean
}

const categoryList = [
  { name: "AI工具", key: "AI工具", icon: <RocketLaunchIcon className="w-5 h-5" /> },
  { name: "破局专区", key: "破局专区", icon: <FireIcon className="w-5 h-5" /> },
  { name: "小说", key: "小说", icon: <BookOpenIcon className="w-5 h-5" /> },
  { name: "图片", key: "图片", icon: <PhotoIcon className="w-5 h-5" /> }
]

const categories = ["全部", ...categoryList.map(c => c.key)]

const tools: Tool[] = [
  {
    name: "ChatGPT",
    description: "OpenAI 出品的强大 AI 聊天工具，支持多语言交互。",
    url: "https://chat.openai.com",
    category: "AI工具"
  },
  {
    name: "Midjourney",
    description: "AI 图像生成平台，适合创意和艺术创作。",
    url: "https://midjourney.com",
    category: "AI工具",
    isPremium: true
  },
  {
    name: "副业指南合集",
    description: "精选10本副业破局电子书，助你快速构建副业思维。",
    url: "#",
    category: "破局专区",
    isPremium: true
  },
  {
    name: "搞钱计划模板",
    description: "高效搞钱SOP文档，适合个人IP、短视频起号。",
    url: "#",
    category: "破局专区"
  },
  {
    name: "《折腰》by 蓬莱客",
    description: "经典古言小说，文笔细腻，剧情跌宕起伏。",
    url: "#",
    category: "小说"
  },
  {
    name: "《惊蛰》by 晋江作者",
    description: "现代悬疑文，节奏紧凑，推荐阅读。",
    url: "#",
    category: "小说",
    isPremium: true
  },
  {
    name: "插画壁纸包",
    description: "100+张精美日系插画壁纸，适合桌面、创作参考。",
    url: "#",
    category: "图片"
  },
  {
    name: "人物肖像写真合集",
    description: "高质量人物素材图包，适合视频剪辑和画画参考。",
    url: "#",
    category: "图片",
    isPremium: true
  }
]

export default function Home() {
  // 简易暗色模式切换
  const [dark, setDark] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("全部")
  const [search, setSearch] = useState("")

  const filteredTools = tools.filter(tool => {
    const matchCat = selectedCategory === "全部" || tool.category === selectedCategory
    const matchSearch = tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.description.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  // 暗色模式 tailwind 方案
  const mainBg = dark ? "bg-[#16181d]" : "bg-gray-50"
  const navBg = dark ? "bg-[#191b20]/95 border-b border-[#23242a]" : "bg-white/90 border-b border-gray-200"
  const cardBg = dark ? "bg-[#23242a] hover:bg-[#24272f]" : "bg-white hover:bg-gray-50"
  // const textPrimary = dark ? "text-white" : "text-gray-900"  // ← 已删除
  const textSecondary = dark ? "text-gray-300" : "text-gray-600"
  const tagBg = dark ? "bg-[#282c33] text-blue-200" : "bg-blue-100 text-blue-700"
  const premiumBg = dark ? "bg-yellow-600/80 text-yellow-200" : "bg-yellow-300 text-yellow-800"
  const searchBg = dark ? "bg-[#23242a] border-[#33353a] text-white" : "bg-gray-100 border-gray-300 text-gray-900"

  return (
    <div className={`min-h-screen flex flex-col ${mainBg} transition-colors duration-200`}>
      {/* 顶部导航栏+分类Tab */}
      <header className={`sticky top-0 z-30 w-full ${navBg} transition-all`}>
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-4 md:px-8">
          {/* 左LOGO */}
          <div className="flex items-center gap-2 font-bold text-2xl text-blue-400">
            <RocketLaunchIcon className="w-7 h-7" />
            <span className="tracking-wider">AI极客工具箱</span>
          </div>
          {/* 分类Tab */}
          <nav className="hidden md:flex items-center gap-2 ml-8">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`
                  px-3 py-1.5 rounded-full font-medium flex items-center gap-1 text-sm
                  border-transparent border-b-2 transition-all duration-100
                  ${selectedCategory === cat
                    ? "border-blue-500 text-blue-400 bg-blue-900/20"
                    : `${dark ? "text-gray-400 hover:text-blue-200" : "text-gray-600 hover:text-blue-600"}`
                  }
                `}
                style={{ minWidth: 54 }}
              >
                {cat !== "全部" && categoryList.find(c => c.key === cat)?.icon}
                {cat}
              </button>
            ))}
          </nav>
          {/* 搜索框+登录+暗色按钮 */}
          <div className="flex items-center gap-2 ml-auto">
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
            <button className="px-4 py-1.5 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 text-sm flex items-center">
              <UserCircleIcon className="w-4 h-4 mr-1" /> 登录
            </button>
            {/* 暗色按钮 */}
            <button
              onClick={() => setDark(!dark)}
              className="ml-1 rounded-full p-2 border border-transparent hover:border-blue-500 transition"
              aria-label="切换暗色模式"
            >
              {dark
                ? <SunIcon className="w-5 h-5 text-yellow-200" />
                : <MoonIcon className="w-5 h-5 text-gray-700" />}
            </button>
          </div>
        </div>
      </header>

      {/* Hero区 */}
      <section className={`w-full flex flex-col items-center justify-center py-10 ${dark ? "" : "bg-gradient-to-r from-blue-100 to-teal-100"}`}>
        <h1 className={`font-extrabold text-4xl md:text-6xl mb-3 mt-4 text-center ${dark ? "text-white" : "text-gray-900"} tracking-tight leading-tight`}>
          AI极客工具箱
        </h1>
        <p className={`mb-3 text-center text-base md:text-lg font-medium ${textSecondary}`}>
          收录AI工具、破局资料、小说与图片，专为极客与创意人导航。
        </p>
        <div className="w-full flex justify-center mt-1">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={`pl-9 pr-3 py-2 rounded-full text-sm outline-none border ${searchBg} placeholder-gray-400 w-full shadow`}
              placeholder="搜索AI/小说/图片"
            />
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-2 top-2 text-gray-400" />
          </div>
        </div>
      </section>

      {/* 移动端分类Tab */}
      <nav className="md:hidden flex flex-wrap justify-center gap-2 mb-3">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`
              px-3 py-1.5 rounded-full font-medium flex items-center gap-1 text-sm
              border-transparent border-b-2 transition-all duration-100
              ${selectedCategory === cat
                ? "border-blue-500 text-blue-400 bg-blue-900/20"
                : `${dark ? "text-gray-400 hover:text-blue-200" : "text-gray-600 hover:text-blue-600"}`
              }
            `}
          >
            {cat !== "全部" && categoryList.find(c => c.key === cat)?.icon}
            {cat}
          </button>
        ))}
      </nav>

      {/* 工具区 */}
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
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-blue-800/30`}>
                    {categoryList.find(c => c.key === tool.category)?.icon}
                  </div>
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-base font-bold hover:underline ${dark ? "text-blue-200" : "text-blue-600"}`}
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
                  {tool.category}
                </span>
              </li>
            ))
          )}
        </ul>
      </main>

      {/* 底部栏 */}
      <footer className={`text-center text-xs py-8 mt-8 ${dark ? "text-gray-500" : "text-gray-400"}`}>
        © {new Date().getFullYear()} AI极客工具箱 · 仅供学习交流
      </footer>
    </div>
  )
}
