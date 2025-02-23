import { useState } from 'react'
import './App.css'

function App() {

  return (
    <>
      <div className="h-full">
        <div className="grid grid-cols-12 grid-rows-8 gap-4 h-full">
          <div className="col-span-2 row-span-8 h-full">1</div>
          <div className="col-span-10 col-start-3">2</div>
          <div className="col-span-5 row-span-4 col-start-3 row-start-2">3</div>
          <div className="col-span-5 row-span-3 col-start-8 row-start-2">5</div>
          <div className="col-span-5 row-span-4 col-start-8 row-start-5">6</div>
          <div className="col-span-5 row-span-3 col-start-3 row-start-6">10</div>
        </div>
      </div>
    </>
  )
}

export default App
