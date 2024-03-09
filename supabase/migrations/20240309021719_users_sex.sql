create type "public"."sex" as enum ('m', 'f');

alter table "public"."users" add column "sex" sex;


