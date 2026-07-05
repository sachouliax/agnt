export function Pipeline({ steps }: { steps: string[] }) {
  return (
    <div className="flex flex-col">
      {steps.map((step, i) => (
        <div key={step} className="flex flex-col items-stretch">
          <div className="border border-border bg-background px-4 py-3 font-mono text-sm text-foreground">
            <span className="text-yellow-dim">[{i}]</span> {step}
          </div>
          {i < steps.length - 1 && (
            <div className="py-1 pl-6 font-mono text-yellow-dim">│</div>
          )}
        </div>
      ))}
    </div>
  );
}
