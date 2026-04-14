import React from "react";

type AccessShellProps = {
    eyebrow: string;
    title: string;
    description?: string;
    panelEyebrow?: string;
    panelTitle: string;
    panelDescription?: string;
    children: React.ReactNode;
};

export default function AccessShell({
    eyebrow,
    title,
    description,
    panelEyebrow,
    panelTitle,
    panelDescription,
    children,
}: AccessShellProps) {
    return (
        <main className="relative flex min-h-full w-full items-center justify-center overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(213,162,92,0.12),transparent_32%),linear-gradient(180deg,#0a0c10_0%,#07080c_100%)]" />
            <div className="absolute inset-y-0 left-0 w-[28%] bg-[radial-gradient(circle_at_center,rgba(213,162,92,0.08),transparent_70%)] blur-3xl" />
            <div className="absolute inset-y-0 right-0 w-[32%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04),transparent_72%)] blur-3xl" />

            <section className="relative z-10 grid w-full max-w-[1120px] overflow-hidden rounded-[34px] border border-white/8 bg-[linear-gradient(180deg,rgba(15,18,25,0.96),rgba(8,10,14,0.98))] shadow-[0_36px_120px_rgba(0,0,0,0.46)] lg:grid-cols-[1.08fr_0.92fr]">
                <div className="flex flex-col justify-center gap-10 border-b border-white/8 px-7 py-8 sm:px-10 sm:py-10 lg:border-b-0 lg:border-r">
                    <div className="space-y-6">
                        <p className="m-0 text-xs uppercase tracking-[0.32em] text-[#d5a25c]">
                            {eyebrow}
                        </p>
                        <div className="space-y-4">
                            <h1 className="m-0 text-5xl font-semibold leading-[0.95] text-[#f6f0e6] sm:text-6xl">
                                {title}
                            </h1>
                            {description && (
                                <p className="max-w-[34rem] text-base leading-8 text-stone-300 sm:text-lg">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center px-7 py-8 sm:px-10 sm:py-10">
                    <div className="w-full rounded-[30px] border border-white/8 bg-[linear-gradient(180deg,rgba(18,22,31,0.92),rgba(11,13,18,0.94))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-8">
                        <div className="mb-8 space-y-3">
                            {panelEyebrow && (
                                <p className="m-0 text-xs uppercase tracking-[0.28em] text-[#d5a25c]">
                                    {panelEyebrow}
                                </p>
                            )}
                            <h2 className="m-0 text-3xl font-semibold text-stone-100">
                                {panelTitle}
                            </h2>
                            {panelDescription && (
                                <p className="m-0 text-sm leading-7 text-stone-400">
                                    {panelDescription}
                                </p>
                            )}
                        </div>
                        {children}
                    </div>
                </div>
            </section>
        </main>
    );
}
