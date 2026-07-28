from cs50 import get_int


def main():
    height = get_height()
    for row in range(1, height + 1):
        print(" " * (height - row) + "#" * row + "  " + "#" * row)


def get_height():
    while True:
        n = get_int("Height: ")
        if 1 <= n <= 8:
            return n


if __name__ == "__main__":
    main()