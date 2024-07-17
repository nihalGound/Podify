import { useState } from 'react';
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Loader } from 'lucide-react';

const GeneratePodcast = () => {
  const handleSubmit = ()=>{};
  const [isgenerating,setIsgenerating] = useState<boolean>(false);
  const [voicePrompt,setVoicePrompt] = useState<string>('');
  return (
    <div className='flex flex-col w-full'>
        <Label className="font-bold text-white-1 text-lg">AI prompt to generate podcast</Label>
        <Textarea placeholder='Provide text to AI to generate audio' 
        className='bg-black-1 font-light border-none placeholder:text-gray-1 text-white-1 focus-visible:ring-offset-orange-1' 
        rows={5}
        value={voicePrompt}
        onChange={(e)=>setVoicePrompt(e.target.value)}
        />
        <Button type='submit' onSubmit={handleSubmit} className='bg-blue-300 mt-2 hover:bg-blue-200 transition-all duration-75'>
          {isgenerating ? (
            <>
              Generating
              <Loader className='animate-spin ml-2' />
            </>
          ):(
            'Generate audio'
          )}
        </Button>
    </div>
  )
}

export default GeneratePodcast