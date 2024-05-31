"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDownUp } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import type { RouterInputs } from "@swardify/api";
import { cn } from "@swardify/ui";
import { Badge } from "@swardify/ui/badge";
import { Button } from "@swardify/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@swardify/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@swardify/ui/drawer";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@swardify/ui/form";
import { Input } from "@swardify/ui/input";
import { ScrollArea } from "@swardify/ui/scroll-area";
import { Separator } from "@swardify/ui/separator";
import { Skeleton } from "@swardify/ui/skeleton";

import { useInterval } from "~/lib/useInterval";
import { useMediaQuery } from "~/lib/useMediaQuery";
import { api } from "~/trpc/client";

const ERROR_MESSAGE =
  "Translation in web is currently unavailable. Please use the mobile application.";

export default function Home() {
  const [openPlaystoreTesting, setOpenPlaystoreTesting] = useState(false);
  const [search, setSearch] = useState("");
  const [phrase, setPhrase] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  // const [debouncedInput, setDebouncedInput] = useDebounceValue(input, 1000);
  const [type, setType] = useState<RouterInputs["mobile"]["translate"]["type"]>(
    "swardspeak-to-tagalog",
  );

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const getAllWordsQuery = api.web.getAllWords.useQuery();
  const getAllPhrasesQuery = api.web.getAllPhrases.useQuery();

  useInterval(
    () => {
      setCopied(false);
    },
    copied ? 2000 : null,
  );

  // useEffect(() => {
  //   if (!debouncedInput || debouncedInput.length === 0) return;
  //   toast(ERROR_MESSAGE);
  //   setOutput(ERROR_MESSAGE);
  //   // translateMutation.mutate({ type, input: debouncedInput });
  // }, [debouncedInput]);

  // useEffect(() => {
  //   setDebouncedInput(input);
  // }, [input]);

  function ProfileForm({ className }: React.ComponentProps<"form">) {
    const addEmailToTestingMutation = api.web.addEmailToTesting.useMutation({
      onSuccess: () => {
        toast("Email added to testing list.");
        setOpenPlaystoreTesting(false);
        form.reset();
      },
    });
    const FormSchema = z.object({
      email: z.string().email(),
    });
    const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        email: "",
      },
    });
    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) =>
            addEmailToTestingMutation.mutate(values),
          )}
          className={cn("grid items-start gap-4", className)}
        >
          <FormField
            control={form.control}
            name="email"
            disabled={addEmailToTestingMutation.isPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email address" {...field} />
                </FormControl>
                <FormDescription>
                  We'll send you an invite to join the testing phase.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={
              addEmailToTestingMutation.isPending || !form.formState.isValid
            }
          >
            Submit{addEmailToTestingMutation.isPending ? "ting..." : ""}
          </Button>
        </form>
      </Form>
    );
  }

  return (
    <>
      {isDesktop ? (
        <Dialog
          open={openPlaystoreTesting}
          onOpenChange={setOpenPlaystoreTesting}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Join the testing phase</DialogTitle>
              <DialogDescription>
                Be the first to try out the app. Enter your email to receive an
                invite.
              </DialogDescription>
            </DialogHeader>
            <ProfileForm />
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer
          open={openPlaystoreTesting}
          onOpenChange={setOpenPlaystoreTesting}
        >
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>Join the testing phase</DrawerTitle>
              <DrawerDescription>
                Be the first to try out the app. Enter your email to receive an
                invite.
              </DrawerDescription>
            </DrawerHeader>
            <ProfileForm className="px-4" />
            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
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
              <div className="absolute top-1/2 flex w-full -translate-y-1/2 justify-center gap-x-2">
                <Button
                  className="h-12 rounded-full border-4 border-white !opacity-100 hover:bg-primary active:bg-blue-500 disabled:bg-muted-foreground"
                  disabled={!input.length}
                  onClick={() => {
                    toast(ERROR_MESSAGE);
                    setOutput(ERROR_MESSAGE);
                  }}
                >
                  Translate
                </Button>
                <Button
                  size="icon"
                  className="h-12 w-12 rounded-full border-4 border-white hover:bg-primary active:bg-blue-500"
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
                  <ArrowDownUp size="1.25rem" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-center font-bold">Download Swardify App</p>
              <div className="flex items-center justify-center gap-x-2">
                <button
                  // href="#"
                  // target="_blank"
                  onClick={() => setOpenPlaystoreTesting(true)}
                >
                  <Image
                    src="/playstore-light.png"
                    alt="Playstore"
                    className="object-cover"
                    width={120}
                    height={40}
                  />
                </button>
                <button
                  // href="#"
                  // target="_blank"
                  onClick={() =>
                    toast("Sorry, the app is not available in App Store yet.")
                  }
                >
                  <Image
                    src="/appstore-light.png"
                    alt="Playstore"
                    className="object-cover"
                    width={120}
                    height={40}
                  />
                </button>
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
              <div className="flex items-center gap-x-2">
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search words"
                />
                <Badge variant="outline">
                  {getAllWordsQuery.data?.length ?? 0}
                </Badge>
              </div>

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
              <div className="flex items-center gap-x-2">
                <Input
                  value={phrase}
                  onChange={(e) => setPhrase(e.target.value)}
                  placeholder="Search phrases"
                />
                <Badge variant="outline">
                  {getAllPhrasesQuery.data?.length ?? 0}
                </Badge>
              </div>

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
                className="flex items-center gap-4 rounded-md border border-border p-4"
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
                  <Link
                    href={`mailto:${developer.email}`}
                    className="text-xs text-primary underline"
                  >
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
    </>
  );
}
