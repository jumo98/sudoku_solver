# sudoku-solver

sudoku-solver is a web application that can extract and solve Sudokus provides as images.

![Overview](./images/overview.PNG)

## Installation

To make testing as easy as possible this application was packed into one single container that can be run with Docker.
> Hint: The size of the container is quite large (~4GB) and can therefore take a while to start
```
docker run -p 3000:3000 motzi/sudoku-solver
```

You should then be able to view the WebUI on: http://localhost:3000

> All tests were performed under Windows 10 (amd64)

Images for testing can be found in the directory images with the names `s0.png`, `s1.png`, `s2.png` and `s3.png`.
The last one is an example where the image processing is not working correctly probably due to inconsistent lighting of the image.