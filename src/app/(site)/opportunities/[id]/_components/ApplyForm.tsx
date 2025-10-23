"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";

import validator from "@rjsf/validator-ajv8";
import { withTheme } from "@rjsf/core";
import { Theme as shadcnTheme } from "@rjsf/shadcn";

const Form = withTheme(shadcnTheme);

interface ApplyFormProps {
  opportunity: {
    id: number;
    title: string;
    jsonSchema?: any;
    uiSchema?: any;
  };
}

const ApplyForm = ({ opportunity }: ApplyFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const createRequestMutation = api.opportunityRequests.create.useMutation({
    onSuccess: () => {
      alert("تم إرسال طلبك بنجاح!");
      setIsOpen(false);
      setFormData({});
    },
    onError: (error) => {
      alert(`حدث خطأ: ${error.message}`);
    },
  });

  const handleSubmit = (data: any) => {
    createRequestMutation.mutate({
      opportunityId: opportunity.id,
      formData: data.formData,
    });
  };

  // Default schema if none provided
  const defaultSchema = {
    type: "object",
    title: `طلب التقديم - ${opportunity.title}`,
    properties: {
      name: {
        type: "string",
        title: "الاسم الكامل",
        description: "يرجى إدخال اسمك الكامل",
      },
      email: {
        type: "string",
        format: "email",
        title: "البريد الإلكتروني",
        description: "يرجى إدخال بريدك الإلكتروني",
      },
      phone: {
        type: "string",
        title: "رقم الهاتف",
        description: "يرجى إدخال رقم هاتفك",
      },
      experience: {
        type: "string",
        title: "الخبرة المهنية",
        description: "يرجى وصف خبرتك المهنية ذات الصلة",
      },
      motivation: {
        type: "string",
        title: "الدافع للتقديم",
        description: "يرجى شرح دوافعك للتقديم على هذه الفرصة",
      },
    },
    required: ["name", "email", "phone", "experience", "motivation"],
  };

  const schema = opportunity.jsonSchema || defaultSchema;
  const uiSchema = opportunity.uiSchema || {
    experience: {
      "ui:widget": "textarea",
      "ui:options": {
        rows: 4,
      },
    },
    motivation: {
      "ui:widget": "textarea",
      "ui:options": {
        rows: 4,
      },
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-cyan-600 text-white hover:bg-cyan-700">
          تقديم طلب
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="rtl:text-center">
            تقديم طلب - {opportunity.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Form
            schema={schema}
            uiSchema={uiSchema}
            formData={formData}
            validator={validator}
            onSubmit={handleSubmit}
            onChange={({ formData: newFormData }) => setFormData(newFormData)}
            className="gap-5 space-y-4"
          >
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={createRequestMutation.isPending}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={createRequestMutation.isPending}
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                {createRequestMutation.isPending
                  ? "جاري الإرسال..."
                  : "إرسال الطلب"}
              </Button>
            </div>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplyForm;
