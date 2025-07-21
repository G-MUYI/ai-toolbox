import { NextResponse } from 'next/server'
import { PrismaClient, Tool } from '@prisma/client'

const prisma = new PrismaClient()

// 类型定义
interface CategoryMap {
  [key: string]: {
    group: string
    category: string
    tags: string[]
    tools: Array<{
      id: number
      name: string
      desc: string
      url: string
      tag: string
      isVip: boolean
    }>
  }
}

// 获取所有工具数据，按分类组织
export async function GET() {
  try {
    const startTime = Date.now()
    
    // 从数据库获取所有工具
    const tools: Tool[] = await prisma.tool.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    // 按分类组织数据
    const categoryMap: CategoryMap = {
      write: {
        group: 'AI写作工具',
        category: 'write',
        tags: ['写作工具', '文本处理', '内容创作'],
        tools: []
      },
      image: {
        group: 'AI图片工具',
        category: 'image',
        tags: ['图片处理', '图像生成', '设计工具'],
        tools: []
      },
      audio: {
        group: 'AI音频视频',
        category: 'audio',
        tags: ['音频视频', '语音处理', '视频编辑'],
        tools: []
      },
      code: {
        group: 'AI代码开发',
        category: 'code',
        tags: ['代码开发', '编程助手', '开发工具'],
        tools: []
      },
      other: {
        group: 'AI其他工具',
        category: 'other',
        tags: ['其他工具', '实用工具', '效率工具'],
        tools: []
      }
    }

    // 将工具分配到对应分类
    tools.forEach((tool: Tool) => {
      const category = categoryMap[tool.category] || categoryMap.other
      
      category.tools.push({
        id: tool.id,
        name: tool.name,
        desc: tool.description,
        url: tool.url,
        tag: tool.tag,
        isVip: tool.isVip
      })
    })

    // 确保每个分类都有对应的标签工具
    Object.values(categoryMap).forEach(category => {
      category.tags.forEach(tag => {
        const hasToolsForTag = category.tools.some(tool => tool.tag === tag)
        if (!hasToolsForTag && category.tools.length > 0) {
          // 如果没有对应标签的工具，将第一个工具的标签设置为该标签
          if (category.tools[0]) {
            category.tools[0].tag = tag
          }
        }
      })
    })

    // 过滤掉空分类并转换为数组
    const groups = Object.values(categoryMap).filter(category => 
      category.tools.length > 0
    )

    // 获取最后更新时间
    const lastUpdate = tools.length > 0 
      ? tools[0].updatedAt?.toISOString() 
      : new Date().toISOString()

    const duration = Date.now() - startTime

    return NextResponse.json({
      success: true,
      data: {
        groups,
        totalTools: tools.length,
        lastUpdate
      },
      duration: `${duration}ms`
    })

  } catch (error) {
    console.error('获取工具数据失败:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '获取数据失败',
      data: {
        groups: [],
        totalTools: 0,
        lastUpdate: new Date().toISOString()
      }
    }, { status: 500 })
    
  } finally {
    await prisma.$disconnect()
  }
}