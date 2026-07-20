export type CurriculumNodeKind = "section" | "lesson";

export const MAX_CURRICULUM_SECTION_DEPTH = 3;

export type CurriculumNode = {
  id: string;
  course_id: string;
  parent_id: string | null;
  kind: CurriculumNodeKind;
  title: string;
  description: string;
  sort_order: number;
  r2_object_key: string | null;
  created_at: string;
  children: CurriculumNode[];
};

export type CurriculumNodeFormValues = {
  tempId: string;
  kind: CurriculumNodeKind;
  title: string;
  description: string;
  r2_object_key: string;
  children: CurriculumNodeFormValues[];
};

export type CurriculumNodeInput = {
  kind: CurriculumNodeKind;
  title: string;
  description: string | null;
  r2_object_key: string | null;
  children: CurriculumNodeInput[];
};

let tempIdCounter = 0;

export function createCurriculumTempId(): string {
  tempIdCounter += 1;
  return `curriculum-${Date.now()}-${tempIdCounter}`;
}

export function createEmptySection(): CurriculumNodeFormValues {
  return {
    tempId: createCurriculumTempId(),
    kind: "section",
    title: "",
    description: "",
    r2_object_key: "",
    children: [],
  };
}

export function createEmptyLesson(): CurriculumNodeFormValues {
  return {
    tempId: createCurriculumTempId(),
    kind: "lesson",
    title: "",
    description: "",
    r2_object_key: "",
    children: [],
  };
}

export function createDefaultCurriculum(): CurriculumNodeFormValues[] {
  return [
    {
      ...createEmptySection(),
      title: "Rozdział 1",
      children: [createEmptyLesson()],
    },
  ];
}

export function buildCurriculumTree(
  rows: Array<{
    id: string;
    course_id: string;
    parent_id: string | null;
    kind: CurriculumNodeKind;
    title: string;
    description: string;
    sort_order: number;
    r2_object_key: string | null;
    created_at: string;
  }>,
): CurriculumNode[] {
  const byParent = new Map<string | null, typeof rows>();

  for (const row of rows) {
    const key = row.parent_id;
    const bucket = byParent.get(key) ?? [];
    bucket.push(row);
    byParent.set(key, bucket);
  }

  function build(parentId: string | null): CurriculumNode[] {
    const siblings = (byParent.get(parentId) ?? []).sort(
      (left, right) => left.sort_order - right.sort_order,
    );

    return siblings.map((row) => ({
      id: row.id,
      course_id: row.course_id,
      parent_id: row.parent_id,
      kind: row.kind,
      title: row.title,
      description: row.description,
      sort_order: row.sort_order,
      r2_object_key: row.r2_object_key,
      created_at: row.created_at,
      children: build(row.id),
    }));
  }

  return build(null);
}

export function curriculumTreeToFormValues(
  nodes: CurriculumNode[],
): CurriculumNodeFormValues[] {
  return nodes.map((node) => ({
    tempId: node.id,
    kind: node.kind,
    title: node.title,
    description: node.description,
    r2_object_key: node.r2_object_key ?? "",
    children: curriculumTreeToFormValues(node.children),
  }));
}

export function curriculumFormValuesToInput(
  nodes: CurriculumNodeFormValues[],
): CurriculumNodeInput[] {
  return nodes.map((node) => ({
    kind: node.kind,
    title: node.title.trim(),
    description:
      node.kind === "lesson" ? node.description.trim() || null : null,
    r2_object_key:
      node.kind === "lesson" ? node.r2_object_key.trim() || null : null,
    children: curriculumFormValuesToInput(node.children),
  }));
}

export function flattenCurriculumLessons(
  nodes: CurriculumNodeInput[],
): Array<{ title: string; r2_object_key: string }> {
  const lessons: Array<{ title: string; r2_object_key: string }> = [];

  function walk(items: CurriculumNodeInput[]) {
    for (const item of items) {
      if (item.kind === "lesson" && item.r2_object_key) {
        lessons.push({
          title: item.title,
          r2_object_key: item.r2_object_key,
        });
      }

      if (item.children.length > 0) {
        walk(item.children);
      }
    }
  }

  walk(nodes);
  return lessons;
}

export function countCurriculumLessons(nodes: CurriculumNodeFormValues[]): number {
  return flattenCurriculumLessons(curriculumFormValuesToInput(nodes)).length;
}

type CurriculumValidationResult =
  | { ok: true }
  | { ok: false; error: string };

