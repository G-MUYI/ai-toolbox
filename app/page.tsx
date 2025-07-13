"use client"
import { useState, useEffect, useRef } from "react"
import {
  RocketLaunchIcon,
  LockClosedIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  MoonIcon,
  SunIcon,
  FolderIcon,
  PlusIcon,
  CogIcon,
  // Heroicons v2 中把 LogoutIcon 改名为 ArrowLeftOnRectangleIcon
  ArrowLeftOnRectangleIcon as LogoutIcon,
  XMarkIcon
} from "@heroicons/react/24/solid"

// ----------------- 类型定义 ----------------
type ToolItem = {
  id: number
  name: string
  desc: string
  url: string
  tag: string
  type: 'tool' | 'resource'
  isVip: boolean
  groupId: number
}

type GroupType = {
  id: number
  group: string
  tags: string[]
  category: string
  tools: ToolItem[]
}

type NavItem =
  | { name: string; sub: { name: string; link: string }[] }
  | { name: string; link: string }

// ----------------- 示例数据 ----------------
const DEFAULT_GROUPS: GroupType[] = [
  {
    id: 1,
    group: "文本生成与编辑",
    tags: ["AI写作助手", "AI智能摘要", "AI文案生成", "AI博客生成", "AI文案写作"],
    category: "write",
    tools: [
      { id: 1, name: "ChatGPT", desc: "最火爆的AI对话/写作助手", url: "https://chat.openai.com", tag: "AI写作助手", type: "tool", isVip: false, groupId: 1 },
      { id: 2, name: "Grammarly", desc: "AI语法纠正、润色", url: "https://grammarly.com", tag: "AI文案写作", type: "tool", isVip: false, groupId: 1 },
      { id: 3, name: "QuillBot", desc: "AI自动改写与润色", url: "https://quillbot.com", tag: "AI文案写作", type: "tool", isVip: false, groupId: 1 },
      { id: 4, name: "Notion AI", desc: "AI智能文档写作和头脑风暴", url: "https://notion.so", tag: "AI智能摘要", type: "tool", isVip: false, groupId: 1 },
      { id: 5, name: "Sudowrite", desc: "创作者专用AI灵感生成器", url: "https://sudowrite.com", tag: "AI写作助手", type: "resource", isVip: true, groupId: 1 }
    ]
  },
  {
    id: 2,
    group: "图像生成与编辑",
    tags: ["AI绘画", "图像处理", "设计工具", "照片编辑"],
    category: "image",
    tools: [
      { id: 6, name: "Midjourney", desc: "顶级AI绘画工具", url: "https://midjourney.com", tag: "AI绘画", type: "tool", isVip: true, groupId: 2 },
      { id: 7, name: "DALL-E", desc: "OpenAI的图像生成AI", url: "https://openai.com/dall-e-2", tag: "AI绘画", type: "tool", isVip: false, groupId: 2 },
      { id: 8, name: "Stable Diffusion", desc: "开源AI图像生成", url: "https://stability.ai", tag: "AI绘画", type: "tool", isVip: false, groupId: 2 },
      { id: 9, name: "Canva AI", desc: "AI设计助手", url: "https://canva.com", tag: "设计工具", type: "tool", isVip: false, groupId: 2 }
    ]
  },
  {
    id: 3,
    group: "音频与视频",
    tags: ["AI配音", "视频编辑", "音频处理", "语音合成"],
    category: "audio",
    tools: [
      { id: 10, name: "Murf", desc: "AI语音生成器", url: "https://murf.ai", tag: "AI配音", type: "tool", isVip: false, groupId: 3 },
      { id: 11, name: "Descript", desc: "AI视频编辑工具", url: "https://descript.com", tag: "视频编辑", type: "tool", isVip: false, groupId: 3 },
      { id: 12, name: "Speechify", desc: "文本转语音工具", url: "https://speechify.com", tag: "语音合成", type: "resource", isVip: false, groupId: 3 }
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

const SITE_START_DATE = new Date("2024-01-10")
const TIMELINE = [
  { date: "2024-01-10", title: "AI极客工具箱上线 🚀" },
  { date: "2024-01-12", title: "会员专区/破局资源首发" },
  { date: "2024-01-13", title: "支持暗黑模式和运营天数展示" },
  { date: "2024-01-15", title: "支持二级菜单与时间线" },
]

const ABOUT_ME = `大家好！我是木易，AI极客工具箱的创建者。
热衷于AI工具收集与分享，致力于为开发者、自由职业者和数字创作者提供一站式AI资源导航和成长资料。本站长期维护更新，欢迎加入共建！`

// ----------------- 工具卡片组件 ----------------
// 移除了 export 关键字
function ToolCard({
  tool,
  dark,
  isLoggedIn,
  isAdmin,
  onEdit,
  onDelete
}: {
  tool: ToolItem
  dark: boolean
  isLoggedIn: boolean
  isAdmin: boolean
  onEdit: (tool: ToolItem) => void
  onDelete: (tool: ToolItem) => void
}) {
  const isResource = tool.type === 'resource'
  const isVipResource = isResource && tool.isVip

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (isVipResource && !isLoggedIn) {
      alert('请先登录并开通会员访问此资源')
    } else {
      window.open(tool.url, '_blank')
    }
  }

  return (
    <div className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 transform ${
      dark ? "bg-gray-800 border-gray-700 hover:border-gray-600" : "bg-white border-gray-200 hover:border-blue-300"
    }`}>
      {/* 背景装饰 */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-blue-200/40 transition-colors duration-300"></div>

      {/* 类型标识 */}
      {isResource && (
        <div className="absolute top-4 right-4">
          <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-full shadow-md ${
            isVipResource ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"
          }`}>
            {isVipResource ? <LockClosedIcon className="w-3 h-3" /> : <FolderIcon className="w-3 h-3" />}
            {isVipResource ? "VIP资源" : "免费资源"}
          </span>
        </div>
      )}

      {/* 管理员操作按钮 */}
      {isAdmin && (
        <div className="absolute top-4 left-4 flex gap-2">
          <button
            onClick={() => onEdit(tool)}
            className="p-1.5 bg-white/90 hover:bg-white text-gray-800 rounded-full shadow-md transition-colors"
          >
            <CogIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(tool)}
            className="p-1.5 bg-white/90 hover:bg-white text-red-600 rounded-full shadow-md transition-colors"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="relative z-10 p-6">
        <h3 className={`text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors ${dark ? "text-white" : "text-gray-900"}`}>
          {tool.name}
        </h3>

        <p className={`text-sm mb-4 flex-1 ${dark ? "text-gray-300" : "text-gray-600"}`}>
          {tool.desc}
        </p>

        <div className="flex items-center justify-between">
          <span className={`text-xs px-2 py-1 rounded-full ${
            dark ? "bg-gray-700 text-gray-300" : "bg-blue-50 text-blue-700"
          }`}>
            {tool.tag}
          </span>

          <a
            href="#"
            onClick={handleClick}
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            {isVipResource && !isLoggedIn ? "登录查看" : "访问"}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}

// ----------------- 登录组件 ----------------
// 移除了 export 关键字
function LoginForm({ onLogin }: { onLogin: (isAdmin: boolean) => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (username === 'admin' && password === 'admin') {
      onLogin(true)
    } else {
      alert('用户名或密码错误')
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all">
        <h2 className="text-2xl font-bold mb-6">管理员登录</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="输入用户名"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="输入密码"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            登录
          </button>
        </form>
      </div>
    </div>
  )
}

// ----------------- 工具管理表单组件 ----------------
// 移除了 export 关键字
function ToolManager({
  groups,
  onAddTool,
  onUpdateTool,
  editingTool,
  setEditingTool
}: {
  groups: GroupType[]
  onAddTool: (tool: ToolItem) => void
  onUpdateTool: (tool: ToolItem) => void
  editingTool: ToolItem | null
  setEditingTool: (tool: ToolItem | null) => void
}) {
  const [formData, setFormData] = useState<{
    groupId: number
    name: string
    desc: string
    url: string
    tag: string
    type: 'tool' | 'resource'
    isVip: boolean
  }>({
    groupId: groups[0]?.id || 0,
    name: '',
    desc: '',
    url: '',
    tag: '',
    type: 'tool',
    isVip: false
  })

  useEffect(() => {
    if (editingTool) {
      setFormData({
        groupId: groups.find(g => g.tools.some(t => t.id === editingTool.id))?.id || groups[0]?.id || 0,
        name: editingTool.name,
        desc: editingTool.desc,
        url: editingTool.url,
        tag: editingTool.tag,
        type: editingTool.type,
        isVip: editingTool.isVip
      })
    } else {
      setFormData({
        groupId: groups[0]?.id || 0,
        name: '',
        desc: '',
        url: '',
        tag: '',
        type: 'tool',
        isVip: false
      })
    }
  }, [editingTool, groups])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (editingTool) {
      onUpdateTool({ ...editingTool, ...formData })
    } else {
      const newId = Math.max(...groups.flatMap(g => g.tools).map(t => t.id), 0) + 1
      onAddTool({ ...formData, id: newId })
    }
    setEditingTool(null)
  }

  const handleCancel = () => {
    setEditingTool(null)
  }

  const currentGroupTags = groups.find(g => g.id === formData.groupId)?.tags || []

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{editingTool ? '编辑工具' : '添加新工具'}</h2>
          <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">所属分组</label>
              <select
                value={formData.groupId}
                onChange={(e) => setFormData({ ...formData, groupId: Number(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {groups.map(group => (
                  <option key={group.id} value={group.id}>{group.group}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">工具名称</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="输入工具名称"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
              <textarea
                value={formData.desc}
                onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="输入工具描述"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="输入工具URL"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">标签</label>
              <select
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">选择标签</option>
                {currentGroupTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">类型</label>
              <div className="flex gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="tool"
                    checked={formData.type === "tool"}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.currentTarget.value as 'tool' | 'resource' }))}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2">工具</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="resource"
                    checked={formData.type === "resource"}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.currentTarget.value as 'tool' | 'resource' }))}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2">资源</span>
                </label>
              </div>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isVip}
                  onChange={(e) => setFormData({ ...formData, isVip: e.target.checked })}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">设为VIP内容</span>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                取消
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                {editingTool ? '保存修改' : '添加工具'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

// -------------- 主组件 -----------------
export default function Home() {
  // 状态管理
  const [dark, setDark] = useState(false)
  const [search, setSearch] = useState("")
  const [days, setDays] = useState<number>(0)
  const [about, setAbout] = useState(false)
  const [navOpen, setNavOpen] = useState<number | null>(null)
  const [activeSection, setActiveSection] = useState(0)
  const [groups, setGroups] = useState<GroupType[]>(DEFAULT_GROUPS)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [editingTool, setEditingTool] = useState<ToolItem | null>(null)
  const [activeTagMap, setActiveTagMap] = useState<Record<number, string>>(() => {
    const initialMap: Record<number, string> = {}
    DEFAULT_GROUPS.forEach((group, idx) => {
      initialMap[idx] = group.tags[0] || ""
    })
    return initialMap
  })

  // Refs
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

  // 滚动监听
  useEffect(() => {
    if (about) return
    function onScroll() {
      const scrollY = window.scrollY + 120
      let current = 0
      sectionRefs.current.forEach((ref, i) => {
        if (ref && ref.offsetTop <= scrollY) current = i
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
    for (let i = 0; i < groups.length; i++) {
      const hasMatch = groups[i].tools.some(tool =>
        tool.name.toLowerCase().includes(searchLower) ||
        tool.desc.toLowerCase().includes(searchLower)
      )
      if (hasMatch) {
        const targetRef = sectionRefs.current[i]
        if (targetRef) targetRef.scrollIntoView({ behavior: "smooth", block: "start" })
        break
      }
    }
  }, [search, groups])
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

    // 管理功能
  const handleLogin = (admin: boolean) => {
    setIsLoggedIn(true)
    setIsAdmin(admin)
  }
  const handleLogout = () => {
    setIsLoggedIn(false)
    setIsAdmin(false)
  }
  const handleAddTool = (tool: ToolItem) => {
    setGroups(prev =>
      prev.map(g =>
        g.id === tool.groupId ? { ...g, tools: [...g.tools, tool] } : g
      )
    )
  }
  const handleUpdateTool = (tool: ToolItem) => {
    setGroups(prev =>
      prev.map(g =>
        g.tools.some(t => t.id === tool.id)
          ? { ...g, tools: g.tools.map(t => t.id === tool.id ? tool : t) }
          : g
      )
    )
  }
  const handleDeleteTool = (tool: ToolItem) => {
    if (!confirm(`确定要删除工具 "${tool.name}" 吗？`)) return
    setGroups(prev => prev.map(g => ({ ...g, tools: g.tools.filter(t => t.id !== tool.id) })))
  }

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
      {/* 登录表单 */}
      {!isLoggedIn && <LoginForm onLogin={handleLogin} />}
      
      {/* 工具管理表单 */}
      {editingTool && (
        <ToolManager
          groups={groups}
          onAddTool={handleAddTool}
          onUpdateTool={handleUpdateTool}
          editingTool={editingTool}
          setEditingTool={setEditingTool}
        />
      )}

      {/* 导航栏 */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b ${navBg} shadow-md transition-all duration-300`}>
        <div className={`${pagePadding} h-16 flex items-center justify-between`}>
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform"
            onClick={handleLogoClick}
            title="返回首页"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
              <RocketLaunchIcon className="w-6 h-6 text-white" />
            </div>
            <div className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              AI极客工具箱
            </div>
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
                            (sub.link === "#write" && activeSection === 0) ||
                            (sub.link === "#image" && activeSection === 1) ||
                            (sub.link === "#audio" && activeSection === 2)
                              ? "text-blue-600 font-bold bg-blue-50"
                              : dark 
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
            {isAdmin && (
              <button 
                onClick={() => setEditingTool({ id: 0, name: '', desc: '', url: '', tag: '', type: 'tool', isVip: false, groupId: groups[0]?.id || 0 })} 
                className={`${btnBase} bg-green-600 hover:bg-green-700 text-white`}
              >
                <PlusIcon className="w-4 h-4" />
                <span className="hidden sm:inline">添加工具</span>
              </button>
            )}
            
            {isLoggedIn ? (
              <button 
                onClick={handleLogout} 
                className={`${btnBase} bg-red-600 hover:bg-red-700 text-white`}
              >
                <LogoutIcon className="w-4 h-4" />
                <span className="hidden sm:inline">退出</span>
              </button>
            ) : (
              <button className={`${btnBase} bg-blue-100 hover:bg-blue-200 text-blue-700`}>
                <UserCircleIcon className="w-4 h-4" />
                <span className="hidden sm:inline">登录</span>
              </button>
            )}
            
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
      {!about && (
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
                已收录 <span className="font-mono text-blue-600 font-bold">{groups.reduce((sum, group) => sum + group.tools.length, 0)}</span> 款工具
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
                    {isAdmin && (
                      <button
                        className="ml-2 text-blue-500 hover:text-blue-700"
                        onClick={() => setEditingTool({ id: 0, name: '', desc: '', url: '', tag: group.tags[0], type: 'tool', isVip: false, groupId: group.id })}
                      >
                        <PlusIcon className="w-5 h-5 inline-block" />
                      </button>
                    )}
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
                      <ToolCard
                        key={tool.name}
                        tool={tool}
                        dark={dark}
                        isLoggedIn={isLoggedIn}
                        isAdmin={isAdmin}
                        onEdit={setEditingTool}
                        onDelete={handleDeleteTool}
                      />
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