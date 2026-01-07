import matplotlib.pyplot as plt
from matplotlib.collections import LineCollection
import numpy as np

def draw_8_segment_digit(lit_segments, include_dot=False):
    """
    Draws an 8-segment digit with specified lit segments and an optional decimal point.

    Args:
        lit_segments: An array/list of segment names to light up 
                      (e.g., ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']).
        include_dot: Boolean to indicate if the decimal point (segment 'dp') should be lit.
    """
    
    # Define vertices for the segments (scaled 0-10 for easy visualization)
    vertices = {
        0: (1, 9), 1: (9, 9), 2: (10, 8), 3: (10, 2), 4: (9, 1), 
        5: (1, 1), 6: (0, 2), 7: (0, 8), 8: (9, 5), 9: (1, 5),
        10: (11, 1), 11: (11.5, 1.5) # for the decimal point
    }

    # Define segment connections using vertex indices, including the middle 'h' (or 'g') and 'dp'
    segment_map = {
        'a': [7, 0, 1, 2],
        'b': [2, 3],
        'c': [3, 4],
        'd': [4, 5, 6, 7],
        'e': [6, 5],
        'f': [7, 6], # Note: in 7-seg a, d are horizontal polygons; b, c, e, f are vertical
        'g': [1, 8], # This script uses polygons for segments a and d to give them thickness
        'h': [9, 8], # A common 8-segment refers to two middle segments
        'dp': [10, 11] # The decimal point is a small circle or line at the bottom right
    }
    
    # Create a list of segments to draw based on input
    segments_to_draw = []
    for segment_name in lit_segments:
        if segment_name in segment_map:
            # If it's a or d, use a polygon for thickness
            if segment_name in ['a', 'd']:
                 if segment_name == 'a':
                     points = [vertices[7], vertices[0], vertices[1], vertices[8], vertices[9], vertices[7]]
                 else: # 'd' segment
                     points = [vertices[6], vertices[5], vertices[4], vertices[3], vertices[2], vertices[7], vertices[6]] # Not quite right, need proper vertices for a polygon at the bottom
                     # Simpler approach: treat all as line segments for simplicity as the user requested "line segments"
                     continue # Skip polygon logic for now, stick to line segments
            
            # Use LineCollection data structure: a list of (x, y) tuples for each segment
            points = [vertices[i] for i in segment_map[segment_name]]
            segments_to_draw.append(points)

    # Simplified segment definitions using just two endpoints for LineCollection
    segment_endpoints = {
        'a': [(1, 9), (9, 9)],
        'b': [(9, 9), (10, 8)], # Using slanted lines for a more realistic look
        'c': [(10, 2), (9, 1)],
        'd': [(9, 1), (1, 1)],
        'e': [(0, 2), (1, 1)],
        'f': [(1, 9), (0, 8)],
        'g': [(1, 5), (9, 5)], # The middle bar
        'h': [(1, 5), (9, 5)], # 'h' is usually the same as 'g' in documentation
        'dp': [(10.5, 0.5), (11, 1)] # Decimal point area
    }

    segments_to_draw = []
    for segment_name in lit_segments:
        if segment_name in segment_endpoints:
            segments_to_draw.append(segment_endpoints[segment_name])
    
    # Add the decimal point if requested
    if include_dot:
        segments_to_draw.append(segment_endpoints['dp'])

    # Plot using matplotlib
    fig, ax = plt.subplots(figsize=(4, 6))
    
    # Create a LineCollection with the segments
    # Set color for lit segments (e.g., red) and a thicker linewidth
    lc = LineCollection(segments_to_draw, colors='red', linewidths=5) 
    ax.add_collection(lc)

    # Set axis limits and hide them for a clean display
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 10)
    ax.axis('off')
    ax.set_aspect('equal') # Maintain aspect ratio

    plt.title(f"8-Segment Digit (Segments Lit: {lit_segments}, Dot: {include_dot})")
    plt.show()

# --- Example Usage ---
# To draw the digit '8' with the decimal point lit:
# All segments 'a' through 'h' are typically lit for the number 8
draw_8_segment_digit(lit_segments=['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'], include_dot=True)

# To draw the number '4' without the decimal point:
draw_8_segment_digit(lit_segments=['b', 'c', 'f', 'g', 'h'], include_dot=False)

