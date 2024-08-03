import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "./ui/input"
import React, { useRef, useState } from "react"
import Image from "next/image";
import { Loader } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { useAction, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { GenerateThumbnailProps } from "@/types";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { v4 as uuid } from "uuid";


const GenerateThumbnail = ({image,imagePrompt,setImageStorageId,setImagePrompt,setImage}: GenerateThumbnailProps) => {
    const [isGenerating,setIsGenerating] = useState(false);

    const { toast } = useToast();

    const generateUploadUrl = useMutation(api.file.generateUploadUrl);
    const { startUpload } = useUploadFiles(generateUploadUrl);
    const getImageUrl = useMutation(api.podcast.getUrl);

    const getPodcastThumbnailUrl = useAction(api.mediageneration.genrateThumbnail);

    const handleImage = async (blob: Blob, fileName: string) => {
        setIsGenerating(true);
        setImage('');
        try {
            const file = new File([blob], fileName, { type: 'image/png' });
            const upload = await startUpload([file]);
            const storageId = (upload[0].response as any).storageId;

            setImageStorageId(storageId);

            const imageUrl = await getImageUrl({storageId});
            console.log(imageUrl)
            setIsGenerating(false);
            setImage(imageUrl!);
            toast({
                title: "image generated successfully"
            });
        } catch (error) {
            console.log("Error : ", error)
            toast({ title: 'Error generating thumbnail', variant: 'destructive' })
            setIsGenerating(false)
        }
    }

const generateThumbnail = async () => {
    setIsGenerating(true)
    if (!imagePrompt) {
        toast({ title: "image prompt not found" });
        setIsGenerating(false);
        return ;
    }
    try {
        const imageData = await getPodcastThumbnailUrl({ input: imagePrompt });
        const imageBuffer = Buffer.from(imageData,'base64');
        const blob = new Blob([imageBuffer!], { type: 'image/png' });
        const fileName = `thumbnail-${uuid()}`;
        handleImage(blob, fileName);
        setIsGenerating(false)
        
    } catch (e) {
        console.log("error in image generation ,", e);
        toast({ title: "Error in image generation", variant: "destructive" })
        setIsGenerating(false)
    }
}

const uploadImage = async (e:React.ChangeEvent<HTMLInputElement>)=>{
    e.preventDefault();

    try {
        const files = e.target.files;
        if(!files)return ;
        const file = files[0];
        // cont buffer = await file.arrayBuffer();
        // const blob = new Blob([buffer!]);
        const blob = await file.arrayBuffer().then((b)=>new Blob([b]));
        handleImage(blob,file.name);
    } catch (error) {
        console.log("error in image uploding ,", e);
        toast({ title: "Error in image uploading", variant: "destructive" })
    }
}   
    const imgRef = useRef<HTMLInputElement>(null);
    return (
        <div className='flex flex-col w-full mt-4'>
            <Tabs defaultValue="upload" className="w-full">
                <TabsList className="gap-x-5 mb-3">
                    <TabsTrigger value="generate" className="bg-black-1 border px-4 py-2 rounded-md focus:bg-gray-700">AI prompt to generate thumbnail</TabsTrigger>
                    <TabsTrigger value="upload" className="bg-black-1  border px-4 py-2 rounded-md focus:bg-gray-700">Upload custom image</TabsTrigger>
                </TabsList>
                <TabsContent value="generate">
                    <div className="flex-center bg-black-1">
                        <h2>This feature is currently unavailable. We're working hard to bring it back soon!</h2>
                    </div>
                </TabsContent>
                <TabsContent value="upload">
                    <div className="image_div" onClick={() => imgRef.current?.click()}>
                        <Input
                            type="file"
                            className="hidden"
                            ref={imgRef}
                            onChange={uploadImage}
                        />
                        {!isGenerating ? (
                            <Image src="/icons/upload-image.svg" width={40} height={40} alt="upload" />
                        ) : (
                            <div className="text-lg flex-center font-medium text-white-1">
                                Uploading
                                <Loader className="animate-spin ml-2" />
                            </div>
                        )}
                        <div className="flex flex-col items-center">
                            <h2 className="text-orange-1 font-bold text-sm">Click to upload</h2>
                            <p className="text-gray-1 font-normal text-sm">SVG, PNG, JPG, or GIF (max. 1080x1080px)</p>
                        </div>

                    </div>
                </TabsContent>
            </Tabs>
            {image && (
                <div className="flex w-full">
                    <Image
                        src={image}
                        width={200}
                        height={200}
                        className="mt-5"
                        alt="thumbnail"
                        loading="lazy"
                    />
                </div>
            )}
        </div>
    )
}

export default GenerateThumbnail