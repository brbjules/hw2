CREATE DATABASE hw1;
USE hw1;

CREATE TABLE appusers (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(20) NOT NULL UNIQUE,
    user_pw VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    user_desc VARCHAR(255),
    join_date DATE,
    post_points INTEGER NOT NULL DEFAULT 0,
    comment_points INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    author VARCHAR(20) NOT NULL,
    title VARCHAR(300) NOT NULL,
    post_date DATETIME,
    upvotes INTEGER NOT NULL DEFAULT 0,
    downvotes INTEGER NOT NULL DEFAULT 0,
    comment_count INTEGER NOT NULL DEFAULT 0,
    post_desc VARCHAR(2000),
    post_url VARCHAR(2000),
    FOREIGN KEY (author) REFERENCES appusers(username)
);

CREATE TABLE comments (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    author VARCHAR(20) NOT NULL,
    comment_date DATETIME,
    upvotes INTEGER NOT NULL DEFAULT 0,
    downvotes INTEGER NOT NULL DEFAULT 0,
    post INTEGER NOT NULL,
    content VARCHAR(1000),
    parent INTEGER,
    FOREIGN KEY (author) REFERENCES appusers(username),
    FOREIGN KEY (post) REFERENCES posts(id),
    FOREIGN KEY (parent) REFERENCES comments(id)
);

CREATE TABLE saves (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    user INTEGER NOT NULL,
    entry_type VARCHAR(10) NOT NULL,
    entry_id INTEGER NOT NULL,
    FOREIGN KEY (user) REFERENCES appusers(id)
);

CREATE TABLE votes (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    voting_user INTEGER NOT NULL,
    entry_type VARCHAR(8) NOT NULL,
    entry_id INTEGER NOT NULL,
    vote VARCHAR(8) NOT NULL,
    FOREIGN KEY (voting_user) REFERENCES appusers(id)
);

CREATE TABLE wiki_saves (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    wiki_user INTEGER NOT NULL,
    link VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    FOREIGN KEY (wiki_user) REFERENCES appusers(id)
);
