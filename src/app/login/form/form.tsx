import React from "react";
import SubmitButton from "./submit-button";
import FormComponent from "./form-component";

export default function LoginForm() {
    return (
        <FormComponent>
            <input name="remember" type="hidden" value="true" />
            <div className="space-y-5">
                <div className="min-w-0">
                    <label
                        className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-stone-500"
                        htmlFor="username"
                    >
                        Login
                    </label>
                    <input
                        autoComplete="username"
                        className="relative block h-12 w-full appearance-none rounded-xl border border-white/8 bg-[#0d1118] px-3.5 py-2 text-sm text-stone-100 placeholder-stone-500 outline-none transition focus:border-[#d5a25c]/45 focus:ring-2 focus:ring-[#d5a25c]/15"
                        id="username"
                        name="username"
                        placeholder="Ваш логин"
                        type="username"
                        required
                    />
                </div>
                <div className="min-w-0">
                    <label
                        className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-stone-500"
                        htmlFor="password"
                    >
                        Password
                    </label>
                    <input
                        autoComplete="current-password"
                        className="relative block h-12 w-full appearance-none rounded-xl border border-white/8 bg-[#0d1118] px-3.5 py-2 text-sm text-stone-100 placeholder-stone-500 outline-none transition focus:border-[#d5a25c]/45 focus:ring-2 focus:ring-[#d5a25c]/15"
                        id="password"
                        name="password"
                        placeholder="Ваш пароль"
                        type="password"
                        required
                    />
                </div>
            </div>
            {/* Пока закомментил запоминание и восстановление пароля
                <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <label
                        htmlFor="remember-me"
                        className="ml-2 block text-sm text-gray-900"
                    >
                        Remember me
                    </label>
                </div>
                <div className="text-sm">
                    <a
                        href="#"
                        className="font-medium text-emerald-600 hover:text-emerald-500"
                    >
                        Forgot your password?
                    </a>
                </div>
            </div> */}
            <SubmitButton />
        </FormComponent>
    );
}
