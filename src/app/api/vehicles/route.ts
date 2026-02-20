import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')
    const brand = searchParams.get('brand')
    const fuel = searchParams.get('fuel')
    const transmission = searchParams.get('transmission')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const minYear = searchParams.get('minYear')
    const maxYear = searchParams.get('maxYear')
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit')

    const where: any = {
      sold: false,
    }

    if (search) {
      where.OR = [
        { brand: { contains: search } },
        { model: { contains: search } },
        { version: { contains: search } },
      ]
    }

    if (brand) where.brand = { equals: brand }
    if (fuel) where.fuel = { equals: fuel }
    if (transmission) where.transmission = { equals: transmission }
    if (minPrice) where.price = { ...where.price, gte: parseFloat(minPrice) }
    if (maxPrice) where.price = { ...where.price, lte: parseFloat(maxPrice) }
    if (minYear) where.year = { ...where.year, gte: parseInt(minYear) }
    if (maxYear) where.year = { ...where.year, lte: parseInt(maxYear) }
    if (featured === 'true') where.featured = true

    const vehicles = await prisma.vehicle.findMany({
      where,
      include: {
        images: { orderBy: { order: 'asc' } },
        optionals: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit) : undefined,
    })

    return NextResponse.json({ vehicles })
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      brand,
      model,
      version,
      year,
      yearModel,
      price,
      mileage,
      fuel,
      transmission,
      bodyType,
      color,
      doors,
      plate,
      description,
      condition,
      featured,
      images,
      optionals,
    } = body

    const vehicle = await prisma.vehicle.create({
      data: {
        brand,
        model,
        version,
        year,
        yearModel,
        price,
        mileage,
        fuel,
        transmission,
        bodyType,
        color,
        doors,
        plate,
        description,
        condition: condition || 'used',
        featured: featured || false,
        images: images
          ? {
              create: images.map((img: string, index: number) => ({
                url: img,
                order: index,
              })),
            }
          : undefined,
        optionals: optionals
          ? {
              create: optionals.map((opt: string) => ({ name: opt })),
            }
          : undefined,
      },
      include: {
        images: true,
        optionals: true,
      },
    })

    return NextResponse.json(vehicle, { status: 201 })
  } catch (error) {
    console.error('Error creating vehicle:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
