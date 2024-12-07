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
trail_color = (0, 0, 255)  # Blue color
trail_positions = []  # List to store the cursor positions
trail_max_length = 15  # Maximum number of positions in the trail

# Button Properties
button_width, button_height = 220, 80
start_button_rect = pygame.Rect((1280 // 2 - button_width // 2, 720 // 2 - 100), (button_width, button_height))
exit_button_rect = pygame.Rect((1280 // 2 - button_width // 2, 720 // 2 + 50), (button_width, button_height))

# End Screen Button Properties (smaller)
small_button_width, small_button_height = 150, 40  # Smaller button size
restart_button_rect = pygame.Rect((1280 // 2 - small_button_width // 2, 720 // 2 + 30), (small_button_width, small_button_height))
end_exit_button_rect = pygame.Rect((1280 // 2 - small_button_width // 2, 720 // 2 + 80), (small_button_width, small_button_height))

# Game States
game_active = False  # Tracks whether the game has started
game_over = False  # Tracks if the game is over

def check_circle_collision() -> bool:
    """Check if the mouse is within the circle's boundary."""
    mouse_pos = pygame.mouse.get_pos()
    return math.sqrt((mouse_pos[0] - circle_pos[0]) ** 2 + (mouse_pos[1] - circle_pos[1]) ** 2) <= circle_radius

def draw_cursor_trail():
    """Draws the cursor trail."""
    for i, pos in enumerate(trail_positions):
        # Gradually reduce opacity and size as the trail fades
        alpha = int(255 * (1 - i / trail_max_length))  # Fading effect
        size = max(2, 10 - i)  # Reduce size for each segment
        trail_surface = pygame.Surface((size * 2, size * 2), pygame.SRCALPHA)
        pygame.draw.circle(trail_surface, (*trail_color, alpha), (size, size), size)
        screen.blit(trail_surface, (pos[0] - size, pos[1] - size))

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

def draw_end_screen():
    """Displays the game over screen with the final score and restart/exit buttons."""
    screen.fill("lightblue")
    
    # Show final score
    score_text = end_screen_font.render(f"Score: {score}", True, "black")
    screen.blit(score_text, (1280 // 2 - score_text.get_width() // 2, 300))  # Center the score
    
    # Draw Restart button
    pygame.draw.rect(screen, (34, 139, 34), restart_button_rect)  # Green Color Restart button
    restart_text = small_button_font.render("Restart Game", True, "black")
    screen.blit(restart_text, (restart_button_rect.x + 10, restart_button_rect.y + 8))  # Smaller text
    
    # Draw Exit button (on end screen)
    pygame.draw.rect(screen, "red", end_exit_button_rect)
    end_exit_text = small_button_font.render("Exit Game", True, "black")
    screen.blit(end_exit_text, (end_exit_button_rect.x + 20, end_exit_button_rect.y + 8))  # Smaller text
    
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
        elif game_over:
            if event.type == pygame.MOUSEBUTTONDOWN:
                if restart_button_rect.collidepoint(event.pos):
                    # Restart the game
                    game_active = True
                    game_over = False
                    score = 0
                    time_remaining = time_limit
                    circle_pos = (1280 / 2, 720 / 2)
                    timer_running = True
                    last_time_check = time.time()
                elif end_exit_button_rect.collidepoint(event.pos):
                    pygame.quit()
                    sys.exit()
        else:
            if event.type == pygame.MOUSEBUTTONDOWN:
                if start_button_rect.collidepoint(event.pos):
                    game_active = True  # Start the game
                    timer_running = True
                    last_time_check = time.time()  # Start the timer
                elif exit_button_rect.collidepoint(event.pos):
                    pygame.quit()
                    sys.exit()

    # Track cursor for the trail
    if game_active:
        mouse_pos = pygame.mouse.get_pos()
        trail_positions.append(mouse_pos)
        if len(trail_positions) > trail_max_length:
            trail_positions.pop(0)

    if game_active:
        # Calculate the time remaining
        if timer_running:
            current_time = time.time()
            elapsed_time = current_time - last_time_check
            time_remaining -= elapsed_time
            last_time_check = current_time  # Update the last time check

            if time_remaining <= 0:
                game_active = False
                game_over = True  # End the game

        # Draw everything
        screen.fill("lightblue")
        pygame.draw.circle(screen, "black", circle_pos, circle_radius)

        # Render the score and timer
        score_surface = font.render(f'Score: {score}', True, "black")
        timer_surface = font.render(f'Time: {int(time_remaining):02}', True, "black")
        screen.blit(score_surface, (50, 50))
        screen.blit(timer_surface, (50, 90))  # Timer below the score

        draw_cursor_trail()
        pygame.display.update()

    elif game_over:
        # Show the end screen with final score
        draw_end_screen()

    else:
        # Show the start menu
        draw_start_menu()

    # Small delay to avoid high CPU usage
    pygame.time.delay(5)