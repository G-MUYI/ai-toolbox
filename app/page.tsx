"use client"
import { useState, useEffect } from "react"
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

const GROUPS: {
  group: string
  tags: string[]
  category: string
  tools: ToolItem[]
}[] = [
  {
    group: "文本生成与编辑",
    tags: ["AI写作助手", "AI智能摘要", "AI文案生成", "AI博客生成", "AI文案写作"],
    category: "write",
    tools: [
      { name: "ChatGPT", desc: "最火爆的AI对话/写作助手", url: "#", tag: "AI写作助手" },
      { name: "Grammarly", desc: "AI语法纠正、润色", url: "#", tag: "AI文案写作" },
      { name: "QuillBot", desc: "AI自动改写与润色", url: "#", tag: "AI文案写作" }
    ]
  },
  {
    group: "图片生成与编辑",
    tags: ["AI图像生成器", "文字生成图像", "AI修图", "AI形象生成", "AI去背景"],
    category: "img",
    tools: [
      { name: "Midjourney", desc: "AI文生图神器，社区活跃", url: "#", tag: "AI图像生成器" },
      { name: "Adobe Firefly", desc: "Adobe原生AI图像工具", url: "#", tag: "AI修图" }
    ]
  },
  {
    group: "AI会员专区",
    tags: ["破局资料", "实战文档"],
    category: "vip",
    tools: [
      { name: "副业指南合集", desc: "10本破局资料，会员专享", url: "#", tag: "破局资料", isVip: true }
    ]
  }
]

// 站点上线日
const SITE_START_DATE = new Date("2025-07-10")

