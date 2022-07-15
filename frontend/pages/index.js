import Head from 'next/head'
import React, { useState } from "react";

import { Board } from '../components/Board'
import { Button } from '../components/Button';
import { UploadImage } from '../components/UploadImage'
import { Navbar } from '../components/Navbar'
import { Card } from '../components/Card';

function ProcessBoardImage(file) {
  const formData = new FormData();
  formData.append('file', file, 'test.png');

  const requestOptions = {
    method: 'POST',
    body: formData
  };

  return fetch('/api/digits', requestOptions)
    .then(response => response.json())
    .then((result) => {
      let sudoku = JSON.parse(result["sudoku"]);
      return sudoku
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

export default function Home() {
  const [boardImage, setBoardImage] = useState(null)
  const [board, setBoard] = useState([])

  function SetBoardImage(image) {
    setBoardImage(image)
    ProcessBoardImage(image)
      .then((result) => {
        console.log(result)
        setBoard(result)
      })
  }

  return (
    <div>
      <Head>
        <title>Sudoku Solver</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className='z-40 fixed'>
        <Navbar />
      </div>

      <div className='h-screen grid grid-cols-2 gap-4'>
        <div className='m-auto text-center'>
          <UploadImage setBoardImage={SetBoardImage} />
        </div>
        {/* <div className='m-auto text-center'>
          {board.length > 0 ? <Board board={board} /> : <p>Waiting...</p>}
        </div> */}
        <div className='m-auto text-center'>
          {
            board.length > 0 ?
              <div>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Card title="Backtracking" description="That took 1.23s" />
                  </div>
                  <div>
                    <Card title="Jan" description="test" />
                  </div>
                  <div>
                    <Card title="AI at once" description="test" />
                  </div>
                  <div>
                    <Card title="AI one after another" description="test" />
                  </div>
                </div>
                <div className='p-5'>
                  <Board board={board}/>
                </div>
              </div>
              :
              <p>Waiting...</p>
          }



        </div>
      </div>

      {/* <div className='h-screen'>
        <div className='m-auto text-center'>
          {step == "upload" ? <UploadImage /> : ''}
          {step  == "board" ? <Board /> : ''}
          <Button onStepChange={handleClick}/>
        </div>
      </div> */}
    </div>
  )
}
