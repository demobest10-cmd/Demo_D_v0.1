import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      <section className="mx-auto grid w-full max-w-6xl gap-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft md:grid-cols-2 md:p-10">
        <div className="rounded-3xl bg-hero-gradient p-8 text-white md:p-10">
          <p className="mb-3 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">ReserveLink SaaS</p>
          <h1 className="text-3xl font-bold leading-tight md:text-4xl">Book smarter appointments with a clean medical SaaS experience.</h1>
          <p className="mt-4 text-sm text-blue-100 md:text-base">
            Manage services, slots, and patient flow from one modern dashboard. Fully responsive and ready for backend integration.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-blue-100">
            <li>• Professional dashboard UI</li>
            <li>• Fast booking workflow</li>
            <li>• Alerts and appointment tracking</li>
          </ul>
        </div>

        <Card className="h-fit self-center">
          <CardHeader>
            <CardTitle>Login to your workspace</CardTitle>
            <p className="text-sm text-slate-500">Welcome back to your appointment platform.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="name@company.com" defaultValue="admin@reservelink.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" defaultValue="password" />
            </div>
            <Link href="/dashboard" className="block">
              <Button className="w-full">Sign in</Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
