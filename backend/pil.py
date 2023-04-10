from PIL import Image, ImageDraw


def line(points_path, output_path):
    txt_file = open(points_path, "r")
    file_content = txt_file.read()
    # print("The file content are: ", file_content)

    content_list = file_content.split("\n")
    txt_file.close()
    final_list = []
    for each in content_list:
        if each != "":
            zz = each.split(" ")
            x, y = int(zz[1]), int(zz[4])
            final_list.append((x, y))

    image = Image.new("RGB", (512, 512), "white")    
    draw = ImageDraw.Draw(image)
    # draw.line(final_list, width=2, fill="black", joint="curve")
    for i in range(len(final_list)-1):
        draw.line(final_list[i] + final_list[i+1], width=2, fill="black")


    image.save(output_path)
    make_gif(final_list)

    

def make_gif(final_list):
    frames = []

    for p in range(len(final_list)):   
        image = Image.new("RGB", (512, 512), "white")    
        draw = ImageDraw.Draw(image) 
        last = final_list[0]    
        for i in range(1, p):
            if final_list[i] == (-1, -1):
                last = final_list[i+1]
            elif final_list[i+1] == (-1, -1):
                last = final_list[i+1]
            else:
                draw.line(last + final_list[i], width=2, fill="black")
                last = final_list[i]
        frames.append(image)

    for p in range(10):   
        image = Image.new("RGB", (512, 512), "white")    
        draw = ImageDraw.Draw(image) 
        last = final_list[0]    
        for i in range(1, len(final_list)-1):
            if final_list[i] == (-1, -1):
                last = final_list[i+1]
            elif final_list[i+1] == (-1, -1):
                last = final_list[i+1]
            else:
                draw.line(last + final_list[i], width=2, fill="black")
                last = final_list[i]
        frames.append(image)
        
    frame_one = frames[0]
    frame_one.save("output.gif", format="GIF", append_images=frames,
                   save_all=True, duration=(len(frames) / 1.5), loop=0)

if __name__ == "__main__":
    line("points.txt", "lines.png")
