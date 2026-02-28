"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const services = ["General Consultation", "Dental", "Dermatology", "Cardiology"];
const slots = ["09:00", "10:00", "11:30", "14:00", "15:30", "17:00"];

export default function BookAppointmentPage() {
  const [service, setService] = useState(services[0]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState(false);

  const canSubmit = useMemo(() => Boolean(service && date && time), [service, date, time]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;
    setSuccess(true);
    setNotes("");
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Book Appointment</CardTitle>
          <p className="text-sm text-slate-500">Keep the same booking structure: service, date, slot, notes, confirm.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="service">Service</Label>
                <Select id="service" value={service} onChange={(e) => setService(e.target.value)}>
                  {services.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Available Time Slots</Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
                {slots.map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => setTime(slot)}
                    className={cn(
                      "rounded-xl border px-3 py-2 text-sm transition",
                      time === slot
                        ? "border-primary-600 bg-primary-50 text-primary-700"
                        : "border-slate-200 bg-white text-slate-700 hover:border-primary-200",
                    )}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any details for your appointment..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={!canSubmit}>
              Submit Appointment
            </Button>
          </form>
        </CardContent>
      </Card>

      {success && (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-4 text-sm text-emerald-700">
            ✅ Appointment booked successfully for <strong>{date}</strong> at <strong>{time}</strong> ({service}).
          </CardContent>
        </Card>
      )}
    </div>
  );
}
