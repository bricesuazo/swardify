"use client";

import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import type { RouterOutputs } from "~/server/api/root";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

const FormSchema = z
  .object({
    type: z.literal("create"),
    swardspeak_words: z.string().array(),
    translated_words: z.string().array(),
    swardspeak_word: z.string(),
    translated_word: z.string(),
  })
  .or(
    z.object({
      type: z.literal("update"),
      id: z.string().uuid(),
      swardspeak_words: z.string().array(),
      translated_words: z.string().array(),
      swardspeak_word: z.string(),
      translated_word: z.string(),
    }),
  )
  .refine((data) => {
    if (
      (data.swardspeak_words.length > 0 && data.translated_words.length > 0) ||
      (data.swardspeak_word.length > 0 && data.translated_word.length > 0)
    )
      return true;
    return false;
  });

export default function SignedIn() {
  const [search, setSearch] = useState("");
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: "create",
      swardspeak_words: [],
      translated_words: [],
      swardspeak_word: "",
      translated_word: "",
    },
  });
  const getAllWordsQuery = api.main.getAllWords.useQuery();
  const createWordsMutation = api.main.createWords.useMutation({
    onSuccess: async () => {
      await getAllWordsQuery.refetch();
      form.reset();
    },
  });
  const updateWordsMutation = api.main.updateWords.useMutation({
    onSuccess: async () => {
      await getAllWordsQuery.refetch();
      form.reset();
    },
  });

  return (
    <div className="flex h-full flex-col gap-4 p-4 md:flex-row">
      <div className="flex flex-1 rounded border p-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => {
              if (values.type === "create") {
                createWordsMutation.mutate({
                  swardspeak_words:
                    values.swardspeak_word.length > 0
                      ? [...values.swardspeak_words, values.swardspeak_word]
                      : values.swardspeak_words,
                  translated_words:
                    values.translated_word.length > 0
                      ? [...values.translated_words, values.translated_word]
                      : values.translated_words,
                });
              }

              if (values.type === "update") {
                updateWordsMutation.mutate({
                  id: values.id,
                  swardspeak_words: values.swardspeak_words,
                  translated_words: values.translated_words,
                });
              }
            })}
            className="h-full flex-1 space-y-5"
          >
            <h1
              className="
              text-primary-900 text-2xl
              font-bold
            "
            >
              {form.getValues("type") === "create"
                ? "Create Words"
                : "Update Words"}
            </h1>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1 space-y-2">
                <FormField
                  control={form.control}
                  name="swardspeak_word"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Swardspeak Words</FormLabel>
                      <div className="flex gap-x-2">
                        <FormControl>
                          <Input placeholder="Swardspeak Word" {...field} />
                        </FormControl>
                        {field.value.length > 0 && (
                          <div>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                form.setValue("swardspeak_words", [
                                  ...form.getValues("swardspeak_words"),
                                  field.value,
                                ]);
                                form.setValue("swardspeak_word", "");
                              }}
                            >
                              <Plus />
                            </Button>
                          </div>
                        )}
                      </div>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch("swardspeak_words").map((_, index) => (
                  <FormField
                    key={index}
                    control={form.control}
                    name={`swardspeak_words.${index}`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex gap-x-2">
                          <FormControl>
                            <Input placeholder="Swardspeak Word" {...field} />
                          </FormControl>
                          <div>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                form.setValue(
                                  "swardspeak_words",
                                  form
                                    .getValues("swardspeak_words")
                                    .filter((_, i) => i !== index),
                                );
                              }}
                            >
                              <Trash2
                                size="1.25rem"
                                className="text-destructive"
                              />
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
                <FormField
                  control={form.control}
                  name="translated_word"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Translated Words</FormLabel>
                      <div className="flex gap-x-2">
                        <FormControl>
                          <Input placeholder="Translated Word" {...field} />
                        </FormControl>
                        {field.value.length > 0 && (
                          <div>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                form.setValue("translated_words", [
                                  ...form.getValues("translated_words"),
                                  field.value,
                                ]);
                                form.setValue("translated_word", "");
                              }}
                            >
                              <Plus />
                            </Button>
                          </div>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch("translated_words").map((_, index) => (
                  <FormField
                    key={index}
                    control={form.control}
                    name={`translated_words.${index}`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex gap-x-2">
                          <FormControl>
                            <Input placeholder="Translated Word" {...field} />
                          </FormControl>
                          <div>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                form.setValue(
                                  "translated_words",
                                  form
                                    .getValues("translated_words")
                                    .filter((_, i) => i !== index),
                                );
                              }}
                            >
                              <Trash2
                                size="1.25rem"
                                className="text-destructive"
                              />
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
            <div className="flex items-center gap-x-2">
              <Button
                type="submit"
                disabled={
                  createWordsMutation.isPending ||
                  updateWordsMutation.isPending ||
                  !form.formState.isValid
                }
              >
                {createWordsMutation.isPending ||
                updateWordsMutation.isPending ? (
                  <Loader2 size="1rem" className="animate-spin" />
                ) : form.getValues("type") === "create" ? (
                  "Create"
                ) : (
                  "Update"
                )}
              </Button>
              <Button
                type="button"
                disabled={!form.formState.isDirty}
                variant="link"
                onClick={() => form.reset()}
              >
                Clear
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <div className="flex flex-1 rounded border p-4">
        <div className="flex flex-1 flex-col gap-y-4">
          <div className="flex items-center gap-x-2">
            <Input
              placeholder="Search word"
              value={search}
              disabled={!getAllWordsQuery.data || getAllWordsQuery.isLoading}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button variant="secondary" className="rounded-full">
              {getAllWordsQuery.data ? (
                getAllWordsQuery.data.length.toLocaleString()
              ) : (
                <Loader2 size="1rem" className="animate-spin" />
              )}
            </Button>
          </div>
          <div className="h-full space-y-2">
            {!getAllWordsQuery.data || getAllWordsQuery.isLoading ? (
              <div className="grid h-full place-items-center">
                <Loader2 className="animate-spin" />
              </div>
            ) : getAllWordsQuery.data.length === 0 ? (
              <p className="text-center">
                No words found. Please add some words to see them here.
              </p>
            ) : (
              (() => {
                const items = getAllWordsQuery.data.filter(
                  (word) =>
                    word.swardspeak_words.some((swardspeak_word) =>
                      swardspeak_word
                        .toLowerCase()
                        .includes(search.trim().toLowerCase()),
                    ) ||
                    word.translated_words.some((translated_word) =>
                      translated_word
                        .toLowerCase()
                        .includes(search.trim().toLowerCase()),
                    ),
                );

                if (items.length === 0) {
                  return <p className="text-center">No words found.</p>;
                }
                return items.map((word) => (
                  <WordItem
                    key={word.id}
                    word={word}
                    onEditClick={() => {
                      form.setValue("type", "update");
                      form.setValue("id", word.id);
                      form.setValue("swardspeak_words", word.swardspeak_words);
                      form.setValue("translated_words", word.translated_words);
                      form.resetField("swardspeak_word");
                      form.resetField("translated_word");
                    }}
                    isEditing={
                      form.getValues("type") === "update" &&
                      word.id === form.getValues("id")
                    }
                  />
                ));
              })()
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function WordItem({
  word,
  onEditClick,
  isEditing,
}: {
  word: RouterOutputs["main"]["getAllWords"][number];
  onEditClick: () => void;
  isEditing: boolean;
}) {
  const utils = api.useUtils();
  const deleteWordsMutation = api.main.deleteWords.useMutation({
    onSuccess: async () => {
      await utils.main.getAllWords.refetch();
    },
  });
  return (
    <div className="space-y-2 rounded border p-4">
      <div className="flex justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium">Swardspeak Word</p>
          {word.swardspeak_words.map((swardspeak_word, index) => (
            <p key={index}>- {swardspeak_word}</p>
          ))}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">Translated Word</p>
          {word.translated_words.map((translated_word, index) => (
            <p key={index}>- {translated_word}</p>
          ))}
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
            <p>Are you sure you want to delete this word?</p>
            <div className="flex gap-2">
              <Button variant="outline" className="h-8 flex-1">
                Cancel
              </Button>
              <Button
                variant="outline"
                className="h-8 flex-1 text-destructive"
                onClick={() => deleteWordsMutation.mutate({ id: word.id })}
                disabled={deleteWordsMutation.isPending}
              >
                {deleteWordsMutation.isPending ? (
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
