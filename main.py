import pygame
import sys
import math
import random
import time

pygame.init()
screen = pygame.display.set_mode((1280,720))

circle_pos = (1280/2, 720/2)

font = pygame.font.Font(None, 30)

score = 0
start_time = None  # Timer start time
timer_running = False  # Check if the timer is running

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
            if event.button == 1:  # 1 refers to the left click
                if check_circle_collision():
                    score += 1
                    circle_pos = (random.randint(50, 1230), random.randint(50, 670))  # Prevent circle going off screen

                    if not timer_running:
                        start_time = time.time()  # Record the time of the first click
                        timer_running = True

    # Calculate the elapsed time if the timer is running
    if timer_running:
        elapsed_time = time.time() - start_time
        minutes = int(elapsed_time // 60)
        seconds = int(elapsed_time % 60)
    else:
        minutes = 0
        seconds = 0

    # Render the score and timer
    score_surface = font.render(f'Score: {score}', True, "black")
    timer_surface = font.render(f'Time: {minutes:02}:{seconds:02}', True, "black")
    
    screen.fill("lightblue")

    pygame.draw.circle(screen, "black", circle_pos, 50)
    screen.blit(score_surface, (50, 50))
    screen.blit(timer_surface, (50, 90))  # Timer below the score
    
    pygame.display.update()