export function validateCurriculumTree(
  nodes: CurriculumNodeFormValues[],
  sectionDepth = 0,
): CurriculumValidationResult {
  if (nodes.length === 0 && sectionDepth === 0) {
    return { ok: false, error: "Dodaj co najmniej jeden rozdział lub lekcję." };
  }

  for (const node of nodes) {
    if (!node.title.trim()) {
      return {
        ok: false,
        error:
          node.kind === "section"
            ? "Każdy rozdział musi mieć nazwę."
            : "Każda lekcja musi mieć nazwę.",
      };
    }

    if (node.kind === "lesson") {
      if (!node.r2_object_key.trim()) {
        return { ok: false, error: "Każda lekcja wideo musi mieć plik R2." };
      }

      if (node.children.length > 0) {
        return { ok: false, error: "Lekcja nie może zawierać podpozycji." };
      }

      continue;
    }

    // sectionDepth: 0 = rozdział, 1 = podrozdział, 2 = podpodrozdział
    // Dopiero głębszy (4.) poziom sekcji jest zabroniony.
    if (sectionDepth >= MAX_CURRICULUM_SECTION_DEPTH) {
      return {
        ok: false,
        error: "Maksymalnie 3 poziomy rozdziałów (rozdział → podrozdział → podpodrozdział).",
      };
    }

    if (node.children.length === 0) {
      return {
        ok: false,
        error: `Rozdział „${node.title.trim()}” musi zawierać lekcje lub podrozdziały.`,
      };
    }

    const childValidation = validateCurriculumTree(
      node.children,
      sectionDepth + 1,
    );

    if (!childValidation.ok) {
      return childValidation;
    }
  }

  if (sectionDepth === 0 && countCurriculumLessons(nodes) === 0) {
    return { ok: false, error: "Dodaj co najmniej jedną lekcję wideo." };
  }

  return { ok: true };
}

export function getSectionDepthLabel(depth: number): string {
  if (depth === 0) return "Rozdział";
  if (depth === 1) return "Podrozdział";
  return "Podpodrozdział";
}

export function reorderSiblingNodes<T extends { tempId: string }>(
  siblings: T[],
  activeId: string,
  overId: string,
): T[] {
  const fromIndex = siblings.findIndex((item) => item.tempId === activeId);
  const toIndex = siblings.findIndex((item) => item.tempId === overId);

  if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) {
    return siblings;
  }

  const next = [...siblings];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

export function updateCurriculumNode(
  nodes: CurriculumNodeFormValues[],
  tempId: string,
  updater: (node: CurriculumNodeFormValues) => CurriculumNodeFormValues,
): CurriculumNodeFormValues[] {
  return nodes.map((node) => {
    if (node.tempId === tempId) {
      return updater(node);
    }

    if (node.children.length === 0) {
      return node;
    }

    return {
      ...node,
      children: updateCurriculumNode(node.children, tempId, updater),
    };
  });
}

export function removeCurriculumNode(
  nodes: CurriculumNodeFormValues[],
  tempId: string,
): CurriculumNodeFormValues[] {
  return nodes
    .filter((node) => node.tempId !== tempId)
    .map((node) => ({
      ...node,
      children: removeCurriculumNode(node.children, tempId),
    }));
}

export function reorderCurriculumSiblings(
  nodes: CurriculumNodeFormValues[],
  parentTempId: string | null,
  activeId: string,
  overId: string,
): CurriculumNodeFormValues[] {
  if (parentTempId === null) {
    return reorderSiblingNodes(nodes, activeId, overId);
  }

  return nodes.map((node) => {
    if (node.tempId === parentTempId) {
      return {
        ...node,
        children: reorderSiblingNodes(node.children, activeId, overId),
      };
    }

    if (node.children.length === 0) {
      return node;
    }

    return {
      ...node,
      children: reorderCurriculumSiblings(
        node.children,
        parentTempId,
        activeId,
        overId,
      ),
    };
  });
}

export function addCurriculumChild(
  nodes: CurriculumNodeFormValues[],
  parentTempId: string | null,
  child: CurriculumNodeFormValues,
): CurriculumNodeFormValues[] {
  if (parentTempId === null) {
    return [...nodes, child];
  }

  return nodes.map((node) => {
    if (node.tempId === parentTempId) {
      return {
        ...node,
        children: [...node.children, child],
      };
    }

    if (node.children.length === 0) {
      return node;
    }

    return {
      ...node,
      children: addCurriculumChild(node.children, parentTempId, child),
    };
  });
}
