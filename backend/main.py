import cv2
import sys
import numpy as np
import PIL
from PIL import Image, ImageFilter, ImageOps
# from potrace import Bitmap
import os
# import subprocess
# from subprocess import Popen
# import a

def filtering(img, tt):
    gray_img = img

    try:
        gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    except:
        print("Image already b/w")
    finally:
        blurred = cv2.medianBlur(gray_img, 5)

    # return blurred

    for i in range(len(blurred)):
        for j in range(len(blurred[i])):
            if blurred[i][j] < tt:
                blurred[i][j] = 0
            else:
                blurred[i][j] = 255


    # blurred = cv2.GaussianBlur(inverted, (13, 13), 0)
    # inv_blur = 255-blurred
    # pencilsktch = cv2.divide(gray_img, inv_blur, scale=256.0)
    return blurred

def applyBlurInvert(img, tt):
    # img = filtering(img)

    gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    inverted= 255-gray_img
    blurred = cv2.GaussianBlur(inverted, (13, 13), 0)
    inv_blur = 255-blurred
    ret = cv2.divide(gray_img, inv_blur, scale=256.0)
    if(tt == -1):
        return ret
    else:
        return filtering(ret, tt)


def applyAdaptiveMeanThreshold(img, tt):
    if(tt == -1):
        gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    else:
        gray_img = filtering(img, tt)

    inverted= 255-gray_img
    blurred = cv2.medianBlur(inverted, 5)
    ret = blurred
    ret = cv2.adaptiveThreshold(blurred, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 11, 2)
    return ret
    

def applyCanny(img, tt):
    if(tt == -1):
        pass
    else:
        img = filtering(img, tt)
        # return img
  
    

    threshold1 = 200
    threshold2 = 100
    edgec = cv2.Canny(img, threshold1, threshold2)
    edgec = Image.fromarray(edgec)
    edgec = ImageOps.invert(edgec)
    ret = np.array(edgec)
    return ret

def convert_to_lineart():
    image=cv2.imread(sys.argv[1])
    algotype = sys.argv[2]
    thresholdd = int(sys.argv[3])

    # resize pls naile onek boro thake img onk time laage :3
    dim = (512, 512)
    image = cv2.resize(image, dim, interpolation = cv2.INTER_AREA)

    # print(image)
    if(algotype == '0'):
        pencilsktch = applyBlurInvert(image, thresholdd)
    elif (algotype == '1'):
        pencilsktch = applyAdaptiveMeanThreshold(image, thresholdd)
    else:
        pencilsktch = applyCanny(image, thresholdd)


    #for i in range(100, 255):
    #    pencilsktch[np.where((pencilsktch==[i,i,i]).all(axis=2))]=[0,0,0]
    # pencilsktch[np.where((pencilsktch==[128,128,128]).all(axis=2))]=[0,0,0]
    cv2.imwrite(sys.argv[1] + ".png", pencilsktch)
    print("Success")
    #convert_lineart_to_vector_path()

  
def convert_lineart_to_vector_path():
    os.system("script.bat")
    a.run()


convert_to_lineart()
# def img_file():
#     convert_to_lineart()

# def png_file():
#     convert_lineart_to_vector_path()



# def run_script(choice):
#     if choice == 0:
#         img_file()
#     else:
#         png_file()


# run_script(0)

# image=cv2.imread("./sketch.jpg")
# image = cv2.cvtColor(image, cv2.IMREAD_COLOR)

#for i in range(image.shape[0]):
#    for j in range(image.shape[1]):
#        (r,g,b) = image[i, j]
#        if r < 210:
#            image[i,j] = (0,0,0)
          
            
# cv2.imwrite("./sketch.jpg", image)          
            
# cv2.imshow('result', pencilsktch)
# cv2.waitKey(0)
# cv2.destroyAllWindows()