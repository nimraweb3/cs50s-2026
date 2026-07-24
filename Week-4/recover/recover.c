#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[])
{
    // Accept a single command-line argument
    if (argc != 2)
    {
        printf("Usage: ./recover FILE\n");
        return 1;
    }

    // Open the memory card
    FILE *card = fopen(argv[1], "r");
    if (card == NULL)
    {
        printf("Could not open %s.\n", argv[1]);
        return 1;
    }

    // Create a buffer for a block of data
    uint8_t buffer[512];

    // File pointer for the current JPEG being written
    FILE *img = NULL;

    // Counter for naming JPEGs
    int counter = 0;

    // Filename buffer: 3 digits + ".jpg" + '\0'
    char filename[8];

    // While there's still data left to read from the memory card
    while (fread(buffer, 1, 512, card) == 512)
    {
        // Check if this block starts a new JPEG
        if (buffer[0] == 0xff && buffer[1] == 0xd8 && buffer[2] == 0xff &&
            (buffer[3] & 0xf0) == 0xe0)
        {
            // If a JPEG is already open, close it
            if (img != NULL)
            {
                fclose(img);
            }

            // Create the new filename
            sprintf(filename, "%03i.jpg", counter);
            counter++;

            // Open the new JPEG file for writing
            img = fopen(filename, "w");
            if (img == NULL)
            {
                fclose(card);
                return 1;
            }
        }

        // If a JPEG file is currently open, write this block to it
        if (img != NULL)
        {
            fwrite(buffer, 1, 512, img);
        }
    }

    // Close the last JPEG file, if one is open
    if (img != NULL)
    {
        fclose(img);
    }

    // Close the memory card
    fclose(card);

    return 0;
}