"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Stock } from "@prisma/client";
import { PARAM_KEYS, CHARACTER_LIMITS } from "@/lib/constants.ts";

const MILLISECONDS_TO_REQUEST = 150;

export default function useSearch() {
  const router = useRouter();

  const formElement = useRef<HTMLFormElement>(null);
  const inputElement = useRef<HTMLInputElement>(null);
  const [text, setText] = useState("");
  const [items, setItems] = useState<Stock[]>([]);
  const [index, setIndex] = useState(-1);
  const [isActive, setIsActive] = useState(false);

  const [timeoutId, setTimeoutId] = useState<number | null>(null);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  const abortRequest = useCallback(() => {
    if (typeof timeoutId === "number") {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }

    if (abortController instanceof AbortController) {
      abortController.abort(null);
      setAbortController(null);
    }
  }, [timeoutId, abortController]);

  const resetIndex = useCallback(() => {
    setIndex(-1);
  }, []);

  const activate = useCallback(() => {
    setIsActive(true);
  }, []);

  const inactivate = useCallback(() => {
    abortRequest();
    resetIndex();
    // setItems([]);
    setIsActive(false);
  }, [abortRequest, resetIndex]);

  const request = useCallback(
    async (query: string) => {
      const controller = new AbortController();
      setAbortController(controller);

      const url = `/api/search?${PARAM_KEYS.search.query}=${query}`;
      const res = await fetch(url, {
        signal: controller.signal,
      });

      if (res.ok) {
        const json = await res.json();
        setItems(json.items);
        resetIndex();
      }
    },
    [resetIndex],
  );

  const redirect = useCallback(
    (item: Stock) => {
      router.push(`/stocks/${item.ticker}/charts`);
      inactivate();
      inputElement.current?.blur();
      window.scroll({
        top: 0,
        behavior: "smooth",
      });
    },
    [router, inactivate],
  );

  const submit = useCallback(() => {
    if (items.length === 1) {
      redirect(items[0]);
    }
  }, [items, redirect]);

  const handleFocus = useCallback(() => {
    activate();
  }, [activate]);

  const handleInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      activate();
      abortRequest();
      setText(event.target.value);
      const trimmedValue = event.target.value.trim();

      if (
        trimmedValue.length >= CHARACTER_LIMITS.searchQuery.min &&
        trimmedValue.length <= CHARACTER_LIMITS.searchQuery.max
      ) {
        const id = setTimeout(async () => {
          await request(trimmedValue);
        }, MILLISECONDS_TO_REQUEST);

        setTimeoutId(Number(id));
      } else {
        setItems([]);
      }
    },
    [abortRequest, activate, request],
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      submit();
    },
    [submit],
  );

  const handleClickSearchIcon = useCallback(() => {
    submit();
  }, [submit]);

  const handleClickItem = useCallback(
    (item: Stock) => {
      redirect(item);
    },
    [redirect],
  );

  const handleMouseOverItem = useCallback((tempIndex: number) => {
    setIndex(tempIndex);
  }, []);

  const handleClickDocument = useCallback(
    (event: MouseEvent) => {
      if (!formElement.current?.contains(event.target as Node)) {
        inactivate();
      }
    },
    [inactivate],
  );

  const handleKeydownDocument = useCallback(
    (event: KeyboardEvent) => {
      switch (event.code) {
        case "ArrowUp":
          if (isActive && items.length > 0) {
            let tempIndex = index - 1;

            if (tempIndex < 0) {
              tempIndex = items.length - 1;
            }

            event.preventDefault();
            setIndex(tempIndex);
          }
          break;

        case "ArrowDown":
          if (isActive && items.length > 0) {
            let tempIndex = index + 1;

            if (tempIndex > items.length - 1) {
              tempIndex = 0;
            }

            event.preventDefault();
            setIndex(tempIndex);
          }
          break;

        case "Escape":
          if (isActive && items.length > 0) {
            event.preventDefault();
            inactivate();
          } else if (inputElement.current) {
            event.preventDefault();
            inputElement.current.blur();
          }
          break;

        case "Enter":
          if (isActive && items.length > 0 && index >= 0) {
            event.preventDefault();
            redirect(items[index]);
          }
          break;

        default:
        // do nothing
      }
    },
    [isActive, items, index, inactivate, redirect],
  );

  useEffect(() => {
    document.addEventListener("click", handleClickDocument);
    document.addEventListener("keydown", handleKeydownDocument);

    return () => {
      document.removeEventListener("click", handleClickDocument);
      document.removeEventListener("keydown", handleKeydownDocument);
    };
  }, [handleClickDocument, handleKeydownDocument]);

  return {
    formElement,
    inputElement,
    text,
    items,
    index,
    isActive,
    handleFocus,
    handleInput,
    handleSubmit,
    handleClickSearchIcon,
    handleClickItem,
    handleMouseOverItem,
  };
}
