"use server"

import dbConnect from "@/lib/mongodb"
import User from "@/model/User"
import { Partner } from "@/types/partner"


export async function fetchPartner(email: string) {
  await dbConnect()
  const decodedEmail = decodeURIComponent(email)
  const userdetails = await User.find({ email: decodedEmail })
  return userdetails
}


export async function fetchPartnerSingle(email: string): Promise<Partner | null> {
  await dbConnect()
  const decodedEmail = decodeURIComponent(email)
  const userDetails = await User.findOne({ email: decodedEmail })

  if (!userDetails) return null
  return {
    id: userDetails._id?.toString(),
    name: userDetails.name,
    email: userDetails.email,
    age: userDetails.age,
    course: userDetails.course,
    year: userDetails.year,
    bio: userDetails.bio,
    interests: userDetails.interests,
    photos: userDetails.photos,
    gender:userDetails.gender
  }
}
export async function fetchPartnerMultiple(emails: string[]): Promise<Partner[] | null> {
  await dbConnect();
  let decodedEmails: string[] = emails.map((email) => decodeURIComponent(email));

  const userDetails = await User.find({ email: { $in: decodedEmails } });

  if (!userDetails || userDetails.length === 0) return null;

  return userDetails.map((user) => ({
    id: user._id?.toString(),
    name: user.name,
    email: user.email,
    age: user.age,
    course: user.course,
    year: user.year,
    bio: user.bio,
    interests: user.interests,
    photos: user.photos,
    gender:user.gender
  }));
}
