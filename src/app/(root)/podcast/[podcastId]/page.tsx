import React from 'react'

const page = ({ params }: { params: { podcastId: string } }) => {
    console.log(params)
  return (
    <div>this is detail podcast page {params.podcastId}</div>
  )
}

export default page