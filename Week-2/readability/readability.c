#include <ctype.h>
#include <cs50.h>
#include <stdio.h>
#include <string.h>

bool validate_key(string key);

int main(int argc, string argv[])
{
    // Must have exactly one command-line argument (the key)
    if (argc != 2)
    {
        printf("Usage: ./substitution key\n");
        return 1;
    }

    string key = argv[1];

    // Validate the key
    if (!validate_key(key))
    {
        return 1;
    }

    // Prompt user for plaintext
    string plaintext = get_string("plaintext:  ");

    // Encrypt and print ciphertext
    printf("ciphertext: ");
    for (int i = 0, len = strlen(plaintext); i < len; i++)
    {
        char c = plaintext[i];

        if (isalpha(c))
        {
            // Find which letter of the alphabet this is (0-25)
            int index = toupper(c) - 'A';

            // Get the substituted character from the key
            char encrypted = key[index];

            // Preserve the original case
            if (isupper(c))
            {
                printf("%c", toupper(encrypted));
            }
            else
            {
                printf("%c", tolower(encrypted));
            }
        }
        else
        {
            // Non-alphabetical characters pass through unchanged
            printf("%c", c);
        }
    }
    printf("\n");
    return 0;
}

bool validate_key(string key)
{
    int len = strlen(key);

    // Must be exactly 26 characters
    if (len != 26)
    {
        printf("Key must contain 26 characters.\n");
        return false;
    }

    // Track which letters have been seen (a-z)
    int seen[26] = {0};

    for (int i = 0; i < len; i++)
    {
        // Must be alphabetical
        if (!isalpha(key[i]))
        {
            printf("Key must only contain alphabetic characters.\n");
            return false;
        }

        // Check for duplicates (case-insensitive)
        int index = toupper(key[i]) - 'A';
        if (seen[index])
        {
            printf("Key must not contain repeated letters.\n");
            return false;
        }
        seen[index] = 1;
    }

    return true;
}
