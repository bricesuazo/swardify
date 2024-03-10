create table "public"."words" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "swardspeak_words" character varying[] not null,
    "translated_words" character varying[] not null,
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."words" enable row level security;

CREATE UNIQUE INDEX words_pkey ON public.words USING btree (id);

alter table "public"."words" add constraint "words_pkey" PRIMARY KEY using index "words_pkey";

grant delete on table "public"."words" to "anon";

grant insert on table "public"."words" to "anon";

grant references on table "public"."words" to "anon";

grant select on table "public"."words" to "anon";

grant trigger on table "public"."words" to "anon";

grant truncate on table "public"."words" to "anon";

grant update on table "public"."words" to "anon";

grant delete on table "public"."words" to "authenticated";

grant insert on table "public"."words" to "authenticated";

grant references on table "public"."words" to "authenticated";

grant select on table "public"."words" to "authenticated";

grant trigger on table "public"."words" to "authenticated";

grant truncate on table "public"."words" to "authenticated";

grant update on table "public"."words" to "authenticated";

grant delete on table "public"."words" to "service_role";

grant insert on table "public"."words" to "service_role";

grant references on table "public"."words" to "service_role";

grant select on table "public"."words" to "service_role";

grant trigger on table "public"."words" to "service_role";

grant truncate on table "public"."words" to "service_role";

grant update on table "public"."words" to "service_role";


