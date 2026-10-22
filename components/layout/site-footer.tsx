import { Container } from "@/components/ui/container";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <Container className="flex flex-col gap-2 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="font-semibold text-ink">SkillBridge</span>
          <span aria-hidden="true"> · </span>
          Internship matching for Sri Lankan students.
        </p>
        <p>Phase 2 · Frontend foundation</p>
      </Container>
    </footer>
  );
}
