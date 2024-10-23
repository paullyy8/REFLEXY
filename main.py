import pygame
import sys
import math
import random
import time

#intializing
pygame.init()
screen = pygame.display.set_mode((1280, 720))
pygame.display.set_caption("REFLEXY")

#ui related stuff
font = pygame.font.Font(None, 30)
button_font = pygame.font.Font(None, 50)

#Game variables
score = 0
timer_running = False
time_limit = 3  # 3-second time limit
time_remaining = time_limit
last_time_check = time.time()  # Track the last time the clock was checked
circle_pos = (1280 / 2, 720 / 2)

#Button Properties
button_width, button_height = 220, 80
start_button_rect = pygame.Rect((1280 // 2 - button_width // 2, 720 // 2 - 100), (button_width, button_height))
exit_button_rect = pygame.Rect((1280 // 2 - button_width // 2, 720 // 2 + 50), (button_width, button_height))


def check_circle_collision() -> bool:
    """Check if the mouse is within the circle's boundary."""
    mouse_pos = pygame.mouse.get_pos()
    return math.sqrt((mouse_pos[0] - circle_pos[0]) ** 2 + (mouse_pos[1] - circle_pos[1]) ** 2) <= 50

while True:
    # Event handling
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()
        
        if event.type == pygame.MOUSEBUTTONDOWN:
            if event.button == 1:  # Left click
                if check_circle_collision():
                    score += 1
                    circle_pos = (random.randint(50, 1230), random.randint(50, 670))  # New random position
                    time_remaining = time_limit  # Reset the timer to 10 seconds

                    if not timer_running:
                        last_time_check = time.time()
                        timer_running = True


    # Calculate the time remaining
    if timer_running:
        current_time = time.time()
        elapsed_time = current_time - last_time_check
        time_remaining -= elapsed_time
        last_time_check = current_time  # Update the last time check

        if time_remaining <= 0:
            pygame.quit()  # Quit the game if time runs out
            sys.exit()

    # Draw everything
    screen.fill("lightblue")
    pygame.draw.circle(screen, "black", circle_pos, 50)

    # Render the score and timer
    score_surface = font.render(f'Score: {score}', True, "black")
    timer_surface = font.render(f'Time: {int(time_remaining):02}', True, "black")
    screen.blit(score_surface, (50, 50))
    screen.blit(timer_surface, (50, 90))  # Timer below the score

    pygame.display.update()

    # Small delay to avoid high CPU usage
    pygame.time.delay(20)
