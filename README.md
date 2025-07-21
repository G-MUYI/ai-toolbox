# AI极客工具箱 🚀

一个现代化的AI工具导航网站，收录各类AI工具，支持自动化抓取和分类展示。

## 🌟 功能特性

- 🎯 **智能分类**：AI写作、图片生成、音视频处理、代码开发等分类
- 🔍 **实时搜索**：快速查找所需的AI工具
- 🌙 **暗黑模式**：支持明暗主题切换
- 🔄 **自动抓取**：定时抓取最新的AI工具信息
- 📱 **响应式设计**：完美适配桌面端和移动端
- ⚡ **高性能**：基于Next.js 15构建，加载快速

## 🛠 技术栈

- **前端框架**：Next.js 15.3.5 + React 19
- **样式方案**：Tailwind CSS 4
- **类型安全**：TypeScript
- **数据库**：Prisma + SQLite/PostgreSQL
- **图标库**：Heroicons
- **数据抓取**：Axios + Cheerio

## 🚀 快速开始

### 本地开发

1. **克隆项目**
```bash
git clone <your-repo-url>
cd ai-toolbox
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**
```bash
cp .env.example .env
# 编辑 .env 文件，配置数据库连接
```

4. **初始化数据库**
```bash
npx prisma generate
npx prisma db push
```

5. **启动开发服务器**
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 生产部署

#### 部署到 Vercel（推荐）

1. **安装 Vercel CLI**
```bash
npm install -g vercel
```

2. **登录 Vercel**
```bash
vercel login
```

3. **部署项目**
```bash
vercel
```

4. **配置环境变量**
在 Vercel 控制台中设置：
- `DATABASE_URL`：生产环境数据库连接字符串

#### 部署到其他平台

项目支持部署到任何支持 Node.js 的平台，如：
- **Netlify**
- **Railway**  
- **DigitalOcean App Platform**
- **AWS Amplify**

## 📁 项目结构

```
ai-toolbox/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   │   ├── scrape/        # 数据抓取接口
│   │   └── tools/         # 工具数据接口
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx          # 首页组件
├── prisma/                # 数据库配置
│   └── schema.prisma      # 数据库模式
├── public/                # 静态资源
├── .env                   # 环境变量
├── vercel.json           # Vercel 部署配置
└── package.json          # 依赖配置
```

## 🗄️ 数据库配置

### SQLite（开发环境）
```env
DATABASE_URL="file:./dev.db"
```

### PostgreSQL（生产环境）
推荐使用以下服务：
- [Supabase](https://supabase.com/)
- [Neon](https://neon.tech/)
- [PlanetScale](https://planetscale.com/)

```env
DATABASE_URL="postgresql://username:password@host:port/database"
```

## 🔧 开发指南

### 可用脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run start` - 启动生产服务器
- `npm run lint` - 运行代码检查

### API 接口

- `GET /api/tools` - 获取所有工具数据
- `GET /api/scrape` - 触发数据抓取

### 添加新的工具分类

1. 修改 `app/api/tools/route.ts` 中的 `categoryMap`
2. 更新 `app/page.tsx` 中的导航配置 `NAV`
3. 调整 `app/api/scrape/route.ts` 中的分类逻辑

## 🤝 贡献指南

1. Fork 本项目
2. 创建功能分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'Add some amazing feature'`
4. 推送到分支：`git push origin feature/amazing-feature`
5. 提交 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系方式

- 作者：木易
- 邮箱：contact@aigeektools.com
- 网站：[AI极客工具箱](https://your-domain.com)

---

⭐ 如果这个项目对你有帮助，请给一个 Star 支持一下！