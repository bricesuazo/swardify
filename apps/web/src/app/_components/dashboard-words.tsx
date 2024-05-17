"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Loader2, Plus, Trash2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@swardify/ui/select";
import { Textarea } from "@swardify/ui/textarea";

import { api } from "~/trpc/client";
import { Database } from "../../../../../supabase/types";
import DrawerDialog from "./drawer-dialog";

const PART_OF_SPEECH: Database["public"]["Enums"]["part_of_speech"][] = [
  "noun",
  "pronoun",
  "verb",
  "adjective",
  "adverb",
  "preposition",
  "conjunction",
  "interjection",
];

const MainFormSchema = z
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
      part_of_speech: z.string(),
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

export default function DashboardWords() {
  const [search, setSearch] = useState("");
  const [POS, setPOS] = useState(null);
  const form = useForm<z.infer<typeof MainFormSchema>>({
    resolver: zodResolver(MainFormSchema),
    defaultValues: {
      type: "create",
      swardspeak_words: [],
      translated_words: [],
      swardspeak_word: "",
      translated_word: "",
    },
  });
  const getAllWordsQuery = api.web.getAllWords.useQuery();
  const createWordMutation = api.web.createWord.useMutation({
    onSuccess: async () => {
      await getAllWordsQuery.refetch();
      form.reset();
    },
  });
  const updateWordPOSMutation = api.web.updateWordPOS.useMutation({
    onSuccess: async () => {
      await getAllWordsQuery.refetch();
      form.reset();
    },
  });
  const updateWordMutation = api.web.updateWord.useMutation({
    onSuccess: async () => {
      await getAllWordsQuery.refetch();
      form.reset();
    },
  });

  return (
    <div className="flex h-full flex-col gap-4 p-4 md:flex-row">
      <Form {...form}>
        <form
          className="flex h-1/2 flex-1 flex-col space-y-5 rounded border md:h-auto"
          onSubmit={form.handleSubmit((values) => {
            if (values.type === "create") {
              createWordMutation.mutate({
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
              updateWordMutation.mutate({
                id: values.id,
                swardspeak_words: values.swardspeak_words,
                translated_words: values.translated_words,
              });
            }
          })}
        >
          <h2 className="text-primary-900 p-4 pb-0 text-lg font-bold">
            {form.getValues("type") === "create"
              ? "Create Words"
              : "Update Words"}
          </h2>
          <div className="flex flex-row gap-x-4 gap-y-2 px-4">
            <FormField
              control={form.control}
              name="swardspeak_word"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>
                    Swardspeak
                    <span className="xs:contents hidden"> Words</span>
                  </FormLabel>
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
                            form.resetField("swardspeak_word");
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
            <FormField
              control={form.control}
              name="translated_word"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>
                    Translated
                    <span className="xs:contents hidden"> Words</span>
                  </FormLabel>
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
                            form.resetField("translated_word");
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
          </div>
          <ScrollArea>
            <div className="flex flex-1 gap-4 p-4 pt-0">
              <div className="flex-1 space-y-2">
                {form.watch("swardspeak_words").map((_, index) => (
                  <FormField
                    key={index}
                    control={form.control}
                    name={`swardspeak_words.${index}`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="xs:flex-row flex flex-col gap-x-2 gap-y-1">
                          <FormControl>
                            <Input placeholder="Swardspeak Word" {...field} />
                          </FormControl>
                          <div>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="xs:flex hidden"
                              onClick={() =>
                                form.setValue(
                                  "swardspeak_words",
                                  form
                                    .watch("swardspeak_words")
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
                                  "swardspeak_words",
                                  form
                                    .watch("swardspeak_words")
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
                {form.watch("translated_words").map((_, index) => (
                  <FormField
                    key={index}
                    control={form.control}
                    name={`translated_words.${index}`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="xs:flex-row flex flex-col gap-x-2 gap-y-1">
                          <FormControl>
                            <Input placeholder="Translated Word" {...field} />
                          </FormControl>
                          <div>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="xs:flex hidden"
                              onClick={() =>
                                form.setValue(
                                  "translated_words",
                                  form
                                    .watch("translated_words")
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
                                  "translated_words",
                                  form
                                    .watch("translated_words")
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
          <div className="flex flex-col justify-between gap-4 p-4 pt-0 sm:flex-row sm:items-center">
            <div className="flex items-center gap-x-2">
              <Button asChild size="sm" variant="outline">
                <Link href="/dashboard">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
              {form.getValues("type") === "update" && (
                <Select
                  onValueChange={(value) => {
                    setPOS(value);
                    updateWordPOSMutation.mutate({
                      id: form.getValues("id"),
                      part_of_speech: value,
                    });
                  }}
                  disabled={updateWordPOSMutation.isPending}
                  value={POS}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Part of speech" />
                  </SelectTrigger>
                  <SelectContent>
                    {PART_OF_SPEECH.map((pos) => (
                      <SelectItem key={pos} value={pos}>
                        {pos.charAt(0).toUpperCase() + pos.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="flex items-center justify-end gap-x-2">
              <Button
                type="button"
                size="sm"
                disabled={!form.formState.isDirty}
                variant="link"
                onClick={() => form.reset()}
              >
                Clear
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={
                  createWordMutation.isPending ||
                  updateWordMutation.isPending ||
                  !form.formState.isValid
                }
              >
                {createWordMutation.isPending ||
                updateWordMutation.isPending ? (
                  <Loader2 size="1rem" className="animate-spin" />
                ) : form.getValues("type") === "create" ? (
                  "Create"
                ) : (
                  "Update"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
      <div className="flex h-1/2 flex-1 flex-col gap-y-4 rounded border md:h-auto">
        <div className="flex items-center gap-x-2 p-4 pb-0">
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
        <ScrollArea>
          <div className="flex flex-col gap-y-2 p-4">
            {!getAllWordsQuery.data ? (
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
                      form.trigger();
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
        </ScrollArea>
      </div>
    </div>
  );
}

function WordItem({
  word,
  onEditClick,
  isEditing,
}: {
  word: RouterOutputs["web"]["getAllWords"][number];
  onEditClick: () => void;
  isEditing: boolean;
}) {
  const [openDefinition, setOpenDefinition] = useState(false);
  const [openExamples, setOpenExamples] = useState(false);
  const utils = api.useUtils();
  const deleteWordMutation = api.web.deleteWord.useMutation({
    onSuccess: async () => {
      await utils.web.getAllWords.refetch();
    },
  });
  return (
    <>
      <div className="space-y-2 rounded border p-4">
        <div className="flex gap-4">
          <div className="xs:flex-row flex flex-1 flex-col justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium">Swardspeak Word</p>
              {word.swardspeak_words.map((swardspeak_word, index) => (
                <p key={index} className="break-words">
                  - {swardspeak_word}
                </p>
              ))}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Translated Word</p>
              {word.translated_words.map((translated_word, index) => (
                <p key={index} className="break-words">
                  - {translated_word}
                </p>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Definition</p>
            <p>{word.definition}</p>
          </div>
        </div>
        <div className="">
          <p className="text-sm font-medium">Examples</p>
          {word.examples?.length === 0 ? (
            <p className="break-words">- No examples</p>
          ) : (
            word.examples?.map((example, index) => (
              <p key={index} className="break-words">
                - {example}
              </p>
            ))
          )}
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
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
                  onClick={() => deleteWordMutation.mutate({ id: word.id })}
                  disabled={deleteWordMutation.isPending}
                >
                  {deleteWordMutation.isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Delete"
                  )}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <Button
            onClick={() => setOpenDefinition(true)}
            size="sm"
            variant="outline"
          >
            Edit Definition
          </Button>
          <Button
            onClick={() => setOpenExamples(true)}
            size="sm"
            variant="outline"
          >
            Edit Examples
          </Button>
        </div>
      </div>
      <DrawerDialog
        title="Edit definition"
        open={openDefinition}
        setOpen={setOpenDefinition}
      >
        <DefinitionForm
          id={word.id}
          setOpen={setOpenDefinition}
          defaultValues={{
            definition: word.definition ?? undefined,
          }}
        />
      </DrawerDialog>
      <DrawerDialog
        title="Edit examples"
        open={openExamples}
        setOpen={setOpenExamples}
      >
        <ExamplesForm
          id={word.id}
          setOpen={setOpenExamples}
          defaultValues={{
            example: "",
            examples: word.examples ?? [],
          }}
        />
      </DrawerDialog>
    </>
  );
}

const DefinitionFormSchema = z.object({
  definition: z.string().optional(),
});

function DefinitionForm({
  id,
  defaultValues,
  setOpen,
}: {
  id: string;
  defaultValues?: z.infer<typeof DefinitionFormSchema>;
  setOpen: (open: boolean) => void;
}) {
  const utils = api.useUtils();
  const form = useForm<z.infer<typeof DefinitionFormSchema>>({
    resolver: zodResolver(DefinitionFormSchema),
    defaultValues,
  });
  const updateWordDefinitionMutation = api.web.updateWordDefinition.useMutation(
    {
      onSuccess: async () => {
        await utils.web.getAllWords.refetch();
        setOpen(false);
      },
    },
  );
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          if (!values.definition) {
            form.setError("definition", {
              message: "Definition is required.",
            });
            return;
          }
          updateWordDefinitionMutation.mutate({
            id,
            definition: values.definition,
          });
        })}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="definition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Definition</FormLabel>
              <FormControl>
                <Textarea placeholder="Definition" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={updateWordDefinitionMutation.isPending}
          type="submit"
          className="w-full"
        >
          {updateWordDefinitionMutation.isPending ? "Saving..." : "Save"}
        </Button>
      </form>
    </Form>
  );
}
const ExamplesFormSchema = z.object({
  example: z.string(),
  examples: z.string().array().optional(),
});

function ExamplesForm({
  id,
  defaultValues,
  setOpen,
}: {
  id: string;
  defaultValues?: z.infer<typeof ExamplesFormSchema>;
  setOpen: (open: boolean) => void;
}) {
  const utils = api.useUtils();
  const form = useForm<z.infer<typeof ExamplesFormSchema>>({
    resolver: zodResolver(ExamplesFormSchema),
    defaultValues,
  });
  const updateWordExamplesMutation = api.web.updateWordExamples.useMutation({
    onSuccess: async () => {
      await utils.web.getAllWords.refetch();
      setOpen(false);
    },
  });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          if (!values.examples) {
            form.setError("examples", {
              message: "Examples is required.",
            });
            return;
          }
          updateWordExamplesMutation.mutate({
            id,
            examples:
              values.example.length > 0
                ? [...values.examples, values.example]
                : values.examples,
          });
        })}
        className="space-y-4"
      >
        <div className="flex items-end gap-x-2">
          <FormField
            control={form.control}
            name="example"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Example</FormLabel>
                <FormControl>
                  <Input placeholder="Example" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            variant="outline"
            size="icon"
            type="button"
            disabled={!form.formState}
            onClick={() => {
              form.setValue("examples", [
                ...(form.getValues("examples") ?? []),
                form.getValues("example"),
              ]);
              form.resetField("example");
            }}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        <div className="space-y-2">
          {form.watch("examples")?.map((_, index) => (
            <div key={index} className="flex items-end gap-x-2">
              <FormField
                control={form.control}
                name={`examples.${index}`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="Example" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                variant="outline"
                size="icon"
                type="button"
                disabled={!form.formState}
                onClick={() => {
                  form.setValue(
                    "examples",
                    (form.getValues("examples") ?? []).filter(
                      (_, i) => i !== index,
                    ),
                  );
                }}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
        <Button
          disabled={updateWordExamplesMutation.isPending}
          type="submit"
          className="w-full"
        >
          {updateWordExamplesMutation.isPending ? "Saving..." : "Save"}
        </Button>
      </form>
    </Form>
  );
}
