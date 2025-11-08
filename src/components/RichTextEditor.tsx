import { useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Underline, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onImagePaste?: (imageData: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor = ({ value, onChange, onImagePaste, placeholder, className }: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        const blob = items[i].getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const imageData = event.target?.result as string;
            if (onImagePaste) {
              onImagePaste(imageData);
            }
            // Insert image into editor
            if (editorRef.current) {
              const img = document.createElement('img');
              img.src = imageData;
              img.style.maxWidth = '100%';
              img.style.height = 'auto';
              img.style.margin = '8px 0';
              editorRef.current.appendChild(img);
            }
          };
          reader.readAsDataURL(blob);
        }
        return;
      }
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="border-b bg-muted/30 p-2 flex gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('bold')}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('italic')}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('underline')}
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <div className="ml-2 text-xs text-muted-foreground flex items-center">
          <ImageIcon className="h-3 w-3 mr-1" />
          Paste images directly
        </div>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onPaste={handlePaste}
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: value }}
        className="min-h-[150px] p-4 outline-none focus:outline-none prose prose-sm max-w-none"
        data-placeholder={placeholder}
        style={{
          ...(value === '' && {
            '--tw-prose-body': 'hsl(var(--muted-foreground))',
          } as React.CSSProperties),
        }}
      />
      <style>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: hsl(var(--muted-foreground));
        }
      `}</style>
    </Card>
  );
};

export default RichTextEditor;
