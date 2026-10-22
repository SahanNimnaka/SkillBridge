import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button, getButtonClassName } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/utils";

const palette = [
  { name: "Deep navy", className: "bg-brand text-white" },
  { name: "Bright blue", className: "bg-accent text-white" },
  { name: "Soft neutral", className: "bg-surface-muted text-muted" },
  { name: "Success", className: "bg-success-soft text-success" },
];

export default function HomePage() {
  return (
    <>
      <section className="border-b border-line bg-surface">
        <Container className="grid gap-10 py-14 sm:py-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:items-center lg:gap-16">
          <div>
            <Badge variant="info">Frontend foundation · Phase 2</Badge>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-brand sm:text-5xl lg:text-6xl">
              A clearer path from your skills to the right opportunity.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
              SkillBridge is being built for Sri Lankan university students and
              fresh graduates to discover internships, understand their skill
              match, and close qualification gaps.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#foundation"
                className={getButtonClassName({ size: "lg" })}
              >
                Explore the foundation
              </Link>
              <Link
                href="#components"
                className={getButtonClassName({
                  variant: "outline",
                  size: "lg",
                })}
              >
                View components
              </Link>
            </div>
          </div>

          <div className="rounded-card border border-line bg-canvas p-6 shadow-card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-ink">
                  Design direction
                </p>
                <p className="mt-1 text-sm text-muted">
                  Professional, calm, and built for trust.
                </p>
              </div>
              <Badge variant="success">Ready</Badge>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {palette.map((color) => (
                <div
                  key={color.name}
                  className={cn(
                    "rounded-control border border-line p-3 text-xs font-semibold",
                    color.className,
                  )}
                >
                  {color.name}
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-control border border-line bg-surface p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                Status badges
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="success">Open</Badge>
                <Badge variant="warning">Closing soon</Badge>
                <Badge variant="danger">Expired</Badge>
                <Badge variant="info">New</Badge>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Section id="foundation" aria-labelledby="foundation-heading">
        <Container>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
                Design system
              </p>
              <h2
                id="foundation-heading"
                className="mt-3 text-3xl font-semibold tracking-tight text-brand sm:text-4xl"
              >
                Foundation first, pages next.
              </h2>
              <p className="mt-4 text-base leading-7 text-muted">
                Shared tokens, controls, and layout patterns are ready for the
                next phase of SkillBridge.
              </p>
            </div>
            <Badge variant="neutral" className="w-fit">
              Phase 2 preview
            </Badge>
          </div>

          <div
            id="components"
            className="mt-10 grid scroll-mt-24 gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            <article className="rounded-card border border-line bg-surface p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-ink">Actions</h3>
              <p className="mt-2 text-sm leading-6 text-muted">
                Primary, secondary, and outline buttons share sizing and focus
                behavior.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
              </div>
            </article>

            <article className="rounded-card border border-line bg-surface p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-ink">Status</h3>
              <p className="mt-2 text-sm leading-6 text-muted">
                Badges use accessible colors for opportunity states.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Badge variant="success">Open</Badge>
                <Badge variant="warning">Closing soon</Badge>
                <Badge variant="danger">Expired</Badge>
                <Badge variant="info">New</Badge>
                <Badge variant="neutral">Draft</Badge>
              </div>
            </article>

            <article className="rounded-card border border-line bg-surface p-6 shadow-sm md:col-span-2 lg:col-span-1">
              <h3 className="text-lg font-semibold text-ink">Form controls</h3>
              <p className="mt-2 text-sm leading-6 text-muted">
                Labels are connected to inputs with consistent focus states.
              </p>
              <div className="mt-5">
                <Label htmlFor="foundation-search">Search example</Label>
                <Input
                  id="foundation-search"
                  className="mt-2"
                  placeholder="e.g. Software engineering"
                />
                <p className="mt-2 text-xs leading-5 text-muted">
                  Preview only. Search will be connected on the opportunities
                  page.
                </p>
              </div>
            </article>
          </div>
        </Container>
      </Section>
    </>
  );
}
