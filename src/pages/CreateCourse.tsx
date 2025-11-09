import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload, Save } from "lucide-react";
import { toast } from "sonner";
import RichTextEditor from "@/components/RichTextEditor";

const CreateCourse = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [planType, setPlanType] = useState<'free' | 'paid'>('free');
  const [price, setPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateDiscount = () => {
    if (price && discountedPrice) {
      const p = parseFloat(price);
      const dp = parseFloat(discountedPrice);
      if (p > 0 && dp > 0 && dp < p) {
        return Math.round(((p - dp) / p) * 100);
      }
    }
    return 0;
  };

  const handleSubmit = () => {
    if (!title || !description) {
      toast.error("Please fill all required fields");
      return;
    }

    if (planType === 'paid' && (!price || parseFloat(price) <= 0)) {
      toast.error("Please enter a valid price");
      return;
    }

    const user = storage.getCurrentUser();
    if (!user) return;

    const course = {
      id: Date.now().toString(),
      title,
      description,
      thumbnail,
      planType,
      ...(planType === 'paid' && {
        price: parseFloat(price),
        discountedPrice: discountedPrice ? parseFloat(discountedPrice) : undefined,
      }),
      category,
      level,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
      quizzes: [],
      enrolledStudents: [],
    };

    storage.addCourse(course);
    toast.success("Course created successfully!");
    navigate("/dashboard");
  };

  const discountPercentage = calculateDiscount();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Create New Course</CardTitle>
            <CardDescription>Fill in the details to create a new course</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Introduction to Web Development"
              />
            </div>

            <div className="space-y-2">
              <Label>Course Description *</Label>
              <RichTextEditor
                value={description}
                onChange={setDescription}
                placeholder="Describe your course..."
              />
            </div>

            <div className="space-y-2">
              <Label>Course Thumbnail</Label>
              <div className="flex items-center gap-4">
                {thumbnail && (
                  <img src={thumbnail} alt="Thumbnail" className="w-32 h-32 object-cover rounded-lg border" />
                )}
                <div>
                  <Input
                    id="thumbnail"
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('thumbnail')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {thumbnail ? 'Change' : 'Upload'} Thumbnail
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Programming, Design, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
              <div className="space-y-2">
                <Label>Plan Type *</Label>
                <Select value={planType} onValueChange={(value: 'free' | 'paid') => setPlanType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {planType === 'paid' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="99.99"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discountedPrice">Discounted Price</Label>
                    <Input
                      id="discountedPrice"
                      type="number"
                      step="0.01"
                      value={discountedPrice}
                      onChange={(e) => setDiscountedPrice(e.target.value)}
                      placeholder="79.99"
                    />
                  </div>
                </div>
              )}

              {planType === 'paid' && discountPercentage > 0 && (
                <div className="p-3 bg-success/10 border border-success/20 rounded-md">
                  <p className="text-sm font-medium text-success">
                    {discountPercentage}% discount applied!
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Students save ${(parseFloat(price) - parseFloat(discountedPrice)).toFixed(2)}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleSubmit} className="flex-1">
                <Save className="mr-2 h-4 w-4" />
                Create Course
              </Button>
              <Button variant="outline" onClick={() => navigate("/dashboard")}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CreateCourse;
