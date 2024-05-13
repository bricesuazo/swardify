alter table "public"."users" add column "pronouns" text[] not null default '{}'::text[];


