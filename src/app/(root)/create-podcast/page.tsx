"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Textarea } from "@/components/ui/textarea"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useState } from "react"
import GeneratePodcast from "@/components/GeneratePodcast"
import GenerateThumbnail from "@/components/GenerateThumbnail"
import { Id } from "../../../../convex/_generated/dataModel"

const formSchema = z.object({
  podcastTitle: z.string().max(100, {
    message: "Podcast Title must within 100 character"
  }),
  podcastDescription: z.string({
    message: "Enter podcast description"
  }),
});

const CreatePodcast = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      podcastTitle: "",
      podcastDescription: "",
    },
  });

  const submitHandler = async (form: z.infer<typeof formSchema>) => {
    const { podcastTitle, podcastDescription } = form;
    // will work later
  }

  const voiceCategories = ['Neural2','WaveNet','Basic'];

  
  const [audioUrl,setAudioUrl] = useState('');
  const [audioStorageId,setAudioStorageId] = useState<Id<"_storage"> | null>(null);
  const [audioDuration,setAudioDuration] = useState(0);

  const [imageUrl,setImageUrl] = useState('');
  const [imageStorageId,setImageStorageId] = useState<Id<"_storage"> | null>(null);
  const [imagePrompt,setImagePrompt] = useState('');
  
  const [voiceType,setVoiceType] = useState<string|null>(null);
  const [voicePrompt,setVoicePrompt] = useState('');

  return (
    <section className="flex flex-col mt-10">
      <h1 className="text-white-1 font-bold text-2xl">Create a Podcast</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitHandler)} className="mt-10 flex flex-col w-full">
          <div className="flex flex-col gap-[30px] border-black-5 pb-10 border-b">
            <FormField
              control={form.control}
              name="podcastTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-lg">Podcast title</FormLabel>
                  <FormControl>
                    <Input placeholder="The Podify Podcast" {...field} className="input-class focus-visible:ring-offset-orange-1" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-y-2">
              <Label className="font-bold text-white-1 text-lg">Voice Type</Label>
              <Select onValueChange={(value)=>setVoiceType(value)}>
                <SelectTrigger className={cn("w-full text-16 border-none bg-black-1 text-white-1 focus-visible:ring-offset-orange-1")}>
                  <SelectValue placeholder="Select category" className="placeholder:text-gray-1" />
                </SelectTrigger>
                <SelectContent className="text-16 border-none bg-black-1 font-bold text-white-1">
                  {
                    voiceCategories.map((category)=>(
                      <SelectItem key={category} value={category} className="focus:bg-orange-1 cursor-pointer capitalize">{category}</SelectItem>
                    ))
                  }
                </SelectContent>
                {voiceType && (
                  <audio
                    src={`/${voiceType}.mp3`}
                    autoPlay
                    className="hidden"
                  />
                )}
              </Select>
            </div>

            <FormField 
            control={form.control}
            name="podcastDescription"
            render={({field})=>(
              <FormItem>
                <FormLabel className="text-white-1 text-lg font-bold">Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Write a short description about the podcast" 
                  className="bg-black-1 placeholder:text-gray-1 text-white-1 focus-visible:ring-offset-orange-1 border-none"
                  {...field} />
                </FormControl>
              </FormItem>
            )}
            />
          </div>

          <div className="py-10">
            <GeneratePodcast
            voicePrompt={voicePrompt}
            setVoicePrompt={setVoicePrompt}
            voiceType={voiceType!}
            setAudio={setAudioUrl}
            audio={audioUrl}
            setAudioStorageId={setAudioStorageId}
            setAudioDuration={setAudioDuration}
            />

            <GenerateThumbnail
            setImage = {setImageUrl}
            setImageStorageId = {setImageStorageId}
            setImagePrompt={setImagePrompt}
            image={imageUrl}
            imagePrompt={imagePrompt}
            />
          </div>
          
          <Button type="submit" className="bg-orange-1 text-white-1 font-bold">Submit & publish podcast</Button>
        </form>
      </Form>
    </section>
  )
}

export default CreatePodcast