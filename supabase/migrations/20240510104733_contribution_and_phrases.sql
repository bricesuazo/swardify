create table "public"."phrase_contributions" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "deleted_at" timestamp with time zone,
    "user_id" uuid not null,
    "swardspeak_phrase" text not null,
    "translated_phrase" text not null,
    "approved_at" timestamp with time zone
);


alter table "public"."phrase_contributions" enable row level security;

create table "public"."phrase_votes" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "phrase_contribution_id" uuid not null
);


alter table "public"."phrase_votes" enable row level security;

create table "public"."phrases" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "deleted_at" timestamp with time zone,
    "swardspeak_phrase" text not null,
    "translated_phrase" text not null,
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."phrases" enable row level security;

create table "public"."word_contributions" (
    "created_at" timestamp with time zone not null default now(),
    "swardspeak_words" text[] not null,
    "translated_words" text[] not null,
    "deleted_at" timestamp with time zone,
    "user_id" uuid not null,
    "id" uuid not null default gen_random_uuid(),
    "approved_at" timestamp with time zone
);


alter table "public"."word_contributions" enable row level security;

create table "public"."word_votes" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "word_contribution_id" uuid not null
);


alter table "public"."word_votes" enable row level security;

CREATE UNIQUE INDEX contributions_pkey ON public.word_contributions USING btree (id);

CREATE UNIQUE INDEX phrase_contributions_pkey ON public.phrase_contributions USING btree (id);

CREATE UNIQUE INDEX phrase_votes_pkey ON public.phrase_votes USING btree (id);

CREATE UNIQUE INDEX phrases_pkey ON public.phrases USING btree (id);

CREATE UNIQUE INDEX votes_pkey ON public.word_votes USING btree (id);

alter table "public"."phrase_contributions" add constraint "phrase_contributions_pkey" PRIMARY KEY using index "phrase_contributions_pkey";

alter table "public"."phrase_votes" add constraint "phrase_votes_pkey" PRIMARY KEY using index "phrase_votes_pkey";

alter table "public"."phrases" add constraint "phrases_pkey" PRIMARY KEY using index "phrases_pkey";

alter table "public"."word_contributions" add constraint "contributions_pkey" PRIMARY KEY using index "contributions_pkey";

alter table "public"."word_votes" add constraint "votes_pkey" PRIMARY KEY using index "votes_pkey";

alter table "public"."phrase_contributions" add constraint "public_phrase_contributions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."phrase_contributions" validate constraint "public_phrase_contributions_user_id_fkey";

