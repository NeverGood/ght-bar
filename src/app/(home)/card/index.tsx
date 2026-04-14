"use client";

import React from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

import type { Item } from "@/models/types";
import type { AppSessionUser } from "@/lib/auth";

import ImageComponent from "./image";
import Header from "./header";
import Footer from "./footer";

export default function Card({
    image,
    name,
    notes,
    strength,
    user,
    countryOrigin,
    type,
    id,
}: Item) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isMounted, setIsMounted] = React.useState(false);
    const [editableNotes, setEditableNotes] = React.useState(notes || "");
    const [isSavingNotes, setIsSavingNotes] = React.useState(false);
    const { data: session } = useSession();
    const currentUser = session?.user as AppSessionUser | undefined;
    const isAdmin = Boolean(currentUser?.isAdmin);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    React.useEffect(() => {
        setEditableNotes(notes || "");
    }, [notes, isOpen]);

    React.useEffect(() => {
        if (!isOpen) {
            return;
        }

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [isOpen]);

    const openCard = () => setIsOpen(true);

    const saveNotes = async () => {
        try {
            setIsSavingNotes(true);

            const formData = new FormData();
            formData.append("notes", editableNotes.trim());

            const response = await fetch(`/api/bottles/${id}`, {
                body: formData,
                method: "PUT",
            });

            const payload = await response.json();

            if (!response.ok) {
                throw new Error(payload.message || "Не удалось сохранить заметку");
            }

            toast.success("Заметка сохранена");
        } catch (error) {
            console.error(error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Не удалось сохранить заметку"
            );
        } finally {
            setIsSavingNotes(false);
        }
    };

    const handleCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const target = event.target as HTMLElement;

        if (target.closest("a, button, [data-card-action]")) {
            return;
        }

        openCard();
    };

    const handleCardKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        const target = event.target as HTMLElement;

        if (target.closest("a, button, [data-card-action]")) {
            return;
        }

        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openCard();
        }
    };

    const modal =
        isMounted && isOpen
            ? createPortal(
                  <div
                      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm md:p-8"
                      onClick={() => setIsOpen(false)}
                  >
                      <div
                          className="relative w-full max-w-[980px] rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(18,22,31,0.98),rgba(10,12,18,0.98))] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.55)] md:p-10"
                          onClick={(event) => event.stopPropagation()}
                      >
                          <button
                              aria-label="Закрыть увеличенный просмотр"
                              className="absolute right-5 top-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-2xl leading-none text-stone-200 transition hover:bg-white/10"
                              type="button"
                              onClick={() => setIsOpen(false)}
                          >
                              ×
                          </button>
                          <div className="grid gap-8 md:grid-cols-[560px_minmax(0,1fr)] md:items-center">
                              <div className="flex justify-center">
                                  <ImageComponent
                                      image={image}
                                      name={name}
                                      className="h-[420px] w-[420px] rounded-[28px] object-cover shadow-[0_24px_60px_rgba(0,0,0,0.35)] md:h-[560px] md:w-[560px]"
                                      height={640}
                                      quality={95}
                                      width={640}
                                  />
                              </div>
                              <div className="flex flex-col gap-4 text-left">
                                  <p className="m-0 text-xs uppercase tracking-[0.28em] text-[#d5a25c]">
                                      Bottle Preview
                                  </p>
                                  <h3 className="m-0 break-words text-4xl font-semibold text-stone-100 md:text-5xl">
                                      {name}
                                  </h3>
                                  <div className="grid grid-cols-2 gap-3 text-sm text-stone-300">
                                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                                          <span className="block text-xs uppercase tracking-[0.18em] text-stone-500">
                                              Type
                                          </span>
                                          <span className="break-words">
                                              {type}
                                          </span>
                                      </div>
                                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                                          <span className="block text-xs uppercase tracking-[0.18em] text-stone-500">
                                              Strength
                                          </span>
                                          <span>{strength} %</span>
                                      </div>
                                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                                          <span className="block text-xs uppercase tracking-[0.18em] text-stone-500">
                                              Country
                                          </span>
                                          <span className="break-words">
                                              {countryOrigin}
                                          </span>
                                      </div>
                                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                                          <span className="block text-xs uppercase tracking-[0.18em] text-stone-500">
                                              Owner
                                          </span>
                                          <span className="break-words">
                                              {user}
                                          </span>
                                      </div>
                                  </div>
                                  {isAdmin ? (
                                      <div className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-4">
                                          <div className="mb-3 flex items-center justify-between gap-3">
                                              <span className="text-xs uppercase tracking-[0.18em] text-stone-500">
                                                  Notes
                                              </span>
                                              <button
                                                  className="inline-flex h-10 items-center justify-center rounded-full border border-[#d5a25c]/25 bg-[#d5a25c] px-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#17130d] transition hover:bg-[#ddb06b] focus:outline-none focus:ring-2 focus:ring-[#d5a25c]/25 disabled:cursor-not-allowed disabled:opacity-60"
                                                  disabled={isSavingNotes}
                                                  type="button"
                                                  onClick={saveNotes}
                                              >
                                                  {isSavingNotes
                                                      ? "Сохраняю..."
                                                      : "Сохранить"}
                                              </button>
                                          </div>
                                          <textarea
                                              className="min-h-[132px] w-full resize-y rounded-[18px] border border-white/8 bg-[#0d1118] px-4 py-3 text-sm leading-7 text-stone-300 outline-none transition placeholder:text-stone-500 focus:border-[#d5a25c]/45 focus:ring-2 focus:ring-[#d5a25c]/15"
                                              placeholder="Добавьте заметку к этой бутылке"
                                              value={editableNotes}
                                              onChange={(event) =>
                                                  setEditableNotes(
                                                      event.target.value
                                                  )
                                              }
                                          />
                                      </div>
                                  ) : (
                                      <div className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-4 text-sm leading-7 text-stone-400">
                                          {notes ||
                                              "Для этой бутылки пока нет заметок."}
                                      </div>
                                  )}
                              </div>
                          </div>
                      </div>
                  </div>,
                  document.body
              )
            : null;

    return (
        <>
            <div
                id={id.toString()}
                aria-label={`Открыть карточку ${name}`}
                className="card-element relative w-full max-w-[252px] cursor-pointer overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(22,26,35,0.96),rgba(12,15,22,0.96))] shadow-[0_24px_60px_rgba(0,0,0,0.3)] transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#d5a25c]/45"
                role="button"
                tabIndex={0}
                onClick={handleCardClick}
                onKeyDown={handleCardKeyDown}
            >
                <Header id={id} />
                <div className="flex w-full flex-col items-center gap-3 px-6 pb-8">
                    <br />
                    <ImageComponent image={image} name={name} />
                    <Footer
                        countryOrigin={countryOrigin}
                        name={name}
                        strength={strength}
                        user={user}
                        type={type}
                    />
                </div>
            </div>
            {modal}
        </>
    );
}
