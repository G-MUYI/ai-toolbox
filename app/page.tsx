"use client"
import { useState, useEffect, useRef } from "react"
import {
  RocketLaunchIcon, LockClosedIcon, MagnifyingGlassIcon,
  UserCircleIcon, MoonIcon, SunIcon
} from "@heroicons/react/24/solid"

// 工具项类型定义
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

// 分组数据（同前）
const GROUPS: GroupType[] = [
  {
    group: "文本生成与编辑",
    tags: ["AI写作助手", "AI智能摘要", "AI文案生成", "AI博客生成", "AI文案写作"],
    category: "write",
    tools: [
      { name: "ChatGPT", desc: "最火爆的AI对话/写作助手", url: "#", tag: "AI写作助手" },
      { name: "Grammarly", desc: "AI语法纠正、润色", url: "#", tag: "AI文案写作" },
      { name: "QuillBot", desc: "AI自动改写与润色", url: "#", tag: "AI文案写作" },
      { name: "Notion AI", desc: "AI智能文档写作和头脑风暴", url: "#", tag: "AI智能摘要" },
      { name: "Sudowrite", desc: "创作者专用AI灵感生成器", url: "#", tag: "AI写作助手" }
    ]
  },
  {
    group: "图片生成与编辑",
    tags: ["AI图像生成器", "文字生成图像", "AI修图", "AI形象生成", "AI去背景"],
    category: "img",
    tools: [
      { name: "Midjourney", desc: "AI文生图神器，社区活跃", url: "#", tag: "AI图像生成器" },
      { name: "Adobe Firefly", desc: "Adobe原生AI图像工具", url: "#", tag: "AI修图" },
      { name: "Remove.bg", desc: "AI一键去除图片背景", url: "#", tag: "AI去背景" },
      { name: "Stable Diffusion", desc: "本地AI作图开源生态", url: "#", tag: "AI图像生成器" }
    ]
  },
  {
    group: "音频与视频",
    tags: ["AI语音生成", "AI配音", "AI剪辑", "AI音频增强"],
    category: "audio",
    tools: [
      { name: "ElevenLabs", desc: "顶级AI拟真语音生成", url: "#", tag: "AI语音生成" },
      { name: "Descript", desc: "AI驱动的视频编辑平台", url: "#", tag: "AI剪辑" },
      { name: "Audyo", desc: "AI文本转音频神器", url: "#", tag: "AI音频增强" }
    ]
  },
  {
    group: "AI会员专区",
    tags: ["破局资料", "实战文档", "会员小说", "会员图片"],
    category: "vip",
    tools: [
      { name: "副业指南合集", desc: "10本破局资料，会员专享", url: "#", tag: "破局资料", isVip: true },
      { name: "AI项目实战库", desc: "超全AI开发实战文档", url: "#", tag: "实战文档", isVip: true },
      { name: "会员小说", desc: "热门网络小说资源，会员专享", url: "#", tag: "会员小说", isVip: true },
      { name: "会员图库", desc: "精选版权图库，会员专享", url: "#", tag: "会员图片", isVip: true }
    ]
  }
]

