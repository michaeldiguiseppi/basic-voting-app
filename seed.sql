\c voting_app;

INSERT INTO questions (question) VALUES
('Which breakout do you want to do this weekend?');

INSERT INTO answers (question_id, answer) VALUES
(1, 'Knex'), (1, 'pg-promise'), (1, 'Express Routing');
