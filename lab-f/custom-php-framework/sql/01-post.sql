create table post
(
    id      integer not null
            constraint post_pk
            primary key autoincrement,
    reviewName text not null,
    reviewText text not null,
    reviewRating text not null
);