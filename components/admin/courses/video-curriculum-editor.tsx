"use client";

import {
  ChevronDownIcon,
  ChevronRightIcon,
  FolderPlusIcon,
  GripVerticalIcon,
  PlusIcon,
  Trash2Icon,
  VideoIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { listR2Files, type R2FileItem } from "@/app/admin/actions/r2-files";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  addCurriculumChild,
  createCurriculumTempId,
  createEmptyLesson,
  createEmptySection,
  getSectionDepthLabel,
  MAX_CURRICULUM_SECTION_DEPTH,
  removeCurriculumNode,
  reorderCurriculumSiblings,
  updateCurriculumNode,
  type CurriculumNodeFormValues,
} from "@/lib/courses/curriculum";
import { isVideoR2Key } from "@/components/admin/r2-files/r2-files.utils";
import { cn } from "@/lib/utils";

import { R2FileUploader } from "./r2-file-uploader";

type VideoCurriculumEditorProps = {
  value: CurriculumNodeFormValues[];
  onChange: (value: CurriculumNodeFormValues[]) => void;
  error?: string;
  courseSlug: string;
};

type DragState = {
  parentTempId: string | null;
  activeId: string;
} | null;

type CurriculumNodeRowProps = {
  node: CurriculumNodeFormValues;
  depth: number;
  sectionDepth: number;
  parentTempId: string | null;
  courseSlug: string;
  libraryOptions: R2FileItem[];
  collapsed: Set<string>;
  onToggleCollapse: (tempId: string) => void;
  onChange: (value: CurriculumNodeFormValues[]) => void;
  value: CurriculumNodeFormValues[];
  dragState: DragState;
  onDragStart: (parentTempId: string | null, activeId: string) => void;
  onDragOver: (event: React.DragEvent) => void;
  onDrop: (parentTempId: string | null, overId: string) => void;
  onDragEnd: () => void;
};

