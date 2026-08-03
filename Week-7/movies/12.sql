-- 12. Titles of all of movies in which both Jennifer Lawrence and Bradley Cooper starred
SELECT movies.title
FROM movies
JOIN stars ON movies.id = stars.movie_id
WHERE stars.person_id = (
    SELECT id FROM people WHERE name = 'Bradley Cooper'
)
AND movies.id IN (
    SELECT stars.movie_id
    FROM stars
    JOIN people ON stars.person_id = people.id
    WHERE people.name = 'Jennifer Lawrence'
);