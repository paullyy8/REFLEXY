import pygame
import sys
import math
import random
import time

# Initialize
pygame.init()
screen = pygame.display.set_mode((1280, 720))
pygame.display.set_caption("REFLEXY")

# UI-related stuff
font = pygame.font.Font(None, 30)
button_font = pygame.font.Font(None, 50)
end_screen_font = pygame.font.Font(None, 100)
small_button_font = pygame.font.Font(None, 30)  # Reduced font size for small buttons

# Game variables
score = 0
timer_running = False
time_limit = 3  # 3-second time limit
time_remaining = time_limit
last_time_check = time.time()  # Track the last time the clock was checked
circle_pos = (1280 / 2, 720 / 2)
circle_radius = 30  # Reduced circle radius

# Cursor trail variables
cursor_positions = []  # List to store the cursor positions
max_trail_length = 20  # Maximum number of positions in the trail

# Button Properties
button_width, button_height = 220, 80
start_button_rect = pygame.Rect((1280 // 2 - button_width // 2, 720 // 2 - 100), (button_width, button_height))
exit_button_rect = pygame.Rect((1280 // 2 - button_width // 2, 720 // 2 + 50), (button_width, button_height))

# Game States
game_active = False  # Tracks whether the game has started
game_over = False  # Tracks if the game is over

def check_circle_collision() -> bool:
    """Check if the mouse is within the circle's boundary."""
    mouse_pos = pygame.mouse.get_pos()
    return math.sqrt((mouse_pos[0] - circle_pos[0]) ** 2 + (mouse_pos[1] - circle_pos[1]) ** 2) <= circle_radius

def draw_cursor_trail():
    """Draws the cursor trail."""
    for i, pos in enumerate(cursor_positions):
        # Gradually decrease the size and opacity of the trail
        size = 15 - (i / max_trail_length) * 10  # Decrease size
        color = (0, 0, 0, 255 - (i * 255 // max_trail_length))  # Decrease opacity
        pygame.draw.circle(screen, (0, 0, 0), pos, int(size))  # Draw circle

def draw_start_menu():
    """Draws the start menu with 'Start Game' and 'Exit' buttons."""
    screen.fill("lightblue")
    
    # Draw Start button
    pygame.draw.rect(screen, (34, 139, 34), start_button_rect)  # Green Color Start button
    start_text = button_font.render("Start Game", True, "black")
    screen.blit(start_text, (start_button_rect.x + 15, start_button_rect.y + 20))
    
    # Draw Exit button
    pygame.draw.rect(screen, "red", exit_button_rect)
    exit_text = button_font.render("Exit Game", True, "black")
    screen.blit(exit_text, (exit_button_rect.x + 25, exit_button_rect.y + 20))
    
    pygame.display.update()

while True:
    # Event handling
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

        elif event.type == pygame.MOUSEMOTION and game_active:
            # Add the new cursor position to the trail
            cursor_positions.append(event.pos)
            if len(cursor_positions) > max_trail_length:
                cursor_positions.pop(0)  # Remove the oldest position to maintain the trail length

        if not game_active:
            if event.type == pygame.MOUSEBUTTONDOWN:
                if start_button_rect.collidepoint(event.pos):
                    game_active = True  # Start the game
                    timer_running = True
                    last_time_check = time.time()  # Start the timer

    if game_active:
        # Calculate the time remaining
        if timer_running:
            current_time = time.time()
            elapsed_time = current_time - last_time_check
            time_remaining -= elapsed_time
            last_time_check = current_time  # Update the last time check

            if time_remaining <= 0:
                game_active = False

        # Draw everything
        screen.fill("lightblue")
        pygame.draw.circle(screen, "black", circle_pos, circle_radius)

        # Render the score and timer
        score_surface = font.render(f'Score: {score}', True, "black")
        timer_surface = font.render(f'Time: {int(time_remaining):02}', True, "black")
        screen.blit(score_surface, (50, 50))
        screen.blit(timer_surface, (50, 90))  # Timer below the score

        # Draw cursor trail
        draw_cursor_trail()

        pygame.display.update()

    else:
        # Show the start menu
        draw_start_menu()

    # Small delay to avoid high CPU usage
    pygame.time.delay(5)