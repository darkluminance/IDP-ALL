import cv2
import numpy as np
import sys
import line

image=cv2.imread(sys.argv[1])
skip2 = sys.argv[2]

# resize image
dim = (512, 512)
resized = cv2.resize(image, dim, interpolation = cv2.INTER_AREA)
resized2 = cv2.resize(image, (14,14), interpolation = cv2.INTER_AREA)

#Convert to grayscale
gray_img = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)
gray_img2 = cv2.cvtColor(resized2, cv2.COLOR_BGR2GRAY)

arr = np.asarray(gray_img)
arr2 = np.asarray(gray_img2)
# print("Image received... Array created...")
""" 
# yx_coords = np.column_stack(np.where(gray_img < 5))
yx_coords = np.flip(np.column_stack(np.where(gray_img <=100)), axis=1)


max_x, max_y = gray_img.shape[1], gray_img.shape[0]

image = np.full((max_x+1, max_y+1), 255) """

""" for i in range(len(yx_coords)):
    # image[max_y - y[i], x[i]] = 1
    image[max_y - y[i],x[i]] = 1 """


#find line thickness
line_thickness = 1000000
value_threshold = 80

for i in arr:
    start_point = -1
    prev_point = -1
    counter = 0
    for j in i:
        if(j <= value_threshold):
            if(start_point == -1):
                start_point = counter
                # print("startpoint ", counter)
            elif(prev_point != -1 and i[prev_point] > value_threshold):
                line_thickness = min(line_thickness, abs(counter - start_point))
                start_point = -1
                # print("paisi at ", counter)

        prev_point = counter
        counter = counter + 1
    line_thickness = min(line_thickness, abs(counter - start_point))

# print("Thickness determined with value of ", line_thickness)

#put black points on the middle of these lines  

limm= 25
max_x, max_y = gray_img.shape[1], gray_img.shape[0]
max_x, max_y = max(max_x, max_y), max(max_x, max_y)
image = np.full((max_x, max_y), 255)
imagee = np.full((limm, limm), 255)
image2 = set()
image2_2 = set()
line_thickness2 = min(8, line_thickness + 4)
skip = line_thickness2

if skip2: 
    skip = int(skip2)
    line_thickness2 = skip

for i in range(0, len(arr) - 1, skip):
    start_point = -1
    prev_point = -1
    lim = len(arr[i]) 
    for j in range(20, lim):
        if((start_point == -1 ) and (arr[i][j] <= value_threshold)):
            start_point = j

        if((start_point + line_thickness2 == j)):
            mid_val = (start_point + j)/2
            image[i, j] = 0
            # image[i+1, j] = 0
            # image[i+1, j+1] = 0
            # image[i+1, j-1] = 0
            # image[i-1, j] = 0
            # image[i-1, j+1] = 0
            # image[i-1, j-1] = 0
            # image[i, j+1] = 0
            # image[i, j-1] = 0
            imagee[int(i/max_x * limm), int(j/max_y * limm)] = 0
            image2.add((round(i/max_x * limm, 1), round(j/max_y * limm, 1)))
            image2_2.add((i,j))
            # image2_2.add((i*0.0104166667,j*0.0104166667))
            start_point = -1

        prev_point = j



# print("Dots added to image")
# print(image2, len(image2))

# image = np.rot90(image, k=2, axes=(0,1))
#image = cv2.flip(image, 1)
cv2.imwrite("dots/" + sys.argv[1] + ".png", image)
cv2.imwrite("dots/" + sys.argv[1] + "_smol.png", imagee)
# resized3 = cv2.resize(arr2, (14,14), interpolation = cv2.INTER_AREA)
# cv2.imwrite("dots/" + sys.argv[1] + "_smol.png", resized3)
# print("File saved as", sys.argv[1])
# print(image2_2)
line.connect_the_dots(image2_2)
# line.connect_the_dots(image2)