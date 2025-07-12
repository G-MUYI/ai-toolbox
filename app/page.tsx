"use client"
import { useState, useEffect } from "react"
import { RocketLaunchIcon, LockClosedIcon, BookOpenIcon, PhotoIcon, FireIcon, MagnifyingGlassIcon, UserCircleIcon, MoonIcon, SunIcon, ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/solid"

type Tool = {
  name: string
  description: string
  url: string
  category: string
  subCategory?: string
  isPremium?: boolean
}

const CATEGORY_TREE = [
  { 
    name: "AI工具", key: "AI工具", icon: <RocketLaunchIcon className="w-5 h-5" />, children: []
  },
  { 
    name: "小说", key: "小说", icon: <BookOpenIcon className="w-5 h-5" />, children: []
  },
  { 
    name: "图片", key: "图片", icon: <PhotoIcon className="w-5 h-5" />, children: []
  },
  { 
    name: "会员专区", key: "会员专区", icon: <LockClosedIcon className="w-5 h-5" />, 
    children: [
      { name: "破局资料", key: "破局资料" },
      // 你可以添加更多会员子类
    ]
  }
]

const tools: Tool[] = [
  { name: "ChatGPT", description: "OpenAI出品的AI聊天工具，支持多语言交互。", url: "https://chat.openai.com", category: "AI工具" },
  { name: "Midjourney", description: "AI图像生成平台，创意与艺术设计首选。", url: "https://midjourney.com", category: "AI工具", isPremium: true },
  { name: "《折腰》by 蓬莱客", description: "经典古言小说，文笔细腻，剧情跌宕。", url: "#", category: "小说" },
  { name: "插画壁纸包", description: "100+精美插画壁纸，适合桌面、创作参考。", url: "#", category: "图片" },
  // 会员专区 > 破局资料
  { name: "副业指南合集", description: "10本副业破局电子书，助你构建副业思维。", url: "#", category: "会员专区", subCategory: "破局资料", isPremium: true },
  { name: "搞钱计划模板", description: "高效搞钱SOP文档，适合个人IP、短视频起号。", url: "#", category: "会员专区", subCategory: "破局资料", isPremium: true },
]

const SITE_START_DATE = new Date("2024-06-01") // 你的建站日

export default function Home() {
  // 暗色模式
  const [dark, setDark] = useState(true)
  // 分类Tab和二级菜单展开
  const [selectedCat, setSelectedCat] = useState<string>("全部")
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  // 运营天数
  const [days, setDays] = useState<number>(0)
  useEffect(() => {
    setDays(Math.floor((Date.now() - SITE_START_DATE.getTime()) / 86400000))
  }, [])

  // 工具筛选
  const filteredTools = tools.filter(tool => {
    // 一级
    const catMatch = selectedCat === "全部"
      || tool.category === selectedCat
      || (selectedCat.includes("-") && (`${tool.category}-${tool.subCategory}` === selectedCat))
    // 搜索
    const searchMatch = tool.name.toLowerCase().includes(search.toLowerCase()) || tool.description.toLowerCase().includes(search.toLowerCase())
    return catMatch && searchMatch
  })

  // 暗色样式变量
  const mainBg = dark ? "bg-[#16181d]" : "bg-gray-50"
  const navBg = dark ? "bg-[#191b20]/95 border-b border-[#23242a]" : "bg-white/90 border-b border-gray-200"
  const cardBg = dark ? "bg-[#23242a] hover:bg-[#24272f]" : "bg-white hover:bg-gray-50"
  const textPrimary = dark ? "text-white" : "text-gray-900"
  const textSecondary = dark ? "text-gray-300" : "text-gray-600"
  const tagBg = dark ? "bg-[#282c33] text-blue-200" : "bg-blue-100 text-blue-700"
  const premiumBg = dark ? "bg-yellow-600/80 text-yellow-200" : "bg-yellow-300 text-yellow-800"
  const searchBg = dark ? "bg-[#23242a] border-[#33353a] text-white" : "bg-gray-100 border-gray-300 text-gray-900"

  return (
    <div className={`min-h-screen flex flex-col ${mainBg} transition-colors duration-200`}>
      {/* 顶部导航+分类二级菜单 */}
      <header className={`sticky top-0 z-30 w-full ${navBg} transition-all`}>
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-4 md:px-8">
          {/* LOGO */}
          <div className="flex items-center gap-2 font-bold text-2xl text-blue-400">
            <RocketLaunchIcon className="w-7 h-7" />
            <span>AI极客工具箱</span>
          </div>
          {/* 分类Tab/二级菜单 */}
          <nav className="hidden md:flex items-center gap-1 ml-10">
            <button
              onClick={() => { setSelectedCat("全部"); setOpenMenu(null); }}
              className={`
                px-4 py-1.5 rounded-full font-medium text-sm transition
                ${selectedCat === "全部" ? "bg-blue-700 text-white" : (dark ? "text-gray-400 hover:text-blue-200" : "text-gray-600 hover:text-blue-600")}
              `}
            >全部</button>
            {CATEGORY_TREE.map(cat => (
              cat.children.length > 0 ? (
                <div key={cat.key} className="relative">
                  <button
                    className={`
                      px-4 py-1.5 rounded-full font-medium text-sm flex items-center gap-1 transition
                      ${selectedCat.startsWith(cat.key) ? "bg-blue-700 text-white" : (dark ? "text-gray-400 hover:text-blue-200" : "text-gray-600 hover:text-blue-600")}
                    `}
                    onClick={() => setOpenMenu(openMenu === cat.key ? null : cat.key)}
                  >
                    {cat.icon}{cat.name}
                    {openMenu === cat.key ? <ChevronDownIcon className="w-4 h-4 ml-1" /> : <ChevronRightIcon className="w-4 h-4 ml-1" />}
                  </button>
                  {/* 二级菜单 */}
                  {openMenu === cat.key &&
                    <div className={`absolute left-0 top-11 min-w-[130px] rounded-xl shadow-lg ${dark ? "bg-[#22252a]" : "bg-white"} z-50`}>
                      {cat.children.map(child => (
                        <button
                          key={child.key}
                          onClick={() => { setSelectedCat(`${cat.key}-${child.key}`); setOpenMenu(null); }}
                          className={`
                            px-5 py-2 w-full text-left rounded-xl font-normal text-sm
                            ${selectedCat === `${cat.key}-${child.key}` ? "bg-blue-700 text-white" : (dark ? "text-gray-300 hover:bg-[#292c30]" : "text-gray-700 hover:bg-blue-100")}
                          `}
                        >{child.name}</button>
                      ))}
                    </div>
                  }
                </div>
              ) : (
                <button
                  key={cat.key}
                  onClick={() => { setSelectedCat(cat.key); setOpenMenu(null); }}
                  className={`
                    px-4 py-1.5 rounded-full font-medium text-sm flex items-center gap-1 transition
                    ${selectedCat === cat.key ? "bg-blue-700 text-white" : (dark ? "text-gray-400 hover:text-blue-200" : "text-gray-600 hover:text-blue-600")}
                  `}
                >{cat.icon}{cat.name}</button>
              )
            ))}
          </nav>
          {/* 搜索/登录/暗色 */}
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

      {/* Hero区 渐变色 */}
      <section className={`w-full flex flex-col items-center justify-center py-14 md:py-20 relative`}>
        <div className="absolute inset-0 -z-10">
          <div className="w-full h-full bg-gradient-to-r from-blue-700 via-indigo-900 to-gray-900 opacity-85"></div>
        </div>
        <h1 className="font-extrabold text-4xl md:text-6xl mb-3 text-white text-center drop-shadow tracking-tight leading-tight">
          AI极客工具箱
        </h1>
        <p className="mb-4 text-center text-base md:text-lg font-medium text-blue-100">
          收录AI工具、会员专区资料、小说、图片等极客精选资源，一站式导航，随心探索！
        </p>
        <div className="w-full flex justify-center mt-1">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 rounded-full text-sm outline-none border bg-white/90 border-blue-300 placeholder-gray-400 w-full shadow"
              placeholder="搜索AI/小说/图片"
            />
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-2 top-2 text-blue-500" />
          </div>
        </div>
      </section>

      {/* 移动端分类 */}
      <nav className="md:hidden flex flex-wrap justify-center gap-2 mb-3">
        <button
          onClick={() => { setSelectedCat("全部"); setOpenMenu(null); }}
          className={`
            px-4 py-1.5 rounded-full font-medium text-sm transition
            ${selectedCat === "全部" ? "bg-blue-700 text-white" : (dark ? "text-gray-400 hover:text-blue-200" : "text-gray-600 hover:text-blue-600")}
          `}
        >全部</button>
        {CATEGORY_TREE.map(cat => (
          cat.children.length > 0 ? (
            <div key={cat.key} className="relative">
              <button
                className={`
                  px-4 py-1.5 rounded-full font-medium text-sm flex items-center gap-1 transition
                  ${selectedCat.startsWith(cat.key) ? "bg-blue-700 text-white" : (dark ? "text-gray-400 hover:text-blue-200" : "text-gray-600 hover:text-blue-600")}
                `}
                onClick={() => setOpenMenu(openMenu === cat.key ? null : cat.key)}
              >
                {cat.icon}{cat.name}
                {openMenu === cat.key ? <ChevronDownIcon className="w-4 h-4 ml-1" /> : <ChevronRightIcon className="w-4 h-4 ml-1" />}
              </button>
              {openMenu === cat.key &&
                <div className={`absolute left-0 top-11 min-w-[120px] rounded-xl shadow-lg ${dark ? "bg-[#22252a]" : "bg-white"} z-50`}>
                  {cat.children.map(child => (
                    <button
                      key={child.key}
                      onClick={() => { setSelectedCat(`${cat.key}-${child.key}`); setOpenMenu(null); }}
                      className={`
                        px-4 py-2 w-full text-left rounded-xl font-normal text-sm
                        ${selectedCat === `${cat.key}-${child.key}` ? "bg-blue-700 text-white" : (dark ? "text-gray-300 hover:bg-[#292c30]" : "text-gray-700 hover:bg-blue-100")}
                      `}
                    >{child.name}</button>
                  ))}
                </div>
              }
            </div>
          ) : (
            <button
              key={cat.key}
              onClick={() => { setSelectedCat(cat.key); setOpenMenu(null); }}
              className={`
                px-4 py-1.5 rounded-full font-medium text-sm flex items-center gap-1 transition
                ${selectedCat === cat.key ? "bg-blue-700 text-white" : (dark ? "text-gray-400 hover:text-blue-200" : "text-gray-600 hover:text-blue-600")}
              `}
            >{cat.icon}{cat.name}</button>
          )
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
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-800/30">
                    {CATEGORY_TREE.find(c => c.key === tool.category)?.icon || <RocketLaunchIcon className="w-5 h-5" />}
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
                  {tool.subCategory ? tool.subCategory : tool.category}
                </span>
              </li>
            ))
          )}
        </ul>
      </main>

      {/* 底部栏+运营天数 */}
      <footer className={`text-center text-xs py-8 mt-8 ${dark ? "text-gray-500" : "text-gray-400"}`}>
        © {new Date().getFullYear()} AI极客工具箱 · 仅供学习交流<br />
        站点已稳定运营 <span className="font-bold text-blue-400">{days}</span> 天
      </footer>
    </div>
  )
}
