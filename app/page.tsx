"use client"
import { useState, useEffect } from "react"
import {
  RocketLaunchIcon, LockClosedIcon, BookOpenIcon, PhotoIcon,
  MagnifyingGlassIcon, UserCircleIcon, MoonIcon, SunIcon, ChevronDownIcon
} from "@heroicons/react/24/solid"

// 工具项类型定义
type ToolItem = {
  name: string
  desc: string
  url: string
  tag: string
  isVip?: boolean
}

// 首页分组与标签、资源
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
  // 你可以继续补充更多分组
]

// 站点上线日
const SITE_START_DATE = new Date("2025-07-10")

export default function Home() {
  const [dark, setDark] = useState(false)
  const [search, setSearch] = useState("")
  const [days, setDays] = useState<number>(0)
  const [activeGroupIdx, setActiveGroupIdx] = useState(0)
  const [activeTag, setActiveTag] = useState(GROUPS[0].tags[0])

  // 实时刷新运营天数
  useEffect(() => {
    function updateDays() {
      setDays(Math.max(1, Math.floor((Date.now() - SITE_START_DATE.getTime()) / 86400000) + 1))
    }
    updateDays()
    const timer = setInterval(updateDays, 1000 * 60 * 10)
    return () => clearInterval(timer)
  }, [])

  // 会员按钮样式修正
  const btnBase = "rounded-full px-5 py-2 font-semibold text-sm transition flex items-center justify-center gap-1 shadow"
  const btnVip = "bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 text-white hover:opacity-90"

  // 亮暗色适配
  const navBg = dark ? "bg-[#232834] border-b border-[#343948]" : "bg-white/90 border-b border-gray-200"
  const heroBg = dark
    ? "bg-gradient-to-b from-[#222c3d] via-[#181c22] to-[#181c22]"
    : "bg-gradient-to-b from-blue-100 via-white to-white"
  const mainBg = dark ? "bg-[#181c22]" : "bg-white"
  const groupTitle = dark ? "text-white" : "text-gray-900"

  return (
    <div className={`min-h-screen flex flex-col ${mainBg} transition-colors`}>
      {/* 顶部导航 */}
      <header className={`sticky top-0 z-30 w-full ${navBg}`}>
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-5 md:px-10 lg:px-14">
          {/* LOGO */}
          <div className="flex items-center gap-2 font-bold text-2xl text-blue-500 cursor-pointer">
            <RocketLaunchIcon className="w-7 h-7" />
            <span>AI极客工具箱</span>
          </div>
          {/* 分类/导航 */}
          <nav className="flex items-center gap-3 ml-8">
            <button className="text-sm font-medium text-gray-700 hover:text-blue-600 transition">AI工具</button>
            <button className="text-sm font-medium text-gray-700 hover:text-blue-600 transition">分类</button>
            <button className="text-sm font-medium text-gray-700 hover:text-blue-600 transition">会员专区</button>
            <button className="text-sm font-medium text-gray-700 hover:text-blue-600 transition">关于我们</button>
          </nav>
          {/* 操作区 */}
          <div className="flex items-center gap-3">
            <button className="rounded-full px-4 py-2 text-blue-600 font-semibold text-sm bg-blue-100 hover:bg-blue-200 transition flex items-center">
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
      <section className={`relative w-full ${heroBg} flex flex-col items-center py-12 md:py-20 overflow-visible`}>
        <div className="w-full flex flex-col items-center z-10">
          <h1 className="font-black text-3xl md:text-5xl text-gray-900 text-center mb-4 tracking-tight leading-snug">
            发现最好的AI网站和AI工具
          </h1>
          <div className="text-base md:text-lg text-gray-600 text-center mb-2">
            <span className="font-mono text-blue-600">{days}</span> 天持续运营 · 已收录 <span className="font-mono text-blue-600">N</span> 款工具
          </div>
          <div className="text-sm md:text-base text-gray-400 text-center mb-4">
            覆盖AI写作、绘图、会员资源、小说图片等，一站式导航
          </div>
          <div className="w-full flex justify-center mt-2 mb-6">
            <div className="relative w-full max-w-xl">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-12 pr-4 py-3 rounded-2xl text-base outline-none border bg-white border-blue-200 shadow-md placeholder-gray-400 w-full focus:ring-2 focus:ring-blue-300"
                placeholder="输入关键词，搜索AI工具/资源"
                style={{ boxShadow: "0 8px 32px 0 rgba(60,130,245,.06)" }}
              />
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-3 text-blue-400" />
            </div>
          </div>
        </div>
        {/* 渐变背景色块 */}
        {!dark && (
          <div
            className="absolute left-1/2 -translate-x-1/2 bottom-0 w-full max-w-2xl h-24 md:h-32 rounded-full pointer-events-none z-0"
            style={{
              background: "linear-gradient(90deg, #8ec5fc 0%, #e0c3fc 100%)",
              filter: "blur(34px)",
              opacity: 0.6,
            }}
          />
        )}
      </section>

      {/* 分类分组、标签、工具卡片 */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-5 md:px-10 lg:px-14 py-6">
        {GROUPS.map((group, idx) => (
          <section key={group.group} className="mb-10">
            {/* 大标题+标签 */}
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
            {/* 卡片 */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {group.tools.filter(t => t.tag === activeTag && activeGroupIdx === idx).length === 0 ? (
                <div className="col-span-full text-gray-400 py-10">该分类暂无内容</div>
              ) : (
                group.tools
                  .filter(t => t.tag === activeTag && activeGroupIdx === idx)
                  .map((tool, i) => (
                    <li
                      key={tool.name}
                      className={`
                        bg-white rounded-2xl p-6 shadow hover:shadow-lg border border-gray-100 hover:border-blue-400 transition
                        flex flex-col gap-2 relative ${tool.isVip ? "ring-2 ring-yellow-300" : ""}
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
                      <div className="text-gray-500 text-sm">{tool.desc}</div>
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

      {/* 底部 */}
      <footer className="text-center text-xs py-10 text-gray-400">
        © {new Date().getFullYear()} AI极客工具箱 · 仅供学习交流
      </footer>
    </div>
  )
}
