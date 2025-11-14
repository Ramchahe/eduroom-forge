import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "@/lib/storage";
import { User, SalaryRecord } from "@/types";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

const AdminSalaryManagement = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [month, setMonth] = useState<string>(new Date().toISOString().slice(0, 7));
  const [basePay, setBasePay] = useState<string>("");
  const [bonus, setBonus] = useState<string>("");
  const [deductions, setDeductions] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const allUsers = useMemo(() => storage.getAllUsers(), []);
  const teachers = useMemo(() => allUsers.filter(u => u.role === 'teacher'), [allUsers]);
  const [records, setRecords] = useState<SalaryRecord[]>(storage.getSalaries());
  const netPay = (Number(basePay || 0) + Number(bonus || 0) - Number(deductions || 0));

  useEffect(() => {
    const current = storage.getCurrentUser();
    if (!current) {
      navigate('/login');
      return;
    }
    if (current.role !== 'admin') {
      toast.error('Access denied. Admins only.');
      navigate('/dashboard');
      return;
    }
    setUser(current);
  }, [navigate]);

  useEffect(() => {
    document.title = 'Salary Management | Admin';
    const desc = 'Manage teacher salaries: create, review, and mark salaries as paid.';
    const meta = document.querySelector('meta[name="description"]') || document.createElement('meta');
    meta.setAttribute('name', 'description');
    meta.setAttribute('content', desc);
    document.head.appendChild(meta);
    const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', window.location.origin + '/admin/salaries');
    document.head.appendChild(canonical);
  }, []);

  const addRecord = () => {
    if (!selectedUserId) return toast.error('Select a teacher');
    if (!basePay) return toast.error('Enter base pay');

    const record: SalaryRecord = {
      id: Date.now().toString(),
      userId: selectedUserId,
      month,
      basePay: Number(basePay),
      bonus: Number(bonus || 0),
      deductions: Number(deductions || 0),
      netPay,
      status: 'pending',
      notes,
      createdAt: new Date().toISOString(),
    };
    storage.addSalary(record as any);
    const updated = storage.getSalaries() as SalaryRecord[];
    setRecords(updated);
    toast.success('Salary record added');
    setBasePay('');
    setBonus('');
    setDeductions('');
    setNotes('');
  };

  const markPaid = (id: string) => {
    storage.updateSalary(id, { status: 'paid', paidAt: new Date().toISOString() });
    setRecords(storage.getSalaries() as SalaryRecord[]);
    toast.success('Marked as paid');
  };

  const removeRecord = (id: string) => {
    storage.deleteSalary(id);
    setRecords(storage.getSalaries() as SalaryRecord[]);
    toast.success('Deleted');
  };

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar user={user} />
        <div className="flex-1 flex flex-col">
          <header className="border-b bg-card shadow-sm sticky top-0 z-10">
            <div className="container mx-auto px-4 py-4 flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-xl font-bold">Salary Management</h1>
            </div>
          </header>
          <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Create Salary</CardTitle>
                <CardDescription>Generate a salary record for a teacher for a specific month.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Teacher</Label>
                    <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select teacher" />
                      </SelectTrigger>
                      <SelectContent>
                        {teachers.map(t => (
                          <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Month</Label>
                    <Input type="month" value={month} onChange={e => setMonth(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Base Pay</Label>
                    <Input inputMode="decimal" value={basePay} onChange={e => setBasePay(e.target.value)} placeholder="e.g. 50000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Bonus (optional)</Label>
                    <Input inputMode="decimal" value={bonus} onChange={e => setBonus(e.target.value)} placeholder="e.g. 5000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Deductions (optional)</Label>
                    <Input inputMode="decimal" value={deductions} onChange={e => setDeductions(e.target.value)} placeholder="e.g. 1000" />
                  </div>
                  <div className="space-y-2 lg:col-span-3">
                    <Label>Notes</Label>
                    <Input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Remarks or payment details" />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Net Pay</div>
                  <div className="text-2xl font-semibold">₹ {netPay.toLocaleString()}</div>
                </div>
                <div className="mt-4">
                  <Button onClick={addRecord}>Add Salary</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>All Salaries</CardTitle>
                <CardDescription>Review and manage salary records.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Teacher</TableHead>
                        <TableHead>Month</TableHead>
                        <TableHead className="text-right">Net</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {records.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground">No salary records yet</TableCell>
                        </TableRow>
                      )}
                      {records.map(r => {
                        const teacher = allUsers.find(u => u.id === r.userId);
                        return (
                          <TableRow key={r.id}>
                            <TableCell>{teacher?.name || '—'}</TableCell>
                            <TableCell>{r.month}</TableCell>
                            <TableCell className="text-right">₹ {r.netPay.toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge variant={r.status === 'paid' ? 'default' : 'secondary'}>{r.status}</Badge>
                            </TableCell>
                            <TableCell className="space-x-2">
                              {r.status !== 'paid' && (
                                <Button size="sm" onClick={() => markPaid(r.id)}>Mark Paid</Button>
                              )}
                              <Button size="sm" variant="outline" onClick={() => removeRecord(r.id)}>Delete</Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminSalaryManagement;
