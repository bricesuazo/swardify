alter table "public"."phrases" add column "phrase_contribution_id" uuid;

alter table "public"."words" add column "word_contribution_id" uuid;

alter table "public"."phrases" add constraint "public_phrases_phrase_contribution_id_fkey" FOREIGN KEY (phrase_contribution_id) REFERENCES phrase_contributions(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."phrases" validate constraint "public_phrases_phrase_contribution_id_fkey";

alter table "public"."words" add constraint "public_words_word_contribution_id_fkey" FOREIGN KEY (word_contribution_id) REFERENCES word_contributions(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."words" validate constraint "public_words_word_contribution_id_fkey";


