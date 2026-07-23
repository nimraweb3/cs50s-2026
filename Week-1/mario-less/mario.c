#include <cs50.h>
#include <stdio.h>

int get_height(void);
void print_row(int spaces, int bricks);

int main(void)
{
    // Prompt the user for the pyramid's height
    int n = get_height();

    // Print a pyramid of that height
    for (int i = 0; i < n; i++)
    {
        // Each row i has (n - i - 1) spaces and (i + 1) bricks
        print_row(n - i - 1, i + 1);
    }
}

int get_height(void)
{
    int n;
    do
    {
        n = get_int("Height: ");
    }
    while (n < 1);
    return n;
}

void print_row(int spaces, int bricks)
{
    // Print spaces
    for (int i = 0; i < spaces; i++)
    {
        printf(" ");
    }

    // Print bricks
    for (int i = 0; i < bricks; i++)
    {
        printf("#");
    }

    printf("\n");
}
