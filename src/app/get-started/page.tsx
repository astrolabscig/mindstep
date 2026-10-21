import { CardBody } from "@/components/ui/card";
import { Art } from "@/components/visual/art";
import GetStartedForm from "./get-started-form";

export const metadata = { title: "Welcome" };

export default function GetStartedPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="prose-readable mx-auto max-w-2xl text-center">
        <Art name="welcome" priority className="mx-auto mb-4 max-w-[180px]" />
        <h1 className="text-3xl font-semibold tracking-tight text-forest">A few quick questions</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-mist">
          Four optional questions shape your dashboard. If you would rather skip them, you can go
          straight to the dashboard.
        </p>
      </div>
      <GetStartedForm />
      <CardBody className="mx-auto mt-4 max-w-2xl text-center text-xs text-mist">
        MINDSTEP asks nothing about your mood, symptoms, or mental health history. Your answers only
        change which lessons appear first.
      </CardBody>
    </div>
  );
}
