"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDownUp } from "lucide-react";
import { toast } from "sonner";

import type { RouterInputs } from "@swardify/api";
import { Button } from "@swardify/ui/button";
import { Input } from "@swardify/ui/input";
import { ScrollArea } from "@swardify/ui/scroll-area";
import { Separator } from "@swardify/ui/separator";
import { Skeleton } from "@swardify/ui/skeleton";

import { useDebounceValue } from "~/lib/useDebounceValue";
import { useInterval } from "~/lib/useInterval";
import { api } from "~/trpc/client";

const ERROR_MESSAGE =
  "Translation in web is currently unavailable. Please use the mobile application.";
export default function Home() {
  const [search, setSearch] = useState("");
  const [phrase, setPhrase] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [debouncedInput, setDebouncedInput] = useDebounceValue(input, 1000);
  const [type, setType] = useState<RouterInputs["mobile"]["translate"]["type"]>(
    "swardspeak-to-tagalog",
  );

  const getAllWordsQuery = api.web.getAllWords.useQuery();
  const getAllPhrasesQuery = api.web.getAllPhrases.useQuery();

  useInterval(
    () => {
      setCopied(false);
    },
    copied ? 2000 : null,
  );

  useEffect(() => {
    if (!debouncedInput || debouncedInput.length === 0) return;
    toast(ERROR_MESSAGE);
    setOutput(ERROR_MESSAGE);
    // translateMutation.mutate({ type, input: debouncedInput });
  }, [debouncedInput]);

  useEffect(() => {
    setDebouncedInput(input);
  }, [input]);
  return (
    <div className="space-y-10">
      <div className="bg-primary text-white">
        <div className="container mx-auto max-w-screen-md space-y-4 p-4">
          <header className="flex flex-col items-center">
            <Image
              src="/icon-foreground.png"
              alt="Logo"
              width={80}
              height={80}
            />
            <h2 className="text-xl font-semibold">Swardify</h2>
            <p className="text-xs">
              A Bidirectional Swardspeak and Tagalog Translator
            </p>
          </header>
          <div className="relative mx-auto max-w-sm">
            <div className="rounded-t-lg border border-white p-4">
              <p className="text-xs text-muted">
                {type === "swardspeak-to-tagalog" ? "Swardspeak" : "Tagalog"}
              </p>
              <textarea
                placeholder={`Type ${
                  type === "swardspeak-to-tagalog" ? "swardspeak" : "tagalog"
                } sentence`}
                className="w-full resize-none bg-transparent focus:outline-none"
                rows={3}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <div className="rounded-b-lg border border-transparent bg-white p-4">
              <p className="text-xs text-muted-foreground">
                {type === "swardspeak-to-tagalog" ? "Tagalog" : "Swardspeak"}
              </p>
              <textarea
                disabled
                placeholder={
                  type === "swardspeak-to-tagalog"
                    ? "Tagalog translation"
                    : "Swardspeak translation"
                }
                className="w-full resize-none bg-transparent text-black focus:outline-none"
                rows={3}
                value={output}
                onChange={(e) => setOutput(e.target.value)}
              />
            </div>
            <Button
              size="icon"
              className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white hover:bg-primary"
              onClick={() => {
                setInput("");
                setOutput("");
                setType(
                  type === "swardspeak-to-tagalog"
                    ? "tagalog-to-swardspeak"
                    : "swardspeak-to-tagalog",
                );
              }}
            >
              <ArrowDownUp />
            </Button>
          </div>
          <div className="space-y-2">
            <p className="text-center font-bold">Download Swardify App</p>
            <div className="flex items-center justify-center gap-x-2">
              <Link
                href="#"
                // target="_blank"
              >
                <Image
                  src="/playstore-light.png"
                  alt="Playstore"
                  className="object-cover"
                  width={120}
                  height={40}
                />
              </Link>
              <Link
                href="#"
                // target="_blank"
              >
                <Image
                  src="/appstore-light.png"
                  alt="Playstore"
                  className="object-cover"
                  width={120}
                  height={40}
                />
              </Link>
            </div>
          </div>
          <div />
        </div>
      </div>

      <div className="container mx-auto max-w-screen-md space-y-1 p-4">
        <h3 className="text-center text-lg font-semibold">
          Swardspeak to Tagalog Words and Phrases
        </h3>
        <div className="flex flex-col gap-4 gap-y-4 p-0 sm:flex-row">
          <div className="flex-1 space-y-2">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search words"
            />

            <ScrollArea className="flex-1" viewportClassName="h-96">
              <div className="space-y-2">
                {!getAllWordsQuery.data || getAllWordsQuery.isLoading ? (
                  <>
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </>
                ) : (
                  (() => {
                    const filtered_words = getAllWordsQuery.data.filter(
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
                    return filtered_words.length === 0 ? (
                      <div>
                        <p className="text-center text-sm text-muted-foreground">
                          No words found.
                        </p>
                      </div>
                    ) : (
                      <>
                        {filtered_words.map((word) => (
                          <div
                            key={word.id}
                            className="flex justify-between rounded-md border p-4"
                          >
                            <p className="flex-1 text-sm">
                              {word.swardspeak_words.join(" / ")}
                            </p>
                            <p className="flex-1 text-right text-sm">
                              {word.translated_words.join(" / ")}
                            </p>
                          </div>
                        ))}
                        {filtered_words.length !== 0 && (
                          <p className="text-center text-xs text-muted-foreground">
                            End
                          </p>
                        )}
                      </>
                    );
                  })()
                )}
              </div>
            </ScrollArea>
          </div>
          <div className="flex-1 space-y-2">
            <Input
              value={phrase}
              onChange={(e) => setPhrase(e.target.value)}
              placeholder="Search phrases"
            />

            <ScrollArea className="flex-1" viewportClassName="h-96">
              <div className="space-y-2">
                {!getAllPhrasesQuery.data || getAllPhrasesQuery.isLoading ? (
                  <>
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </>
                ) : (
                  (() => {
                    const filtered_phrases = getAllPhrasesQuery.data.filter(
                      (word) =>
                        word.swardspeak_phrase
                          .toLowerCase()
                          .includes(phrase.trim().toLowerCase()) ||
                        word.translated_phrase
                          .toLowerCase()
                          .includes(phrase.trim().toLowerCase()),
                    );
                    return filtered_phrases.length === 0 ? (
                      <div>
                        <p className="text-center text-sm text-muted-foreground">
                          No phrases found.
                        </p>
                      </div>
                    ) : (
                      <>
                        {filtered_phrases.map((phrase) => (
                          <div
                            key={phrase.id}
                            className="flex justify-between rounded-md border p-4"
                          >
                            <p className="flex-1 text-sm">
                              {phrase.swardspeak_phrase}
                            </p>
                            <p className="flex-1 text-right text-sm">
                              {phrase.translated_phrase}
                            </p>
                          </div>
                        ))}
                        {filtered_phrases.length !== 0 && (
                          <p className="text-center text-xs text-muted-foreground">
                            End
                          </p>
                        )}
                      </>
                    );
                  })()
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      <Separator />

      <div className="container mx-auto max-w-screen-md space-y-2 p-4">
        <h4 className="text-center text-lg font-semibold">
          Meet the developers
        </h4>

        <p className="text-center text-sm text-muted-foreground">
          **This application is for our undergraduate thesis.**
        </p>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {[
            {
              id: 0,
              name: "Jasmine Franchette Amurao",
              imageUri:
                "https://raw.githubusercontent.com/bricesuazo/swardify/main/apps/mobile/assets/devs/jasmine.png",
              email: "jasminefranchette.amurao@cvsu.edu.ph",
            },
            {
              id: 1,
              name: "Lourielene Baldomero",
              imageUri:
                "https://raw.githubusercontent.com/bricesuazo/swardify/main/apps/mobile/assets/devs/lourielene.png",
              email: "lourielene.baldomero@cvsu.edu.ph",
            },

            {
              id: 2,
              name: "Rey Anthony De Luna",
              imageUri:
                "https://raw.githubusercontent.com/bricesuazo/swardify/main/apps/mobile/assets/devs/rey.png",
              email: "reyanthony.deluna@cvsu.edu.ph",
            },
            {
              id: 3,
              name: "Brice Brine Suazo",
              imageUri:
                "https://raw.githubusercontent.com/bricesuazo/swardify/main/apps/mobile/assets/devs/brice.png",
              email: "bricebrine.suazo@cvsu.edu.ph",
            },
          ].map((developer) => (
            <div
              key={developer.id}
              className="flex items-center gap-5 rounded-md border border-border p-4"
            >
              <Image
                src={developer.imageUri}
                alt="Developer Image"
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <h5 className="text-sm font-medium">{developer.name}</h5>
                <Link href={`mailto:${developer.email}`} className="text-xs">
                  {developer.email}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="border-t p-4 text-center text-xs text-muted-foreground">
        Swardify
      </footer>
    </div>
  );
}
