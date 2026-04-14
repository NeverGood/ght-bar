export default function SubmitButton() {
    return (
        <div className="pt-2">
            <button
                className="group relative h-14 w-full rounded-full border border-[#d5a25c]/30 bg-[#d5a25c] px-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#17130d] shadow-[0_20px_40px_rgba(213,162,92,0.22)] transition hover:-translate-y-0.5 hover:bg-[#ddb06b] focus:outline-none focus:ring-2 focus:ring-[#d5a25c]/35"
                type="submit"
            >
                <span className="absolute inset-0 grid place-items-center">
                    <span className="block text-center leading-none">
                        Войти
                    </span>
                </span>
            </button>
        </div>
    );
}
