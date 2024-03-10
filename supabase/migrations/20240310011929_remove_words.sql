revoke delete on table "public"."words" from "anon";

revoke insert on table "public"."words" from "anon";

revoke references on table "public"."words" from "anon";

revoke select on table "public"."words" from "anon";

revoke trigger on table "public"."words" from "anon";

revoke truncate on table "public"."words" from "anon";

revoke update on table "public"."words" from "anon";

revoke delete on table "public"."words" from "authenticated";

revoke insert on table "public"."words" from "authenticated";

revoke references on table "public"."words" from "authenticated";

revoke select on table "public"."words" from "authenticated";

revoke trigger on table "public"."words" from "authenticated";

revoke truncate on table "public"."words" from "authenticated";

revoke update on table "public"."words" from "authenticated";

revoke delete on table "public"."words" from "service_role";

revoke insert on table "public"."words" from "service_role";

revoke references on table "public"."words" from "service_role";

revoke select on table "public"."words" from "service_role";

revoke trigger on table "public"."words" from "service_role";

revoke truncate on table "public"."words" from "service_role";

revoke update on table "public"."words" from "service_role";

alter table "public"."words" drop constraint "words_pkey";

drop index if exists "public"."words_pkey";

drop table "public"."words";


