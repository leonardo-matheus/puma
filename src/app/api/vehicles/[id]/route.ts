import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: 'asc' } },
        optionals: true,
      },
    })

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    return NextResponse.json(vehicle)
  } catch (error) {
    console.error('Error fetching vehicle:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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
      sold,
      images,
      optionals,
    } = body

    // Delete existing images and optionals
    await prisma.vehicleImage.deleteMany({ where: { vehicleId: id } })
    await prisma.vehicleOptional.deleteMany({ where: { vehicleId: id } })

    const vehicle = await prisma.vehicle.update({
      where: { id },
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
        condition,
        featured,
        sold,
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

    return NextResponse.json(vehicle)
  } catch (error) {
    console.error('Error updating vehicle:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.vehicle.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting vehicle:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
