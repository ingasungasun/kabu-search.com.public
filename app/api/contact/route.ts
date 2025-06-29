import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma-client.ts";
import {
  getIPAddress,
  validateEmail,
  validateSubject,
  validateText,
} from "@/lib/functions.ts";
import { ContactForm } from "@/lib/types.ts";

/*
  eslint-disable-next-line import/prefer-default-export --
  This is a specification of Next.js.
  */
export async function POST(request: NextRequest) {
  const params = await request.json();

  try {
    const email = (params.email?.trim() as string) ?? "";
    const subject = (params.subject?.trim() as string) ?? "";
    const text = (params.text?.trim() as string) ?? "";

    const validation: ContactForm = {
      email: validateEmail(email),
      subject: validateSubject(subject),
      text: validateText(text),
    };

    if (
      !validation.email.isValid ||
      !validation.subject.isValid ||
      !validation.text.isValid
    ) {
      return NextResponse.json(
        {
          validation,
        },
        {
          status: 400,
        },
      );
    }

    const userAgent = request.headers.get("user-agent") ?? "";
    const ipAddress = getIPAddress(request);
    const createdAt = dayjs().add(9, "hours").toDate();

    const record = await prisma.contact.create({
      data: {
        email,
        subject,
        text,
        user_agent: userAgent,
        ip_address: ipAddress,
        is_sent: false,
        created_at: createdAt,
      },
    });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: `"お問い合わせ" <${process.env.SMTP_FROM_ADDRESS}>`,
      to: process.env.SMTP_TO_ADDRESS,
      replyTo: email,
      subject,
      text,
    });

    // 送信成功
    if (/^250 /.test(info.response)) {
      await prisma.contact.update({
        data: {
          is_sent: true,
        },
        where: {
          id: record.id,
        },
      });
    }

    return new NextResponse(null, {
      status: 204,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : String(error),
      },
      {
        status: 400,
      },
    );
  }
}
