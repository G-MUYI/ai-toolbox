"use client"
import { useState, useEffect, useRef } from "react"
import {
  RocketLaunchIcon, LockClosedIcon, MagnifyingGlassIcon,
  UserCircleIcon, MoonIcon, SunIcon
} from "@heroicons/react/24/solid"

// ----------------- 类型定义 ----------------
type ToolItem = {
  name: string
  desc: string
  url: string
  tag: string
  isVip?: boolean
}

type GroupType = {
  group: string
  tags: string[]
  category: string
  tools: ToolItem[]
}

type NavItem =
  | { name: string; sub: { name: string; link: string }[] }
  | { name: string; link: string }

// ----------------- 示例数据 ----------------
const GROUPS: GroupType[] = [
  {
    group: "文本生成与编辑",
    tags: ["AI写作助手", "AI智能摘要", "AI文案生成", "AI博客生成", "AI文案写作"],
    category: "write",
    tools: [
      { name: "ChatGPT", desc: "最火爆的AI对话/写作助手", url: "https://chat.openai.com", tag: "AI写作助手" },
      { name: "Grammarly", desc: "AI语法纠正、润色", url: "https://grammarly.com", tag: "AI文案写作" },
      { name: "QuillBot", desc: "AI自动改写与润色", url: "https://quillbot.com", tag: "AI文案写作" },
      { name: "Notion AI", desc: "AI智能文档写作和头脑风暴", url: "https://notion.so", tag: "AI智能摘要" },
      { name: "Sudowrite", desc: "创作者专用AI灵感生成器", url: "https://sudowrite.com", tag: "AI写作助手", isVip: true }
    ]
  },
  {
    group: "图像生成与编辑",
    tags: ["AI绘画", "图像处理", "设计工具", "照片编辑"],
    category: "image",
    tools: [
      { name: "Midjourney", desc: "顶级AI绘画工具", url: "https://midjourney.com", tag: "AI绘画", isVip: true },
      { name: "DALL-E", desc: "OpenAI的图像生成AI", url: "https://openai.com/dall-e-2", tag: "AI绘画" },
      { name: "Stable Diffusion", desc: "开源AI图像生成", url: "https://stability.ai", tag: "AI绘画" },
      { name: "Canva AI", desc: "AI设计助手", url: "https://canva.com", tag: "设计工具" }
    ]
  },
  {
    group: "音频与视频",
    tags: ["AI配音", "视频编辑", "音频处理", "语音合成"],
    category: "audio",
    tools: [
      { name: "Murf", desc: "AI语音生成器", url: "https://murf.ai", tag: "AI配音" },
      { name: "Descript", desc: "AI视频编辑工具", url: "https://descript.com", tag: "视频编辑" },
      { name: "Speechify", desc: "文本转语音工具", url: "https://speechify.com", tag: "语音合成" }
    ]
  }
]

const NAV: NavItem[] = [
  {
    name: "AI工具",
    sub: [
      { name: "写作", link: "#write" },
      { name: "图片", link: "#image" },
      { name: "音频视频", link: "#audio" }
    ]
  },
  {
    name: "会员专区",
    sub: [
      { name: "破局资料", link: "#vip-break" },
      { name: "实战文档", link: "#vip-doc" }
    ]
  },
  {
    name: "关于我们",
    link: "#about"
  }
]

// 站点配置
const SITE_START_DATE = new Date("2024-01-10")
const TIMELINE = [
  { date: "2024-01-10", title: "AI极客工具箱上线 🚀" },
  { date: "2024-01-12", title: "会员专区/破局资源首发" },
  { date: "2024-01-13", title: "支持暗黑模式和运营天数展示" },
  { date: "2024-01-15", title: "支持二级菜单与时间线" },
]

const ABOUT_ME = `大家好！我是木易，AI极客工具箱的创建者。
热衷于AI工具收集与分享，致力于为开发者、自由职业者和数字创作者提供一站式AI资源导航和成长资料。本站长期维护更新，欢迎加入共建！`

