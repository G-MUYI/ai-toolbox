import { NextResponse } from 'next/server'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Tool interface to fix TypeScript typing
interface ToolData {
  name: string
  description: string
  url: string
  category: string
  tag: string
  isVip: boolean
  updatedAt: Date
  createdAt?: Date
}

// 抓取Toolify.ai的AI工具数据
export async function GET() {
  try {
    const startTime = Date.now()
    console.log('开始抓取 Toolify.ai 数据...')

    // 抓取网页内容
    const response = await axios.get('https://www.toolify.ai/zh/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000
    })

    const $ = cheerio.load(response.data)
    
    // 查找工具卡片
    const toolCards = $('.tool-card, .ai-tool-card, [class*="tool"], [class*="card"]').slice(0, 20)
    console.log(`找到 ${toolCards.length} 个工具卡片`)

    let itemsFound = 0
    let itemsAdded = 0
    let itemsUpdated = 0

    // 处理每个工具
    for (let i = 0; i < toolCards.length; i++) {
      const element = toolCards.eq(i)
      
      try {
        // 提取工具信息
        const name = element.find('h3, .title, .name, [class*="title"], [class*="name"]').first().text().trim()
        const desc = element.find('p, .desc, .description, [class*="desc"]').first().text().trim()
        const linkElement = element.find('a').first()
        const url = linkElement.attr('href') || ''
        
        if (!name || name.length < 2) continue
        
        itemsFound++
        
        // 智能分类逻辑
        let category = 'other'
        let tag = '其他工具'
        
        const nameAndDesc = (name + ' ' + desc).toLowerCase()
        
        if (nameAndDesc.includes('write') || nameAndDesc.includes('text') || nameAndDesc.includes('写作') || nameAndDesc.includes('文本')) {
          category = 'write'
          tag = '写作工具'
        } else if (nameAndDesc.includes('image') || nameAndDesc.includes('photo') || nameAndDesc.includes('图片') || nameAndDesc.includes('绘画')) {
          category = 'image'
          tag = '图片处理'
        } else if (nameAndDesc.includes('video') || nameAndDesc.includes('audio') || nameAndDesc.includes('音频') || nameAndDesc.includes('视频')) {
          category = 'audio'
          tag = '音频视频'
        } else if (nameAndDesc.includes('code') || nameAndDesc.includes('dev') || nameAndDesc.includes('程序') || nameAndDesc.includes('开发')) {
          category = 'code'
          tag = '代码开发'
        }

        // 检查工具是否已存在 (使用正确的模型名称 - 大写 Tool)
        const existingTool = await prisma.tool.findFirst({
          where: {
            OR: [
              { name: name },
              { url: url }
            ]
          }
        })

        const toolData: ToolData = {
          name: name,
          description: desc || `${name} - AI工具`,
          url: url.startsWith('http') ? url : `https://www.toolify.ai${url}`,
          category: category,
          tag: tag,
          isVip: false,
          updatedAt: new Date()
        }

        if (existingTool) {
          // 更新现有工具
          await prisma.tool.update({
            where: { id: existingTool.id },
            data: toolData
          })
          itemsUpdated++
        } else {
          // 添加新工具
          await prisma.tool.create({
            data: {
              ...toolData,
              createdAt: new Date()
            }
          })
          itemsAdded++
        }

        console.log(`处理工具: ${name} (${category})`)
        
      } catch (toolError) {
        console.error(`处理工具时出错:`, toolError)
        continue
      }
    }

    const duration = Math.round((Date.now() - startTime) / 1000)
    
    console.log(`抓取完成: 找到 ${itemsFound} 个工具, 新增 ${itemsAdded} 个, 更新 ${itemsUpdated} 个, 耗时 ${duration} 秒`)

    return NextResponse.json({
      success: true,
      message: '抓取完成',
      data: {
        itemsFound,
        itemsAdded,
        itemsUpdated
      },
      duration
    })

  } catch (error) {
    console.error('抓取过程出错:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '抓取失败',
      message: '抓取过程中发生错误'
    }, { status: 500 })
    
  } finally {
    await prisma.$disconnect()
  }
}