export default function Home() {
  const [dark, setDark] = useState(false)
  const [search, setSearch] = useState("")
  const [days, setDays] = useState<number>(0)
  const [activeGroupIdx, setActiveGroupIdx] = useState(0)
  const [activeTag, setActiveTag] = useState(GROUPS[0].tags[0])
  const [about, setAbout] = useState(false)

  useEffect(() => {
    function updateDays() {
      setDays(Math.max(1, Math.floor((Date.now() - SITE_START_DATE.getTime()) / 86400000) + 1))
    }
    updateDays()
    const timer = setInterval(updateDays, 1000 * 60 * 10)
    return () => clearInterval(timer)
  }, [])

  // 统一左右大边距，但不过于窄，大气有呼吸感
  const pagePadding = "max-w-[120rem] mx-auto w-full px-6 md:px-12 xl:px-32" // px-32约等于128px，两侧呼吸感非常大气

  // 会员按钮样式
  const btnBase = "rounded-full px-5 py-2 font-semibold text-sm transition flex items-center justify-center gap-1 shadow"
  const btnVip = "bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 text-white hover:opacity-90"

  // 亮暗色适配
  const navBg = dark ? "bg-[#232834] border-b border-[#343948]" : "bg-white/90 border-b border-gray-200"
  const mainBg = dark ? "bg-[#181c22]" : "bg-white"
  const groupTitle = dark ? "text-white" : "text-gray-900"
  const textMain = dark ? "text-white" : "text-gray-900"
  const textSecond = dark ? "text-gray-300" : "text-gray-600"
  const textThird = dark ? "text-gray-400" : "text-gray-400"
  const inputBg = dark ? "bg-[#232834] border-[#555c6a] text-white placeholder-gray-400" : "bg-white border-blue-100 text-gray-900 placeholder-gray-400"

  return (
    <div className={`min-h-screen flex flex-col ${mainBg} transition-colors`}>
      {/* 顶部导航 */}
      <header className={`sticky top-0 z-30 w-full ${navBg}`}>
        <div className={`${pagePadding} h-16 flex items-center justify-between`}>
          {/* LOGO */}
          <div className="flex items-center gap-2 font-bold text-2xl text-blue-500 cursor-pointer">
            <RocketLaunchIcon className="w-7 h-7" />
            <span>AI极客工具箱</span>
          </div>
          {/* 分类/导航 */}
          <nav className="flex items-center gap-3 ml-8">
            <button className="text-sm font-medium hover:text-blue-600 transition" onClick={() => setAbout(false)} style={{ color: dark ? "#fff" : "#1d2233" }}>首页</button>
            <button className="text-sm font-medium hover:text-blue-600 transition" onClick={() => setAbout(false)} style={{ color: dark ? "#fff" : "#1d2233" }}>AI工具</button>
            <button className="text-sm font-medium hover:text-blue-600 transition" onClick={() => setAbout(false)} style={{ color: dark ? "#fff" : "#1d2233" }}>会员专区</button>
            <button className="text-sm font-medium hover:text-blue-600 transition" onClick={() => setAbout(true)} style={{ color: dark ? "#fff" : "#1d2233" }}>关于我们</button>
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

      {/* Hero区（大气渐变+无边框过渡） */}
      {!about && (
        <section className="relative w-full min-h-[340px] pb-0 overflow-visible">
          {/* 渐变背景 */}
          {!dark && (
            <div className="absolute inset-0 z-0 pointer-events-none select-none"
              style={{
                background: "linear-gradient(160deg, #b0c6ff 0%, #e0c3fc 60%, #ffffff 100%)",
                boxShadow: "0 40px 80px 0 rgba(128,152,255,0.10)",
              }}
            />
          )}
          {dark && (
            <div className="absolute inset-0 z-0 pointer-events-none select-none"
              style={{
                background: "linear-gradient(120deg,#232a36 0%,#20232c 100%)"
              }}
            />
          )}
          <div className={`${pagePadding} relative z-10 flex flex-col items-center pt-16 pb-14`}>
            <h1 className={`font-black text-4xl md:text-6xl text-center mb-4 tracking-tight leading-snug ${textMain}`}>发现最好的AI网站和AI工具</h1>
            <div className={`text-lg md:text-xl text-center mb-2 font-medium ${textSecond}`}>
              <span className="font-mono text-blue-600">{days}</span> 天持续运营 · 已收录 <span className="font-mono text-blue-600">N</span> 款工具
            </div>
            <div className={`text-base md:text-lg text-center mb-6 max-w-2xl ${textThird}`}>
              覆盖AI写作、绘图、会员资源、小说图片等，一站式导航
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
                    boxShadow: "0 4px 36px 0 rgba(96,142,240,.11)",
                    borderWidth: 0,
                  }}
                />
                <MagnifyingGlassIcon className="w-6 h-6 absolute left-4 top-3 text-blue-400" />
              </div>
            </div>
          </div>
          {/* 与下方白色内容自然衔接（用一个渐变下溢遮罩实现无硬边） */}
          {!dark && (
            <div className="absolute bottom-0 left-0 w-full h-16 z-10"
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.0) 0%, #fff 95%)",
                pointerEvents: "none"
              }} />
          )}
        </section>
      )}

      {/* 首页内容模块（白色大背景+分组） */}
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
                          shadow-xl
                          border border-transparent
                          flex flex-col gap-2 relative
                          hover:scale-[1.025] hover:shadow-2xl
                          ${dark
                            ? "bg-[#232834] text-white hover:border-blue-400"
                            : "bg-white text-gray-900 hover:border-blue-400"
                          }
                          ${tool.isVip ? "ring-2 ring-yellow-300" : ""}
                        `}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-blue-600">{tool.name}</span>
                          {tool.isVip && (
                            <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-200 text-yellow-800 rounded-full font-bold flex items-center gap-1">
                              <LockClosedIcon className="w-4 h-4" /> 会员
                            </span>
                          )}
                        </div>
                        <div className="text-gray-500 dark:text-gray-300 text-sm">{tool.desc}</div>
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

      {/* 底部 */}
      <footer className={`text-center text-xs py-10 ${dark ? "text-gray-500" : "text-gray-400"}`}>
        © {new Date().getFullYear()} AI极客工具箱 · 仅供学习交流
      </footer>
    </div>
  )
}
