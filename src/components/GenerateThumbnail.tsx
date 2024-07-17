import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "./ui/input"
import { useRef, useState } from "react"
import Image from "next/image";
import { Loader } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";


const GenerateThumbnail = () => {
    const [isImageLoading, setIsImageLoading] = useState<boolean>(false);
    const imgRef = useRef<HTMLInputElement>(null);
    return (
        <div className='flex flex-col w-full mt-4'>
            <Tabs defaultValue="upload" className="w-full">
                <TabsList className="gap-x-5 mb-3">
                    <TabsTrigger value="generate" className="bg-black-1 border px-4 py-2 rounded-md focus:bg-gray-700">AI prompt to generate thumbnail</TabsTrigger>
                    <TabsTrigger value="upload" className="bg-black-1  border px-4 py-2 rounded-md focus:bg-gray-700">Upload custom image</TabsTrigger>
                </TabsList>
                <TabsContent value="generate">
                    <Textarea placeholder="Enter prompt to generate thumbnail" className="placeholder:text-gray-1 text-white-1 border-none
                    focus-visible:ring-offset-orange-1 bg-black-1" rows={5} />
                    <Button className="bg-blue-300 mt-3 hover:bg-blue-200 transition-all duration-75 w-full">
                        {
                            isImageLoading ? (
                                <>
                                Generating 
                                <Loader className="animate-spin ml-2" />
                                </>
                            ) :("Generate Thumbnail")
                        }
                    </Button>
                </TabsContent>
                <TabsContent value="upload">
                    <div className="image_div" onClick={()=>imgRef.current?.click()}>
                        <Input
                            type="file"
                            className="hidden"
                            ref={imgRef}
                        />
                        {!isImageLoading ? (
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
        </div>
    )
}

export default GenerateThumbnail