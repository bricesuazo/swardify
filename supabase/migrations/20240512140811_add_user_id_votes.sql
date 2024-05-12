alter table "public"."phrase_votes" add column "user_id" uuid not null;

alter table "public"."word_votes" add column "user_id" uuid not null;

alter table "public"."phrase_votes" add constraint "public_phrase_votes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES phrase_contributions(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."phrase_votes" validate constraint "public_phrase_votes_user_id_fkey";

alter table "public"."word_votes" add constraint "public_word_votes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."word_votes" validate constraint "public_word_votes_user_id_fkey";


