import pygame
import sys
import math
import random
import time

# Initializing
pygame.init()
screen = pygame.display.set_mode((1280, 720))
pygame.display.set_caption("REFLEXY")

# UI related stuff
font = pygame.font.Font(None, 30)
button_font = pygame.font.Font(None, 50)

# Game variables
score = 0
timer_running = False
time_limit = 3  # 3-second time limit
time_remaining = time_limit
last_time_check = time.time()  # Track the last time the clock was checked
circle_pos = (1280 / 2, 720 / 2)
circle_radius = 30  # Reduced circle radius

# Button Properties
button_width, button_height = 220, 80
start_button_rect = pygame.Rect((1280 // 2 - button_width // 2, 720 // 2 - 100), (button_width, button_height))
exit_button_rect = pygame.Rect((1280 // 2 - button_width // 2, 720 // 2 + 50), (button_width, button_height))

# Game States
game_active = False  # Tracks whether the game has started

def check_circle_collision() -> bool:
    """Check if the mouse is within the circle's boundary."""
    mouse_pos = pygame.mouse.get_pos()
    return math.sqrt((mouse_pos[0] - circle_pos[0]) ** 2 + (mouse_pos[1] - circle_pos[1]) ** 2) <= circle_radius

def draw_start_menu():
    """Draws the start menu with 'Start Game' and 'Exit' buttons."""
    screen.fill("lightblue")
    
    # Draw Start button
    pygame.draw.rect(screen, "green", start_button_rect)
    start_text = button_font.render("Start Game", True, "black")
    screen.blit(start_text, (start_button_rect.x + 25, start_button_rect.y + 20))
    
    # Draw Exit button
    pygame.draw.rect(screen, "red", exit_button_rect)
    exit_text = button_font.render("Exit", True, "black")
    screen.blit(exit_text, (exit_button_rect.x + 65, exit_button_rect.y + 20))
    
    pygame.display.update()

while True:
    # Event handling
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()
        
        if game_active:
            if event.type == pygame.MOUSEBUTTONDOWN:
                if event.button == 1:  # Left click
                    if check_circle_collision():
                        score += 1
                        circle_pos = (random.randint(50 + circle_radius, 1230 - circle_radius), random.randint(50 + circle_radius, 670 - circle_radius))  # New random position
                        time_remaining = time_limit  # Reset the timer to 3 seconds

                        if not timer_running:
                            last_time_check = time.time()
                            timer_running = True
        else:
            if event.type == pygame.MOUSEBUTTONDOWN:
                if start_button_rect.collidepoint(event.pos):
                    game_active = True  # Start the game
                    timer_running = True
                    last_time_check = time.time()  # Start the timer
                elif exit_button_rect.collidepoint(event.pos):
                    pygame.quit()
                    sys.exit()

    if game_active:
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
        pygame.draw.circle(screen, "black", circle_pos, circle_radius)

        # Render the score and timer
        score_surface = font.render(f'Score: {score}', True, "black")
        timer_surface = font.render(f'Time: {int(time_remaining):02}', True, "black")
        screen.blit(score_surface, (50, 50))
        screen.blit(timer_surface, (50, 90))  # Timer below the score

        pygame.display.update()

    else:
        # Show the start menu
        draw_start_menu()

    # Small delay to avoid high CPU usage
    pygame.time.delay(5)
