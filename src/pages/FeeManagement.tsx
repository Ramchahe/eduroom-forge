import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '@/lib/storage';
import { FeeStructure, FeeRecord, FeeComponent, Payment, User } from '@/types';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Plus, DollarSign, Trash2, CreditCard, Download } from 'lucide-react';

export default function FeeManagement() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [structures, setStructures] = useState<FeeStructure[]>([]);
  const [records, setRecords] = useState<FeeRecord[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [showStructureDialog, setShowStructureDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<FeeRecord | null>(null);

  // Structure form
  const [structureName, setStructureName] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [components, setComponents] = useState<FeeComponent[]>([
    { id: '1', name: 'Tuition Fee', amount: 0, type: 'tuition' }
  ]);

  // Payment form
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online' | 'cheque' | 'card'>('cash');
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => {
    const currentUser = storage.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (currentUser.role === 'student') {
      navigate('/my-fees');
      return;
    }
    setUser(currentUser);
    loadData();
  }, [navigate]);

  const loadData = () => {
    setStructures(storage.getFeeStructures());
    setRecords(storage.getFeeRecords());
    const allUsers = storage.getAllUsers();
    setStudents(allUsers.filter(u => u.role === 'student'));
  };

  const addComponent = () => {
    setComponents([...components, {
      id: Date.now().toString(),
      name: '',
      amount: 0,
      type: 'other',
    }]);
  };

  const updateComponent = (id: string, field: keyof FeeComponent, value: any) => {
    setComponents(components.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const removeComponent = (id: string) => {
    if (components.length > 1) {
      setComponents(components.filter(c => c.id !== id));
    }
  };

  const handleCreateStructure = () => {
    if (!structureName || !academicYear) {
      toast.error('Please fill all required fields');
      return;
    }

    const newStructure: FeeStructure = {
      id: Date.now().toString(),
      name: structureName,
      components: components.filter(c => c.name && c.amount > 0),
      academicYear,
      createdBy: user!.id,
      createdAt: new Date().toISOString(),
    };

    storage.addFeeStructure(newStructure);
    toast.success('Fee structure created');
    resetStructureForm();
    setShowStructureDialog(false);
    loadData();
  };

  const resetStructureForm = () => {
    setStructureName('');
    setAcademicYear('');
    setComponents([{ id: '1', name: 'Tuition Fee', amount: 0, type: 'tuition' }]);
  };

  const handleRecordPayment = () => {
    if (!selectedRecord || !paymentAmount) {
      toast.error('Please enter payment amount');
      return;
    }

    const amount = parseFloat(paymentAmount);
    const newPaidAmount = selectedRecord.paidAmount + amount;

    const newPayment: Payment = {
      id: Date.now().toString(),
      amount,
      date: new Date().toISOString(),
      method: paymentMethod,
      transactionId: transactionId || undefined,
      receiptNumber: `RCP${Date.now()}`,
    };

    const updatedRecord = {
      ...selectedRecord,
      paidAmount: newPaidAmount,
      payments: [...selectedRecord.payments, newPayment],
      status: newPaidAmount >= selectedRecord.totalAmount ? 'paid' : 
              newPaidAmount > 0 ? 'partial' : 'pending',
    };

    storage.updateFeeRecord(selectedRecord.id, updatedRecord);
    toast.success('Payment recorded successfully');
    setShowPaymentDialog(false);
    setSelectedRecord(null);
    setPaymentAmount('');
    setTransactionId('');
    loadData();
  };

  const createFeeRecordsForStructure = (structureId: string) => {
    const structure = structures.find(s => s.id === structureId);
    if (!structure) return;

    const totalAmount = structure.components.reduce((sum, c) => sum + c.amount, 0);
    let created = 0;

    students.forEach(student => {
      const exists = records.some((r: FeeRecord) => 
        r.structureId === structureId && r.studentId === student.id
      );

      if (!exists) {
        const newRecord: FeeRecord = {
          id: Date.now().toString() + student.id,
          studentId: student.id,
          structureId,
          totalAmount,
          paidAmount: 0,
          status: 'pending',
          dueDate: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString(),
          payments: [],
          createdAt: new Date().toISOString(),
        };
        storage.addFeeRecord(newRecord);
        created++;
      }
    });

    toast.success(`Created fee records for ${created} students`);
    loadData();
  };

  const getStudentName = (id: string) => students.find(s => s.id === id)?.name || 'Unknown';
  const getStructureName = (id: string) => structures.find(s => s.id === id)?.name || 'Unknown';

  if (!user) return null;

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <main className="flex-1 w-full p-6">
        <div className="flex items-center gap-4 mb-6">
          <SidebarTrigger />
          <h1 className="text-3xl font-bold text-foreground">Fee Management</h1>
        </div>

        <Tabs defaultValue="records" className="w-full">
          <TabsList>
            <TabsTrigger value="records">Fee Records</TabsTrigger>
            <TabsTrigger value="structures">Fee Structures</TabsTrigger>
          </TabsList>

          <TabsContent value="structures" className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">Create and manage fee structures</p>
              <Dialog open={showStructureDialog} onOpenChange={setShowStructureDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Structure
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create Fee Structure</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Structure Name *</Label>
                        <Input value={structureName} onChange={(e) => setStructureName(e.target.value)} />
                      </div>
                      <div>
                        <Label>Academic Year *</Label>
                        <Input value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} placeholder="2024-2025" />
                      </div>
                    </div>
                    <div>
                      <Label className="mb-2 block">Fee Components</Label>
                      {components.map((comp, idx) => (
                        <div key={comp.id} className="grid grid-cols-12 gap-2 mb-2">
                          <Input
                            className="col-span-4"
                            placeholder="Component name"
                            value={comp.name}
                            onChange={(e) => updateComponent(comp.id, 'name', e.target.value)}
                          />
                          <Input
                            className="col-span-3"
                            type="number"
                            placeholder="Amount"
                            value={comp.amount || ''}
                            onChange={(e) => updateComponent(comp.id, 'amount', parseFloat(e.target.value) || 0)}
                          />
                          <Select value={comp.type} onValueChange={(val) => updateComponent(comp.id, 'type', val)}>
                            <SelectTrigger className="col-span-4">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="tuition">Tuition</SelectItem>
                              <SelectItem value="transport">Transport</SelectItem>
                              <SelectItem value="activities">Activities</SelectItem>
                              <SelectItem value="library">Library</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="col-span-1"
                            onClick={() => removeComponent(comp.id)}
                            disabled={components.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={addComponent}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Component
                      </Button>
                    </div>
                    <div className="pt-4 border-t">
                      <p className="text-lg font-semibold">
                        Total: ₹{components.reduce((sum, c) => sum + (c.amount || 0), 0)}
                      </p>
                    </div>
                    <Button onClick={handleCreateStructure} className="w-full">
                      Create Structure
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {structures.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No fee structures created</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {structures.map((structure: FeeStructure) => (
                  <Card key={structure.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{structure.name}</CardTitle>
                          <CardDescription>Academic Year: {structure.academicYear}</CardDescription>
                        </div>
                        <Button size="sm" onClick={() => createFeeRecordsForStructure(structure.id)}>
                          Apply to Students
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {structure.components.map(comp => (
                          <div key={comp.id} className="flex justify-between items-center">
                            <span className="text-sm">{comp.name}</span>
                            <Badge variant="secondary">₹{comp.amount}</Badge>
                          </div>
                        ))}
                        <div className="flex justify-between items-center pt-2 border-t font-semibold">
                          <span>Total</span>
                          <span>₹{structure.components.reduce((sum, c) => sum + c.amount, 0)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="records" className="space-y-4">
            <p className="text-muted-foreground">Track and manage student fee payments</p>
            
            {records.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No fee records yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {records.map((record: FeeRecord) => (
                  <Card key={record.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{getStudentName(record.studentId)}</CardTitle>
                          <CardDescription>{getStructureName(record.structureId)}</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={
                              record.status === 'paid' ? 'default' :
                              record.status === 'partial' ? 'secondary' :
                              record.status === 'overdue' ? 'destructive' : 'outline'
                            }
                          >
                            {record.status.toUpperCase()}
                          </Badge>
                          {record.status !== 'paid' && (
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedRecord(record);
                                setShowPaymentDialog(true);
                              }}
                            >
                              <CreditCard className="h-4 w-4 mr-2" />
                              Record Payment
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium">Total Amount</p>
                          <p className="text-lg font-semibold">₹{record.totalAmount}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Paid Amount</p>
                          <p className="text-lg font-semibold text-green-600">₹{record.paidAmount}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Pending</p>
                          <p className="text-lg font-semibold text-orange-600">
                            ₹{record.totalAmount - record.paidAmount}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Due Date</p>
                          <p className="text-sm">{new Date(record.dueDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      {record.payments.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2">Payment History:</p>
                          <div className="space-y-1">
                            {record.payments.map(payment => (
                              <div key={payment.id} className="flex justify-between items-center text-sm">
                                <span>
                                  {new Date(payment.date).toLocaleDateString()} - 
                                  {payment.method} {payment.transactionId && `(${payment.transactionId})`}
                                </span>
                                <Badge variant="outline">₹{payment.amount}</Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record Payment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Amount *</Label>
                <Input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="Enter amount"
                />
                {selectedRecord && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Pending: ₹{selectedRecord.totalAmount - selectedRecord.paidAmount}
                  </p>
                )}
              </div>
              <div>
                <Label>Payment Method</Label>
                <Select value={paymentMethod} onValueChange={(val: any) => setPaymentMethod(val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {(paymentMethod === 'online' || paymentMethod === 'cheque') && (
                <div>
                  <Label>Transaction/Cheque ID</Label>
                  <Input
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="Enter reference number"
                  />
                </div>
              )}
              <Button onClick={handleRecordPayment} className="w-full">
                Record Payment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </SidebarProvider>
  );
}