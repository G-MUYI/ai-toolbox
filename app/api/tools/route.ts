import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 获取所有工具数据，按分类组织
export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now()
    
    // 从数据库获取所有工具
    const tools = await prisma.aiTool.findMany({
      orderBy: [
        { subCategory: 'asc' },
        { updatedAt: 'desc' }
      ]
    })
    
    // 按子分类组织数据
    const groupedTools = tools.reduce((acc, tool) => {
      // 使用 subCategory 作为分组键，如果为空则使用 '其他'
      const category = tool.subCategory || '其他'
      
      if (!acc[category]) {
        acc[category] = {
          group: category,
          tags: [],
          category: category.toLowerCase().replace(/\s+/g, ''),
          tools: []
        }
      }
      
      // 添加工具到对应分类
      acc[category].tools.push({
        name: tool.name,
        desc: tool.description || '',
        url: tool.url,
        tag: tool.tags || category,
        isVip: tool.pricing ? tool.pricing.toLowerCase().includes('paid') || tool.pricing.toLowerCase().includes('premium') : false
      })
      
      // 收集标签（去重）
      if (tool.tags && !acc[category].tags.includes(tool.tags)) {
        acc[category].tags.push(tool.tags)
      }
      
      return acc
    }, {} as any)
    
    // 转换为数组格式，并确保每个分类至少有一个标签
    const groups = Object.values(groupedTools).map((group: any) => ({
      ...group,
      tags: group.tags.length > 0 ? group.tags : [group.group]
    }))
    
    const duration = Date.now() - startTime
    
    return NextResponse.json({
      success: true,
      groups: groups,
      stats: {
        totalTools: tools.length,
        categories: groups.length,
        duration: `${duration}ms`
      }
    })
    
  } catch (error) {
    console.error('获取工具数据失败:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '获取失败',
    }, { status: 500 })
    
  } finally {
    await prisma.$disconnect()
  }
}