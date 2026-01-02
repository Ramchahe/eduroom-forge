import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type BaseProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
};

export function FloatingInput({ id, label, value, onChange, required, type }: BaseProps) {
  return (
    <div className="relative">
      <Input
        id={id}
        type={type}
        placeholder=" "
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="peer h-12 bg-secondary/40 border-border/60 focus-visible:ring-ring/40"
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-3 top-3 text-sm text-muted-foreground transition-all
          peer-focus:-top-2 peer-focus:left-2 peer-focus:text-xs peer-focus:text-foreground
          peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-2
          peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-foreground"
      >
        <span className="rounded bg-background/80 px-1">{label}</span>
      </label>
    </div>
  );
}

export function FloatingTextarea({ id, label, value, onChange, required }: BaseProps) {
  return (
    <div className="relative">
      <Textarea
        id={id}
        placeholder=" "
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="peer min-h-[160px] bg-secondary/40 border-border/60 focus-visible:ring-ring/40"
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-3 top-3 text-sm text-muted-foreground transition-all
          peer-focus:-top-2 peer-focus:left-2 peer-focus:text-xs peer-focus:text-foreground
          peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-2
          peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-foreground"
      >
        <span className="rounded bg-background/80 px-1">{label}</span>
      </label>
    </div>
  );
}
