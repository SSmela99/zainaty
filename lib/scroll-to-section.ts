export function scrollToSection(sectionId: string, extraOffset = 0) {
  const target = document.getElementById(sectionId);
  if (!target) {
    return;
  }

  const header = document.querySelector("header");
  const headerHeight = header?.getBoundingClientRect().height ?? 72;
  const top =
    target.getBoundingClientRect().top +
    window.scrollY -
    headerHeight -
    extraOffset;

  window.scrollTo({ top, behavior: "smooth" });
}
