import { ReactNode } from "react";
import { HeaderModern } from "./HeaderModern";
import { FooterModern } from "./FooterModern";
import { ScrollIndicator } from "@/components/ScrollIndicator";

interface LayoutModernProps {
  children: ReactNode;
}

export function LayoutModern({ children }: LayoutModernProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white font-poppins">
      <HeaderModern />
      <main className="flex-1 pt-16">{children}</main>
      <FooterModern />
      <ScrollIndicator variant="modern" />
    </div>
  );
}
