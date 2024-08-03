import { useState } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Loader } from 'lucide-react';
import { GeneratePodcastProps } from "@/types";
import { useToast } from './ui/use-toast';
import { useAction, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { v4 as uuidv4 } from "uuid";

const useGeneratePodcast = ({setAudio, voiceType, voicePrompt, setAudioStorageId}:GeneratePodcastProps)=>{
  const [isGenerating,setIsGenerating] = useState<boolean>(false);
  const {toast} = useToast();

  const generateUploadUrl = useMutation(api.file.generateUploadUrl);
  const {startUpload} = useUploadFiles(generateUploadUrl);

  const getPodcastAudio = useAction(api.mediageneration.generateAudio);
  const getAudioUrl = useMutation(api.podcast.getUrl);

  const generatePodcast = async ()=>{
    setIsGenerating(true);
    setAudio('');

    if(!voicePrompt){
      toast({
        title: "Please provide a voice prompt to generate a podcast",
      });
      return setIsGenerating(false);
    }

    if(!voiceType){
      toast({
        title: "Please provide a voiceType to generate a podcast",
      });
      return setIsGenerating(false);
    }

    try {
      const audioData = await getPodcastAudio({
        voiceType:voiceType,
        input:voicePrompt
      });
      const data = Buffer.from(audioData,"base64");
      const blob = new Blob([data!],{type:'audio/mpeg'})
      const fileName = `podcast-${uuidv4()}.mp3`;
      const file = new File([blob], fileName, { type: 'audio/mpeg' });

      const upload = await startUpload([file]);

      const storageId = (upload[0].response as any).storageId;

      setAudioStorageId(storageId);

      const audioUrl = await getAudioUrl({storageId});
      setAudio(audioUrl!);
      setIsGenerating(false);
      toast({
        title:"Podcast generated successfully",
      })
    } catch (error) {
      console.log("Error generating Podcast",error);
      toast({
        title:"Error generating podcast",
        variant:"destructive"
      })
      setIsGenerating(false);
    }

  }

  return {
    isGenerating,
    generatePodcast
  }
}


const GeneratePodcast = (props:GeneratePodcastProps) => {
  const {isGenerating,generatePodcast} = useGeneratePodcast(props);
  return (
    <div className='flex flex-col w-full'>
      <Label className="font-bold text-white-1 text-lg">AI prompt to generate podcast</Label>
      <Textarea placeholder='Provide text to AI to generate audio' 
        className='bg-black-1 font-light border-none placeholder:text-gray-1 text-white-1 focus-visible:ring-offset-orange-1' 
        rows={5}
        value={props.voicePrompt}
        onChange={(e)=>props.setVoicePrompt(e.target.value)}
      />
      <Button type='submit' onClick={generatePodcast} className='bg-blue-300 mt-2 hover:bg-blue-200 transition-all duration-75'>
        {isGenerating ? (
          <>
            Generating
            <Loader className='animate-spin ml-2' />
          </>
        ):(
          'Generate audio'
        )}
      </Button>

      {props.audio && (
        <audio
          src={props.audio}
          autoPlay
          controls
          className='mt-5'
          onLoadedMetadata={(e)=>props.setAudioDuration(e.currentTarget.duration)}
        />
      )}
    </div>
  )
}

export default GeneratePodcast;
