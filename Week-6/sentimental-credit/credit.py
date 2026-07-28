import re
from cs50 import get_string


def main():
    number = get_card_number()
    if is_valid(number) and get_card_type(number):
        print(get_card_type(number))
    else:
        print("INVALID")


def get_card_number():
    while True:
        number = get_string("Number: ")
        if re.fullmatch(r"\d+", number):
            return number


def is_valid(number):
    total = 0
    # Process digits from rightmost to leftmost
    digits = number[::-1]
    for i, digit in enumerate(digits):
        d = int(digit)
        if i % 2 == 1:
            d *= 2
            if d > 9:
                d -= 9
        total += d
    return total % 10 == 0


def get_card_type(number):
    length = len(number)
    if length == 15 and number[:2] in ("34", "37"):
        return "AMEX"
    elif length == 16 and number[:1] == "4":
        return "VISA"
    elif length == 13 and number[:1] == "4":
        return "VISA"
    elif length == 16 and 51 <= int(number[:2]) <= 55:
        return "MASTERCARD"
    return None


if __name__ == "__main__":
    main()