import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json(
      { message: "An error occurred." },
      { status: 500 }
    );
  }

  const body = await request.json();
  const { listingId, startDate, endDate, totalPrice, hostId, characterInfo } =
    body;

  if (!listingId || !startDate || !endDate || !totalPrice) {
    return NextResponse.json(
      { message: "An error occurred." },
      { status: 500 }
    );
  }

  const listingAndReservation = await prisma.listing.update({
    where: {
      id: listingId,
    },
    data: {
      reservations: {
        create: {
          userId: currentUser.id,
          hostId,
          startDate,
          endDate,
          totalPrice,
          characterInfo,
        },
      },
    },
  });

  return NextResponse.json(listingAndReservation);
}
