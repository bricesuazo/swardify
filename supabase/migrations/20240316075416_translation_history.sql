alter table "public"."users" drop constraint "public_users_id_fkey";

alter table "public"."users" drop constraint "users_pkey";

drop index if exists "public"."users_pkey";

create table "public"."translation_histories" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid not null,
    "tagalog" text,
    "swardspeak" text
);


alter table "public"."translation_histories" enable row level security;

CREATE UNIQUE INDEX translation_history_pkey ON public.translation_histories USING btree (id);

CREATE INDEX users_email_idx ON public.users USING btree (email);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

alter table "public"."translation_histories" add constraint "translation_history_pkey" PRIMARY KEY using index "translation_history_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."translation_histories" add constraint "translation_histories_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."translation_histories" validate constraint "translation_histories_user_id_fkey";

alter table "public"."users" add constraint "users_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."users" validate constraint "users_id_fkey";

grant delete on table "public"."translation_histories" to "anon";

grant insert on table "public"."translation_histories" to "anon";

grant references on table "public"."translation_histories" to "anon";

grant select on table "public"."translation_histories" to "anon";

grant trigger on table "public"."translation_histories" to "anon";

grant truncate on table "public"."translation_histories" to "anon";

grant update on table "public"."translation_histories" to "anon";

grant delete on table "public"."translation_histories" to "authenticated";

grant insert on table "public"."translation_histories" to "authenticated";

grant references on table "public"."translation_histories" to "authenticated";

grant select on table "public"."translation_histories" to "authenticated";

grant trigger on table "public"."translation_histories" to "authenticated";

grant truncate on table "public"."translation_histories" to "authenticated";

grant update on table "public"."translation_histories" to "authenticated";

grant delete on table "public"."translation_histories" to "service_role";

grant insert on table "public"."translation_histories" to "service_role";

grant references on table "public"."translation_histories" to "service_role";

grant select on table "public"."translation_histories" to "service_role";

grant trigger on table "public"."translation_histories" to "service_role";

grant truncate on table "public"."translation_histories" to "service_role";

grant update on table "public"."translation_histories" to "service_role";


