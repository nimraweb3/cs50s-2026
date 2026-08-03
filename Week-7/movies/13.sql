-- 13. Names of all people who starred in a movie in which Kevin Bacon also starred
SELECT DISTINCT people.name
FROM people
JOIN stars ON people.id = stars.person_id
WHERE stars.movie_id IN (
    SELECT stars.movie_id
    FROM stars
    JOIN people AS kb ON stars.person_id = kb.id
    WHERE kb.name = 'Kevin Bacon' AND kb.birth = 1958
)
AND people.name != 'Kevin Bacon';