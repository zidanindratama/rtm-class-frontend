"use client";

import type React from "react";
import { CircleHelp, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AssignmentType } from "./assignment-types";
import {
  createEmptyEssayQuestion,
  createEmptyMcqQuestion,
  EssayQuestionDraft,
  McqQuestionDraft,
} from "./assignment-form-utils";

type AssignmentQuestionBuilderSectionProps = {
  assignmentType: AssignmentType;
  mcqQuestions: McqQuestionDraft[];
  essayQuestions: EssayQuestionDraft[];
  setMcqQuestions: React.Dispatch<React.SetStateAction<McqQuestionDraft[]>>;
  setEssayQuestions: React.Dispatch<React.SetStateAction<EssayQuestionDraft[]>>;
  mcqBuilderPage: number;
  essayBuilderPage: number;
  setMcqBuilderPage: React.Dispatch<React.SetStateAction<number>>;
  setEssayBuilderPage: React.Dispatch<React.SetStateAction<number>>;
  builderQuestionPerPage: number;
  canEdit?: boolean;
  titleDescription?: string;
  emptyMessage: string;
  lockedMessage?: string;
  optionalMessage: string;
  showMcqScoringControls?: boolean;
  showEssayPoints?: boolean;
};

export function AssignmentQuestionBuilderSection({
  assignmentType,
  mcqQuestions,
  essayQuestions,
  setMcqQuestions,
  setEssayQuestions,
  mcqBuilderPage,
  essayBuilderPage,
  setMcqBuilderPage,
  setEssayBuilderPage,
  builderQuestionPerPage,
  canEdit = true,
  titleDescription,
  emptyMessage,
  lockedMessage,
  optionalMessage,
  showMcqScoringControls = true,
  showEssayPoints = true,
}: AssignmentQuestionBuilderSectionProps) {
  const isMcqType = assignmentType === "QUIZ_MCQ";
  const isEssayType = assignmentType === "QUIZ_ESSAY";

  const mcqBuilderTotalPages = Math.max(1, Math.ceil(mcqQuestions.length / builderQuestionPerPage));
  const essayBuilderTotalPages = Math.max(1, Math.ceil(essayQuestions.length / builderQuestionPerPage));

  const pagedMcqBuilderQuestions = mcqQuestions.slice(
    (mcqBuilderPage - 1) * builderQuestionPerPage,
    mcqBuilderPage * builderQuestionPerPage,
  );
  const pagedEssayBuilderQuestions = essayQuestions.slice(
    (essayBuilderPage - 1) * builderQuestionPerPage,
    essayBuilderPage * builderQuestionPerPage,
  );

  if (!isMcqType && !isEssayType) {
    return (
      <div className="rounded-xl border border-border/70 bg-background/80 p-4 text-xs text-muted-foreground">
        <p className="inline-flex items-start gap-2">
          <CircleHelp className="mt-0.5 h-4 w-4 text-primary" />
          {optionalMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-xl border border-border/70 bg-background/80 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold">Question Builder</p>
          {titleDescription ? (
            <p className="text-xs text-muted-foreground">{titleDescription}</p>
          ) : null}
        </div>

        {canEdit ? (
          isMcqType ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setMcqQuestions((current) => [...current, createEmptyMcqQuestion()])}
            >
              <Plus className="h-3.5 w-3.5" />
              Add MCQ
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setEssayQuestions((current) => [...current, createEmptyEssayQuestion()])}
            >
              <Plus className="h-3.5 w-3.5" />
              Add Essay
            </Button>
          )
        ) : null}
      </div>

      {!canEdit && lockedMessage ? (
        <div className="rounded-lg border border-dashed border-border/70 bg-muted/30 p-3 text-xs text-muted-foreground">
          {lockedMessage}
        </div>
      ) : null}

      {isMcqType
        ? pagedMcqBuilderQuestions.map((question, index) => (
            <div key={question.id} className="space-y-3 rounded-lg border border-border/70 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium">
                  MCQ #{(mcqBuilderPage - 1) * builderQuestionPerPage + index + 1}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setMcqQuestions((current) => current.filter((item) => item.id !== question.id))
                  }
                  disabled={!canEdit}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>

              <Textarea
                value={question.question}
                onChange={(event) =>
                  setMcqQuestions((current) =>
                    current.map((item) =>
                      item.id === question.id ? { ...item, question: event.target.value } : item,
                    ),
                  )
                }
                placeholder="Question text"
                className="min-h-[75px]"
                disabled={!canEdit}
              />

              <div className="grid gap-2 md:grid-cols-2">
                <Input
                  value={question.optionA}
                  onChange={(event) =>
                    setMcqQuestions((current) =>
                      current.map((item) =>
                        item.id === question.id ? { ...item, optionA: event.target.value } : item,
                      ),
                    )
                  }
                  placeholder="Option A"
                  disabled={!canEdit}
                />
                <Input
                  value={question.optionB}
                  onChange={(event) =>
                    setMcqQuestions((current) =>
                      current.map((item) =>
                        item.id === question.id ? { ...item, optionB: event.target.value } : item,
                      ),
                    )
                  }
                  placeholder="Option B"
                  disabled={!canEdit}
                />
                <Input
                  value={question.optionC}
                  onChange={(event) =>
                    setMcqQuestions((current) =>
                      current.map((item) =>
                        item.id === question.id ? { ...item, optionC: event.target.value } : item,
                      ),
                    )
                  }
                  placeholder="Option C"
                  disabled={!canEdit}
                />
                <Input
                  value={question.optionD}
                  onChange={(event) =>
                    setMcqQuestions((current) =>
                      current.map((item) =>
                        item.id === question.id ? { ...item, optionD: event.target.value } : item,
                      ),
                    )
                  }
                  placeholder="Option D"
                  disabled={!canEdit}
                />
              </div>

              {showMcqScoringControls ? (
                <div className="grid gap-2 md:grid-cols-2">
                  <Select
                    value={question.correctOption}
                    onValueChange={(value) =>
                      setMcqQuestions((current) =>
                        current.map((item) =>
                          item.id === question.id
                            ? { ...item, correctOption: value as "A" | "B" | "C" | "D" }
                            : item,
                        ),
                      )
                    }
                    disabled={!canEdit}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Correct option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Correct: Option A</SelectItem>
                      <SelectItem value="B">Correct: Option B</SelectItem>
                      <SelectItem value="C">Correct: Option C</SelectItem>
                      <SelectItem value="D">Correct: Option D</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    type="number"
                    value={question.points}
                    onChange={(event) =>
                      setMcqQuestions((current) =>
                        current.map((item) =>
                          item.id === question.id ? { ...item, points: event.target.value } : item,
                        ),
                      )
                    }
                    placeholder="Points"
                    disabled={!canEdit}
                  />
                </div>
              ) : null}
            </div>
          ))
        : pagedEssayBuilderQuestions.map((question, index) => (
            <div key={question.id} className="space-y-3 rounded-lg border border-border/70 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium">
                  Essay #{(essayBuilderPage - 1) * builderQuestionPerPage + index + 1}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setEssayQuestions((current) => current.filter((item) => item.id !== question.id))
                  }
                  disabled={!canEdit}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>

              <Textarea
                value={question.question}
                onChange={(event) =>
                  setEssayQuestions((current) =>
                    current.map((item) =>
                      item.id === question.id ? { ...item, question: event.target.value } : item,
                    ),
                  )
                }
                placeholder="Essay question text"
                className="min-h-[75px]"
                disabled={!canEdit}
              />

              <Textarea
                value={question.answerGuide}
                onChange={(event) =>
                  setEssayQuestions((current) =>
                    current.map((item) =>
                      item.id === question.id ? { ...item, answerGuide: event.target.value } : item,
                    ),
                  )
                }
                placeholder="Answer guide / rubric"
                className="min-h-[70px]"
                disabled={!canEdit}
              />

              {showEssayPoints ? (
                <Input
                  type="number"
                  value={question.points}
                  onChange={(event) =>
                    setEssayQuestions((current) =>
                      current.map((item) =>
                        item.id === question.id ? { ...item, points: event.target.value } : item,
                      ),
                    )
                  }
                  placeholder="Points"
                  disabled={!canEdit}
                />
              ) : null}
            </div>
          ))}

      {(isMcqType ? mcqQuestions.length === 0 : essayQuestions.length === 0) ? (
        <div className="rounded-md border border-dashed border-border/70 p-3 text-xs text-muted-foreground">
          {emptyMessage}
        </div>
      ) : null}

      {(isMcqType ? mcqBuilderTotalPages > 1 : essayBuilderTotalPages > 1) ? (
        <div className="flex items-center justify-between gap-2 border-t border-border/60 pt-3">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() =>
              isMcqType
                ? setMcqBuilderPage((current) => Math.max(1, current - 1))
                : setEssayBuilderPage((current) => Math.max(1, current - 1))
            }
            disabled={isMcqType ? mcqBuilderPage <= 1 : essayBuilderPage <= 1}
          >
            Previous
          </Button>
          <p className="text-xs text-muted-foreground">
            Page {isMcqType ? mcqBuilderPage : essayBuilderPage} of{" "}
            {isMcqType ? mcqBuilderTotalPages : essayBuilderTotalPages}
          </p>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() =>
              isMcqType
                ? setMcqBuilderPage((current) => Math.min(mcqBuilderTotalPages, current + 1))
                : setEssayBuilderPage((current) => Math.min(essayBuilderTotalPages, current + 1))
            }
            disabled={
              isMcqType
                ? mcqBuilderPage >= mcqBuilderTotalPages
                : essayBuilderPage >= essayBuilderTotalPages
            }
          >
            Next
          </Button>
        </div>
      ) : null}
    </div>
  );
}
