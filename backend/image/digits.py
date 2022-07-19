import copy
import numpy as np
import cv2
import pytesseract

def extract_digits(board):
    # Extract size of the board
    sizeX, sizeY = board.shape[0], board.shape[1]
    length = (sizeX+sizeY)/2

    # Approximate the kernel to use
    kernel_size = round(length/350)
    kernel = np.ones((kernel_size,kernel_size),np.uint8)

    # Apply image corrections
    blurred = cv2.GaussianBlur(board,(5,5),0)
    opened = cv2.morphologyEx(blurred, cv2.MORPH_OPEN, kernel)
    closed = cv2.morphologyEx(opened, cv2.MORPH_CLOSE, kernel)
    dilated = cv2.dilate(closed,kernel)

    # show_wait_destroy("smooth - dilated", dilated)

    # Detect large lines to remove grid
    lines = cv2.ximgproc.createFastLineDetector(length_threshold=int(length/(18)), do_merge=True).detect(dilated)
    if lines is not None:
        for line in lines:
            # Draw white line other identified lines
            (x_start, y_start, x_end, y_end) = line[0]
            cv2.line(dilated, (int(x_start), int(y_start)), (int(x_end), int(y_end)), (255, 255, 255), thickness=int(board.shape[0]/20))

    # Init empty sudoku
    sudoku = np.zeros([9,9])

    # Apply threshold for 
    thr = cv2.threshold(dilated,100,255,cv2.THRESH_BINARY+cv2.THRESH_OTSU)[1]    

    boxes = pytesseract.image_to_boxes(thr,config='-c tessedit_char_whitelist=123456789 --psm 6')
    for b in boxes.splitlines():
        # Extract box features
        b = b.split(' ')
        x, y, w, h = int(b[1]), int(b[2]), int(b[3]), int(b[4])

        # Assign box to to a grid on the 9x9 board
        i = int(((x+w)/2)/(sizeX/9))
        j = int((sizeY-((y+h)/2))/(sizeY/9))

        # Extract image of the box
        # Skip if it is white only
        box = thr[int(j*sizeX/9):int(int((j+1)*sizeX/9)),int(i*sizeY/9):int(int((i+1)*sizeY/9))]
        if (i < 9 and j < 9 and np.average(box) < 254):
            sudoku[j][i] = b[0]
        else:
            print("Skipping "+str(j)+str(i))
        
        # For debugging
        # cv2.rectangle(res, (x, sizeY - y), (w, sizeY - h), (50, 50, 255), 1)
        # cv2.putText(res, b[0], (x, sizeY - y + 30), cv2.FONT_HERSHEY_SIMPLEX, 4, (50, 205, 50), 5)

    return sudoku