function CurriculumNodeRow({
  node,
  depth,
  sectionDepth,
  parentTempId,
  courseSlug,
  libraryOptions,
  collapsed,
  onToggleCollapse,
  onChange,
  value,
  dragState,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: CurriculumNodeRowProps) {
  const isSection = node.kind === "section";
  const isCollapsed = collapsed.has(node.tempId);
  const canAddSubSection =
    isSection && sectionDepth < MAX_CURRICULUM_SECTION_DEPTH - 1;
  const isDragging = dragState?.activeId === node.tempId;

  function patchNode(patch: Partial<CurriculumNodeFormValues>) {
    onChange(
      updateCurriculumNode(value, node.tempId, (current) => ({
        ...current,
        ...patch,
      })),
    );
  }

  function handleRemove() {
    onChange(removeCurriculumNode(value, node.tempId));
  }

  function handleAddLesson() {
    onChange(addCurriculumChild(value, node.tempId, createEmptyLesson()));
  }

  function handleAddSubSection() {
    onChange(addCurriculumChild(value, node.tempId, createEmptySection()));
  }

  return (
    <div className="space-y-2">
      <div
        draggable
        onDragStart={() => onDragStart(parentTempId, node.tempId)}
        onDragOver={onDragOver}
        onDrop={() => onDrop(parentTempId, node.tempId)}
        onDragEnd={onDragEnd}
        className={cn(
          "rounded-2xl border p-3 transition-opacity",
          isDragging
            ? "border-[#f24a00]/50 bg-[#fff4f0] opacity-60 dark:border-[#daff02]/40 dark:bg-[#3a4500]/40"
            : "border-zinc-200 bg-white dark:border-zinc-700 dark:bg-[#151414]",
        )}
        style={{ marginLeft: `${depth * 16}px` }}
      >
        <div className="flex items-start gap-2">
          <button
            type="button"
            aria-label="Przeciągnij, aby zmienić kolejność"
            className="mt-2 inline-flex size-8 shrink-0 cursor-grab items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 active:cursor-grabbing dark:hover:bg-zinc-800"
          >
            <GripVerticalIcon className="size-4" />
          </button>

          {isSection ? (
            <button
              type="button"
              onClick={() => onToggleCollapse(node.tempId)}
              className="mt-2 inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              {isCollapsed ? (
                <ChevronRightIcon className="size-4" />
              ) : (
                <ChevronDownIcon className="size-4" />
              )}
            </button>
          ) : (
            <span className="mt-2 inline-flex size-8 shrink-0 items-center justify-center text-[#f24a00] dark:text-[#daff02]">
              <VideoIcon className="size-4" />
            </span>
          )}

          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#dfe5ff] px-2.5 py-1 text-[11px] font-bold tracking-[0.08em] text-[#0033ff] uppercase dark:bg-[#1a2a5e] dark:text-[#6688ff]">
                {isSection
                  ? getSectionDepthLabel(sectionDepth)
                  : "Lekcja wideo"}
              </span>
            </div>

            <Input
              value={node.title}
              onChange={(event) => patchNode({ title: event.target.value })}
              placeholder={
                isSection ? "np. Wprowadzenie do AI" : "np. Lekcja 1 — Start"
              }
              className="h-11 rounded-xl border-zinc-200 bg-white px-3.5 text-sm dark:border-zinc-700 dark:bg-[#151414]"
            />

            {!isSection ? (
              <Textarea
                value={node.description}
                onChange={(event) =>
                  patchNode({ description: event.target.value })
                }
                placeholder="Krótki opis lekcji — o czym jest wideo, co przygotować, co ćwiczyć po obejrzeniu."
                rows={3}
                className="rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm dark:border-zinc-700 dark:bg-[#151414]"
              />
            ) : null}

            {!isSection ? (
              <div className="space-y-3 rounded-xl border border-dashed border-zinc-200 p-3 dark:border-zinc-700">
                <R2FileUploader
                  courseSlug={courseSlug}
                  kind="video"
                  onUploaded={(objectKey, filename) => {
                    patchNode({
                      r2_object_key: objectKey,
                      title:
                        node.title.trim() || filename.replace(/\.[^.]+$/, ""),
                    });
                  }}
                />

                {libraryOptions.length > 0 ? (
                  <select
                    value={
                      libraryOptions.some(
                        (option) => option.key === node.r2_object_key,
                      )
                        ? node.r2_object_key
                        : ""
                    }
                    onChange={(event) => {
                      const key = event.target.value;
                      if (!key) return;
                      const filename = key.split("/").pop() ?? key;
                      patchNode({
                        r2_object_key: key,
                        title:
                          node.title.trim() || filename.replace(/\.[^.]+$/, ""),
                      });
                    }}
                    className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-sm dark:border-zinc-700 dark:bg-[#151414]"
                  >
                    <option value="">— wybierz z biblioteki R2 —</option>
                    {libraryOptions.map((option) => (
                      <option key={option.key} value={option.key}>
                        {option.key}
                      </option>
                    ))}
                  </select>
                ) : null}

                <Input
                  value={node.r2_object_key}
                  onChange={(event) =>
                    patchNode({ r2_object_key: event.target.value })
                  }
                  placeholder="videos/slug/lekcja.mp4"
                  className="h-11 rounded-xl border-zinc-200 bg-white px-3.5 text-sm dark:border-zinc-700 dark:bg-[#151414]"
                />
              </div>
            ) : null}

            {isSection ? (
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddLesson}
                  className="rounded-xl"
                >
                  <PlusIcon className="size-4" />
                  Dodaj lekcję
                </Button>
                {canAddSubSection ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddSubSection}
                    className="rounded-xl"
                  >
                    <FolderPlusIcon className="size-4" />
                    Dodaj podrozdział
                  </Button>
                ) : null}
              </div>
            ) : null}
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleRemove}
            aria-label="Usuń pozycję"
            className="size-11 shrink-0 rounded-xl"
          >
            <Trash2Icon className="size-4" />
          </Button>
        </div>
      </div>

      {isSection && !isCollapsed && node.children.length > 0 ? (
        <CurriculumNodeList
          nodes={node.children}
          depth={depth + 1}
          sectionDepth={sectionDepth + 1}
          parentTempId={node.tempId}
          courseSlug={courseSlug}
          libraryOptions={libraryOptions}
          collapsed={collapsed}
          onToggleCollapse={onToggleCollapse}
          onChange={onChange}
          value={value}
          dragState={dragState}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onDragEnd={onDragEnd}
        />
      ) : null}
    </div>
  );
}

type CurriculumNodeListProps = {
  nodes: CurriculumNodeFormValues[];
  depth: number;
  sectionDepth: number;
  parentTempId: string | null;
  courseSlug: string;
  libraryOptions: R2FileItem[];
  collapsed: Set<string>;
  onToggleCollapse: (tempId: string) => void;
  onChange: (value: CurriculumNodeFormValues[]) => void;
  value: CurriculumNodeFormValues[];
  dragState: DragState;
  onDragStart: (parentTempId: string | null, activeId: string) => void;
  onDragOver: (event: React.DragEvent) => void;
  onDrop: (parentTempId: string | null, overId: string) => void;
  onDragEnd: () => void;
};

