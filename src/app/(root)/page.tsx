"use client";
import React from 'react'
import { podcastData } from '../constants'
import PodcastCard from '@/components/PodcastCard'

const Home = () => {
  return (
    <main className='flex flex-col mt-9 gap-9 md:overflow-hidden'>
      <div className='flex flex-col gap-5'>
        <h3 className='text-20 font-bold text-white-1'>Trending Podcasts</h3>
        <div className='podcast_grid'>
          {podcastData.map(({id,title,description,imgURL})=>{
            return <PodcastCard
              key={id}
              title = {title}
              description = {description}
              imgURL={imgURL}
            />
          })}
        </div>
      </div>
    </main>
  )
}

export default Home