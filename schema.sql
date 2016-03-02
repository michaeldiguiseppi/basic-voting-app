DROP DATABASE IF EXISTS voting_app;
CREATE DATABASE voting_app;

\c voting_app;

CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  question TEXT,
  active BOOLEAN DEFAULT TRUE
);

CREATE TABLE answers (
  id SERIAL PRIMARY KEY,
  question_id INT,
  answer VARCHAR(255),
  vote_num INT DEFAULT 0
);

ALTER TABLE answers ADD FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE;
