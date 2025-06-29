"use client";

import React, { useState, useRef } from "react";
import { Box, Stack, Alert, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import {
  validateEmail,
  validateSubject,
  validateText,
} from "@/lib/functions.ts";
import { ContactForm } from "@/lib/types.ts";

export default function Contact() {
  const rootElement = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [validation, setValidation] = useState<ContactForm>({
    email: {
      message: "",
      isValid: true,
    },
    subject: {
      message: "",
      isValid: true,
    },
    text: {
      message: "",
      isValid: true,
    },
  });

  function hasError() {
    return (
      !validation.email.isValid ||
      !validation.subject.isValid ||
      !validation.text.isValid
    );
  }

  function scroll() {
    if (rootElement.current) {
      rootElement.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }

  async function handleClickButton() {
    const temp: ContactForm = {
      email: validateEmail(email),
      subject: validateSubject(subject),
      text: validateText(text),
    };
    setValidation(temp);

    if (!temp.email.isValid || !temp.subject.isValid || !temp.text.isValid) {
      scroll();
    } else {
      setIsSending(true);
      const res = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify({
          email,
          subject,
          text,
        }),
      });
      setIsSending(false);
      scroll();

      if (res.ok) {
        setEmail("");
        setSubject("");
        setText("");
        setIsDone(true);
      } else {
        const result = await res.json();

        if ("validation" in result) {
          setValidation(result.validation as ContactForm);
        } else if ("message" in result) {
          // eslint-disable-next-line no-console
          console.error(result.message);
        }
      }
    }
  }

  return (
    <Stack ref={rootElement} spacing={4} width={500} maxWidth="100%">
      {isDone && (
        <Box>
          <Alert severity="success">お問い合わせを承りました</Alert>
        </Box>
      )}
      {!isDone && hasError() && (
        <Box>
          <Alert severity="error">エラーがあります</Alert>
        </Box>
      )}
      <Box>
        <TextField
          label="メールアドレス"
          value={email}
          helperText={validation.email.message}
          error={!validation.email.isValid}
          fullWidth
          required
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setEmail(event.target.value);
          }}
        />
      </Box>
      <Box>
        <TextField
          label="件名"
          value={subject}
          helperText={validation.subject.message}
          error={!validation.subject.isValid}
          fullWidth
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSubject(event.target.value);
          }}
        />
      </Box>
      <Box>
        <TextField
          label="本文"
          value={text}
          helperText={validation.text.message}
          error={!validation.text.isValid}
          fullWidth
          required
          multiline
          rows={12}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setText(event.target.value);
          }}
        />
      </Box>
      <Box>
        <LoadingButton
          variant={isSending ? "outlined" : "contained"}
          size="large"
          disableElevation
          loading={isSending}
          disabled={isDone}
          onClick={handleClickButton}
          sx={{
            width: 100,
          }}
        >
          送信
        </LoadingButton>
      </Box>
    </Stack>
  );
}
