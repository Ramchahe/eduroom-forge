import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "@/lib/storage";
import { User, FeeRecord, FeeStructure, Payment } from "@/types";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, CreditCard, DollarSign, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const StudentFees = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>([]);
  const [structures, setStructures] = useState<FeeStructure[]>([]);

  useEffect(() => {
    const currentUser = storage.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }
    if (currentUser.role !== "student") {
      navigate("/dashboard");
      return;
    }
    setUser(currentUser);
    loadFeeData(currentUser);
  }, [navigate]);

  const loadFeeData = (currentUser: User) => {
    const allRecords = storage.getFeeRecords() as FeeRecord[];
    const userRecords = allRecords.filter(r => r.studentId === currentUser.id);
    setFeeRecords(userRecords);

    const allStructures = storage.getFeeStructures() as FeeStructure[];
    setStructures(allStructures);
  };

  const downloadInvoice = (record: FeeRecord) => {
    // Simple invoice generation
    const structure = structures.find(s => s.id === record.structureId);
    const invoiceContent = `
INVOICE
----------------------------------------
Student ID: ${user?.enrollmentNumber || user?.id}
Student Name: ${user?.name}
Date: ${new Date().toLocaleDateString()}

Fee Structure: ${structure?.name || 'N/A'}
Total Amount: ₹${record.totalAmount}
Paid Amount: ₹${record.paidAmount}
Balance: ₹${record.totalAmount - record.paidAmount}
Status: ${record.status}

Payment History:
${record.payments.map(p => `${new Date(p.date).toLocaleDateString()} - ₹${p.amount} (${p.method}) - Receipt: ${p.receiptNumber}`).join('\n')}

----------------------------------------
Thank you for your payment!
    `;

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${record.id}.txt`;
    a.click();
    toast.success("Invoice downloaded");
  };

  const handlePayment = (record: FeeRecord) => {
    // Simulate payment
    const remainingAmount = record.totalAmount - record.paidAmount;
    const newPayment: Payment = {
      id: Date.now().toString(),
      amount: remainingAmount,
      date: new Date().toISOString(),
      method: 'online',
      transactionId: `TXN${Date.now()}`,
      receiptNumber: `REC${Date.now()}`
    };

    const updatedRecord = {
      ...record,
      paidAmount: record.totalAmount,
      status: 'paid' as const,
      payments: [...record.payments, newPayment]
    };

    storage.updateFeeRecord(record.id, updatedRecord);
    loadFeeData(user!);
    toast.success("Payment successful!");
  };

  const getTotalOutstanding = () => {
    return feeRecords.reduce((sum, r) => sum + (r.totalAmount - r.paidAmount), 0);
  };

  const getTotalPaid = () => {
    return feeRecords.reduce((sum, r) => sum + r.paidAmount, 0);
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
              <h1 className="text-xl font-bold">Fee Payment & Demands</h1>
            </div>
          </header>

          <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{getTotalOutstanding().toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Amount pending</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{getTotalPaid().toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Amount paid</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Records</CardTitle>
                  <CreditCard className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{feeRecords.length}</div>
                  <p className="text-xs text-muted-foreground">Fee records</p>
                </CardContent>
              </Card>
            </div>

            {/* Fee Records */}
            <Card>
              <CardHeader>
                <CardTitle>My Fee Records</CardTitle>
                <CardDescription>View and pay your fee demands</CardDescription>
              </CardHeader>
              <CardContent>
                {feeRecords.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No fee records found
                  </div>
                ) : (
                  <div className="space-y-4">
                    {feeRecords.map((record) => {
                      const structure = structures.find(s => s.id === record.structureId);
                      const remaining = record.totalAmount - record.paidAmount;
                      const isOverdue = new Date(record.dueDate) < new Date() && record.status !== 'paid';

                      return (
                        <Card key={record.id} className={isOverdue ? 'border-destructive' : ''}>
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg">{structure?.name || 'Fee Record'}</CardTitle>
                                <CardDescription>
                                  Due: {new Date(record.dueDate).toLocaleDateString()}
                                </CardDescription>
                              </div>
                              <Badge variant={
                                record.status === 'paid' ? 'default' :
                                record.status === 'overdue' ? 'destructive' :
                                record.status === 'partial' ? 'secondary' : 'outline'
                              }>
                                {record.status}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                  <div className="text-muted-foreground">Total Amount</div>
                                  <div className="font-bold text-lg">₹{record.totalAmount.toLocaleString()}</div>
                                </div>
                                <div>
                                  <div className="text-muted-foreground">Paid</div>
                                  <div className="font-bold text-lg text-green-600">₹{record.paidAmount.toLocaleString()}</div>
                                </div>
                                <div>
                                  <div className="text-muted-foreground">Balance</div>
                                  <div className="font-bold text-lg text-orange-600">₹{remaining.toLocaleString()}</div>
                                </div>
                              </div>

                              {structure && (
                                <div className="border-t pt-4">
                                  <div className="text-sm font-medium mb-2">Fee Components:</div>
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    {structure.components.map(comp => (
                                      <div key={comp.id} className="flex justify-between">
                                        <span className="text-muted-foreground">{comp.name}</span>
                                        <span className="font-medium">₹{comp.amount.toLocaleString()}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {record.payments.length > 0 && (
                                <div className="border-t pt-4">
                                  <div className="text-sm font-medium mb-2">Payment History:</div>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Method</TableHead>
                                        <TableHead>Receipt</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {record.payments.map(payment => (
                                        <TableRow key={payment.id}>
                                          <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                                          <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                                          <TableCell className="capitalize">{payment.method}</TableCell>
                                          <TableCell className="font-mono text-xs">{payment.receiptNumber}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              )}

                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => downloadInvoice(record)}
                                >
                                  <Download className="mr-2 h-4 w-4" />
                                  Download Invoice
                                </Button>
                                {record.status !== 'paid' && (
                                  <Button
                                    size="sm"
                                    onClick={() => handlePayment(record)}
                                  >
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    Pay ₹{remaining.toLocaleString()}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default StudentFees;
