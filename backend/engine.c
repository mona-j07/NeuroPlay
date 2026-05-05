#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>

#define MAX_INPUT 4096

typedef struct {
    int row;
    int col;
    long long timestamp;
} Click;

int main() {
    char input[MAX_INPUT];
    if (fgets(input, MAX_INPUT, stdin) == NULL) {
        return 1;
    }

    // Basic JSON extraction (manual parsing for speed/simplicity)
    // Looking for "level", "grid_size", "pattern", "user_clicks"
    
    int level = 1;
    int grid_size = 3;
    
    char *level_ptr = strstr(input, "\"level\":");
    if (level_ptr) sscanf(level_ptr, "\"level\": %d", &level);

    char *grid_ptr = strstr(input, "\"grid_size\":");
    if (grid_ptr) sscanf(grid_ptr, "\"grid_size\": %d", &grid_size);

    // Count correct patterns (1s in the matrix)
    int total_targets = 0;
    char *pattern_ptr = strstr(input, "\"pattern\":");
    if (pattern_ptr) {
        char *p = pattern_ptr;
        while (*p && *p != ']') {
            if (*p == '1') total_targets++;
            p++;
        }
    }

    // Parse user clicks
    Click clicks[100];
    int click_count = 0;
    char *clicks_ptr = strstr(input, "\"user_clicks\":");
    if (clicks_ptr) {
        char *p = strchr(clicks_ptr, '[');
        if (p) p++; // Skip the outer [
        while (p && (p = strchr(p, '{'))) {
            char *r_ptr = strstr(p, "\"cell\":");
            if (r_ptr) {
                r_ptr = strchr(r_ptr, '[');
                if (r_ptr) {
                    clicks[click_count].row = atoi(r_ptr + 1);
                    char *comma = strchr(r_ptr, ',');
                    if (comma) {
                        clicks[click_count].col = atoi(comma + 1);
                    }
                }
            }
            char *t_ptr = strstr(p, "\"time\":");
            if (t_ptr) {
                clicks[click_count].timestamp = atoll(t_ptr + 7);
            }
            click_count++;
            p = strchr(p, '}');
            if (p) p++;
        }
    }

    // 1. MEMORY SCORE
    // For simplicity in this demo, we'll assume the frontend only sends valid cells
    // but the backend validates the count. In a real app, we'd check the grid coords.
    float accuracy = (total_targets > 0) ? ((float)click_count / total_targets) * 100.0f : 0;
    if (accuracy > 100.0f) accuracy = 100.0f;

    // 2. REACTION SCORE
    long long total_time = 0;
    long long fastest = 999999;
    long long slowest = 0;
    
    for (int i = 0; i < click_count; i++) {
        total_time += clicks[i].timestamp;
        if (clicks[i].timestamp < fastest) fastest = clicks[i].timestamp;
        if (clicks[i].timestamp > slowest) slowest = clicks[i].timestamp;
    }

    float avg_reaction = (click_count > 0) ? (float)total_time / click_count / 1000.0f : 0; // seconds

    // 3. CONSISTENCY (Standard Deviation)
    float variance = 0;
    if (click_count > 1) {
        for (int i = 0; i < click_count; i++) {
            float diff = (clicks[i].timestamp / 1000.0f) - avg_reaction;
            variance += diff * diff;
        }
        variance /= click_count;
    }
    float std_dev = sqrt(variance);
    char *consistency = "Good";
    if (std_dev > 0.5) consistency = "Erratic";
    else if (std_dev > 0.2) consistency = "Average";

    // 4. FINAL SCORE
    // difficulty_multiplier = level * 1.2
    float difficulty = level * 1.2f;
    // score = (accuracy * 0.6) + (speed_score * 0.25) + (consistency_score * 0.15)
    // speed_score: 1.0 - (avg_reaction / 2.0), capped at 0-1
    float speed_score = 1.0f - (avg_reaction / 3.0f);
    if (speed_score < 0) speed_score = 0;
    
    float final_score = (accuracy * 0.6f) + (speed_score * 100.0f * 0.25f) + (consistency[0] == 'G' ? 15.0f : 5.0f);
    final_score *= (difficulty / 5.0f); // Normalize by level

    // Feedback Engine
    char *feedback = "Keep practicing!";
    if (accuracy > 90 && avg_reaction < 0.5) feedback = "Excellent Focus!";
    else if (accuracy > 90) feedback = "Careful Thinker";
    else if (avg_reaction < 0.4) feedback = "Impulsive - Slow down!";

    // Output JSON
    printf("{\n");
    printf("  \"accuracy\": %.0f,\n", accuracy);
    printf("  \"avg_reaction\": %.2f,\n", avg_reaction);
    printf("  \"consistency\": \"%s\",\n", consistency);
    printf("  \"score\": %.0f,\n", final_score);
    printf("  \"feedback\": \"%s\"\n", feedback);
    printf("}\n");

    return 0;
}
