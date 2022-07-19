import cv2
import numpy as np
import io

def max_contour(contours):
    max_length = 0
    max = None
    for contour in contours:
        length = cv2.arcLength(contour, closed=False)
        if length > max_length:
            max_length = length
            max = contour 
    return max

def distance_between(p1, p2):
	a = p2[0] - p1[0]
	b = p2[1] - p1[1]
	return np.sqrt((a ** 2) + (b ** 2))

def get_corners(polygon):
    top_left, top_right, bottom_left, bottom_right = [],[],[],[]

    max_length = np.max(polygon)

    i = 0
    for corner_array in polygon:
        # Top left corner
        corner = corner_array[0]
        print(corner)
        if corner[0] < max_length/2 and corner[1] < max_length/2:
            if len(top_left) == 0:
                print("TopLeft")
                top_left = corner
        # Top right corner
        if corner[0] > max_length/2 and corner[1] < max_length/2:
            if len(top_right) == 0:
                print("TopRight")
                top_right = corner
        # Bottom left corner
        if corner[0] < max_length/2 and corner[1] > max_length/2:
            if len(bottom_left) == 0:
                print("BottomLeft")
                bottom_left = corner
        # Bottom right corner
        if corner[0] > max_length/2 and corner[1] > max_length/2:
            if len(bottom_right) == 0:
                print("BottomRight")
                bottom_right = corner

    return top_left, top_right, bottom_left, bottom_right

def warp_to_board(src, max_contour):
     # TEST
    peri = cv2.arcLength(max_contour, True)
    corners = cv2.approxPolyDP(max_contour, 0.04 * peri, True)

    # draw quadrilateral on input image from detected corners
    result = src.copy()
    cv2.polylines(result, [corners], True, (0,0,255), 10, cv2.LINE_AA)
    result = cv2.resize(result, (800 , 800)) 
    cv2.imwrite("QUAD.png", result)
    # cv2.waitKey(0)

    top_left, top_right, bottom_left, bottom_right  = get_corners(corners)
    s = np.array([top_left, top_right, bottom_right, bottom_left], dtype='float32')

    # Get the longest side in the rectangle
    side = np.max([
    	distance_between(bottom_right, top_right),
    	distance_between(top_left, bottom_left),
    	distance_between(bottom_right, bottom_left),
    	distance_between(top_left, top_right)
    ])

    # Describe a square with side of the calculated length, this is the new perspective we want to warp to
    dst = np.array([[0, 0], [side - 1, 0], [side - 1, side - 1], [0, side - 1]], dtype='float32')

	# Gets the transformation matrix for skewing the image to fit a square by comparing the 4 before and after points
    m = cv2.getPerspectiveTransform(s, dst)

    return  cv2.warpPerspective(src, m, (int(side), int(side)))

def board_threshold(img, threshold):

    cv2.imwrite("src.png", img)
    # Convert source image to gray scale
    src_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    # Blur image to smooth edges with 3x3 kernel
    src_gray = cv2.blur(src_gray, (2,2))
    # Apply threshold
    src_gray = cv2.threshold(src_gray,threshold,255,cv2.THRESH_BINARY+cv2.THRESH_OTSU)[1]

    # Detect edges using Canny
    canny_output = cv2.Canny(src_gray, threshold, threshold * 2)
    # Find contours
    contours, _ = cv2.findContours(canny_output, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

    # Find max contour / border of the game board
    max_con = max_contour(contours)

    # Encode for data transfer
    _, buffer = cv2.imencode(".png", src_gray)
    io_buf = io.BytesIO(buffer)

    if (cv2.arcLength(max_con, closed=True) < 2*img.shape[0]):
        return io_buf

    res = warp_to_board(src_gray, max_con)

    _, buffer = cv2.imencode(".png", res)
    io_buf = io.BytesIO(buffer)
    
    return io_buf