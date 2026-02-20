import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const evaluations = await prisma.evaluation.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ evaluations })
  } catch (error) {
    console.error('Error fetching evaluations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, brand, model, year, mileage, description } = body

    const evaluation = await prisma.evaluation.create({
      data: {
        name,
        email,
        phone,
        brand,
        model,
        year,
        mileage,
        description,
      },
    })

    return NextResponse.json(evaluation, { status: 201 })
  } catch (error) {
    console.error('Error creating evaluation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
