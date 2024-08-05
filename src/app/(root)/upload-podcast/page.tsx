"use client"

import React, { useRef, useState } from 'react'
import { Id } from '../../../../convex/_generated/dataModel';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader } from 'lucide-react';
import { useUploadFiles } from '@xixixao/uploadstuff/react';

const formSchema = z.object({
    podcastTitle: z.string().max(100, {
        message: "Podcast Title must within 100 character"
    }),
    podcastDescription: z.string({
        message: "Enter podcast description"
    }),
});

const uploadPodcast = () => {
    const router = useRouter();
    const audioRef = useRef<HTMLInputElement>(null);
    const imgRef = useRef<HTMLInputElement>(null);
    const [isVideoUploading, setIsVideoUploading] = useState<boolean>(false);
    const [isImageUploading, setIsImageUploading] = useState<boolean>(false);
    const [audioUrl, setAudioUrl] = useState('');
    const [audioStorageId, setAudioStorageId] = useState<Id<"_storage"> | null>(null);
    const [audioDuration, setAudioDuration] = useState(0);

    const [imageUrl, setImageUrl] = useState('');
    const [imageStorageId, setImageStorageId] = useState<Id<"_storage"> | null>(null);

    const [isSubmiting, setIsSubmiting] = useState(false);
    const { toast } = useToast();

    const generateUploadUrl = useMutation(api.file.generateUploadUrl);
    const { startUpload } = useUploadFiles(generateUploadUrl);

    const createPodcast = useMutation(api.podcast.createPodcast);
    const getUrl = useMutation(api.podcast.getUrl);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            podcastTitle: "",
            podcastDescription: ""
        }
    });

    const handleAudio = async (blob: Blob, fileName: string) => {
        try {
            setIsVideoUploading(true);
            const file = new File([blob], fileName, { type: "audio/mpeg" });
            const upload = await startUpload([file]);
            const storageId = (upload[0].response as any).storageId;

            setAudioStorageId(storageId);
            const audioUrl = await getUrl({ storageId });
            setIsVideoUploading(false);
            setAudioUrl(audioUrl!);
            toast({
                title: "audio uploaded successfully !!!"
            });
        } catch (error) {
            console.log("Error in uploading audio file : ", error);
            toast({
                title: "Error in uploading audio file",
                variant: "destructive"
            });
            setIsVideoUploading(false);
        }
    }

    const uploadAudio = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        try {
            const files = e.target.files;
            if (!files) return;
            const file = files[0];
            const buffer = await file.arrayBuffer();
            const blob = new Blob([buffer!]);
            await handleAudio(blob, file.name);
        } catch (error) {
            console.log("Error in audio uploading ", error);
            toast({ title: "Error in audio uploading", variant: "destructive" })
        }
    }

    const handleSubmit = async (form: z.infer<typeof formSchema>) => {
        try {
            setIsSubmiting(true);
            if (!audioUrl || !imageUrl) {
                setIsSubmiting(false)
                throw new Error("Please generate audio and image");
            }

            const podcast = await createPodcast({
                audioStorageId: audioStorageId!,
                audioUrl: audioUrl,
                imageStorageId: imageStorageId!,
                imageUrl: imageUrl,
                podcastTitle: form.podcastTitle,
                podcastDescription: form.podcastDescription,
                voicePrompt: "Custom audio",
                imagePrompt: "Custom image",
                voiceType: "Custom voice",
                audioDuration: audioDuration,
                views: 0,
            });
            toast({ title: "Podcast created !!" })
            setIsSubmiting(false);
            router.push('/')
        } catch (error) {
            console.log(error);
            toast({ title: "Error", variant: "destructive" })
            setIsSubmiting(false);
        }
    }

    const handleImage = async (blob: Blob, fileName: string) => {
        try {
            setIsImageUploading(true);
            const file = new File([blob], fileName, { type: "image/png" });
            const upload = await startUpload([file]);
            const storageId = (upload[0].response as any).storageId;

            setImageStorageId(storageId);
            const imageUrl = await getUrl({ storageId });
            setImageUrl(imageUrl!);
            setIsImageUploading(false);

        } catch (error) {
            console.log("Error in uploading image : ", error);
            toast({ title: "Error in uploading image", variant: "destructive" });
            setIsImageUploading(false);
        }
    }

    const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        try {
            const files = e.target.files;
            if (!files) return;
            const file = files[0];
            // const buffer = await file.arrayBuffer();
            // const blob = new Blob([buffer!]);
            const blob = await file.arrayBuffer().then((b) => new Blob([b]));
            handleImage(blob, file.name);
        } catch (error) {
            console.log("Error in uploading image ", error);
            toast({
                title: "Error in image uploading",
                variant: "destructive"
            });
        }
    }

    return (
        <section className='flex flex-col mt-10'>
            <h1>Upload Podcast</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-10 flex flex-col w-full">
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


                        <FormField
                            control={form.control}
                            name="podcastDescription"
                            render={({ field }) => (
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

                        <div className='flex flex-col items-start gap-y-2'>
                            <div className='image_div' onClick={() => audioRef.current?.click()} >
                                <Input
                                    type='file'
                                    accept='audio/*'
                                    ref={audioRef}
                                    className='hidden'
                                    onChange={uploadAudio}
                                />

                                {!isVideoUploading ? (
                                    <Image src="/icons/upload-image.svg" width={40} height={40} alt="upload" />
                                ) : (
                                    <div className="text-lg flex-center font-medium text-white-1">
                                        Uploading
                                        <Loader className="animate-spin ml-2" />
                                    </div>
                                )}
                                <div className="flex flex-col items-center">
                                    <h2 className="text-orange-1 font-bold text-sm">Click to upload</h2>
                                    <p className="text-gray-1 font-normal text-sm">mp3,mpeg</p>
                                </div>
                            </div>
                            {audioUrl && (
                                <audio
                                    src={audioUrl}
                                    onLoadedMetadata={(e) => setAudioDuration(e.currentTarget.duration)}
                                    autoPlay
                                    controls
                                />
                            )}
                        </div>

                        <div className='flex flex-col gap-y-2'>
                            <div className='image_div' onClick={() => imgRef.current?.click()}>
                                <Input
                                    type='file'
                                    accept='image/*'
                                    ref={imgRef}
                                    className='hidden'
                                    onChange={uploadImage}
                                />
                                {!isImageUploading ? (
                                    <Image src="/icons/upload-image.svg" width={40} height={40} alt="upload" />
                                ) : (
                                    <div className="text-lg flex-center font-medium text-white-1">
                                        Uploading
                                        <Loader className="animate-spin ml-2" />
                                    </div>
                                )}
                                <div className="flex flex-col items-center">
                                    <h2 className="text-orange-1 font-bold text-sm">Click to upload</h2>
                                    <p className="text-gray-1 font-normal text-sm">svg,jpg,jpeg,png</p>
                                </div>
                            </div>
                            {imageUrl && (
                                <Image
                                    src={imageUrl}
                                    width={200}
                                    height={200}
                                    className="mt-5"
                                    alt="thumbnail"
                                    loading="lazy"
                                />
                            )}
                        </div>
                    </div>

                    <Button type="submit" className="bg-orange-1 text-white-1 font-bold">Submit & publish podcast</Button>
                </form>
            </Form>

        </section>
    )
}

export default uploadPodcast