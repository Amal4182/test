import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import HomePage from "./HomePage"
import ProfileCompletion from "./profile-completion"
import { headers } from "next/headers"

async function checkProfileComplete(email: string): Promise<boolean> {
  try {
    const requestHeaders = await headers()
    const protocol = requestHeaders.get("x-forwarded-proto") ?? "http"
    const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host")
    const baseUrl =
      host ? `${protocol}://${host}` : process.env.NEXTAUTH_URL ?? "http://10.10.35.103:3000"

    const response = await fetch(
      `${baseUrl}/api/completeprofile?email=${encodeURIComponent(email)}`,
      { cache: "no-store" }
    )
    if (!response.ok) {
      throw new Error('Failed to fetch profile status');
    }
    const data = await response.json();
    return data.message === 'Profile is completed';
  } catch (error) {
    console.error('Error checking profile status:', error);
    return false;
  }
}


export default async function ProtectedHomePage() {
  const session = await auth()
  if (!session || !session.user?.email) {
    return redirect("/")
  }

  const profileComplete = await checkProfileComplete(session.user.email)

  if (!profileComplete) {
    return <ProfileCompletion />
  }

  return <HomePage />
}
