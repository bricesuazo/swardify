"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { RouterOutputs } from "@swardify/api";
import { Button } from "@swardify/ui/button";
import { ScrollArea } from "@swardify/ui/scroll-area";
import { Separator } from "@swardify/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@swardify/ui/tabs";

import { api } from "~/trpc/client";

export default function Contributions() {
  const [type, setType] = useState("ongoing");
  const getAllWordContributionsQuery =
    api.web.getAllWordContributions.useQuery();

  if (!getAllWordContributionsQuery.data)
    return (
      <div className="p-4">
        <Loader2 className="animate-spin" />
      </div>
    );

  const items = getAllWordContributionsQuery.data.filter((contribution) =>
    type === "approved"
      ? contribution.approved_at
      : type === "declined"
        ? contribution.declined_at
        : type === "deleted"
          ? contribution.deleted_at
          : !contribution.approved_at &&
            !contribution.declined_at &&
            !contribution.deleted_at,
  );
  return (
    <div className="space-y-4">
      <Tabs value={type} onValueChange={(e) => setType(e)}>
        <TabsList>
          <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="declined">Declined</TabsTrigger>
          <TabsTrigger value="deleted">Deleted</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="max-w-96">
        <ScrollArea viewportClassName="max-h-[40rem]">
          <div className="space-y-2">
            {items.length === 0 ? (
              <div className="p-4">
                <p className="text-center">No {type} contributions</p>
              </div>
            ) : (
              items.map((contribution) => (
                <Contribution contribution={contribution} type={type} />
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

function Contribution({
  contribution,
  type,
}: {
  contribution: RouterOutputs["web"]["getAllWordContributions"][number];
  type: string;
}) {
  const utils = api.useUtils();
  const toggleDeleteWordContributionMutation =
    api.web.toggleDeleteWordContribution.useMutation({
      onSuccess: () => utils.web.getAllWordContributions.invalidate(),
    });
  const toggleUpdateWordContributionMutation =
    api.web.toggleUpdateWordContribution.useMutation({
      onSuccess: () => utils.web.getAllWordContributions.invalidate(),
    });

  return (
    <div className="space-y-2 rounded-md border p-4">
      <h2 className="text-center text-2xl font-semibold">
        {contribution.vote_count}
      </h2>
      <div className="flex gap-x-2">
        <div className="flex-1">
          <p>{contribution.swardspeak_words.join(" / ")}</p>
        </div>
        <div>
          <Separator orientation="vertical" />
        </div>
        <div className="flex-1">
          <p className="text-right">
            {contribution.translated_words.join(" / ")}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium">{contribution.user?.email}</p>
      </div>

      <div className="space-y-2">
        {type === "ongoing" && (
          <div className="flex gap-x-2">
            <Button
              size="sm"
              className="flex-1"
              disabled={
                toggleUpdateWordContributionMutation.isPending &&
                toggleUpdateWordContributionMutation.variables.update ===
                  "approved"
              }
              onClick={() =>
                toggleUpdateWordContributionMutation.mutate({
                  id: contribution.id,
                  update: "approved",
                })
              }
            >
              {toggleUpdateWordContributionMutation.isPending &&
              toggleUpdateWordContributionMutation.variables.update ===
                "approved" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {contribution.approved_at ? "Una" : "A"}pproving...
                </>
              ) : (
                <>{contribution.approved_at ? "Unapprove" : "Approve"}</>
              )}
            </Button>
            <Button
              size="sm"
              className="flex-1"
              disabled={
                toggleUpdateWordContributionMutation.isPending &&
                toggleUpdateWordContributionMutation.variables.update ===
                  "declined"
              }
              onClick={() =>
                toggleUpdateWordContributionMutation.mutate({
                  id: contribution.id,
                  update: "declined",
                })
              }
            >
              {toggleUpdateWordContributionMutation.isPending &&
              toggleUpdateWordContributionMutation.variables.update ===
                "declined" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {contribution.declined_at ? "Und" : "D"}eclining...
                </>
              ) : (
                <>{contribution.declined_at ? "Undecline" : "Decline"}</>
              )}
            </Button>
          </div>
        )}

        <Button
          variant="destructive"
          size="sm"
          className="w-full"
          disabled={toggleDeleteWordContributionMutation.isPending}
          onClick={() =>
            toggleDeleteWordContributionMutation.mutate({
              id: contribution.id,
            })
          }
        >
          {!toggleDeleteWordContributionMutation.isPending ? (
            <>{contribution.deleted_at ? "Undelete" : "Delete"}</>
          ) : (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {contribution.deleted_at ? "Und" : "D"}eleting...
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
