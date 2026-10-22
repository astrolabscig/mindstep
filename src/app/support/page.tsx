import { supportServices } from "@/content/support-services";
import { ServiceDirectory } from "@/components/directory/service-directory";
import { Callout } from "@/components/ui/callout";
import { Art } from "@/components/visual/art";

export const metadata = { title: "Find support" };

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <header className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-semibold tracking-tight text-forest">Find support in Ghana</h1>
          <p className="prose-readable mt-3 text-[15px] leading-relaxed text-mist">
            Mental health services, checked against official sources. <strong className="text-correct">Verified</strong> entries show where the details came from. If we could not confirm something, we say so instead of guessing.
          </p>
        </div>
        <Art name="support-connection" priority className="w-full max-w-[180px] shrink-0 animate-float" />
      </header>

      <Callout tone="safety" title="In immediate danger" className="mt-6">
        Call <strong>112</strong> (national emergency). For free, confidential mental health
        support, call the Mental Health Authority on <strong>0800 678 678</strong>. MINDSTEP is
        not an emergency service, and nobody here monitors messages.
      </Callout>

      <div className="mt-8">
        <ServiceDirectory services={supportServices} />
      </div>
    </div>
  );
}
