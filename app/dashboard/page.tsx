import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const appointments = [
  { id: 1, patient: "Emma Thomas", service: "Dental Checkup", date: "2026-03-02", time: "10:30" },
  { id: 2, patient: "Noah Wilson", service: "Cardiology", date: "2026-03-03", time: "14:00" },
  { id: 3, patient: "Olivia Brown", service: "Dermatology", date: "2026-03-04", time: "16:00" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
          <p className="text-sm text-slate-500">Overview of your upcoming appointments and actions.</p>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">Total upcoming appointments</p>
            <p className="text-3xl font-bold text-primary-700">{appointments.length}</p>
          </div>
          <Link href="/dashboard/book">
            <Button>Book New Appointment</Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Appointments (Dummy Data)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="rounded-xl border border-slate-200 p-4">
              <p className="font-semibold">{appointment.service}</p>
              <p className="text-sm text-slate-600">Patient: {appointment.patient}</p>
              <p className="text-sm text-slate-600">
                {appointment.date} at {appointment.time}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
