"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Loader2, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { RouterOutputs } from "@swardify/api";
import { Button } from "@swardify/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@swardify/ui/form";
import { Input } from "@swardify/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@swardify/ui/popover";
import { ScrollArea } from "@swardify/ui/scroll-area";

import { api } from "~/trpc/client";

const FormSchema = z
  .object({
    type: z.literal("create"),
    swardspeak_phrases: z.string().array(),
    translated_phrases: z.string().array(),
    swardspeak_phrase: z.string(),
    translated_phrase: z.string(),
  })
  .or(
    z.object({
      type: z.literal("update"),
      id: z.string().uuid(),
      swardspeak_phrases: z.string().array(),
      translated_phrases: z.string().array(),
      swardspeak_phrase: z.string(),
      translated_phrase: z.string(),
    }),
  );

export default function DashboardPhrases() {
  const [search, setSearch] = useState("");
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: "create",
      swardspeak_phrases: [],
      translated_phrases: [],
      swardspeak_phrase: "",
      translated_phrase: "",
    },
  });
  const getAllPhrasesQuery = api.web.getAllPhrases.useQuery();
  const createPhraseMutation = api.web.createPhrase.useMutation({
    onSuccess: async () => {
      await getAllPhrasesQuery.refetch();
      form.reset();
    },
  });
  const updatePhraseMutation = api.web.updatePhrase.useMutation({
    onSuccess: async () => {
      await getAllPhrasesQuery.refetch();
      form.reset();
    },
  });

  return (
    <div className="flex h-full flex-col gap-4 p-4 md:flex-row">
      <Form {...form}>
        <form
          className="flex max-h-[50%] flex-1 flex-col space-y-5 rounded border md:max-h-none"
          onSubmit={form.handleSubmit((values) => {
            if (values.type === "create") {
              createPhraseMutation.mutate({
                swardspeak_phrase: values.swardspeak_phrase,
                translated_phrase: values.translated_phrase,
              });
            }

            if (values.type === "update") {
              updatePhraseMutation.mutate({
                id: values.id,
                swardspeak_phrase: values.swardspeak_phrase,
                translated_phrase: values.translated_phrase,
              });
            }
          })}
        >
          <h2 className="text-primary-900 p-4 pb-0 text-lg font-bold">
            {form.getValues("type") === "create"
              ? "Create Phrases"
              : "Update Phrases"}
          </h2>

          <div className="flex flex-row gap-x-4 gap-y-2 px-4">
            <FormField
              control={form.control}
              name="swardspeak_phrase"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>
                    Swardspeak
                    <span className="xs:contents hidden"> Phrases</span>
                  </FormLabel>
                  <div className="flex gap-x-2">
                    <FormControl>
                      <Input placeholder="Swardspeak Phrase" {...field} />
                    </FormControl>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="translated_phrase"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>
                    Translated
                    <span className="xs:contents hidden"> Phrases</span>
                  </FormLabel>
                  <div className="flex gap-x-2">
                    <FormControl>
                      <Input placeholder="Translated Phrase" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <ScrollArea>
            <div className="flex flex-1 gap-4 p-4 pt-0">
              <div className="flex-1 space-y-2">
                {form.watch("swardspeak_phrases").map((_, index) => (
                  <FormField
                    key={index}
                    control={form.control}
                    name={`swardspeak_phrases.${index}`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="xs:flex-row flex flex-col gap-x-2 gap-y-1">
                          <FormControl>
                            <Input placeholder="Swardspeak Phrase" {...field} />
                          </FormControl>
                          <div>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="xs:flex hidden"
                              onClick={() =>
                                form.setValue(
                                  "swardspeak_phrases",
                                  form
                                    .watch("swardspeak_phrases")
                                    .filter((_, i) => i !== index),
                                )
                              }
                            >
                              <Trash2
                                size="1.25rem"
                                className="text-destructive"
                              />
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="xs:hidden h-7 w-full text-destructive"
                              onClick={() =>
                                form.setValue(
                                  "swardspeak_phrases",
                                  form
                                    .watch("swardspeak_phrases")
                                    .filter((_, i) => i !== index),
                                )
                              }
                            >
                              <Trash2 size="1rem" className="mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <div className="flex-1 space-y-2">
                {form.watch("translated_phrases").map((_, index) => (
                  <FormField
                    key={index}
                    control={form.control}
                    name={`translated_phrases.${index}`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="xs:flex-row flex flex-col gap-x-2 gap-y-1">
                          <FormControl>
                            <Input placeholder="Translated Phrase" {...field} />
                          </FormControl>
                          <div>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="xs:flex hidden"
                              onClick={() =>
                                form.setValue(
                                  "translated_phrases",
                                  form
                                    .watch("translated_phrases")
                                    .filter((_, i) => i !== index),
                                )
                              }
                            >
                              <Trash2
                                size="1.25rem"
                                className="text-destructive"
                              />
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="xs:hidden h-7 w-full text-destructive"
                              onClick={() =>
                                form.setValue(
                                  "translated_phrases",
                                  form
                                    .watch("translated_phrases")
                                    .filter((_, i) => i !== index),
                                )
                              }
                            >
                              <Trash2 size="1rem" className="mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>
          </ScrollArea>
          <div className="flex items-center justify-between gap-x-4 p-4 pt-0">
            <Button asChild size="sm" variant="outline">
              <Link href="/dashboard">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>

            <div className="flex items-center gap-x-2">
              <Button
                type="submit"
                size="sm"
                disabled={
                  createPhraseMutation.isPending ||
                  updatePhraseMutation.isPending ||
                  !form.formState.isValid
                }
              >
                {createPhraseMutation.isPending ||
                updatePhraseMutation.isPending ? (
                  <Loader2 size="1rem" className="animate-spin" />
                ) : form.getValues("type") === "create" ? (
                  "Create"
                ) : (
                  "Update"
                )}
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={!form.formState.isDirty}
                variant="link"
                onClick={() => form.reset()}
              >
                Clear
              </Button>
            </div>
          </div>
        </form>
      </Form>
      <div className="flex max-h-[50%] flex-1 flex-col gap-y-4 rounded border md:max-h-none">
        <div className="flex items-center gap-x-2 p-4 pb-0">
          <Input
            placeholder="Search phrase"
            value={search}
            disabled={!getAllPhrasesQuery.data || getAllPhrasesQuery.isLoading}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button variant="secondary" className="rounded-full">
            {getAllPhrasesQuery.data ? (
              getAllPhrasesQuery.data.length.toLocaleString()
            ) : (
              <Loader2 size="1rem" className="animate-spin" />
            )}
          </Button>
        </div>
        <ScrollArea>
          <div className="flex flex-col gap-y-2 p-4">
            {!getAllPhrasesQuery.data ? (
              <div className="grid h-full place-items-center">
                <Loader2 className="animate-spin" />
              </div>
            ) : getAllPhrasesQuery.data.length === 0 ? (
              <p className="text-center">
                No phrases found. Please add some phrases to see them here.
              </p>
            ) : (
              (() => {
                const items = getAllPhrasesQuery.data.filter(
                  (phrase) =>
                    phrase.swardspeak_phrase
                      .toLowerCase()
                      .includes(search.trim().toLowerCase()) ||
                    phrase.translated_phrase
                      .toLowerCase()
                      .includes(search.trim().toLowerCase()),
                );

                if (items.length === 0) {
                  return <p className="text-center">No phrases found.</p>;
                }
                return items.map((phrase) => (
                  <PhraseItem
                    key={phrase.id}
                    phrase={phrase}
                    onEditClick={() => {
                      form.setValue("type", "update");
                      form.setValue("id", phrase.id);
                      form.setValue(
                        "swardspeak_phrase",
                        phrase.swardspeak_phrase,
                      );
                      form.setValue(
                        "translated_phrase",
                        phrase.translated_phrase,
                      );
                    }}
                    isEditing={
                      form.getValues("type") === "update" &&
                      phrase.id === form.getValues("id")
                    }
                  />
                ));
              })()
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

function PhraseItem({
  phrase,
  onEditClick,
  isEditing,
}: {
  phrase: RouterOutputs["web"]["getAllPhrases"][number];
  onEditClick: () => void;
  isEditing: boolean;
}) {
  const utils = api.useUtils();
  const deletePhraseMutation = api.web.deletePhrase.useMutation({
    onSuccess: async () => {
      await utils.web.getAllPhrases.refetch();
    },
  });
  return (
    <div className="space-y-2 rounded border p-4">
      <div className="xs:flex-row flex flex-col justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium">Swardspeak Phrase</p>
          <p className="break-words">- {phrase.swardspeak_phrase}</p>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">Translated Phrase</p>
          <p className="break-words">- {phrase.translated_phrase}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          variant="outline"
          disabled={isEditing}
          className="h-8 flex-1"
          onClick={onEditClick}
        >
          Edit{isEditing ? "ing..." : ""}
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-8 flex-1 text-destructive">
              Delete
            </Button>
          </PopoverTrigger>
          <PopoverContent className="max-w-60 space-y-2">
            <p>Are you sure you want to delete this phrase?</p>
            <div className="flex gap-2">
              <Button variant="outline" className="h-8 flex-1">
                Cancel
              </Button>
              <Button
                variant="outline"
                className="h-8 flex-1 text-destructive"
                onClick={() => deletePhraseMutation.mutate({ id: phrase.id })}
                disabled={deletePhraseMutation.isPending}
              >
                {deletePhraseMutation.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
