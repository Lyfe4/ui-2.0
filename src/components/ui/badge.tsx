import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border transition-colors",
  {
    variants: {
      variant: {
        // Label badges — uppercase pill style
        default:      "border-transparent bg-primary text-primary-foreground px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        secondary:    "border-transparent bg-secondary text-secondary-foreground px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        outline:      "border-border text-foreground px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        muted:        "border-transparent bg-muted text-muted-foreground px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        accent:       "border-transparent bg-primary/10 text-primary-accessible px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        // Numeric notification dot — compact circle
        notification: "border-transparent bg-primary text-primary-foreground h-4 min-w-4 shrink-0 justify-center px-1 text-[10px] font-semibold",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, className }))}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
