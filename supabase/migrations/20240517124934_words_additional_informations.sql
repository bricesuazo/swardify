create type "public"."part_of_speech" as enum ('noun', 'pronoun', 'verb', 'adjective', 'adverb', 'preposition', 'conjunction', 'interjection');

alter table "public"."words" add column "definition" text;

alter table "public"."words" add column "examples" text[] default '{}'::text[];

alter table "public"."words" add column "part_of_speech" part_of_speech;


