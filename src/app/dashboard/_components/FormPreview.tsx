"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { type RJSFSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import { withTheme } from "@rjsf/core";
import { Theme as shadcnTheme } from "@rjsf/shadcn";

const Form = withTheme(shadcnTheme);

const schema: RJSFSchema = {
  type: "object",
  properties: {
    title: {
      type: "string",
    },
    done: {
      type: "boolean",
    },
  },
};

const testSchema: RJSFSchema = {
  type: "object",
  required: [
    "providerName",
    "contactName",
    "email",
    "phone",
    "proposalDocument",
    "serviceDescription",
  ],
  properties: {
    email: { type: "string", title: "البريد الإلكتروني", format: "email" },
    phone: { type: "string", title: "رقم الهاتف" },
    contactName: { type: "string", title: "اسم الشخص المسؤول" },
    providerName: { type: "string", title: "اسم مزود الخدمة" },
    companyProfile: {
      type: "string",
      title: "ملف الشركة التعريفي (اختياري)",
      format: "data-url",
    },
    proposalDocument: {
      type: "string",
      title: "العرض الفني والمالي",
      format: "data-url",
    },
    estimatedTimeline: {
      type: "string",
      title: "الجدول الزمني المقترح للتنفيذ",
    },
    serviceDescription: { type: "string", title: "وصف موجز للحلول المقترحة" },
  },
};

const FormPreview = ({
  formSchema,
  formData,
}: {
  formSchema: any;
  formData: any;
}) => {
  return (
    <Dialog>
      <DialogTrigger>عرض</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="rtl:text-center">أستعراض الطلب</DialogTitle>
        </DialogHeader>

        <Form
          schema={formSchema}
          formData={formData}
          validator={validator}
          readonly
          className="space-y-4"
        />
      </DialogContent>
    </Dialog>
  );
};

export default FormPreview;