function CurriculumNodeList({
  nodes,
  depth,
  sectionDepth,
  parentTempId,
  courseSlug,
  libraryOptions,
  collapsed,
  onToggleCollapse,
  onChange,
  value,
  dragState,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: CurriculumNodeListProps) {
  return (
    <div className="space-y-2">
      {nodes.map((node) => (
        <CurriculumNodeRow
          key={node.tempId}
          node={node}
          depth={depth}
          sectionDepth={node.kind === "section" ? sectionDepth : sectionDepth}
          parentTempId={parentTempId}
          courseSlug={courseSlug}
          libraryOptions={libraryOptions}
          collapsed={collapsed}
          onToggleCollapse={onToggleCollapse}
          onChange={onChange}
          value={value}
          dragState={dragState}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onDragEnd={onDragEnd}
        />
      ))}
    </div>
  );
}

export function VideoCurriculumEditor({
  value,
  onChange,
  error,
  courseSlug,
}: VideoCurriculumEditorProps) {
  const [libraryFiles, setLibraryFiles] = useState<R2FileItem[]>([]);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [dragState, setDragState] = useState<DragState>(null);

  useEffect(() => {
    let active = true;

    void listR2Files().then((result) => {
      if (active && result.ok) {
        setLibraryFiles(result.data);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const libraryOptions = useMemo(
    () => libraryFiles.filter((file) => isVideoR2Key(file.key)),
    [libraryFiles],
  );

  function toggleCollapse(tempId: string) {
    setCollapsed((current) => {
      const next = new Set(current);
      if (next.has(tempId)) {
        next.delete(tempId);
      } else {
        next.add(tempId);
      }
      return next;
    });
  }

  function handleDragStart(parentTempId: string | null, activeId: string) {
    setDragState({ parentTempId, activeId });
  }

  function handleDragOver(event: React.DragEvent) {
    event.preventDefault();
  }

  function handleDrop(parentTempId: string | null, overId: string) {
    if (!dragState || dragState.parentTempId !== parentTempId) {
      setDragState(null);
      return;
    }

    onChange(
      reorderCurriculumSiblings(
        value,
        parentTempId,
        dragState.activeId,
        overId,
      ),
    );
    setDragState(null);
  }

  function handleDragEnd() {
    setDragState(null);
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold tracking-[0.02em] text-zinc-800 dark:text-zinc-100">
          Program kursu wideo
        </p>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Ułóż strukturę jak na Udemy: rozdział → podrozdział → podpodrozdział →
          lekcje wideo. Przeciągnij pozycje, aby zmienić kolejność w obrębie tego
          samego poziomu.
        </p>
      </div>

      {value.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-zinc-200 px-4 py-6 text-sm text-zinc-500 dark:border-zinc-700">
          Dodaj pierwszy rozdział, aby zacząć budować program kursu.
        </p>
      ) : (
        <CurriculumNodeList
          nodes={value}
          depth={0}
          sectionDepth={0}
          parentTempId={null}
          courseSlug={courseSlug}
          libraryOptions={libraryOptions}
          collapsed={collapsed}
          onToggleCollapse={toggleCollapse}
          onChange={onChange}
          value={value}
          dragState={dragState}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragEnd={handleDragEnd}
        />
      )}

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => onChange([...value, createEmptySection()])}
          className="h-10 rounded-xl"
        >
          <FolderPlusIcon className="size-4" />
          Dodaj rozdział
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => onChange([...value, createEmptyLesson()])}
          className="h-10 rounded-xl"
        >
          <PlusIcon className="size-4" />
          Dodaj lekcję na najwyższym poziomie
        </Button>
      </div>

      {error ? (
        <p
          className="text-xs font-medium text-red-500 dark:text-red-400"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function filesToCurriculumFallback(
  files: Array<{ title: string; r2_object_key: string }>,
): CurriculumNodeFormValues[] {
  if (files.length === 0) {
    return [
      {
        tempId: createCurriculumTempId(),
        kind: "section",
        title: "Rozdział 1",
        description: "",
        r2_object_key: "",
        children: [createEmptyLesson()],
      },
    ];
  }

  return [
    {
      tempId: createCurriculumTempId(),
      kind: "section",
      title: "Program kursu",
      description: "",
      r2_object_key: "",
      children: files.map((file) => ({
        tempId: createCurriculumTempId(),
        kind: "lesson" as const,
        title: file.title,
        description: "",
        r2_object_key: file.r2_object_key,
        children: [],
      })),
    },
  ];
}
