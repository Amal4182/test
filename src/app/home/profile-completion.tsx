"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { UploadButton } from "@/utils/uploadthing"
import { useSession } from "next-auth/react"
import Image from "next/image"

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  age: z
    .number()
    .min(18, { message: "You must be at least 18 years old." })
    .max(100, { message: "Age must be less than 100." }),
  course: z.string().min(2, { message: "Course is required." }),
  email: z.string().email(),
  year: z.number().min(1, { message: "Year of study is required" }).max(10, { message: "Year must be 10 or less" }),
  bio: z
    .string()
    .min(4, { message: "About you must be at least 4 characters." })
    .max(120, { message: "About you must be less than 120 characters." }),
  photos: z.array(z.string()),
  interests: z.array(z.string()),
  gender: z.enum(["male", "female", "other"]),
})
const courses = [
]
export default function ProfileCompletion() {
  const router = useRouter()
  const [photosurl, setPhotosUrl1] = useState<string[]>([])
  const [interests, setInterests] = useState<string[]>([])
  const [newInterest, setNewInterest] = useState("")
  const { data: session, status } = useSession()
  const [disabledButton, setDisabledButton] = useState<boolean>(false)

  const addItem = (newUrl: string) => {
    if (photosurl.length < 2 && newUrl) {
      setPhotosUrl1((prevItems) => [...prevItems, newUrl])
    } else if (photosurl.length >= 2) {
      toast({
        title: "Limit reached",
        description: "You can only upload 2 photos.",
        variant: "destructive",
      })
    }
  }
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      age: 18,
      email: session?.user?.email!,
      course: "",
      year: 1,
      bio: "",
      photos: [],
      gender: "male",
    },
  })
  async function onSubmit(values: z.infer<typeof profileSchema>) {
    setDisabledButton(true)
    try {
      if (photosurl.length < 1 || photosurl.length > 2) {
        toast({
          title: "Incomplete",
          description: "Please upload at least 1 photo (max 2).",
          variant: "destructive",
        })
        setDisabledButton(false)
        return
      }
      values.photos = photosurl
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!response.ok) throw new Error("Failed to create profile")
      const response2 = await fetch("/api/completeprofile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
        }),
      })
      if (!response2.ok) throw new Error("Failed to create profile")
      toast({
        title: "Profile completed",
        description: "Your profile has been successfully created.",
      })
      form.reset()
      setPhotosUrl1([])
      setInterests([])
      router.push("/home")
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem completing your profile. Please try again.",
        variant: "destructive",
      })
    }
    setDisabledButton(false)
  }
  const addInterest = () => {
    if (newInterest && !interests.includes(newInterest)) {
      setInterests([...interests, newInterest])
      form.setValue("interests", [...interests, newInterest])
      setNewInterest("")
    }
  }

  const removeInterest = (interest: string) => {
    const updatedInterests = interests.filter((i) => i !== interest)
    setInterests(updatedInterests)
    form.setValue("interests", updatedInterests)
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-10 md:py-12 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Complete Your Profile</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...form.register("email")} // Still register for submission
                    readOnly // Make it read-only
                    value={session?.user?.email || ""}
                  />
                </FormControl>
                <FormDescription>This is your email address associated with your account.</FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={(e) => field.onChange(Number.parseInt(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="course"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your course" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course} value={course}>
                        {course}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year of Study</FormLabel>
                <Select
                  value={String(field.value ?? "")}
                  onValueChange={(value) => field.onChange(Number.parseInt(value))}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select study year" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">1st year</SelectItem>
                    <SelectItem value="2">2nd year</SelectItem>              
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>About You</FormLabel>
                <FormControl>
                  <Textarea placeholder="Tell us about you" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormItem>
            <FormLabel>Interests</FormLabel>
            <div className="flex space-x-2">
              <Input
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Add an interest"
              />
              <Button type="button" onClick={addInterest}>
                Add
              </Button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {interests.map((interest, index) => (
                <div
                  key={index}
                  className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md flex items-center"
                >
                  {interest}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="ml-2 h-auto p-0 text-secondary-foreground"
                    onClick={() => removeInterest(interest)}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </FormItem>
          <FormField
            control={form.control}
            name="photos"
            render={() => (
              <FormItem>
                <FormLabel>Photos</FormLabel>
                <FormControl>
                  <div className="flex space-x-2">
                    {[...Array(2)].map((_, idx) => (
                      <UploadButton
                        key={idx}
                        className="h-40 w-40"
                        endpoint="imageUploader"
                        disabled={photosurl.length >= 2}
                        onClientUploadComplete={(res) => {
                          if (res && res[0]?.url) addItem(res[0].url)
                        }}
                        onUploadError={(error) => {
                          toast({
                            title: "Upload Error",
                            description: error.message,
                            variant: "destructive",
                          })
                        }}
                      />
                    ))}
                  </div>
                </FormControl>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {photosurl.map((url, index) => (
                    <div key={index} className="relative h-32 w-full overflow-hidden rounded">
                      <Image
                        src={url || "/placeholder.svg"}
                        alt={`Uploaded photo ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 200px"
                      />
                    </div>
                  ))}
                </div>
                <FormDescription>Please upload up to 2 photos (at least 1).</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={disabledButton}>
            Complete Profile
          </Button>
        </form>
      </Form>
    </div>
  )
}
