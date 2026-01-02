import { Brain } from "lucide-react";

export function FooterSection() {
  return (
    <footer className="border-t border-border/60 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-hero text-primary-foreground">
                <Brain className="h-5 w-5" />
              </div>
              <span className="text-xl font-display font-semibold">EduAI</span>
            </div>
            <p className="text-muted-foreground">AI-powered online teaching management software.</p>
          </div>

          <div>
            <h4 className="font-medium">Product</h4>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li>
                <a href="#features" className="transition-colors hover:text-foreground">
                  Modules
                </a>
              </li>
              <li>
                <a href="#pricing" className="transition-colors hover:text-foreground">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#solutions" className="transition-colors hover:text-foreground">
                  Flow
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium">Company</h4>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li>
                <a href="#contact" className="transition-colors hover:text-foreground">
                  Contact
                </a>
              </li>
              <li>
                <a href="#faq" className="transition-colors hover:text-foreground">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium">Legal</h4>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li>
                <a href="#" className="transition-colors hover:text-foreground">
                  Privacy policy
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-foreground">
                  Terms of service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/60 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} EduAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
