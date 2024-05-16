alter table "public"."phrase_contributions" add column "declined_at" timestamp with time zone;

alter table "public"."word_contributions" add column "declined_at" timestamp with time zone;