alter table "public"."phrase_votes" add constraint "public_phrase_votes_phrase_contribution_id_fkey" FOREIGN KEY (phrase_contribution_id) REFERENCES phrase_contributions(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."phrase_votes" validate constraint "public_phrase_votes_phrase_contribution_id_fkey";

alter table "public"."word_contributions" add constraint "public_contributions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."word_contributions" validate constraint "public_contributions_user_id_fkey";

alter table "public"."word_votes" add constraint "public_votes_contribution_id_fkey" FOREIGN KEY (word_contribution_id) REFERENCES word_contributions(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."word_votes" validate constraint "public_votes_contribution_id_fkey";

grant delete on table "public"."phrase_contributions" to "anon";

grant insert on table "public"."phrase_contributions" to "anon";

grant references on table "public"."phrase_contributions" to "anon";

grant select on table "public"."phrase_contributions" to "anon";

grant trigger on table "public"."phrase_contributions" to "anon";

grant truncate on table "public"."phrase_contributions" to "anon";

grant update on table "public"."phrase_contributions" to "anon";

grant delete on table "public"."phrase_contributions" to "authenticated";

grant insert on table "public"."phrase_contributions" to "authenticated";

grant references on table "public"."phrase_contributions" to "authenticated";

grant select on table "public"."phrase_contributions" to "authenticated";

grant trigger on table "public"."phrase_contributions" to "authenticated";

grant truncate on table "public"."phrase_contributions" to "authenticated";

grant update on table "public"."phrase_contributions" to "authenticated";

grant delete on table "public"."phrase_contributions" to "service_role";

grant insert on table "public"."phrase_contributions" to "service_role";

grant references on table "public"."phrase_contributions" to "service_role";

grant select on table "public"."phrase_contributions" to "service_role";

grant trigger on table "public"."phrase_contributions" to "service_role";

grant truncate on table "public"."phrase_contributions" to "service_role";

grant update on table "public"."phrase_contributions" to "service_role";

grant delete on table "public"."phrase_votes" to "anon";

grant insert on table "public"."phrase_votes" to "anon";

grant references on table "public"."phrase_votes" to "anon";

grant select on table "public"."phrase_votes" to "anon";

grant trigger on table "public"."phrase_votes" to "anon";

grant truncate on table "public"."phrase_votes" to "anon";

grant update on table "public"."phrase_votes" to "anon";

grant delete on table "public"."phrase_votes" to "authenticated";

grant insert on table "public"."phrase_votes" to "authenticated";

grant references on table "public"."phrase_votes" to "authenticated";

grant select on table "public"."phrase_votes" to "authenticated";

grant trigger on table "public"."phrase_votes" to "authenticated";

grant truncate on table "public"."phrase_votes" to "authenticated";

grant update on table "public"."phrase_votes" to "authenticated";

grant delete on table "public"."phrase_votes" to "service_role";

grant insert on table "public"."phrase_votes" to "service_role";

grant references on table "public"."phrase_votes" to "service_role";

grant select on table "public"."phrase_votes" to "service_role";

grant trigger on table "public"."phrase_votes" to "service_role";

grant truncate on table "public"."phrase_votes" to "service_role";

grant update on table "public"."phrase_votes" to "service_role";

grant delete on table "public"."phrases" to "anon";

grant insert on table "public"."phrases" to "anon";

grant references on table "public"."phrases" to "anon";

grant select on table "public"."phrases" to "anon";

grant trigger on table "public"."phrases" to "anon";

grant truncate on table "public"."phrases" to "anon";

grant update on table "public"."phrases" to "anon";

grant delete on table "public"."phrases" to "authenticated";

grant insert on table "public"."phrases" to "authenticated";

grant references on table "public"."phrases" to "authenticated";

grant select on table "public"."phrases" to "authenticated";

grant trigger on table "public"."phrases" to "authenticated";

grant truncate on table "public"."phrases" to "authenticated";

grant update on table "public"."phrases" to "authenticated";

grant delete on table "public"."phrases" to "service_role";

grant insert on table "public"."phrases" to "service_role";

grant references on table "public"."phrases" to "service_role";

grant select on table "public"."phrases" to "service_role";

grant trigger on table "public"."phrases" to "service_role";

grant truncate on table "public"."phrases" to "service_role";

grant update on table "public"."phrases" to "service_role";

grant delete on table "public"."word_contributions" to "anon";

grant insert on table "public"."word_contributions" to "anon";

grant references on table "public"."word_contributions" to "anon";

grant select on table "public"."word_contributions" to "anon";

grant trigger on table "public"."word_contributions" to "anon";

grant truncate on table "public"."word_contributions" to "anon";

grant update on table "public"."word_contributions" to "anon";

grant delete on table "public"."word_contributions" to "authenticated";

grant insert on table "public"."word_contributions" to "authenticated";

grant references on table "public"."word_contributions" to "authenticated";

grant select on table "public"."word_contributions" to "authenticated";

grant trigger on table "public"."word_contributions" to "authenticated";

grant truncate on table "public"."word_contributions" to "authenticated";

grant update on table "public"."word_contributions" to "authenticated";

grant delete on table "public"."word_contributions" to "service_role";

grant insert on table "public"."word_contributions" to "service_role";

grant references on table "public"."word_contributions" to "service_role";

grant select on table "public"."word_contributions" to "service_role";

grant trigger on table "public"."word_contributions" to "service_role";

grant truncate on table "public"."word_contributions" to "service_role";

grant update on table "public"."word_contributions" to "service_role";

grant delete on table "public"."word_votes" to "anon";

grant insert on table "public"."word_votes" to "anon";

grant references on table "public"."word_votes" to "anon";

grant select on table "public"."word_votes" to "anon";

grant trigger on table "public"."word_votes" to "anon";

grant truncate on table "public"."word_votes" to "anon";

grant update on table "public"."word_votes" to "anon";

grant delete on table "public"."word_votes" to "authenticated";

grant insert on table "public"."word_votes" to "authenticated";

grant references on table "public"."word_votes" to "authenticated";

grant select on table "public"."word_votes" to "authenticated";

grant trigger on table "public"."word_votes" to "authenticated";

grant truncate on table "public"."word_votes" to "authenticated";

grant update on table "public"."word_votes" to "authenticated";

grant delete on table "public"."word_votes" to "service_role";

grant insert on table "public"."word_votes" to "service_role";

grant references on table "public"."word_votes" to "service_role";

grant select on table "public"."word_votes" to "service_role";

grant trigger on table "public"."word_votes" to "service_role";

grant truncate on table "public"."word_votes" to "service_role";

grant update on table "public"."word_votes" to "service_role";


