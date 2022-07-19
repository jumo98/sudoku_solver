import Head from 'next/head'
import React, { useState } from "react";

import { Board } from '../components/Board'
import { Button } from '../components/Button';
import { UploadImage } from '../components/UploadImage'
import { Navbar } from '../components/Navbar'
import { Card } from '../components/Card';
import { Algorithms } from '../components/Algorithms';
import { Solution } from '../components/Solution';

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
  const [solution, setSolution] = useState([])
  const [durations, setDurations] = useState({})

  function SetBoardImage(image) {
    setBoardImage(image)
    ProcessBoardImage(image)
      .then((result) => {
        console.log(result)
        setBoard(result)
      })
  }

  function resetSolution() {
    setSolution([])
  }

  function resetChart() {
    setDurations({})
  }

  return (
    <div>
      <Head>
        <title>Sudoku Solver</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className='z-40'>
        <Navbar />
      </div>

      <div className='p-5 m-auto grid grid-cols-3 gap-4'>
        <div className='m-auto text-center'>
          <h1 className='align-top'>Image Upload</h1>
          <UploadImage setBoardImage={SetBoardImage} />
        </div>
        <div className='m-auto text-center'>
          {
            board.length > 0 ?
              <Algorithms setSolution={setSolution} setDurations={setDurations} board={board} solution/>
              :
              <p>Waiting for submission</p>
          }
        </div>
        <div className='m-auto text-center'>
          <Solution solution={solution} durations={durations} resetChart={resetChart} resetSolution={resetSolution}/>
        </div>
      </div>
    </div>
  )
}
