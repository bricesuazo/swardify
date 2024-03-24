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
import { Loader2, Plus } from "lucide-react";

const FormSchema = z
  .object({
    type: z.literal("create").or(z.literal("update")),
    swardspeak_words: z.string().array(),
    translated_words: z.string().array(),
    swardspeak_word: z.string(),
    translated_word: z.string(),
  })
  .refine((data) => {
    if (data.translated_words.length > 0 && data.translated_word.length > 0) {
      return true;
    }

    if (data.swardspeak_word.length > 0 && data.swardspeak_word.length > 0) {
      return true;
    }
    return true;
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
  return (
    <div className="flex h-full flex-col gap-4 p-4 sm:flex-row">
      <div className="flex flex-1 rounded border p-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) =>
              createWordsMutation.mutate({
                swardspeak_words:
                  values.swardspeak_word.length > 0
                    ? [...values.swardspeak_words, values.swardspeak_word]
                    : values.swardspeak_words,
                translated_words:
                  values.translated_words.length > 0
                    ? [...values.translated_words, values.translated_word]
                    : values.translated_words,
              }),
            )}
            className="h-full flex-1 space-y-5"
          >
            <div className="flex gap-4">
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
                        <FormControl>
                          <Input placeholder="Swardspeak Word" {...field} />
                        </FormControl>
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
                        <FormControl>
                          <Input placeholder="Translated Word" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>
            <Button type="submit">Create</Button>
          </form>
        </Form>
      </div>
      <div className="flex flex-1 rounded border p-4">
        <div className="flex flex-1 flex-col gap-y-4">
          <Input
            placeholder="Search word"
            value={search}
            disabled={!getAllWordsQuery.data || getAllWordsQuery.isLoading}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="h-full space-y-2">
            {!getAllWordsQuery.data || getAllWordsQuery.isLoading ? (
              <div className="grid h-full place-items-center">
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              getAllWordsQuery.data
                .filter(
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
                )
                .map((word) => (
                  <div
                    key={word.id}
                    className="flex justify-between rounded border p-4"
                  >
                    <div>
                      <p className="text-sm font-medium">Swardspeak Word</p>
                      {word.swardspeak_words.map((swardspeak_word, index) => (
                        <p key={index}>- {swardspeak_word}</p>
                      ))}
                    </div>
                    <div>
                      <p className="text-sm font-medium">Translated Word</p>
                      {word.translated_words.map((translated_word, index) => (
                        <p key={index}>- {translated_word}</p>
                      ))}
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
