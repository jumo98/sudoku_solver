import numpy as np
import cv2

import pytesseract

pytesseract.pytesseract.tesseract_cmd = r'C:/Program Files/Tesseract-OCR/tesseract.exe'

def extract_digits(board):
    sudoku = np.empty([9,9])

    # Has 9 rows and 9 columns
    nRows = mCols = 9

    sizeX = board.shape[1]
    sizeY = board.shape[0]

    img = cv2.cvtColor(board, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(img,(3,3),0)
    img = cv2.threshold(blur,0,255,cv2.THRESH_BINARY+cv2.THRESH_OTSU)[1]


    # img = cv.adaptiveThreshold(img,255,cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY,11,2)


    for i in range(0,nRows):
        for j in range(0, mCols):
            x_a = int(i*sizeY/nRows)
            x_b = int(i*sizeY/nRows + sizeY/nRows) 
            y_a = int(j*sizeX/mCols)
            y_b = int(j*sizeX/mCols + sizeX/mCols)
            roi = img[x_a:x_b,y_a:y_b]
            ROIsizeX = roi.shape[1]
            ROIsizeY = roi.shape[0]

            roi = roi[int(0.1*ROIsizeY):int(0.9*ROIsizeY),int(0.1*ROIsizeX):int(0.9*ROIsizeX)]

            # grey_roi = cv.cvtColor(roi, cv.COLOR_BGR2GRAY)
            # edited = cv.medianBlur(roi, 3)
            kernel = np.ones((3,3),np.uint8)
            edited = cv2.morphologyEx(roi, cv2.MORPH_OPEN, kernel)
            # edited = cv.threshold(edited, 127, 255, cv.THRESH_BINARY + cv.THRESH_OTSU)[1]
            # edited = cv.adaptiveThreshold(edited,255,cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY,11,2)
            #edited = cv.blur(grey_roi, (3,3))

            # cv.imshow('rois'+str(i)+str(j), edited)
            # cv2.imwrite(basepath + '/patches/patch_'+str(i)+str(j)+".jpg", edited)
            # cv.waitKey()

            text = pytesseract.image_to_string(edited, config='-c tessedit_char_whitelist=123456789 --psm 10 --oem 3')
            # print(text)
            text = text.replace('\n', '').replace('\f', '')
            if text.isdigit():
                sudoku[i][j] = int(text)
            else:
                sudoku[i][j] = 0
        
    return sudoku
    # print(sudoku)