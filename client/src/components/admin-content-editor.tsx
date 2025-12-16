import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Check, X, Settings, ChevronDown, ChevronUp } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";

interface AdminContentEditorProps {
  isAdmin: boolean;
  adminPassword: string | null;
}

interface ContentSection {
  label: string;
  keys: { key: string; label: string; multiline?: boolean }[];
}

const contentSections: ContentSection[] = [
  {
    label: "Hero Section",
    keys: [
      { key: "hero_title", label: "Title" },
      { key: "hero_name", label: "Name" },
      { key: "hero_subtitle", label: "Subtitle" },
      { key: "hero_signature", label: "Signature" },
    ],
  },
  {
    label: "Message Section",
    keys: [
      { key: "message_greeting", label: "Greeting" },
      { key: "message_para1", label: "Paragraph 1", multiline: true },
      { key: "message_para2", label: "Paragraph 2", multiline: true },
      { key: "message_quote", label: "Quote" },
      { key: "message_quote_attribution", label: "Quote Attribution" },
    ],
  },
  {
    label: "Things I Want You to Know",
    keys: [
      { key: "things_title", label: "Title" },
      { key: "things_subtitle", label: "Subtitle" },
      { key: "love_message_1", label: "Message 1" },
      { key: "love_message_2", label: "Message 2" },
      { key: "love_message_3", label: "Message 3" },
      { key: "love_message_4", label: "Message 4" },
      { key: "love_message_5", label: "Message 5" },
    ],
  },
  {
    label: "Why I Love You",
    keys: [
      { key: "reasons_title", label: "Title" },
      { key: "reasons_subtitle", label: "Subtitle" },
      { key: "reason_1", label: "Reason 1" },
      { key: "reason_2", label: "Reason 2" },
      { key: "reason_3", label: "Reason 3" },
      { key: "reason_4", label: "Reason 4" },
      { key: "reason_5", label: "Reason 5" },
      { key: "reason_6", label: "Reason 6" },
      { key: "reason_7", label: "Reason 7" },
      { key: "reason_8", label: "Reason 8" },
    ],
  },
  {
    label: "Birthday Wishes",
    keys: [
      { key: "wishes_title", label: "Title" },
      { key: "wishes_subtitle", label: "Subtitle" },
      { key: "wish_1_title", label: "Wish 1 Title" },
      { key: "wish_1_text", label: "Wish 1 Text", multiline: true },
      { key: "wish_2_title", label: "Wish 2 Title" },
      { key: "wish_2_text", label: "Wish 2 Text", multiline: true },
      { key: "wish_3_title", label: "Wish 3 Title" },
      { key: "wish_3_text", label: "Wish 3 Text", multiline: true },
      { key: "wish_4_title", label: "Wish 4 Title" },
      { key: "wish_4_text", label: "Wish 4 Text", multiline: true },
      { key: "wish_5_title", label: "Wish 5 Title" },
      { key: "wish_5_text", label: "Wish 5 Text", multiline: true },
      { key: "wish_6_title", label: "Wish 6 Title" },
      { key: "wish_6_text", label: "Wish 6 Text", multiline: true },
    ],
  },
  {
    label: "Our Dreams Together",
    keys: [
      { key: "dreams_title", label: "Title" },
      { key: "dreams_subtitle", label: "Subtitle" },
      { key: "dream_1_title", label: "Dream 1 Title" },
      { key: "dream_1_text", label: "Dream 1 Text", multiline: true },
      { key: "dream_2_title", label: "Dream 2 Title" },
      { key: "dream_2_text", label: "Dream 2 Text", multiline: true },
      { key: "dream_3_title", label: "Dream 3 Title" },
      { key: "dream_3_text", label: "Dream 3 Text", multiline: true },
      { key: "dream_4_title", label: "Dream 4 Title" },
      { key: "dream_4_text", label: "Dream 4 Text", multiline: true },
      { key: "dream_5_title", label: "Dream 5 Title" },
      { key: "dream_5_text", label: "Dream 5 Text", multiline: true },
    ],
  },
  {
    label: "Surprises Section",
    keys: [
      { key: "surprises_title", label: "Title" },
      { key: "surprises_subtitle", label: "Subtitle" },
      { key: "surprises_rules", label: "Game Rules (how to get keys)", multiline: true },
    ],
  },
  {
    label: "Proposal Section",
    keys: [
      { key: "proposal_title", label: "Title" },
      { key: "proposal_message", label: "Message", multiline: true },
    ],
  },
  {
    label: "Footer",
    keys: [
      { key: "footer_signature", label: "Signature" },
    ],
  },
];