// -------------- 主组件 -----------------
export default function Home() {
  // 状态管理
  const [dark, setDark] = useState(false)
  const [search, setSearch] = useState("")
  const [days, setDays] = useState<number>(0)
  const [about, setAbout] = useState(false)
  const [navOpen, setNavOpen] = useState<number | null>(null)
  
  // 修复：使用对象管理每个分组的活跃标签
  const [activeTagMap, setActiveTagMap] = useState<Record<number, string>>(() => {
    const initialMap: Record<number, string> = {}
    GROUPS.forEach((group, idx) => {
      initialMap[idx] = group.tags[0] || ""
    })
    return initialMap
  })
  
  const [activeSection, setActiveSection] = useState(0)
  
  // Refs - 修复类型问题
  const navTimeout = useRef<NodeJS.Timeout | null>(null)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  // 计算运营天数
  useEffect(() => {
    function updateDays() {
      const diffTime = Date.now() - SITE_START_DATE.getTime()
      const diffDays = Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1)
      setDays(diffDays)
    }
    updateDays()
    const timer = setInterval(updateDays, 1000 * 60 * 10)
    return () => clearInterval(timer)
  }, [])

  // 滚动监听 - 修复类型问题
  useEffect(() => {
    if (about) return
    
    function onScroll() {
      const scrollY = window.scrollY + 120
      let current = 0
      
      sectionRefs.current.forEach((ref, i) => {
        if (ref && ref.offsetTop <= scrollY) {
          current = i
        }
      })
      
      setActiveSection(current)
    }
    
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [about])

  // 搜索自动定位
  useEffect(() => {
    if (!search.trim()) return
    
    const searchLower = search.toLowerCase()
    for (let i = 0; i < GROUPS.length; i++) {
      const hasMatch = GROUPS[i].tools.some(tool =>
        tool.name.toLowerCase().includes(searchLower) || 
        tool.desc.toLowerCase().includes(searchLower)
      )
      
      if (hasMatch) {
        const targetRef = sectionRefs.current[i]
        if (targetRef) {
          targetRef.scrollIntoView({ 
            behavior: "smooth", 
            block: "start" 
          })
        }
        break
      }
    }
  }, [search])

  // 事件处理函数
  const handleLogoClick = () => {
    setAbout(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // 修改：只更新标签，不滚动页面
  const handleTagClick = (groupIdx: number, tag: string) => {
    setActiveTagMap(prev => ({
      ...prev,
      [groupIdx]: tag
    }))
    // 移除滚动逻辑，只更新标签状态
  }

  const handleNavEnter = (idx: number) => {
    if (navTimeout.current) clearTimeout(navTimeout.current)
    setNavOpen(idx)
  }

  const handleNavLeave = () => {
    navTimeout.current = setTimeout(() => setNavOpen(null), 180)
  }

  const handleNavMenuClick = (idx: number) => {
    setNavOpen(navOpen === idx ? null : idx)
  }

  // 过滤搜索结果
  const getFilteredTools = (tools: ToolItem[]) => {
    if (!search.trim()) return tools
    
    const searchLower = search.toLowerCase()
    return tools.filter(tool =>
      tool.name.toLowerCase().includes(searchLower) || 
      tool.desc.toLowerCase().includes(searchLower)
    )
  }

  // 样式类名
  const pagePadding = "max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8"
  const btnBase = "rounded-full px-4 py-2 font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2"
  const btnVip = "bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 text-white hover:opacity-90 shadow-lg"
  const navBg = dark ? "bg-gray-900/95 border-gray-700" : "bg-white/95 border-gray-200"
  const mainBg = dark ? "bg-gray-900" : "bg-gray-50"
  const textMain = dark ? "text-white" : "text-gray-900"
  const textSecond = dark ? "text-gray-300" : "text-gray-600"
  const textThird = dark ? "text-gray-400" : "text-gray-500"
  const inputBg = dark 
    ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400" 
    : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"

  return (
    <div className={`min-h-screen ${mainBg} transition-colors duration-300`}>
      {/* 导航栏 */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b ${navBg}`}>
        <div className={`${pagePadding} h-16 flex items-center justify-between`}>
          {/* Logo */}
          <div
            className="flex items-center gap-2 font-bold text-2xl text-blue-600 cursor-pointer hover:text-blue-700 transition-colors"
            onClick={handleLogoClick}
            title="返回首页"
          >
            <RocketLaunchIcon className="w-7 h-7" />
            <span className="hidden sm:inline">AI极客工具箱</span>
            <span className="sm:hidden">AI工具箱</span>
          </div>

          {/* 导航菜单 */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV.map((item, idx) =>
              "sub" in item ? (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => handleNavEnter(idx)}
                  onMouseLeave={handleNavLeave}
                >
                  <button
                    className={`text-sm font-medium transition-colors flex items-center gap-1 ${
                      dark ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-blue-600"
                    }`}
                    onClick={() => handleNavMenuClick(idx)}
                  >
                    {item.name}
                    <svg 
                      className={`w-4 h-4 transition-transform duration-200 ${
                        navOpen === idx ? "rotate-180" : ""
                      }`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {navOpen === idx && (
                    <div
                      className={`absolute left-0 top-full mt-2 min-w-[140px] rounded-lg shadow-lg py-2 border ${
                        dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                      }`}
                      onMouseEnter={() => { if (navTimeout.current) clearTimeout(navTimeout.current) }}
                      onMouseLeave={handleNavLeave}
                    >
                      {item.sub.map(sub => (
                        <a
                          key={sub.name}
                          href={sub.link}
                          className={`block px-4 py-2 text-sm transition-colors ${
                            dark 
                              ? "text-gray-300 hover:text-white hover:bg-gray-700" 
                              : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                          }`}
                        >
                          {sub.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  key={item.name}
                  className={`text-sm font-medium transition-colors ${
                    dark ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-blue-600"
                  }`}
                  onClick={() => setAbout(item.name === "关于我们")}
                >
                  {item.name}
                </button>
              )
            )}
          </nav>

          {/* 右侧按钮组 */}
          <div className="flex items-center gap-3">
            <button className={`${btnBase} bg-blue-100 hover:bg-blue-200 text-blue-700`}>
              <UserCircleIcon className="w-4 h-4" />
              <span className="hidden sm:inline">登录</span>
            </button>
            <button className={`${btnBase} ${btnVip}`}>
              <LockClosedIcon className="w-4 h-4" />
              <span className="hidden sm:inline">开通会员</span>
            </button>
            <button
              onClick={() => setDark(!dark)}
              className={`p-2 rounded-full transition-colors ${
                dark ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
              aria-label="切换暗色模式"
            >
              {dark ? (
                <SunIcon className="w-5 h-5 text-yellow-400" />
              ) : (
                <MoonIcon className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero 区域 */}
      {!about && (
        <section className="relative overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute inset-0 z-0">
            {dark ? (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black" />
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl">
                  <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" />
                  <div className="absolute top-40 right-10 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000" />
                  <div className="absolute bottom-20 left-1/2 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-500" />
                </div>
              </>
            )}
          </div>

          <div className={`${pagePadding} relative z-10 pt-16 pb-20`}>
            <div className="text-center max-w-4xl mx-auto">
              <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight ${textMain}`}>
                发现最好的
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  AI工具
                </span>
              </h1>
              
              <div className={`text-lg sm:text-xl mb-4 ${textSecond}`}>
                <span className="font-mono text-blue-600 font-bold">{days}</span> 天持续运营 · 
                已收录 <span className="font-mono text-blue-600 font-bold">{GROUPS.reduce((sum, group) => sum + group.tools.length, 0)}</span> 款工具
              </div>
              
              <p className={`text-base sm:text-lg mb-8 max-w-2xl mx-auto ${textThird}`}>
                覆盖AI写作、绘图、音视频、会员资源等领域，一站式AI工具导航
              </p>

              {/* 搜索框 */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 rounded-2xl text-lg border-2 outline-none transition-all duration-300 ${inputBg} focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20`}
                    placeholder="搜索 AI 工具..."
                  />
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-blue-500" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 工具分组展示 */}
      {!about && (
        <main className={`${pagePadding} py-12`}>
          {GROUPS.map((group, idx) => {
            const activeTag = activeTagMap[idx] || group.tags[0] || ""
            const filteredByTag = group.tools.filter(tool => tool.tag === activeTag)
            const finalTools = getFilteredTools(filteredByTag)

            return (
              <section
                key={group.group}
                ref={(el) => { 
                  sectionRefs.current[idx] = el 
                }}
                className="mb-16"
              >
                {/* 分组标题和标签 */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                  <h2 className={`text-2xl sm:text-3xl font-bold ${textMain}`}>
                    {group.group}
                  </h2>
                  
                  <div className="flex flex-wrap gap-2">
                    {group.tags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => handleTagClick(idx, tag)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                          activeTag === tag
                            ? "bg-blue-600 text-white shadow-lg transform scale-105"
                            : dark
                            ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 工具卡片网格 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {finalTools.length === 0 ? (
                    <div className="col-span-full text-center py-16">
                      <div className={`text-lg ${textThird}`}>
                        {search ? "未找到匹配的工具" : "该分类暂无工具"}
                      </div>
                    </div>
                  ) : (
                    finalTools.map((tool) => (
                      <div
                        key={tool.name}
                        className={`group relative p-6 rounded-xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                          dark
                            ? "bg-gray-800 border-gray-700 hover:border-gray-600"
                            : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-blue-100"
                        }`}
                      >
                        {/* VIP 标识 */}
                        {tool.isVip && (
                          <div className="absolute top-4 right-4">
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">
                              <LockClosedIcon className="w-3 h-3" />
                              VIP
                            </span>
                          </div>
                        )}

                        <div className="flex flex-col h-full">
                          <h3 className={`text-lg font-bold mb-2 ${textMain} group-hover:text-blue-600 transition-colors`}>
                            {tool.name}
                          </h3>
                          
                          <p className={`text-sm mb-4 flex-1 ${textSecond}`}>
                            {tool.desc}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              dark ? "bg-gray-700 text-gray-300" : "bg-blue-50 text-blue-700"
                            }`}>
                              {tool.tag}
                            </span>
                            
                            <a
                              href={tool.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                            >
                              访问
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            )
          })}
        </main>
      )}

      {/* 关于我们页面 */}
      {about && (
        <main className={`${pagePadding} py-12`}>
          <div className={`max-w-4xl mx-auto rounded-2xl p-8 ${
            dark ? "bg-gray-800" : "bg-white"
          } shadow-xl`}>
            <h2 className={`text-3xl font-bold mb-8 ${textMain}`}>
              关于我们
            </h2>
            
            <div className={`text-lg leading-relaxed mb-12 whitespace-pre-line ${textSecond}`}>
              {ABOUT_ME}
            </div>

            <h3 className={`text-2xl font-bold mb-6 ${textMain}`}>
              网站发展时间线
            </h3>
            
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-600"></div>
              <div className="space-y-8">
                {TIMELINE.map((event) => (
                  <div key={event.date} className="relative flex items-start">
                    <div className="absolute left-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <div className="ml-12">
                      <div className={`text-sm mb-1 ${textThird}`}>
                        {event.date}
                      </div>
                      <div className={`text-base font-semibold ${textMain}`}>
                        {event.title}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* 底部 */}
      <footer className={`text-center py-8 border-t ${
        dark ? "border-gray-700 text-gray-400" : "border-gray-200 text-gray-500"
      }`}>
        <p className="text-sm">
          © {new Date().getFullYear()} AI极客工具箱 · 仅供学习交流使用
        </p>
      </footer>
    </div>
  )
}