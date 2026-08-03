-- Keep a log of any SQL queries you execute as you solve the mystery.
-- Keep a log of any SQL queries you execute as you solve the mystery.

-- Fiftyville Mystery: Investigation Log

-- Step 1: Find the crime scene report for the theft on July 28, 2025 on Humphrey Street
SELECT description
FROM crime_scene_reports
WHERE year = 2025 AND month = 7 AND day = 28 AND street = 'Humphrey Street';

-- The report says the theft happened at 10:15am at the bakery on Humphrey Street,
-- and that three witnesses gave interviews that mention the bakery.

-- Step 2: Find the interview transcripts of the three witnesses
SELECT name, transcript
FROM interviews
WHERE year = 2025 AND month = 7 AND day = 28 AND transcript LIKE '%bakery%';

-- Ruth says the thief got into a car in the bakery parking lot within 10 minutes
-- of the theft (so between 10:15 and 10:25) and drove away.
-- Eugene says the thief was at the Leggett Street ATM earlier that morning, before the theft.
-- Raymond says the thief made a call under a minute long while leaving the bakery,
-- and mentioned taking the earliest flight out of Fiftyville the next day (July 29),
-- asking the person on the call to buy the ticket.

-- Step 3: Find cars that exited the bakery parking lot between 10:15 and 10:25
SELECT license_plate, hour, minute, activity
FROM bakery_security_logs
WHERE year = 2025 AND month = 7 AND day = 28
AND activity = 'exit'
AND hour = 10 AND minute >= 15 AND minute <= 25;

-- This gives 8 possible license plates for the thief's car.

-- Step 4: Find who withdrew money at the Leggett Street ATM that same morning
SELECT people.name, people.id, atm_transactions.amount
FROM atm_transactions
JOIN bank_accounts ON atm_transactions.account_number = bank_accounts.account_number
JOIN people ON bank_accounts.person_id = people.id
WHERE atm_transactions.year = 2025 AND atm_transactions.month = 7 AND atm_transactions.day = 28
AND atm_transactions.atm_location = 'Leggett Street'
AND atm_transactions.transaction_type = 'withdraw';

-- This gives 8 names who withdrew money at that ATM that morning.

-- Step 5: Cross-reference the ATM withdrawal names with the exit license plates
-- to narrow down suspects who match both clues
SELECT people.name, people.id, people.license_plate
FROM people
JOIN bank_accounts ON people.id = bank_accounts.person_id
JOIN atm_transactions ON bank_accounts.account_number = atm_transactions.account_number
WHERE atm_transactions.year = 2025 AND atm_transactions.month = 7 AND atm_transactions.day = 28
AND atm_transactions.atm_location = 'Leggett Street'
AND atm_transactions.transaction_type = 'withdraw'
AND people.license_plate IN ('5P2BI95', '94KL13X', '6P58WS2', '4328GD8', 'G412CB7', 'L93JTIZ', '322W7JE', '0NTHK55');

-- This narrows the suspect list down to 4 people: Bruce, Diana, Iman, and Luca.

-- Step 6: Find which of these 4 suspects made a call under a minute long on July 28,
-- matching Raymond's account of the thief calling someone while leaving the bakery
SELECT people.name AS caller_name, phone_calls.receiver, phone_calls.duration
FROM phone_calls
JOIN people ON phone_calls.caller = people.phone_number
WHERE phone_calls.year = 2025 AND phone_calls.month = 7 AND phone_calls.day = 28
AND phone_calls.duration < 60
AND people.name IN ('Bruce', 'Diana', 'Iman', 'Luca');

-- This narrows it down further to 2 suspects: Bruce and Diana, both made short calls.

-- Step 7: Find the Fiftyville airport's ID so we can find flights leaving from it
SELECT id, full_name, city
FROM airports
WHERE city = 'Fiftyville';

-- Fiftyville Regional Airport has id 8.

-- Step 8: Find the earliest flight out of Fiftyville on July 29, matching what
-- Raymond overheard the thief say about their escape plan
SELECT id, hour, minute, destination_airport_id
FROM flights
WHERE year = 2025 AND month = 7 AND day = 29
AND origin_airport_id = 8
ORDER BY hour, minute
LIMIT 1;

-- The earliest flight is flight id 36, departing at 8:20am, headed to airport id 4.

-- Step 9: Find the city that flight 36 flies to
SELECT city FROM airports WHERE id = 4;

-- The destination city is New York City.

-- Step 10: Check which of our two remaining suspects (Bruce or Diana) was a
-- passenger on flight 36
SELECT people.name, people.passport_number
FROM passengers
JOIN people ON passengers.passport_number = people.passport_number
WHERE passengers.flight_id = 36
AND people.name IN ('Bruce', 'Diana');

-- Bruce was a passenger on flight 36. This confirms Bruce is the thief,
-- and that he escaped to New York City.

-- Step 11: Find the accomplice by looking up the phone number Bruce called
-- while leaving the bakery (from Step 6, Bruce's receiver was (375) 555-8161)
SELECT name FROM people WHERE phone_number = '(375) 555-8161';

-- The accomplice is Robin.

-- CONCLUSION:
-- Thief: Bruce
-- Escaped to: New York City
-- Accomplice: Robin

