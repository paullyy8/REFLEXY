import pygame
import sys
import math
import random

pygame.init()
screen = pygame.display.set_mode((1280,720))

circle_pos = (1280/2, 720/2)

def check_circle_collision() -> bool:
    mouse_pos = pygame.mouse.get_pos()

    if math.sqrt((mouse_pos[0] - circle_pos[0]) ** 2 + (mouse_pos[1] - circle_pos[1]) ** 2 ) <= 50:
        return True
    return False


while True:

    events = pygame.event.get()
    for event in events:
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()
        if event.type == pygame.MOUSEBUTTONDOWN:
            if event.button == 1: #1 refers to the left click over her
                if check_circle_collision():
                    circle_pos = (random.randint(0 , 1280) , random.randint(0 , 720))

    screen.fill("lightblue")
    pygame.draw.circle(screen, "black", circle_pos, 50)
    pygame.display.update()