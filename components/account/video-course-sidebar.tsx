"use client";

import { ChevronDownIcon, CirclePlayIcon } from "lucide-react";
import { useMemo, useState } from "react";

import type { UserCurriculumNode } from "@/lib/courses/user-courses.shared";
import { cn } from "@/lib/utils";

type VideoCourseSidebarProps = {
  curriculum: UserCurriculumNode[];
  activeLessonId: string | null;
  onSelectLesson: (lessonId: string, fileId: string) => void;
};

type SidebarNodeProps = {
  node: UserCurriculumNode;
  numberLabel: string;
  depth: number;
  activeLessonId: string | null;
  onSelectLesson: (lessonId: string, fileId: string) => void;
  expandedSections: Set<string>;
  onToggleSection: (sectionId: string) => void;
};

const NESTED_GROUP_CLASS =
  "ml-3 space-y-0.5 border-l border-[#ddd8ce]/90 pl-3 dark:border-[#333333]/80";

function NumberBadge({
  label,
  isActive = false,
}: {
  label: string;
  isActive?: boolean;
}) {
  return (
    <span
      className={cn(
        "shrink-0 tabular-nums text-xs font-bold tracking-tight",
        isActive
          ? "text-[#f24a00] dark:text-[#daff02]/90"
          : "text-zinc-400 dark:text-zinc-500",
      )}
    >
      {label}.
    </span>
  );
}

function SidebarNode({
  node,
  numberLabel,
  depth,
  activeLessonId,
  onSelectLesson,
  expandedSections,
  onToggleSection,
}: SidebarNodeProps) {
  const isSection = node.kind === "section";
  const isExpanded = expandedSections.has(node.id);

  if (isSection) {
    return (
      <div>
        <button
          type="button"
          onClick={() => onToggleSection(node.id)}
          className={cn(
            "flex w-full cursor-pointer items-start gap-2 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-[#f5f2e9] dark:hover:bg-[#151414]",
            depth === 0
              ? "font-black text-zinc-950 dark:text-white"
              : depth === 1
                ? "text-sm font-bold text-zinc-800 dark:text-zinc-200"
                : "text-sm font-semibold text-zinc-700 dark:text-zinc-300",
          )}
        >
          <ChevronDownIcon
            className={cn(
              "mt-0.5 size-4 shrink-0 text-zinc-400 transition-transform",
              isExpanded ? "rotate-0" : "-rotate-90",
            )}
            strokeWidth={2.2}
          />
          <NumberBadge label={numberLabel} />
          <span className="min-w-0 flex-1 break-words leading-snug">
            {node.title}
          </span>
        </button>

        {isExpanded ? (
          <div className={cn(NESTED_GROUP_CLASS, depth === 0 ? "mt-1" : "mt-0.5")}>
            {node.children.map((child, index) => (
              <SidebarNode
                key={child.id}
                node={child}
                numberLabel={`${numberLabel}.${index + 1}`}
                depth={depth + 1}
                activeLessonId={activeLessonId}
                onSelectLesson={onSelectLesson}
                expandedSections={expandedSections}
                onToggleSection={onToggleSection}
              />
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  const isActive = activeLessonId === node.id;
  const isDisabled = !node.fileId;

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={() => {
        if (node.fileId) {
          onSelectLesson(node.id, node.fileId);
        }
      }}
      className={cn(
        "flex w-full cursor-pointer items-start gap-2 rounded-md py-2 pr-2 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        isActive ? "pl-2" : "pl-1",
        isActive
          ? "border-l-2 border-[#f24a00] font-semibold text-zinc-900 dark:border-[#daff02]/80 dark:text-zinc-100"
          : "border-l-2 border-transparent font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-500 dark:hover:bg-[#151414] dark:hover:text-zinc-300",
      )}
    >
      <CirclePlayIcon
        className={cn(
          "mt-0.5 size-3.5 shrink-0",
          isActive
            ? "text-[#f24a00] dark:text-[#daff02]/90"
            : "text-zinc-400 dark:text-zinc-600",
        )}
        strokeWidth={isActive ? 2.2 : 2}
      />
      <NumberBadge label={numberLabel} isActive={isActive} />
      <span className="min-w-0 flex-1 break-words leading-snug">{node.title}</span>
    </button>
  );
}

function collectSectionIds(nodes: UserCurriculumNode[]): string[] {
  const ids: string[] = [];

  function walk(items: UserCurriculumNode[]) {
    for (const item of items) {
      if (item.kind === "section") {
        ids.push(item.id);
        walk(item.children);
      }
    }
  }

  walk(nodes);
  return ids;
}

export function VideoCourseSidebar({
  curriculum,
  activeLessonId,
  onSelectLesson,
}: VideoCourseSidebarProps) {
  const allSectionIds = useMemo(
    () => collectSectionIds(curriculum),
    [curriculum],
  );
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    () => new Set(allSectionIds),
  );

  function handleToggleSection(sectionId: string) {
    setExpandedSections((current) => {
      const next = new Set(current);

      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }

      return next;
    });
  }

  return (
    <aside className="flex h-full flex-col overflow-hidden rounded-3xl border border-[#ddd8ce] bg-white dark:border-[#282828] dark:bg-[#1c1c1c]">
      <div className="border-b border-[#ede8de] px-5 py-4 dark:border-[#2a2a2a]">
        <h2 className="text-sm font-black tracking-[0.12em] text-zinc-500 uppercase dark:text-zinc-400">
          Program kursu
        </h2>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 py-3">
        <div className="divide-y divide-[#ede8de] dark:divide-[#2a2a2a]">
          {curriculum.map((node, index) => (
            <div key={node.id} className="py-2 first:pt-0 last:pb-0">
              <SidebarNode
                node={node}
                numberLabel={`${index + 1}`}
                depth={0}
                activeLessonId={activeLessonId}
                onSelectLesson={onSelectLesson}
                expandedSections={expandedSections}
                onToggleSection={handleToggleSection}
              />
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
