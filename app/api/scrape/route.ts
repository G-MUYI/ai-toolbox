import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 抓取Toolify.ai的AI工具数据
export async function GET(request: NextRequest) {
  const startTime = Date.now()
  let itemsFound = 0
  let itemsAdded = 0
  let itemsUpdated = 0
  
  try {
    console.log('开始抓取 Toolify.ai 数据...')
    
    // 目标URL - Toolify.ai的中文页面
    const baseUrl = 'https://www.toolify.ai/zh'
    
    // 发送HTTP请求
    const response = await axios.get(baseUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 30000
    })
    
    // 解析HTML
    const $ = cheerio.load(response.data)
    
    // 查找工具卡片 - 需要分析网站结构来确定选择器
    const toolCards = $('.tool-card, .ai-tool-card, [class*="tool"], [class*="card"]').slice(0, 20) // 先测试20个
    
    console.log(`找到 ${toolCards.length} 个工具卡片`)
    itemsFound = toolCards.length
    
    // 遍历每个工具卡片
    for (let i = 0; i < toolCards.length; i++) {
      const card = $(toolCards[i])
      
      // 提取工具信息 - 根据实际HTML结构调整
      const name = card.find('h3, .title, [class*="name"], [class*="title"]').first().text().trim()
      const description = card.find('.description, .desc, p').first().text().trim()
      const url = card.find('a').first().attr('href') || ''
      const logoUrl = card.find('img').first().attr('src') || ''
      
      if (name && url) {
        try {
          // 检查是否已存在
          const existing = await prisma.aiTool.findFirst({
            where: {
              OR: [
                { name: name },
                { url: url.startsWith('http') ? url : `https://www.toolify.ai${url}` }
              ]
            }
          })
          
          const toolData = {
            name,
            description: description || `${name}是一款AI工具`,
            url: url.startsWith('http') ? url : `https://www.toolify.ai${url}`,
            logoUrl: logoUrl.startsWith('http') ? logoUrl : logoUrl ? `https://www.toolify.ai${logoUrl}` : null,
            category: '未分类',
            tags: 'AI工具',
            pricing: 'unknown',
            sourceUrl: baseUrl
          }
          
          if (existing) {
            // 更新现有记录
            await prisma.aiTool.update({
              where: { id: existing.id },
              data: {
                description: toolData.description,
                logoUrl: toolData.logoUrl,
                updatedAt: new Date()
              }
            })
            itemsUpdated++
          } else {
            // 创建新记录
            await prisma.aiTool.create({
              data: toolData
            })
            itemsAdded++
          }
          
          console.log(`处理工具: ${name}`)
        } catch (error) {
          console.error(`处理工具 ${name} 时出错:`, error)
        }
      }
    }
    
    // 记录抓取日志
    const duration = Math.floor((Date.now() - startTime) / 1000)
    await prisma.scrapingLog.create({
      data: {
        source: 'toolify.ai',
        status: 'success',
        itemsFound,
        itemsAdded,
        itemsUpdated,
        duration
      }
    })
    
    return NextResponse.json({
      success: true,
      message: '抓取完成',
      data: {
        itemsFound,
        itemsAdded,
        itemsUpdated,
        duration
      }
    })
    
  } catch (error) {
    console.error('抓取过程中出错:', error)
    
    // 记录错误日志
    const duration = Math.floor((Date.now() - startTime) / 1000)
    await prisma.scrapingLog.create({
      data: {
        source: 'toolify.ai',
        status: 'failed',
        itemsFound,
        itemsAdded,
        itemsUpdated,
        errorMsg: error instanceof Error ? error.message : '未知错误',
        duration
      }
    })
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '抓取失败'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}