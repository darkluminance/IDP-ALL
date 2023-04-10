import cv2
import numpy as np
import sys
import math
# using distance.euclidean() method

# Import SciPi Library
from scipy.spatial import distance

dotList = []
visited = {}
distList = {}
cc = 0
sender = []
sender2 = []


def connect_the_dots(points):
    # print("List of Points received...")
    
    for i in points:
        dotList.append(i)
        visited[i] = 0

    # for i in range(len(arr)):
    #     for j in range(len(arr[i])):
    #         if arr[i][j] == 0:
    #             dotList.append([i, j, 0])

    # for i in range(len(arr)>>1,len(arr)):
    #     for j in range(len(arr[i])):
    #         if arr[i][j] == 0:
    #             dotList.append([i, j, 0])
    # for i in range(len(arr)>>1, 0, -1):
    #     for j in range(len(arr[i])-1, 0, -1):
    #         if arr[i][j] == 0:
    #             dotList.append([i, j, 0])

    for i in range(len(dotList)):
        for j in range(len(dotList)):
            if dotList[i] != dotList[j]:
                dist = distance.euclidean(dotList[i],dotList[j])

                if dotList[i] not in distList:
                    distList[dotList[i]] = []
                
                distList[dotList[i]].append((dotList[j], dist))

    for i, j in distList.items():
        distList[i].sort(key=lambda x: x[1])
        distList[i] = j[0:5]

    # print(visited)
    def dfs(point):
        visited[point] = 1
        shouldLoop = False

        for j in distList[point]:
            if not visited[j[0]]:
                # print(visited[j[0]])
                shouldLoop = True
                break
        if not shouldLoop: 
            # print(-1)
            return

        global cc
        global sender
        global sender2
        """ cc = cc + 1
        xx = point[0]
        yy = point[1]
        l1 = 14
        l2 = 11
        l = xx*xx + yy*yy
        l = math.sqrt(l)

        theta2 = (xx*xx + yy*yy-pow(l1,2)-pow(l2,2))
        theta2 = theta2/(2*l1*l2)
        try:
            theta2=-math.acos(theta2)
        except Exception as e:
            print(e)
            print(theta2, xx, yy)
        joint2_val=math.degrees(-theta2)
        angle2= joint2_val

        if xx != 0:
            m = math.degrees(math.atan(yy/xx))
        else:
            m = 90

        theta1=(m-math.degrees(math.atan((l2*math.sin(theta2)))/(l1+l2*math.degrees(math.cos(theta2)))))
        joint1_val=theta1
        angle1= joint1_val

         """
        # print(point[0])
        # print(point[1])
        sender.append(point[0])
        # sender.append(angle1)
        sender2.append(point[1])
        # sender2.append(angle2)

        for j in distList[point]:
            if(not visited[j[0]]):
                dfs(j[0])

    first_elem = list(distList.values())[0][0][0]
    dfs(first_elem)
    # print(cc)
    for i in range(len(sender)):
        # print("G01 X", sender2[i], " Y", sender[i])
        print(f"process(F(\"G01 X{sender2[i]/3} Y{sender[i]/3}\"));")
    # print(sender)
    # print(sender2)
# connect_the_dots()