function ContentField({ 
  contentKey, 
  label, 
  value, 
  multiline,
  onSave,
  isPending
}: { 
  contentKey: string;
  label: string;
  value: string;
  multiline?: boolean;
  onSave: (key: string, value: string) => void;
  isPending: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onSave(contentKey, editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">{label}</label>
        {multiline ? (
          <Textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="min-h-[80px]"
            data-testid={`textarea-content-${contentKey}`}
          />
        ) : (
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            data-testid={`input-content-${contentKey}`}
          />
        )}
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave} disabled={isPending} data-testid={`button-save-${contentKey}`}>
            <Check className="w-3 h-3 mr-1" />
            Save
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel} data-testid={`button-cancel-${contentKey}`}>
            <X className="w-3 h-3 mr-1" />
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex items-start justify-between gap-2 p-2 rounded-md hover-elevate cursor-pointer group"
      onClick={() => setIsEditing(true)}
      data-testid={`field-content-${contentKey}`}
    >
      <div className="flex-1 min-w-0">
        <label className="text-xs font-medium text-muted-foreground block">{label}</label>
        <p className="text-sm text-foreground truncate">{value || "(empty)"}</p>
      </div>
      <Button 
        size="icon" 
        variant="ghost" 
        className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
        data-testid={`button-edit-${contentKey}`}
      >
        <Pencil className="w-3 h-3" />
      </Button>
    </div>
  );
}

function SectionEditor({ 
  section, 
  content, 
  onSave,
  isPending
}: { 
  section: ContentSection;
  content: Record<string, string>;
  onSave: (key: string, value: string) => void;
  isPending: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 hover-elevate transition-colors"
        data-testid={`button-toggle-section-${section.label.replace(/\s+/g, '-').toLowerCase()}`}
      >
        <span className="font-medium text-sm">{section.label}</span>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-3 pt-0 space-y-2 border-t">
              {section.keys.map((field) => (
                <ContentField
                  key={field.key}
                  contentKey={field.key}
                  label={field.label}
                  value={content[field.key] || ""}
                  multiline={field.multiline}
                  onSave={onSave}
                  isPending={isPending}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

export function AdminContentEditor({ isAdmin, adminPassword }: AdminContentEditorProps) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const { data: content = {} } = useQuery<Record<string, string>>({
    queryKey: ["/api/content"],
  });

  const updateMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const res = await apiRequest("PUT", `/api/content/${key}`, {
        value,
        adminPassword,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
    },
  });

  const handleSave = (key: string, value: string) => {
    if (adminPassword) {
      updateMutation.mutate({ key, value });
    }
  };

  if (!isAdmin) return null;

  return (
    <>
      <Button
        size="icon"
        variant="outline"
        className="fixed bottom-20 right-4 z-50 shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
        data-testid="button-admin-content-editor"
      >
        <Settings className="w-4 h-4" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed right-4 bottom-32 w-80 max-h-[60vh] overflow-y-auto bg-background border rounded-lg shadow-xl z-50 p-4"
            data-testid="panel-admin-content-editor"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold">Edit Site Content</h3>
              <Button size="icon" variant="ghost" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-3">
              {contentSections.map((section) => (
                <SectionEditor
                  key={section.label}
                  section={section}
                  content={content}
                  onSave={handleSave}
                  isPending={updateMutation.isPending}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
