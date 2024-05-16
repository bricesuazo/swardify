
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE TYPE "public"."sex" AS ENUM (
    'm',
    'f'
);

ALTER TYPE "public"."sex" OWNER TO "postgres";

CREATE TYPE "public"."vote" AS ENUM (
    'upvote',
    'downvote'
);

ALTER TYPE "public"."vote" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."favorites" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "word_id" "uuid" NOT NULL
);

ALTER TABLE "public"."favorites" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."phrase_contributions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "deleted_at" timestamp with time zone,
    "user_id" "uuid" NOT NULL,
    "swardspeak_phrase" "text" NOT NULL,
    "translated_phrase" "text" NOT NULL,
    "approved_at" timestamp with time zone,
    "declined_at" timestamp with time zone
);

ALTER TABLE "public"."phrase_contributions" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."phrase_votes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "phrase_contribution_id" "uuid" NOT NULL,
    "vote" "public"."vote" NOT NULL,
    "user_id" "uuid" NOT NULL
);

ALTER TABLE "public"."phrase_votes" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."phrases" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "deleted_at" timestamp with time zone,
    "swardspeak_phrase" "text" NOT NULL,
    "translated_phrase" "text" NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "phrase_contribution_id" "uuid"
);

ALTER TABLE "public"."phrases" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."translation_histories" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "tagalog" "text",
    "swardspeak" "text"
);

ALTER TABLE "public"."translation_histories" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "email" character varying NOT NULL,
    "sex" "public"."sex",
    "pronouns" "text"[] DEFAULT '{}'::"text"[] NOT NULL
);

ALTER TABLE "public"."users" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."word_contributions" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "swardspeak_words" "text"[] NOT NULL,
    "translated_words" "text"[] NOT NULL,
    "deleted_at" timestamp with time zone,
    "user_id" "uuid" NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "approved_at" timestamp with time zone,
    "declined_at" timestamp with time zone
);

ALTER TABLE "public"."word_contributions" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."word_votes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "word_contribution_id" "uuid" NOT NULL,
    "vote" "public"."vote" NOT NULL,
    "user_id" "uuid" NOT NULL
);

ALTER TABLE "public"."word_votes" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."words" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "swardspeak_words" character varying[] NOT NULL,
    "translated_words" character varying[] NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "deleted_at" timestamp with time zone,
    "word_contribution_id" "uuid"
);

ALTER TABLE "public"."words" OWNER TO "postgres";

ALTER TABLE ONLY "public"."word_contributions"
    ADD CONSTRAINT "contributions_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."favorites"
    ADD CONSTRAINT "favorites_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."phrase_contributions"
    ADD CONSTRAINT "phrase_contributions_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."phrase_votes"
    ADD CONSTRAINT "phrase_votes_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."phrases"
    ADD CONSTRAINT "phrases_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."translation_histories"
    ADD CONSTRAINT "translation_history_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."word_votes"
    ADD CONSTRAINT "votes_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."words"
    ADD CONSTRAINT "words_pkey" PRIMARY KEY ("id");

CREATE INDEX "users_email_idx" ON "public"."users" USING "btree" ("email");

ALTER TABLE ONLY "public"."favorites"
    ADD CONSTRAINT "favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."favorites"
    ADD CONSTRAINT "favorites_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "public"."words"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."word_contributions"
    ADD CONSTRAINT "public_contributions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."phrase_contributions"
    ADD CONSTRAINT "public_phrase_contributions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."phrase_votes"
    ADD CONSTRAINT "public_phrase_votes_phrase_contribution_id_fkey" FOREIGN KEY ("phrase_contribution_id") REFERENCES "public"."phrase_contributions"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."phrase_votes"
    ADD CONSTRAINT "public_phrase_votes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."phrase_contributions"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."phrases"
    ADD CONSTRAINT "public_phrases_phrase_contribution_id_fkey" FOREIGN KEY ("phrase_contribution_id") REFERENCES "public"."phrase_contributions"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."word_votes"
    ADD CONSTRAINT "public_votes_contribution_id_fkey" FOREIGN KEY ("word_contribution_id") REFERENCES "public"."word_contributions"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."word_votes"
    ADD CONSTRAINT "public_word_votes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."words"
    ADD CONSTRAINT "public_words_word_contribution_id_fkey" FOREIGN KEY ("word_contribution_id") REFERENCES "public"."word_contributions"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."translation_histories"
    ADD CONSTRAINT "translation_histories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "public"."favorites" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."phrase_contributions" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."phrase_votes" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."phrases" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."translation_histories" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."word_contributions" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."word_votes" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."words" ENABLE ROW LEVEL SECURITY;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";

GRANT ALL ON TABLE "public"."favorites" TO "anon";
GRANT ALL ON TABLE "public"."favorites" TO "authenticated";
GRANT ALL ON TABLE "public"."favorites" TO "service_role";

GRANT ALL ON TABLE "public"."phrase_contributions" TO "anon";
GRANT ALL ON TABLE "public"."phrase_contributions" TO "authenticated";
GRANT ALL ON TABLE "public"."phrase_contributions" TO "service_role";

GRANT ALL ON TABLE "public"."phrase_votes" TO "anon";
GRANT ALL ON TABLE "public"."phrase_votes" TO "authenticated";
GRANT ALL ON TABLE "public"."phrase_votes" TO "service_role";

GRANT ALL ON TABLE "public"."phrases" TO "anon";
GRANT ALL ON TABLE "public"."phrases" TO "authenticated";
GRANT ALL ON TABLE "public"."phrases" TO "service_role";

GRANT ALL ON TABLE "public"."translation_histories" TO "anon";
GRANT ALL ON TABLE "public"."translation_histories" TO "authenticated";
GRANT ALL ON TABLE "public"."translation_histories" TO "service_role";

GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";

GRANT ALL ON TABLE "public"."word_contributions" TO "anon";
GRANT ALL ON TABLE "public"."word_contributions" TO "authenticated";
GRANT ALL ON TABLE "public"."word_contributions" TO "service_role";

GRANT ALL ON TABLE "public"."word_votes" TO "anon";
GRANT ALL ON TABLE "public"."word_votes" TO "authenticated";
GRANT ALL ON TABLE "public"."word_votes" TO "service_role";

GRANT ALL ON TABLE "public"."words" TO "anon";
GRANT ALL ON TABLE "public"."words" TO "authenticated";
GRANT ALL ON TABLE "public"."words" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
