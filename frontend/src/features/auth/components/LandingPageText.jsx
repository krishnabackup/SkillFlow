import React from 'react'

export default function LandingPageText() {
  return (
              <div className='flex flex-col gap-10'>
            <h2 className='bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 text-transparent bg-clip-text font-semibold text-xl xl:text-5xl xl:w-1/2'>Smart AI Roadmap Generation cum Learning Website</h2>
              <div className='text-white'>
              <h4>Things You can do with this website</h4>
              <ul className="list-disc pl-6">
                <li>Generate roadmap for anything to learn using AI</li>
                <li>Get a roadmap canvas to navigate easily</li>
                <li>Youtube embeded , So no need to switch the webstie</li>
                <li>Quizes after completion of courses to test your  knowledge</li>
                <li>Certificate generated upon securing 60% above in the quizes</li>
              </ul>
              </div>
            </div>
  )
}
