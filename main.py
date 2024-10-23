import pygame
import sys
import math
import random
import time

pygame.init()
screen = pygame.display.set_mode((1280, 720))

font = pygame.font.Font(None, 30)
button_font = pygame.font.Font(None, 50)

# Game variables
circle_pos = (1280 / 2, 720 / 2)
score = 0
start_time = None  # Timer start time
timer_running = False  # Check if the timer is running

# Button properties
button_width, button_height = 200, 100
start_button_rect = pygame.Rect((1280 // 2 - button_width // 2, 720 // 2 - 100), (button_width, button_height))
exit_button_rect = pygame.Rect((1280 // 2 - button_width // 2, 720 // 2 + 50), (button_width, button_height))

def check_circle_collision() -> bool:
    mouse_pos = pygame.mouse.get_pos()
    if math.sqrt((mouse_pos[0] - circle_pos[0]) ** 2 + (mouse_pos[1] - circle_pos[1]) ** 2) <= 50:
        return True
    return False

def draw_buttons():
    pygame.draw.rect(screen, "lightgray", start_button_rect)
    pygame.draw.rect(screen, "lightgray", exit_button_rect)

    # Render button text
    start_text = button_font.render("Start Game", True, "black")
    exit_text = button_font.render("Exit", True, "black")
    
    screen.blit(start_text, (start_button_rect.x + 20, start_button_rect.y + 20))
    screen.blit(exit_text, (exit_button_rect.x + 60, exit_button_rect.y + 20))

def main_menu():
    while True:
        screen.fill("skyblue")
        draw_buttons()
        pygame.display.update()

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            
            if event.type == pygame.MOUSEBUTTONDOWN:
                if event.button == 1:  # Left-click
                    if start_button_rect.collidepoint(event.pos):
                        return  # Start the game
                    elif exit_button_rect.collidepoint(event.pos):
                        pygame.quit()
                        sys.exit()

def game_loop():
    global score, circle_pos, start_time, timer_running
    
    while True:
        events = pygame.event.get()
        for event in events:
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            if event.type == pygame.MOUSEBUTTONDOWN:
                if event.button == 1:  # Left-click
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

# Run the main menu first
main_menu()

# After the menu, start the game loop
game_loop()