// 导航
const NAV = [
  {
    name: "AI工具",
    sub: [
      { name: "写作", link: "#write" },
      { name: "图片", link: "#img" },
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

// 站点上线日
const SITE_START_DATE = new Date("2025-07-10")
const TIMELINE = [
  { date: "2025-07-10", title: "AI极客工具箱上线 🚀" },
  { date: "2025-07-12", title: "会员专区/破局资源首发" },
  { date: "2025-07-13", title: "支持暗黑模式和运营天数展示" },
  { date: "2025-07-15", title: "支持二级菜单与时间线" },
]
const ABOUT_ME = `大家好！我是木易，AI极客工具箱的创建者。
热衷于AI工具收集与分享，致力于为开发者、自由职业者和数字创作者提供一站式AI资源导航和成长资料。本站长期维护更新，欢迎加入共建！`

export default function Home() {
  const [dark, setDark] = useState(false)
  const [search, setSearch] = useState("")
  const [days, setDays] = useState<number>(0)
  const [activeGroupIdx, setActiveGroupIdx] = useState(0)
  const [activeTag, setActiveTag] = useState(GROUPS[0].tags[0])
  const [about, setAbout] = useState(false)
  const navTimeout = useRef<NodeJS.Timeout | null>(null)
  const [navOpen, setNavOpen] = useState<number | null>(null)

  useEffect(() => {
    function updateDays() {
      setDays(Math.max(1, Math.floor((Date.now() - SITE_START_DATE.getTime()) / 86400000) + 1))
    }
    updateDays()
    const timer = setInterval(updateDays, 1000 * 60 * 10)
    return () => clearInterval(timer)
  }, [])

  // 跳首页
  const handleLogoClick = () => {
    setAbout(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const pagePadding = "max-w-[110rem] mx-auto w-full px-4 md:px-8 xl:px-20"
  const btnBase = "rounded-full px-5 py-2 font-semibold text-sm transition flex items-center justify-center gap-1 shadow"
  const btnVip = "bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 text-white hover:opacity-90"
  const navBg = dark ? "bg-[#232834] border-b border-[#343948]" : "bg-white/90 border-b border-gray-200"
  const mainBg = dark ? "bg-[#181c22]" : "bg-white"
  const groupTitle = dark ? "text-white" : "text-gray-900"
  const textMain = dark ? "text-white" : "text-gray-900"
  const textSecond = dark ? "text-gray-300" : "text-gray-600"
  const textThird = dark ? "text-gray-400" : "text-gray-400"
  const inputBg = dark ? "bg-[#232834] border-[#555c6a] text-white placeholder-gray-400" : "bg-white border-blue-100 text-gray-900 placeholder-gray-400"

  const handleNavEnter = (idx: number) => {
    if (navTimeout.current) clearTimeout(navTimeout.current)
    setNavOpen(idx)
  }
  const handleNavLeave = () => {
    navTimeout.current = setTimeout(() => setNavOpen(null), 180)
  }
  const handleNavMenuClick = (idx: number) => setNavOpen(navOpen === idx ? null : idx)

  return (
    <div className={`min-h-screen flex flex-col ${mainBg} transition-colors`}>
      {/* 顶部导航 */}
      <header className={`sticky top-0 z-30 w-full ${navBg}`}>
        <div className={`${pagePadding} h-16 flex items-center justify-between`}>
          {/* LOGO 点击跳首页 */}
          <div
            className="flex items-center gap-2 font-bold text-2xl text-blue-500 cursor-pointer select-none"
            onClick={handleLogoClick}
            title="返回首页"
          >
            <RocketLaunchIcon className="w-7 h-7" />
            <span>AI极客工具箱</span>
          </div>
          {/* 分类/导航（支持二级菜单） */}
          <nav className="flex items-center gap-3 ml-8 relative">
            {NAV.map((item, idx) =>
              item.sub ? (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => handleNavEnter(idx)}
                  onMouseLeave={handleNavLeave}
                >
                  <button
                    className={`text-sm font-medium hover:text-blue-600 transition flex items-center gap-1 ${dark ? "text-white" : "text-gray-800"}`}
                    onClick={() => handleNavMenuClick(idx)}
                  >
                    {item.name}
                    <svg className="ml-1 w-4 h-4 transition-transform duration-200" style={{ transform: navOpen === idx ? "rotate(180deg)" : "" }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>
                  </button>
                  {navOpen === idx && (
                    <div
                      className={`absolute left-0 top-full mt-1 min-w-[100px] rounded-xl shadow-xl py-1 bg-white dark:bg-[#21232a] border border-gray-100 dark:border-gray-700 transition-all`}
                      onMouseEnter={() => { if (navTimeout.current) clearTimeout(navTimeout.current) }}
                      onMouseLeave={handleNavLeave}
                    >
                      {item.sub.map(sub => (
                        <a
                          key={sub.name}
                          href={sub.link}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-[#293153] rounded-lg"
                        >{sub.name}</a>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  key={item.name}
                  className={`text-sm font-medium hover:text-blue-600 transition ${dark ? "text-white" : "text-gray-800"}`}
                  onClick={() => setAbout(item.name === "关于我们")}
                >{item.name}</button>
              )
            )}
          </nav>
          {/* 操作区 */}
          <div className="flex items-center gap-3">
            <button className="rounded-full px-4 py-2 font-semibold text-sm bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center">
              <UserCircleIcon className="w-5 h-5 mr-1" /> 登录
            </button>
            <button className={`${btnBase} ${btnVip}`}>
              <LockClosedIcon className="w-5 h-5" /> 开通会员
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
      {!about && (
        <section className="relative w-full min-h-[340px] pb-0 overflow-visible">
          {/* 多层渐变气氛，柔和+透明度+叠加 */}
          <div className="absolute inset-0 z-0 pointer-events-none select-none">
            {!dark && (
              <>
                <div
                  style={{
                    background: "radial-gradient(ellipse 70% 50% at 60% 15%,#b2d0ffcc 0%,rgba(255,255,255,0) 100%)",
                    position: "absolute", inset: 0, zIndex: 1, opacity: 0.8
                  }}
                />
                <div
                  style={{
                    background: "radial-gradient(ellipse 40% 20% at 35% 70%,#e0c3fc88 0%,rgba(255,255,255,0) 100%)",
                    position: "absolute", inset: 0, zIndex: 2, opacity: 0.7
                  }}
                />
                <div
                  style={{
                    background: "linear-gradient(135deg,#b2c6ff 0%,#e0c3fc 65%,#fff 100%)",
                    position: "absolute", inset: 0, zIndex: 0, opacity: 1
                  }}
                />
              </>
            )}
            {dark && (
              <div
                style={{
                  background: "linear-gradient(120deg,#232a36 0%,#20232c 100%)"
                }}
                className="absolute inset-0 z-0"
              />
            )}
          </div>
          <div className={`${pagePadding} relative z-10 flex flex-col items-center pt-14 pb-10`}>
            <h1 className={`font-black text-4xl md:text-6xl text-center mb-4 tracking-tight leading-snug ${textMain}`}>发现最好的AI网站和AI工具</h1>
            <div className={`text-lg md:text-xl text-center mb-2 font-medium ${textSecond}`}>
              <span className="font-mono text-blue-600">{days}</span> 天持续运营 · 已收录 <span className="font-mono text-blue-600">N</span> 款工具
            </div>
            <div className={`text-base md:text-lg text-center mb-7 max-w-2xl ${textThird}`}>
              覆盖AI写作、绘图、音视频、会员资源、小说图片等，一站式导航
            </div>
            {/* 搜索框有柔和投影 */}
            <div className="w-full flex justify-center mb-2">
              <div className="relative w-full max-w-xl">
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className={`pl-12 pr-4 py-4 rounded-2xl text-lg outline-none border shadow-2xl placeholder-gray-400 w-full focus:ring-2 focus:ring-blue-300 transition-all duration-300 ${inputBg}`}
                  placeholder="输入关键词，搜索AI工具/资源"
                  style={{
                    boxShadow: "0 6px 36px 0 rgba(96,142,240,.11)",
                    borderWidth: 0,
                  }}
                />
                <MagnifyingGlassIcon className="w-6 h-6 absolute left-4 top-3 text-blue-400" />
              </div>
            </div>
          </div>
          {/* 与下方白色内容自然衔接（渐变下溢遮罩无硬边） */}
          {!dark && (
            <div className="absolute bottom-0 left-0 w-full h-16 z-10"
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.0) 0%, #fff 95%)",
                pointerEvents: "none"
              }} />
          )}
        </section>
      )}

      {/* 首页内容模块（工具卡片显眼） */}
      {!about && (
        <main className={`${pagePadding} flex-1 py-8 relative z-20`}>
          {GROUPS.map((group, idx) => (
            <section key={group.group} className="mb-12">
              <div className="flex flex-wrap items-end justify-between mb-3">
                <h2 className={`text-2xl md:text-3xl font-extrabold mb-2 ${groupTitle}`}>{group.group}</h2>
                <div className="flex flex-wrap gap-2">
                  {group.tags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => { setActiveGroupIdx(idx); setActiveTag(tag); }}
                      className={`
                        px-4 py-1.5 rounded-full font-medium text-sm
                        ${activeGroupIdx === idx && activeTag === tag
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-blue-50"}
                      `}
                    >{tag}</button>
                  ))}
                </div>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {group.tools.filter(t => t.tag === activeTag && activeGroupIdx === idx).length === 0 ? (
                  <div className="col-span-full text-gray-400 py-10">该分类暂无内容</div>
                ) : (
                  group.tools
                    .filter(t => t.tag === activeTag && activeGroupIdx === idx)
                    .map(tool => (
                      <li
                        key={tool.name}
                        className={`
                          transition
                          rounded-2xl p-7
                          shadow-2xl
                          border-0
                          flex flex-col gap-2 relative
                          hover:scale-[1.03] hover:shadow-2xl
                          ring-2 ring-transparent
                          bg-gradient-to-br from-[#f2f6ff] via-white to-[#f0f6ff]
                          ${dark
                            ? "dark:bg-gradient-to-br dark:from-[#232834] dark:via-[#20232a] dark:to-[#2c3351] dark:text-white dark:hover:ring-blue-400"
                            : "hover:ring-2 hover:ring-blue-300"}
                          ${tool.isVip ? "ring-2 ring-yellow-300" : ""}
                        `}
                        style={{
                          boxShadow: dark
                            ? "0 8px 36px 0 rgba(24,36,64,.45)"
                            : "0 6px 24px 0 rgba(80,140,255,0.10)"
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-blue-600 text-lg">{tool.name}</span>
                          {tool.isVip && (
                            <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-200 text-yellow-800 rounded-full font-bold flex items-center gap-1">
                              <LockClosedIcon className="w-4 h-4" /> 会员
                            </span>
                          )}
                        </div>
                        <div className="text-gray-500 dark:text-gray-300 text-sm mb-3">{tool.desc}</div>
                        <a
                          href={tool.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-auto inline-block text-blue-500 hover:underline text-xs font-medium"
                        >访问</a>
                      </li>
                    ))
                )}
              </ul>
            </section>
          ))}
        </main>
      )}

      {/* 关于我们页面（亮暗模式自适应+主副标题突出） */}
      {about && (
        <main className={`${pagePadding} flex-1 py-14`}>
          <div className={`
            max-w-3xl mx-auto rounded-2xl shadow-xl p-8
            transition-colors
            ${dark
              ? "bg-gradient-to-br from-[#23283a] via-[#23283a] to-[#2c3351] text-white"
              : "bg-gradient-to-br from-[#f6f7fb] via-white to-[#f5f7ff] text-gray-900"}
          `}>
            <h2 className={`
              text-4xl font-black mb-6 tracking-tight
              ${dark ? "text-blue-200" : "text-blue-800"}
            `}>关于我们</h2>
            <div className={`
              mb-10 whitespace-pre-line text-lg font-semibold leading-relaxed
              ${dark ? "text-blue-100" : "text-blue-700"}
            `}>{ABOUT_ME}</div>
            <h3 className={`
              font-bold text-2xl mb-4
              ${dark ? "text-yellow-300" : "text-blue-700"}
            `}>网站大事件时间线</h3>
            <ol className="relative border-l-2 border-blue-300 dark:border-blue-700 pl-6">
              {TIMELINE.map(evt => (
                <li key={evt.date} className="mb-8">
                  <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-2.5 border-2 border-white dark:border-[#22232a]"></div>
                  <div className={`text-xs mb-0.5 ${dark ? "text-blue-200" : "text-gray-400"}`}>{evt.date}</div>
                  <div className={`text-base font-semibold ${dark ? "text-white" : "text-gray-900"}`}>{evt.title}</div>
                </li>
              ))}
            </ol>
          </div>
        </main>
      )}

      {/* 底部 */}
      <footer className={`text-center text-xs py-10 ${dark ? "text-gray-500" : "text-gray-400"}`}>
        © {new Date().getFullYear()} AI极客工具箱 · 仅供学习交流
      </footer>
    </div>
  )
}
