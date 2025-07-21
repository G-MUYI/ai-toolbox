"use client"
import { useState, useEffect, useRef } from "react"
import {
  RocketLaunchIcon, LockClosedIcon, MagnifyingGlassIcon,
  UserCircleIcon, MoonIcon, SunIcon
} from "@heroicons/react/24/solid"

// ----------------- 类型定义 ----------------
type ToolItem = {
  id?: number
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

// ----------------- 导航配置 ----------------
const NAV: NavItem[] = [
  {
    name: "AI工具",
    sub: [
      { name: "写作", link: "#write" },
      { name: "图片", link: "#image" },
      { name: "音频视频", link: "#audio" },
      { name: "代码开发", link: "#code" },
      { name: "其他工具", link: "#other" }
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
  { date: "2024-01-20", title: "集成自动化数据抓取功能" },
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
  const [activeSection, setActiveSection] = useState(0)
  const [groups, setGroups] = useState<GroupType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<string>("")
  
  // 使用对象管理每个分组的活跃标签
  const [activeTagMap, setActiveTagMap] = useState<Record<number, string>>({})
  
  // Refs
  const navTimeout = useRef<NodeJS.Timeout | null>(null)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  // 加载工具数据
useEffect(() => {
  async function loadTools() {
    try {
      setLoading(true);
      const response = await fetch('/api/tools');
      if (!response.ok) {
        throw new Error('Failed to fetch tools');
      }
      const data = await response.json();

      if (data.success) {
        setGroups(data.data.groups);
        setLastUpdate(data.data.lastUpdate);

        // 初始化每个分组的活跃标签
        const initialMap: Record<number, string> = {};
        data.data.groups.forEach((group: GroupType, idx: number) => {
          initialMap[idx] = group.tags[0] || '';
        });
        setActiveTagMap(initialMap);
      } else {
        setError(data.error || '加载数据失败');
      }
    } catch (error: unknown) {
      setError('网络错误，请稍后重试');
      console.error('加载工具数据失败:', error);
    } finally {
      setLoading(false);
    }
  }

  loadTools();
}, []);

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

  // 滚动监听
  useEffect(() => {
    if (about || loading) return
    
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
  }, [about, loading])

  // 搜索自动定位
  useEffect(() => {
    if (!search.trim() || loading) return
    
    const searchLower = search.toLowerCase()
    for (let i = 0; i < groups.length; i++) {
      const hasMatch = groups[i].tools.some(tool =>
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
  }, [search, groups, loading])

  // 手动刷新数据
  const handleRefreshData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/scrape')
      const result = await response.json()
      
      if (result.success) {
        // 重新加载数据
        const toolsResponse = await fetch('/api/tools')
        const toolsData = await toolsResponse.json()
        
        if (toolsData.success) {
          setGroups(toolsData.data.groups)
          setLastUpdate(toolsData.data.lastUpdate)
          alert(`数据更新成功！\n新增: ${result.data.itemsAdded} 个工具\n更新: ${result.data.itemsUpdated} 个工具`)
        }
      } else {
        alert('数据更新失败: ' + result.error)
      }
    } catch {
      alert('数据更新失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  // 事件处理函数
  const handleLogoClick = () => {
    setAbout(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleTagClick = (groupIdx: number, tag: string) => {
    setActiveTagMap(prev => ({
      ...prev,
      [groupIdx]: tag
    }))
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

  // 计算总工具数量
  const totalTools = groups.reduce((sum, group) => sum + group.tools.length, 0)

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
                      (item.name === "AI工具" && activeSection >= 0 && activeSection < groups.length)
                        ? "text-blue-600 font-bold"
                        : dark ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-blue-600"
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
            {/* 数据刷新按钮 */}
            <button 
              onClick={handleRefreshData}
              disabled={loading}
              className={`${btnBase} bg-green-100 hover:bg-green-200 text-green-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="刷新数据"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="hidden sm:inline">{loading ? '更新中...' : '刷新数据'}</span>
            </button>
            
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

      {/* 添加右侧滚动指示器 */}
      {!about && !loading && (
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
          <div className="flex flex-col gap-2">
            {groups.map((group, idx) => (
              <button
                key={group.group}
                onClick={() => {
                  const targetRef = sectionRefs.current[idx]
                  if (targetRef) {
                    targetRef.scrollIntoView({ 
                      behavior: "smooth", 
                      block: "start" 
                    })
                  }
                }}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  activeSection === idx 
                    ? "bg-blue-600 scale-125" 
                    : dark 
                    ? "bg-gray-600 hover:bg-gray-500" 
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                title={group.group}
              />
            ))}
          </div>
        </div>
      )}

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
                已收录 <span className="font-mono text-blue-600 font-bold">{totalTools}</span> 款工具
              </div>
              
              {lastUpdate && (
                <div className={`text-sm mb-6 ${textThird}`}>
                  最后更新：{new Date(lastUpdate).toLocaleString('zh-CN')}
                </div>
              )}
              
              <p className={`text-base sm:text-lg mb-8 max-w-2xl mx-auto ${textThird}`}>
                覆盖AI写作、绘图、音视频、代码开发等领域，自动化抓取最新AI工具
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
                    disabled={loading}
                  />
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-blue-500" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 加载状态 */}
      {loading && !about && (
        <main className={`${pagePadding} py-12`}>
          <div className="text-center">
            <div className="inline-flex items-center gap-3 text-lg text-blue-600">
              <svg className="animate-spin w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              正在加载AI工具数据...
            </div>
          </div>
        </main>
      )}

      {/* 错误状态 */}
      {error && !about && (
        <main className={`${pagePadding} py-12`}>
          <div className="text-center">
            <div className={`text-lg mb-4 ${textMain}`}>
              加载失败: {error}
            </div>
            <button 
              onClick={() => window.location.reload()}
              className={`${btnBase} bg-blue-600 hover:bg-blue-700 text-white`}
            >
              重新加载
            </button>
          </div>
        </main>
      )}

      {/* 工具分组展示 */}
      {!about && !loading && !error && (
        <main className={`${pagePadding} py-12`}>
          {groups.map((group, idx) => {
            const activeTag = activeTagMap[idx] || group.tags[0] || ""
            const filteredByTag = group.tools.filter(tool => tool.tag === activeTag)
            const finalTools = getFilteredTools(filteredByTag)

            return (
              <section
                key={group.group}
                id={group.category}
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
                        key={tool.id || tool.name}
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
                      <div className={`text-lg font-semibold ${textMain}`}>
                        {event.title}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <p className={`text-sm ${textThird} mb-4`}>
                  AI极客工具箱 · 让AI工具触手可及
                </p>
               <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                  <button 
                    className={`${btnBase} bg-blue-600 hover:bg-blue-700 text-white`}
                    onClick={() => setAbout(false)}
                  >
                    返回首页
                  </button>
                  <a 
                    href="mailto:contact@aigeektools.com"
                    className={`${btnBase} border-2 ${
                      dark ? "border-gray-600 text-gray-300 hover:border-gray-500" : "border-gray-300 text-gray-600 hover:border-gray-400"
                    }`}
                  >
                    联系我们
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* 页脚 */}
      {!about && (
        <footer className={`border-t ${dark ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"}`}>
          <div className={`${pagePadding} py-8`}>
            <div className="text-center">
              <div className={`text-sm ${textThird} mb-2`}>
                © 2024 AI极客工具箱 · 已运营 {days} 天 · 收录 {totalTools} 款工具
              </div>
              <div className={`text-xs ${textThird}`}>
                让AI工具触手可及 · 持续更新中...
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}