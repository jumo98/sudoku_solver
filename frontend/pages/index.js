import Head from 'next/head'
import React, { useState } from "react";

import { UploadImage } from '../components/UploadImage'
import { Navbar } from '../components/Navbar'
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
  const [board, setBoard] = useState([])
  const [solution, setSolution] = useState([])
  const [durations, setDurations] = useState({})

  function SetBoardImage(image) {
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
    <div className='h-screen'>
      <Head>
        <title>Sudoku Solver</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className='fixed z-50'>
        <Navbar />
      </div>

      <div className='h-screen p-5 grid grid-cols-3 gap-4'>
        <div className='m-auto text-center'>
          <h1 className='align-top'>Image Upload</h1>
          <UploadImage setBoardImage={SetBoardImage} />
        </div>
        <div className='m-auto text-center'>
          <Algorithms setSolution={setSolution} setDurations={setDurations} board={board} solution />
        </div>
        <div className='m-auto text-center'>
          <Solution solution={solution} durations={durations} resetChart={resetChart} resetSolution={resetSolution} />
        </div>
      </div>
    </div>
  )
}
