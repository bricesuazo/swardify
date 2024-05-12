create type "public"."vote" as enum ('upvote', 'downvote');

alter table "public"."phrase_votes" add column "vote" vote not null;

alter table "public"."word_votes" add column "vote" vote not null;


