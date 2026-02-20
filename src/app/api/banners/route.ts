import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    })
    return NextResponse.json({ banners })
  } catch (error) {
    console.error('Error fetching banners:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, subtitle, imageUrl, link, active, order } = body

    const banner = await prisma.banner.create({
      data: {
        title,
        subtitle,
        imageUrl,
        link,
        active: active ?? true,
        order: order ?? 0,
      },
    })

    return NextResponse.json(banner, { status: 201 })
  } catch (error) {
    console.error('Error creating banner:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
